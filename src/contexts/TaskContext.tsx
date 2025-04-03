
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTasks, Task } from '../data/defaultTasks';
import { achievements as defaultAchievements, Achievement } from '../data/achievements';
import { toast } from '@/hooks/use-toast';
import BadgeUnlockAnimation from '@/components/BadgeUnlockAnimation';
import { TaskContextProps } from './task/types';
import { 
  LOCAL_STORAGE_TASKS_KEY,
  LOCAL_STORAGE_ACHIEVEMENTS_KEY,
  LOCAL_STORAGE_STREAK_KEY,
  LOCAL_STORAGE_LAST_LOGIN_KEY,
  LOCAL_STORAGE_STREAK_UPDATED_TODAY,
  LOCAL_STORAGE_VISITED_LOCATIONS,
  LOCAL_STORAGE_TASK_COUNTS
} from './task/constants';
import { 
  getCurrentLocation, 
  displayTaskAddedToast, 
  displayTaskDeletedToast, 
  displayStreakResetToast 
} from './task/taskUtils';
import { 
  updateAchievement, 
  checkCompletionAchievements,
  checkThemeAchievements,
  checkTaskCreationAchievements,
  checkAllDailyTasksCompletion
} from './task/achievementHandler';

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    return storedTasks ? JSON.parse(storedTasks) : defaultTasks;
  });
  
  const [achievementsList, setAchievements] = useState<Achievement[]>(() => {
    try {
      const storedAchievements = localStorage.getItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY);
      console.log('Loading achievements from storage or default');
      
      if (storedAchievements) {
        const parsed = JSON.parse(storedAchievements);
        console.log('Found stored achievements:', parsed.length);
        
        if (parsed.length < defaultAchievements.length) {
          console.log('Adding new default achievements');
          
          const existingAchievementsMap = new Map(
            parsed.map((achievement: Achievement) => [achievement.id, achievement])
          );
          
          const mergedAchievements = [...parsed];
          defaultAchievements.forEach(achievement => {
            if (!existingAchievementsMap.has(achievement.id)) {
              mergedAchievements.push(achievement);
            }
          });
          
          console.log('Total achievements after merge:', mergedAchievements.length);
          return mergedAchievements;
        }
        
        return parsed;
      } else {
        console.log('Using default achievements:', defaultAchievements.length);
        return defaultAchievements;
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
      return defaultAchievements;
    }
  });
  
  const [streak, setStreak] = useState<number>(() => {
    const storedStreak = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    return storedStreak ? parseInt(storedStreak) : 0;
  });

  const [streakUpdatedToday, setStreakUpdatedToday] = useState<boolean>(() => {
    const updated = localStorage.getItem(LOCAL_STORAGE_STREAK_UPDATED_TODAY);
    return updated === 'true';
  });

  const [visitedLocations, setVisitedLocations] = useState<string[]>(() => {
    const storedLocations = localStorage.getItem(LOCAL_STORAGE_VISITED_LOCATIONS);
    return storedLocations ? JSON.parse(storedLocations) : [];
  });

  const [themeCounts, setThemeCounts] = useState<Record<string, number>>(() => {
    const storedCounts = localStorage.getItem(LOCAL_STORAGE_TASK_COUNTS);
    return storedCounts ? JSON.parse(storedCounts) : {};
  });

  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  // Achievement handler props for passing to functions
  const achievementHandlerProps = {
    achievements: achievementsList,
    setAchievements,
    setUnlockedAchievement
  };

  // Save visited locations to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_VISITED_LOCATIONS, JSON.stringify(visitedLocations));
  }, [visitedLocations]);

  // Save theme counts to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TASK_COUNTS, JSON.stringify(themeCounts));
  }, [themeCounts]);

  // Check for streak consistency and reset dailies on new day
  useEffect(() => {
    const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      resetDailyTasks();
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLogin !== yesterdayStr && streak > 0) {
        setStreak(0);
        displayStreakResetToast();
      }
      
      setStreakUpdatedToday(false);
      localStorage.setItem(LOCAL_STORAGE_STREAK_UPDATED_TODAY, 'false');
      localStorage.setItem(LOCAL_STORAGE_LAST_LOGIN_KEY, today);

      // Weekend warrior achievement check
      const dayOfWeek = new Date().getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Check if we completed tasks yesterday and today is weekend
        const completedYesterday = tasks.some(t => 
          t.completedAt && new Date(t.completedAt).toDateString() === yesterdayStr
        );
        
        if (completedYesterday) {
          updateAchievement('achievement-11', achievementHandlerProps); // Weekend Warrior
        }
      }
    }
  }, []);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Persist achievements to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(achievementsList));
  }, [achievementsList]);

  // Persist streak to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STREAK_KEY, streak.toString());
  }, [streak]);

  // Persist streakUpdatedToday to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STREAK_UPDATED_TODAY, streakUpdatedToday.toString());
  }, [streakUpdatedToday]);

  // Track task creation count for achievements
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      streak: 0
    };
    
    setTasks([...tasks, newTask]);
    
    // Update theme counts
    if (task.theme) {
      const updatedThemeCounts = { ...themeCounts };
      updatedThemeCounts[task.theme] = (updatedThemeCounts[task.theme] || 0) + 1;
      setThemeCounts(updatedThemeCounts);
    }
    
    // Check achievements
    checkTaskCreationAchievements(
      tasks.length + 1,
      task,
      themeCounts,
      tasks,
      achievementHandlerProps
    );
    
    displayTaskAddedToast(newTask.title);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    displayTaskDeletedToast();
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const now = new Date();
    const today = now.toDateString();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    const isCompleting = !task.completed;
    
    if (isCompleting) {
      // Task is being completed
      const completionTime = now.toISOString();
      
      // Get the current location when completing a task
      const currentLocation = await getCurrentLocation();
      console.log(`Task completed at location: ${currentLocation}`);

      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id !== taskId) return t;
        
        const updatedTask = {
          ...t,
          completed: true,
          completedAt: completionTime,
          completionLocation: currentLocation // Store the location where task was completed
        };
        
        if (t.category === 'daily') {
          const lastCompleted = t.lastCompleted ? new Date(t.lastCompleted).toDateString() : null;
          const isConsecutiveDay = lastCompleted && 
            new Date(lastCompleted).getTime() === new Date(today).getTime() - 86400000;
          
          updatedTask.streak = isConsecutiveDay ? (t.streak || 0) + 1 : 1;
          updatedTask.lastCompleted = today;
        }
        
        return updatedTask;
      }));
      
      // Time-based achievements
      const currentHour = now.getHours();
      
      if (currentHour < 8) {
        updateAchievement('achievement-5', achievementHandlerProps); // Early Riser
      }
      
      if (currentHour >= 22) {
        updateAchievement('achievement-10', achievementHandlerProps); // Night Owl
      }
      
      // Speed achievement - completed within 5 min of creation
      if (task.createdAt) {
        const creationTime = new Date(task.createdAt).getTime();
        const completionTimeMs = now.getTime();
        const timeDifferenceMinutes = (completionTimeMs - creationTime) / (1000 * 60);
        
        if (timeDifferenceMinutes <= 5) {
          updateAchievement('achievement-21', achievementHandlerProps); // Quick Starter
        } else if (timeDifferenceMinutes <= 10) {
          updateAchievement('achievement-17', achievementHandlerProps); // Time Optimizer
        }
      }
      
      // Add to visited locations if not already tracked
      if (currentLocation !== "Unknown") {
        if (!visitedLocations.includes(currentLocation)) {
          const newVisitedLocations = [...visitedLocations, currentLocation];
          setVisitedLocations(newVisitedLocations);
          
          // Check for Global Achiever (3 different locations)
          if (newVisitedLocations.length === 3) {
            updateAchievement('achievement-24', achievementHandlerProps); // Global Achiever
          }
        }
      }
      
      // Theme-based achievements
      if (task.theme) {
        const updatedThemeCounts = { ...themeCounts };
        const currentCount = (updatedThemeCounts[task.theme] || 0) + 1;
        updatedThemeCounts[task.theme] = currentCount;
        setThemeCounts(updatedThemeCounts);
        
        // Check theme-specific achievements
        checkThemeAchievements(task.theme, currentCount, achievementHandlerProps);
      }
      
      // Check streak achievement
      if (task.category === 'daily' && task.streak === 3) {
        updateAchievement('achievement-2', achievementHandlerProps); // Habit Forming
      }
      
      // Milestone achievement
      if (task.isMilestone) {
        updateAchievement('achievement-34', achievementHandlerProps); // Milestone Maker
      }
      
      // Count goals completed
      if (task.category === 'goal') {
        const completedGoals = tasks.filter(t => t.category === 'goal' && t.completed).length + 1;
        if (completedGoals === 5) {
          updateAchievement('achievement-8', achievementHandlerProps); // Goal Getter
        }
      }
      
      // Check completion achievements
      checkCompletionAchievements(tasks, achievementHandlerProps);
      
      // Check all daily tasks completion
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { 
          ...t, 
          completed: true, 
          completedAt: completionTime,
          completionLocation: currentLocation 
        } : t
      );
      checkAllDailyTasksCompletion(
        updatedTasks, 
        streak, 
        streakUpdatedToday,
        setStreak,
        setStreakUpdatedToday,
        achievementHandlerProps
      );
      
      // Check for "Perfectionist" achievement - all tasks completed in one day
      const allTasksCompleted = updatedTasks.every(t => t.completed);
      if (allTasksCompleted && updatedTasks.length > 3) {
        updateAchievement('achievement-9', achievementHandlerProps); // Perfectionist
      }
      
      // Check for "Efficiency Expert" - 5 tasks in a single day
      const tasksCompletedToday = updatedTasks.filter(t => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toDateString() === today;
      }).length;
      
      if (tasksCompletedToday === 5) {
        updateAchievement('achievement-14', achievementHandlerProps); // Efficiency Expert
      }
      
      // Check seasonal achievement
      const currentMonth = now.getMonth();
      let currentSeason = '';
      
      if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
      else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
      else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'autumn';
      else currentSeason = 'winter';
      
      // Store the season in localStorage if not already there
      const completedSeasons = JSON.parse(localStorage.getItem('completedSeasons') || '[]');
      if (!completedSeasons.includes(currentSeason)) {
        completedSeasons.push(currentSeason);
        localStorage.setItem('completedSeasons', JSON.stringify(completedSeasons));
        
        // Check if all seasons are completed
        if (completedSeasons.length === 4) {
          updateAchievement('achievement-23', achievementHandlerProps); // Seasonal Planner
        }
      }
    } else {
      // Task is being uncompleted
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id !== taskId) return t;
        
        return {
          ...t,
          completed: false,
          completedAt: undefined,
          completionLocation: undefined // Clear completion location
        };
      }));
    }
  };

  const resetDailyTasks = () => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.category === 'daily') {
        return {
          ...task,
          completed: false,
          completedAt: undefined
        };
      }
      return task;
    }));
  };

  const handleAnimationComplete = () => {
    setUnlockedAchievement(null);
  };

  useEffect(() => {
    console.log('TaskProvider mounted with', achievementsList.length, 'achievements');
  }, []);

  const value = {
    tasks,
    achievements: achievementsList,
    addTask,
    toggleTaskCompletion,
    streak,
    resetDailyTasks,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
      {unlockedAchievement && (
        <BadgeUnlockAnimation 
          achievement={unlockedAchievement} 
          onComplete={handleAnimationComplete} 
        />
      )}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
