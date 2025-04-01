
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTasks, Task } from '../data/defaultTasks';
import { achievements, Achievement } from '../data/achievements';
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

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    return storedTasks ? JSON.parse(storedTasks) : defaultTasks;
  });
  
  const [achievementsList, setAchievements] = useState<Achievement[]>(() => {
    const storedAchievements = localStorage.getItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY);
    return storedAchievements ? JSON.parse(storedAchievements) : achievements;
  });
  
  const [streak, setStreak] = useState<number>(() => {
    const storedStreak = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    return storedStreak ? parseInt(storedStreak) : 0;
  });

  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      resetDailyTasks();
      
      // Reset streak to 0 if a day was skipped
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLogin !== yesterdayStr && streak > 0) {
        setStreak(0);
        toast({
          title: "Streak Reset",
          description: "You missed a day! Your streak has been reset.",
        });
      }
      
      localStorage.setItem(LOCAL_STORAGE_LAST_LOGIN_KEY, today);
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

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      streak: 0
    };
    
    setTasks([...tasks, newTask]);
    toast({
      title: "New Task Added",
      description: `'${newTask.title}' has been added to your tasks`,
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been removed",
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    const now = new Date();
    const today = now.toDateString();
    
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id !== taskId) return task;
      
      const isCompleting = !task.completed;
      const updatedTask = {
        ...task,
        completed: isCompleting,
        completedAt: isCompleting ? now.toISOString() : undefined
      };
      
      if (task.category === 'daily' && isCompleting) {
        const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted).toDateString() : null;
        const isConsecutiveDay = lastCompleted && 
          new Date(lastCompleted).getTime() === new Date(today).getTime() - 86400000;
        
        updatedTask.streak = isConsecutiveDay ? (task.streak || 0) + 1 : 1;
        updatedTask.lastCompleted = today;
        
        if (updatedTask.streak === 3) {
          updateAchievement('achievement-2');
        }
      }
      
      return updatedTask;
    }));
    
    if (tasks.find(task => task.id === taskId)?.completed === false) {
      checkCompletionAchievements();
      
      // Check if all daily tasks are completed
      const updatedTasks = [...tasks];
      updatedTasks.find(t => t.id === taskId)!.completed = true; // Simulate the task being completed
      
      checkAllDailyTasksCompletion(updatedTasks);
      
      if (now.getHours() < 8) {
        updateAchievement('achievement-5');
      }
    }
  };

  const checkAllDailyTasksCompletion = (currentTasks: Task[]) => {
    const dailyTasks = currentTasks.filter(task => task.category === 'daily');
    
    if (dailyTasks.length > 0 && dailyTasks.every(task => task.completed)) {
      // All daily tasks are completed, update the streak
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLogin === yesterdayStr || lastLogin === today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (newStreak === 1) {
          toast({
            title: "Streak Started!",
            description: "Keep completing all daily tasks to build your streak!",
          });
        } else {
          toast({
            title: "Streak Increased!",
            description: `You're on a ${newStreak} day streak! Keep it up!`,
          });
        }
        
        if (newStreak >= 7) {
          updateAchievement('achievement-4');
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
      updateAchievement('achievement-1');
    }
    
    if (completedCount === 10) {
      updateAchievement('achievement-3');
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
