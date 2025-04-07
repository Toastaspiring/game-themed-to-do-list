
import { z } from 'zod';
import { Task } from '@/data/defaultTasks';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['daily', 'goal', 'custom']),
  icon: z.string().optional(),
  theme: z.enum([
    'health', 'learning', 'creativity', 'productivity', 'social',
    'finance', 'technology', 'outdoor', 'cooking', 'mindfulness',
    'reading', 'music', 'film', 'pet', 'gardening', 'shopping'
  ] as const).optional(),
  isMilestone: z.boolean().default(false)
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type TaskTheme = NonNullable<Task['theme']>;

export interface TaskFormProps {
  onTaskAdded?: () => void;
}
