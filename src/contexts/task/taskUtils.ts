
import { Task } from '@/data/defaultTasks';
import { toast } from '@/hooks/use-toast';

// Function to get user's current location using browser Geolocation API
export const getCurrentLocation = (): Promise<string> => {
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

export const displayTaskAddedToast = (title: string): void => {
  toast({
    title: "New Task Added",
    description: `'${title}' has been added to your tasks`,
    duration: 4000,
  });
};

export const displayTaskDeletedToast = (): void => {
  toast({
    title: "Task Deleted",
    description: "The task has been removed",
    duration: 4000,
  });
};

export const displayStreakToast = (newStreak: number): void => {
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
};

export const displayStreakResetToast = (): void => {
  toast({
    title: "Streak Reset",
    description: "You missed a day! Your streak has been reset.",
    duration: 4000,
  });
};

export const displayAchievementToast = (title: string, description: string): void => {
  toast({
    title: "Achievement Unlocked!",
    description: `${title}: ${description}`,
    duration: 4000,
  });
};

export const isTaskCompletedToday = (task: Task): boolean => {
  if (!task.completedAt) return false;
  
  const completedDate = new Date(task.completedAt).toDateString();
  const today = new Date().toDateString();
  
  return completedDate === today;
};
