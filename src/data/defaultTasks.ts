
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'daily' | 'goal' | 'custom';
  createdAt: string;
  completedAt?: string;
  streak?: number;
  lastCompleted?: string;
  icon?: string;
}

export const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Morning Exercise',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'dumbbell'
  },
  {
    id: 'task-2',
    title: 'Read for 20 minutes',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'book'
  },
  {
    id: 'task-3',
    title: 'Drink 8 glasses of water',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'glass-water'
  },
  {
    id: 'task-4',
    title: 'Learn something new',
    completed: false,
    category: 'goal',
    createdAt: new Date().toISOString(),
    icon: 'lightbulb'
  },
  {
    id: 'task-5',
    title: 'Meditate for 10 minutes',
    completed: false,
    category: 'daily',
    createdAt: new Date().toISOString(),
    streak: 0,
    icon: 'brain'
  }
];
