
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
    icon: 'Trophy',
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
    icon: 'Calendar',
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
    icon: 'CheckCircle',
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
    icon: 'Medal',
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
    icon: 'Sunrise',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  // New achievements below
  {
    id: 'achievement-6',
    title: 'Fortnight Warrior',
    description: 'Maintain a 14-day streak',
    icon: 'Flame',
    unlocked: false,
    category: 'streak',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 14
  },
  {
    id: 'achievement-7',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: 'CalendarClock',
    unlocked: false,
    category: 'streak',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'achievement-8',
    title: 'Goal Getter',
    description: 'Complete 5 goal tasks',
    icon: 'Target',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-9',
    title: 'Perfectionist',
    description: 'Complete all tasks in your list in a single day',
    icon: 'Star',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-10',
    title: 'Night Owl',
    description: 'Complete a task after 10PM',
    icon: 'Moon',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-11',
    title: 'Weekend Warrior',
    description: 'Complete tasks on both Saturday and Sunday',
    icon: 'CalendarDays',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-12',
    title: 'Task Creator',
    description: 'Create 10 new tasks',
    icon: 'PenLine',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-13',
    title: 'Balance Master',
    description: 'Have active tasks in all categories',
    icon: 'Scale',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-14',
    title: 'Efficiency Expert',
    description: 'Complete 5 tasks in a single day',
    icon: 'TimerReset',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-15',
    title: 'Task Veteran',
    description: 'Complete 50 tasks total',
    icon: 'Award',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 50
  }
];
