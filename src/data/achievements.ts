
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Use Lucide icon name
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'completion' | 'special';
  createdAt: string;
  unlockedAt?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: 'trophy',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'achievement-2',
    title: 'Habit Forming',
    description: 'Complete the same task 3 days in a row',
    icon: 'calendar',
    unlocked: false,
    category: 'streak',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-3',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: 'check-circle',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-4',
    title: 'Consistency Champion',
    description: 'Complete at least one task for 7 days straight',
    icon: 'medal',
    unlocked: false,
    category: 'streak',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'achievement-5',
    title: 'Early Riser',
    description: 'Complete a task before 8AM',
    icon: 'sunrise',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  }
];
