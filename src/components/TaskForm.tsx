
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TaskFormProps, taskSchema, TaskFormValues, TaskTheme } from './task/task-schema';
import { 
  TitleField, 
  CategoryField, 
  IconField, 
  ThemeField, 
  MilestoneField 
} from './task/TaskFormFields';
import LocationTracker, { getCurrentLocation } from './task/LocationTracker';

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const { addTask } = useTaskContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: TaskFormValues) => {
    if (!user) {
      toast.error("Please enter your name to add tasks");
      return;
    }

    setIsLoading(true);

    try {
      const userLocation = await getCurrentLocation();
      
      const newTask = {
        title: values.title,
        category: values.category,
        icon: values.icon,
        theme: values.theme as TaskTheme,
        isMilestone: values.isMilestone,
        location: userLocation || undefined,
        userId: user.name,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

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
          <TitleField form={form} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryField form={form} isLoading={isLoading} />
            <IconField form={form} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThemeField form={form} isLoading={isLoading} />
            <MilestoneField form={form} isLoading={isLoading} />
          </div>
          
          <LocationTracker />

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
