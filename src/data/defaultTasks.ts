
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  category: 'daily' | 'goal' | 'custom';
  icon?: string;
  streak?: number;
  lastCompleted?: string;
  theme?: 'health' | 'learning' | 'creativity' | 'productivity' | 'social' | 'finance' | 
         'technology' | 'outdoor' | 'cooking' | 'mindfulness' | 'reading' | 'music' | 
         'film' | 'pet' | 'gardening' | 'shopping';
  isMilestone?: boolean;
  location?: string;
  completionLocation?: string;
}

export const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Set your first goal',
    completed: false,
    category: 'goal',
    createdAt: new Date().toISOString(),
    icon: 'target',
    theme: 'productivity',
    isMilestone: true
  }
];
