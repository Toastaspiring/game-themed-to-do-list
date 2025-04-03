
import { Achievement } from '@/data/achievements';
import { Task } from '@/data/defaultTasks';
import { displayAchievementToast } from './taskUtils';

export interface AchievementHandlerProps {
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  setUnlockedAchievement: React.Dispatch<React.SetStateAction<Achievement | null>>;
}

export const updateAchievement = (
  achievementId: string,
  { achievements, setAchievements, setUnlockedAchievement }: AchievementHandlerProps
) => {
  setAchievements(prevAchievements => {
    const updatedAchievements = prevAchievements.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const updatedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        
        setUnlockedAchievement(updatedAchievement);
        
        displayAchievementToast(updatedAchievement.title, updatedAchievement.description);
        
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

export const checkCompletionAchievements = (
  tasks: Task[],
  handlerProps: AchievementHandlerProps
) => {
  const completedCount = tasks.filter(task => task.completed).length + 1;
  
  if (completedCount === 1) {
    updateAchievement('achievement-1', handlerProps); // First Steps
  }
  
  if (completedCount === 10) {
    updateAchievement('achievement-3', handlerProps); // Task Master
  }
  
  if (completedCount === 50) {
    updateAchievement('achievement-15', handlerProps); // Task Veteran
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
    updateAchievement('achievement-16', handlerProps); // Priority Manager
  }
};

export const checkThemeAchievements = (
  theme: string, 
  count: number, 
  handlerProps: AchievementHandlerProps
) => {
  switch (theme) {
    case 'health':
      if (count === 15) updateAchievement('achievement-22', handlerProps); // Health Enthusiast
      break;
    case 'learning':
      if (count === 10) updateAchievement('achievement-18', handlerProps); // Knowledge Seeker
      break;
    case 'creativity':
      if (count === 10) updateAchievement('achievement-25', handlerProps); // Creative Genius
      break;
    case 'social':
      if (count === 5) updateAchievement('achievement-26', handlerProps); // Social Butterfly
      break;
    case 'finance':
      if (count === 8) updateAchievement('achievement-27', handlerProps); // Financial Wizard
      break;
    case 'technology':
      if (count === 7) updateAchievement('achievement-28', handlerProps); // Tech Guru
      break;
    case 'outdoor':
      if (count === 5) updateAchievement('achievement-29', handlerProps); // Adventurer
      break;
    case 'cooking':
      if (count === 6) updateAchievement('achievement-30', handlerProps); // Chef's Hat
      break;
    case 'mindfulness':
      if (count === 10) updateAchievement('achievement-31', handlerProps); // Mindfulness Master
      break;
    case 'reading':
      if (count === 5) updateAchievement('achievement-32', handlerProps); // Bookworm
      break;
    case 'music':
      if (count === 3) updateAchievement('achievement-36', handlerProps); // Melody Maker
      break;
    case 'film':
      if (count === 4) updateAchievement('achievement-37', handlerProps); // Film Buff
      break;
    case 'pet':
      if (count === 10) updateAchievement('achievement-38', handlerProps); // Pet Parent
      break;
    case 'gardening':
      if (count === 5) updateAchievement('achievement-35', handlerProps); // Planting Seeds
      break;
    case 'shopping':
      if (count === 8) updateAchievement('achievement-40', handlerProps); // Shopping Wizard
      break;
  }
};

export const checkTaskCreationAchievements = (
  taskCount: number,
  task: Omit<Task, 'id' | 'createdAt' | 'completed'>,
  themeCounts: Record<string, number>,
  tasks: Task[],
  handlerProps: AchievementHandlerProps
) => {
  // Check task creation achievement
  if (taskCount === 10) {
    updateAchievement('achievement-12', handlerProps); // Task Creator
  }
  
  // Check if we have created tasks in various categories/themes
  if (task.theme) {
    // Check if we have tasks in 5 different themes
    const uniqueThemes = Object.keys(themeCounts);
    if (uniqueThemes.length === 5) {
      updateAchievement('achievement-20', handlerProps); // Task Pioneer
    }
    
    // Balance Master - having active tasks in all categories
    const hasDaily = tasks.some(t => t.category === 'daily') || task.category === 'daily';
    const hasGoal = tasks.some(t => t.category === 'goal') || task.category === 'goal';
    const hasCustom = tasks.some(t => t.category === 'custom') || task.category === 'custom';
    
    if (hasDaily && hasGoal && hasCustom) {
      updateAchievement('achievement-13', handlerProps); // Balance Master
    }
  }
};

export const checkAllDailyTasksCompletion = (
  currentTasks: Task[],
  streak: number,
  streakUpdatedToday: boolean,
  setStreak: React.Dispatch<React.SetStateAction<number>>,
  setStreakUpdatedToday: React.Dispatch<React.SetStateAction<boolean>>,
  handlerProps: AchievementHandlerProps
) => {
  const dailyTasks = currentTasks.filter(task => task.category === 'daily');
  
  if (dailyTasks.length > 0 && dailyTasks.every(task => task.completed)) {
    if (!streakUpdatedToday) {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem('nostalgiaAchievements_lastLogin');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLogin === yesterdayStr || lastLogin === today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setStreakUpdatedToday(true);
        
        displayStreakToast(newStreak);
        
        if (newStreak >= 7) {
          updateAchievement('achievement-4', handlerProps);
        }
        
        if (newStreak >= 14) {
          updateAchievement('achievement-6', handlerProps);
        }
        
        if (newStreak >= 30) {
          updateAchievement('achievement-7', handlerProps);
        }
      }
    }
  }
};
