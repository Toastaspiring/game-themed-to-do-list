
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/data/defaultTasks';

const themeOptions = [
  { value: 'health', label: 'Health & Fitness' },
  { value: 'learning', label: 'Learning & Education' },
  { value: 'creativity', label: 'Creative & Artistic' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'social', label: 'Social Activities' },
  { value: 'finance', label: 'Financial' },
  { value: 'technology', label: 'Technology' },
  { value: 'outdoor', label: 'Outdoor Activities' },
  { value: 'cooking', label: 'Cooking & Food' },
  { value: 'mindfulness', label: 'Mindfulness & Mental Health' },
  { value: 'reading', label: 'Reading' },
  { value: 'music', label: 'Music' },
  { value: 'film', label: 'Film & Entertainment' },
  { value: 'pet', label: 'Pet Care' },
  { value: 'gardening', label: 'Gardening & Plants' },
  { value: 'shopping', label: 'Shopping' }
];

const iconOptions = [
  { value: 'check', label: 'Check' },
  { value: 'book', label: 'Book' },
  { value: 'dumbbell', label: 'Fitness' },
  { value: 'brain', label: 'Mind' },
  { value: 'glass-water', label: 'Water' },
  { value: 'lightbulb', label: 'Idea' },
  { value: 'heart', label: 'Health' },
  { value: 'dollar-sign', label: 'Finance' },
  { value: 'laptop', label: 'Technology' },
  { value: 'compass', label: 'Outdoor' },
  { value: 'utensils', label: 'Cooking' },
  { value: 'music', label: 'Music' },
  { value: 'film', label: 'Film' },
  { value: 'paw-print', label: 'Pet' },
  { value: 'flower', label: 'Plant' },
  { value: 'shopping-cart', label: 'Shopping' }
];

type TaskTheme = NonNullable<Task['theme']>;

const taskSchema = z.object({
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

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onTaskAdded?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const { addTask } = useTaskContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      category: 'daily',
      icon: 'check',
      theme: 'productivity',
      isMilestone: false
    }
  });

  useEffect(() => {
    const requestUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                );
                const data = await response.json();
                const city = data.address?.city || data.address?.town || 'Unknown';
                setUserLocation(city);
              } catch (error) {
                console.error('Error fetching location details:', error);
                setUserLocation('Unknown');
              }
            },
            (error) => {
              console.error('Error getting location:', error);
              setUserLocation(null);
            }
          );
        } else {
          console.log('Geolocation not supported by this browser');
          setUserLocation(null);
        }
      } catch (error) {
        console.error('Error requesting location:', error);
        setUserLocation(null);
      }
    };

    requestUserLocation();
  }, []);

  const onSubmit = async (values: TaskFormValues) => {
    if (!user) {
      toast.error("Please log in to add tasks");
      return;
    }

    setIsLoading(true);

    try {
      const newTask = {
        title: values.title,
        category: values.category,
        icon: values.icon,
        theme: values.theme as TaskTheme,
        isMilestone: values.isMilestone,
        location: userLocation || undefined
      };

      if (user) {
        const { error } = await supabase
          .from('tasks')
          .insert({
            title: newTask.title,
            category: newTask.category,
            icon: newTask.icon,
            user_id: user.id,
            theme: newTask.theme,
            is_milestone: newTask.isMilestone,
            location: newTask.location
          });

        if (error) throw error;
      }

      addTask(newTask);
      
      form.reset({
        title: '',
        category: 'daily',
        icon: 'check',
        theme: 'productivity',
        isMilestone: false
      });
      
      toast.success("Task added successfully");
      
      // Call the callback function if provided
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-game-primary/20 p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-game-text">Task Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter task title" 
                    {...field} 
                    className="bg-transparent border-2 border-game-primary focus:border-game-secondary text-game-text"
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-game-text">Category</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-transparent border-2 border-game-primary text-game-text">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-game-background border-2 border-game-primary">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="goal">Goal</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-game-text">Icon</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-transparent border-2 border-game-primary text-game-text">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent className="bg-game-background border-2 border-game-primary max-h-[200px] overflow-y-auto">
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-game-text">Theme</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-transparent border-2 border-game-primary text-game-text">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-game-background border-2 border-game-primary max-h-[200px] overflow-y-auto">
                        {themeOptions.map(theme => (
                          <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMilestone"
              render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-3 space-y-0 mt-8">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="border-2 border-game-primary data-[state=checked]:bg-game-secondary data-[state=checked]:border-game-secondary"
                    />
                  </FormControl>
                  <FormLabel className="text-game-text cursor-pointer">
                    Mark as milestone
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {userLocation && (
            <div className="text-sm text-game-text-muted mt-2">
              Current location: {userLocation}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full pixel-button"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
