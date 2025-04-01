
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['daily', 'goal', 'custom']),
  icon: z.string().optional()
});

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      category: 'daily',
      icon: 'check'
    }
  });

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
        icon: values.icon
      };

      // If user is logged in, save to Supabase
      if (user) {
        const { error } = await supabase
          .from('tasks')
          .insert({
            title: newTask.title,
            category: newTask.category,
            icon: newTask.icon,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Add to local state
      addTask(newTask);
      
      // Reset the form
      form.reset({
        title: '',
        category: 'daily',
        icon: 'check'
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-game-primary/20 p-4 rounded-lg border-2 border-game-primary">
      <h3 className="text-lg font-bold mb-4 text-game-accent">Add New Task</h3>
      
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
