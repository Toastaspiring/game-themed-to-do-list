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

export const achievements = [
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
  },
  {
    id: 'achievement-16',
    title: 'Priority Manager',
    description: 'Complete 3 high priority tasks in a row',
    icon: 'AlertCircle',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-17',
    title: 'Time Optimizer',
    description: 'Complete a task in less than 10 minutes',
    icon: 'Clock',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-18',
    title: 'Knowledge Seeker',
    description: 'Complete 10 learning-related tasks',
    icon: 'BookOpen',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-19',
    title: 'Focused Mind',
    description: 'Complete 3 tasks without checking social media',
    icon: 'Focus',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-20',
    title: 'Task Pioneer',
    description: 'Create tasks in 5 different categories',
    icon: 'Map',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-21',
    title: 'Quick Starter',
    description: 'Complete a task within 5 minutes of creating it',
    icon: 'Zap',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-22',
    title: 'Health Enthusiast',
    description: 'Complete 15 health-related tasks',
    icon: 'Heart',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'achievement-23',
    title: 'Seasonal Planner',
    description: 'Create and complete tasks in all four seasons',
    icon: 'Snowflake',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'achievement-24',
    title: 'Global Achiever',
    description: 'Complete tasks in 3 different locations',
    icon: 'Globe',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-25',
    title: 'Creative Genius',
    description: 'Complete 10 creative or artistic tasks',
    icon: 'Palette',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-26',
    title: 'Social Butterfly',
    description: 'Complete 5 social activities',
    icon: 'Users',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-27',
    title: 'Financial Wizard',
    description: 'Complete 8 finance-related tasks',
    icon: 'DollarSign',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 8
  },
  {
    id: 'achievement-28',
    title: 'Tech Guru',
    description: 'Complete 7 technology-related tasks',
    icon: 'Laptop',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'achievement-29',
    title: 'Adventurer',
    description: 'Complete 5 outdoor activities',
    icon: 'Compass',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-30',
    title: 'Chef\'s Hat',
    description: 'Complete 6 cooking-related tasks',
    icon: 'Utensils',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 6
  },
  {
    id: 'achievement-31',
    title: 'Mindfulness Master',
    description: 'Complete 10 mental wellness tasks',
    icon: 'Brain',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-32',
    title: 'Bookworm',
    description: 'Complete 5 reading-related tasks',
    icon: 'Book',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-33',
    title: 'Evernote Champion',
    description: 'Create 20 notes within tasks',
    icon: 'FileText',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'achievement-34',
    title: 'Milestone Maker',
    description: 'Complete a task marked as a milestone',
    icon: 'Flag',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString()
  },
  {
    id: 'achievement-35',
    title: 'Planting Seeds',
    description: 'Complete 5 gardening or plant care tasks',
    icon: 'Flower',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'achievement-36',
    title: 'Melody Maker',
    description: 'Complete 3 music-related tasks',
    icon: 'Music',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-37',
    title: 'Film Buff',
    description: 'Complete 4 movie or film-related tasks',
    icon: 'Film',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'achievement-38',
    title: 'Pet Parent',
    description: 'Complete 10 pet care tasks',
    icon: 'Paw',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'achievement-39',
    title: 'Coordinator',
    description: 'Complete tasks with 3 different collaborators',
    icon: 'UserPlus',
    unlocked: false,
    category: 'special',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'achievement-40',
    title: 'Shopping Wizard',
    description: 'Complete 8 shopping-related tasks',
    icon: 'ShoppingCart',
    unlocked: false,
    category: 'completion',
    createdAt: new Date().toISOString(),
    progress: 0,
    maxProgress: 8
  }
];
