
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { iconOptions, themeOptions } from './task-options';
import { UseFormReturn } from 'react-hook-form';
import { TaskFormValues } from './task-schema';

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  isLoading: boolean;
}

export const TitleField: React.FC<TaskFormFieldsProps> = ({ form, isLoading }) => (
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
);

export const CategoryField: React.FC<TaskFormFieldsProps> = ({ form, isLoading }) => (
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
);

export const IconField: React.FC<TaskFormFieldsProps> = ({ form, isLoading }) => (
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
);

export const ThemeField: React.FC<TaskFormFieldsProps> = ({ form, isLoading }) => (
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
);

export const MilestoneField: React.FC<TaskFormFieldsProps> = ({ form, isLoading }) => (
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
            disabled={isLoading}
          />
        </FormControl>
        <FormLabel className="text-game-text cursor-pointer">
          Mark as milestone
        </FormLabel>
      </FormItem>
    )}
  />
);
