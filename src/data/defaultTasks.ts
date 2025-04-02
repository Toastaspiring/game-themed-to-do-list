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
    title: 'Morning Exercise',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'dumbbell',
    theme: 'health'
  },
  {
    id: 'task-2',
    title: 'Read for 20 minutes',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'book',
    theme: 'reading'
  },
  {
    id: 'task-3',
    title: 'Drink 8 glasses of water',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'glass-water',
    theme: 'health'
  },
  {
    id: 'task-4',
    title: 'Learn something new',
    completed: false,
    category: 'goal',
    createdAt: new Date().toISOString(),
    icon: 'lightbulb',
    theme: 'learning',
    isMilestone: true
  },
  {
    id: 'task-5',
    title: 'Meditate for 10 minutes',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'brain',
    theme: 'mindfulness'
  }
];
