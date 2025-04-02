import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTasks, Task } from '../data/defaultTasks';
import { achievements as defaultAchievements, Achievement } from '../data/achievements';
import { toast } from '@/hooks/use-toast';
import BadgeUnlockAnimation from '@/components/BadgeUnlockAnimation';

interface TaskContextProps {
  tasks: Task[];
  achievements: Achievement[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  streak: number;
  resetDailyTasks: () => void;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const LOCAL_STORAGE_TASKS_KEY = 'nostalgiaAchievements_tasks';
const LOCAL_STORAGE_ACHIEVEMENTS_KEY = 'nostalgiaAchievements_achievements';
const LOCAL_STORAGE_STREAK_KEY = 'nostalgiaAchievements_streak';
const LOCAL_STORAGE_LAST_LOGIN_KEY = 'nostalgiaAchievements_lastLogin';
const LOCAL_STORAGE_STREAK_UPDATED_TODAY = 'nostalgiaAchievements_streakUpdatedToday';
const LOCAL_STORAGE_VISITED_LOCATIONS = 'nostalgiaAchievements_visitedLocations';
const LOCAL_STORAGE_TASK_COUNTS = 'nostalgiaAchievements_taskCounts';

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

  // Save visited locations to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_VISITED_LOCATIONS, JSON.stringify(visitedLocations));
  }, [visitedLocations]);

  // Save theme counts to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TASK_COUNTS, JSON.stringify(themeCounts));
  }, [themeCounts]);

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
        toast({
          title: "Streak Reset",
          description: "You missed a day! Your streak has been reset.",
          duration: 4000,
        });
      }
      
      setStreakUpdatedToday(false);
      localStorage.setItem(LOCAL_STORAGE_STREAK_UPDATED_TODAY, 'false');
      localStorage.setItem(LOCAL_STORAGE_LAST_LOGIN_KEY, today);

      // Weekend warrior achievement check - we're on a Saturday or Sunday
      const dayOfWeek = new Date().getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Check if we completed tasks yesterday and today is weekend
        const completedYesterday = tasks.some(t => 
          t.completedAt && new Date(t.completedAt).toDateString() === yesterdayStr
        );
        
        if (completedYesterday) {
          updateAchievement('achievement-11'); // Weekend Warrior
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(achievementsList));
  }, [achievementsList]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STREAK_KEY, streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STREAK_UPDATED_TODAY, streakUpdatedToday.toString());
  }, [streakUpdatedToday]);

  // Function to get user's current location using browser Geolocation API
  const getCurrentLocation = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve("Unknown");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            
            // Extract region/state or county information rather than just city
            const region = data.address?.state || 
                          data.address?.county || 
                          data.address?.region || 
                          data.address?.city || 
                          "Unknown";
            
            console.log("Detected location (region):", region);
            resolve(region);
          } catch (error) {
            console.error("Error getting location details:", error);
            resolve("Unknown");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          resolve("Unknown");
        },
        { timeout: 10000 }
      );
    });
  };

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
    
    // Check task creation achievement
    const createdTaskCount = tasks.length + 1;
    if (createdTaskCount === 10) {
      updateAchievement('achievement-12'); // Task Creator
    }
    
    // Check if we have created tasks in various categories/themes
    if (task.theme) {
      const updatedThemeCounts = { ...themeCounts };
      updatedThemeCounts[task.theme] = (updatedThemeCounts[task.theme] || 0) + 1;
      setThemeCounts(updatedThemeCounts);
      
      // Check if we have tasks in 5 different themes
      const uniqueThemes = Object.keys(updatedThemeCounts);
      if (uniqueThemes.length === 5) {
        updateAchievement('achievement-20'); // Task Pioneer
      }
      
      // Balance Master - having active tasks in all categories
      const hasDaily = tasks.some(t => t.category === 'daily') || task.category === 'daily';
      const hasGoal = tasks.some(t => t.category === 'goal') || task.category === 'goal';
      const hasCustom = tasks.some(t => t.category === 'custom') || task.category === 'custom';
      
      if (hasDaily && hasGoal && hasCustom) {
        updateAchievement('achievement-13'); // Balance Master
      }
    }
    
    toast({
      title: "New Task Added",
      description: `'${newTask.title}' has been added to your tasks`,
      duration: 4000,
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been removed",
      duration: 4000,
    });
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
        updateAchievement('achievement-5'); // Early Riser
      }
      
      if (currentHour >= 22) {
        updateAchievement('achievement-10'); // Night Owl
      }
      
      // Speed achievement - completed within 5 min of creation
      if (task.createdAt) {
        const creationTime = new Date(task.createdAt).getTime();
        const completionTimeMs = now.getTime();
        const timeDifferenceMinutes = (completionTimeMs - creationTime) / (1000 * 60);
        
        if (timeDifferenceMinutes <= 5) {
          updateAchievement('achievement-21'); // Quick Starter
        } else if (timeDifferenceMinutes <= 10) {
          updateAchievement('achievement-17'); // Time Optimizer
        }
      }
      
      // Add to visited locations if not already tracked
      if (currentLocation !== "Unknown") {
        if (!visitedLocations.includes(currentLocation)) {
          const newVisitedLocations = [...visitedLocations, currentLocation];
          setVisitedLocations(newVisitedLocations);
          
          // Check for Global Achiever (3 different locations)
          if (newVisitedLocations.length === 3) {
            updateAchievement('achievement-24'); // Global Achiever
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
        switch (task.theme) {
          case 'health':
            if (currentCount === 15) updateAchievement('achievement-22'); // Health Enthusiast
            break;
          case 'learning':
            if (currentCount === 10) updateAchievement('achievement-18'); // Knowledge Seeker
            break;
          case 'creativity':
            if (currentCount === 10) updateAchievement('achievement-25'); // Creative Genius
            break;
          case 'social':
            if (currentCount === 5) updateAchievement('achievement-26'); // Social Butterfly
            break;
          case 'finance':
            if (currentCount === 8) updateAchievement('achievement-27'); // Financial Wizard
            break;
          case 'technology':
            if (currentCount === 7) updateAchievement('achievement-28'); // Tech Guru
            break;
          case 'outdoor':
            if (currentCount === 5) updateAchievement('achievement-29'); // Adventurer
            break;
          case 'cooking':
            if (currentCount === 6) updateAchievement('achievement-30'); // Chef's Hat
            break;
          case 'mindfulness':
            if (currentCount === 10) updateAchievement('achievement-31'); // Mindfulness Master
            break;
          case 'reading':
            if (currentCount === 5) updateAchievement('achievement-32'); // Bookworm
            break;
          case 'music':
            if (currentCount === 3) updateAchievement('achievement-36'); // Melody Maker
            break;
          case 'film':
            if (currentCount === 4) updateAchievement('achievement-37'); // Film Buff
            break;
          case 'pet':
            if (currentCount === 10) updateAchievement('achievement-38'); // Pet Parent
            break;
          case 'gardening':
            if (currentCount === 5) updateAchievement('achievement-35'); // Planting Seeds
            break;
          case 'shopping':
            if (currentCount === 8) updateAchievement('achievement-40'); // Shopping Wizard
            break;
        }
      }
      
      // Check streak achievement
      if (task.category === 'daily' && task.streak === 3) {
        updateAchievement('achievement-2'); // Habit Forming
      }
      
      // Milestone achievement
      if (task.isMilestone) {
        updateAchievement('achievement-34'); // Milestone Maker
      }
      
      // Count goals completed
      if (task.category === 'goal') {
        const completedGoals = tasks.filter(t => t.category === 'goal' && t.completed).length + 1;
        if (completedGoals === 5) {
          updateAchievement('achievement-8'); // Goal Getter
        }
      }
      
      // Check completion achievements
      checkCompletionAchievements();
      
      // Check all daily tasks completion
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { 
          ...t, 
          completed: true, 
          completedAt: completionTime,
          completionLocation: currentLocation 
        } : t
      );
      checkAllDailyTasksCompletion(updatedTasks);
      
      // Check for "Perfectionist" achievement - all tasks completed in one day
      const allTasksCompleted = updatedTasks.every(t => t.completed);
      if (allTasksCompleted && updatedTasks.length > 3) {
        updateAchievement('achievement-9'); // Perfectionist
      }
      
      // Check for "Efficiency Expert" - 5 tasks in a single day
      const tasksCompletedToday = updatedTasks.filter(t => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toDateString() === today;
      }).length;
      
      if (tasksCompletedToday === 5) {
        updateAchievement('achievement-14'); // Efficiency Expert
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
          updateAchievement('achievement-23'); // Seasonal Planner
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

  const checkAllDailyTasksCompletion = (currentTasks: Task[]) => {
    const dailyTasks = currentTasks.filter(task => task.category === 'daily');
    
    if (dailyTasks.length > 0 && dailyTasks.every(task => task.completed)) {
      if (!streakUpdatedToday) {
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastLogin === yesterdayStr || lastLogin === today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          setStreakUpdatedToday(true);
          
          if (newStreak === 1) {
            toast({
              title: "Streak Started!",
              description: "Keep completing all daily tasks to build your streak!",
              duration: 4000,
            });
          } else {
            toast({
              title: "Streak Increased!",
              description: `You're on a ${newStreak} day streak! Keep it up!`,
              duration: 4000,
            });
          }
          
          if (newStreak >= 7) {
            updateAchievement('achievement-4');
          }
          
          if (newStreak >= 14) {
            updateAchievement('achievement-6');
          }
          
          if (newStreak >= 30) {
            updateAchievement('achievement-7');
          }
        }
      }
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

  const checkCompletionAchievements = () => {
    const completedCount = tasks.filter(task => task.completed).length + 1;
    
    if (completedCount === 1) {
      updateAchievement('achievement-1'); // First Steps
    }
    
    if (completedCount === 10) {
      updateAchievement('achievement-3'); // Task Master
    }
    
    if (completedCount === 50) {
      updateAchievement('achievement-15'); // Task Veteran
    }

    // High priority tasks in a row (for this example, we'll consider goal tasks as high priority)
    const recentCompletedTasks = [...tasks]
      .sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      })
      .slice(0, 3);

    const highPriorityInARow = recentCompletedTasks.length === 3 && 
      recentCompletedTasks.every(t => t.category === 'goal' && t.completed);
      
    if (highPriorityInARow) {
      updateAchievement('achievement-16'); // Priority Manager
    }
  };

  const updateAchievement = (achievementId: string) => {
    setAchievements(prevAchievements => {
      const updatedAchievements = prevAchievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const updatedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          
          setUnlockedAchievement(updatedAchievement);
          
          toast({
            title: "Achievement Unlocked!",
            description: `${updatedAchievement.title}: ${updatedAchievement.description}`,
            duration: 4000,
          });
          
          return updatedAchievement;
        } else if (achievement.id === achievementId) {
          return {
            ...achievement,
            progress: achievement.progress ? achievement.progress + 1 : 1
          };
        }
        return achievement;
      });
      
      return updatedAchievements;
    });
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
