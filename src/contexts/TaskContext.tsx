
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultTasks, Task } from '../data/defaultTasks';
import { achievements, Achievement } from '../data/achievements';
import { toast } from '@/hooks/use-toast';

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

  useEffect(() => {
    // Check if it's a new day and reset daily tasks
    const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      resetDailyTasks();
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
      
      // Handle streaks for daily tasks
      if (task.category === 'daily' && isCompleting) {
        const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted).toDateString() : null;
        const isConsecutiveDay = lastCompleted && 
          new Date(lastCompleted).getTime() === new Date(today).getTime() - 86400000;
        
        updatedTask.streak = isConsecutiveDay ? (task.streak || 0) + 1 : 1;
        updatedTask.lastCompleted = today;
        
        // Check for streak achievements
        if (updatedTask.streak === 3) {
          updateAchievement('achievement-2');
        }
      }
      
      return updatedTask;
    }));
    
    if (tasks.find(task => task.id === taskId)?.completed === false) {
      // Check for task completion achievements
      checkCompletionAchievements();
      
      // Check if this is the first task completed today
      const completedToday = tasks.some(task => 
        task.completed && 
        task.completedAt && 
        new Date(task.completedAt).toDateString() === today
      );
      
      if (!completedToday) {
        updateStreak();
      }
      
      // Check for early riser achievement
      if (now.getHours() < 8) {
        updateAchievement('achievement-5');
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

  const updateStreak = () => {
    const lastLogin = localStorage.getItem(LOCAL_STORAGE_LAST_LOGIN_KEY);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastLogin === yesterdayStr) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Check for streak achievements
      if (newStreak >= 7) {
        updateAchievement('achievement-4');
      }
    } else if (lastLogin !== today) {
      // Reset streak if not consecutive days
      setStreak(1);
    }
    
    localStorage.setItem(LOCAL_STORAGE_LAST_LOGIN_KEY, today);
  };

  const checkCompletionAchievements = () => {
    // Count completed tasks
    const completedCount = tasks.filter(task => task.completed).length + 1; // +1 for the current task
    
    // First task completed
    if (completedCount === 1) {
      updateAchievement('achievement-1');
    }
    
    // 10 tasks completed
    if (completedCount === 10) {
      updateAchievement('achievement-3');
    }
  };

  const updateAchievement = (achievementId: string) => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const updatedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          
          // Show achievement toast
          toast({
            title: "Achievement Unlocked!",
            description: `${updatedAchievement.title}: ${updatedAchievement.description}`,
          });
          
          return updatedAchievement;
        } else if (achievement.id === achievementId) {
          // Update progress if already exists
          return {
            ...achievement,
            progress: achievement.progress ? achievement.progress + 1 : 1
          };
        }
        return achievement;
      })
    );
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

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
