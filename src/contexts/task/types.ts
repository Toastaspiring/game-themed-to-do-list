
import { Achievement } from '@/data/achievements';
import { Task } from '@/data/defaultTasks';

export interface TaskContextProps {
  tasks: Task[];
  achievements: Achievement[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  streak: number;
  resetDailyTasks: () => void;
  deleteTask: (taskId: string) => void;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  region: string;
}
