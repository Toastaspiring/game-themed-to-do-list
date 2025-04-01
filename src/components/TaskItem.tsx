
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/data/defaultTasks';
import { Check, Trash2, Flame } from 'lucide-react';
import * as Icons from 'lucide-react';

// Dynamic icon component
const DynamicIcon: React.FC<{
  name?: string;
  size?: number;
  className?: string;
}> = ({ name, size = 18, className = "" }) => {
  if (!name) return null;
  
  const LucideIcon = Icons[name as keyof typeof Icons] as React.ElementType;
  
  return LucideIcon ? (
    <LucideIcon size={size} className={className} />
  ) : null;
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();

  return (
    <div 
      className={`mb-3 rounded-lg pixel-border p-4 transition-all duration-300
        ${task.completed 
          ? 'bg-game-success bg-opacity-20 border-game-success' 
          : 'bg-game-background border-game-primary'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => toggleTaskCompletion(task.id)}
            className={`w-8 h-8 rounded-md flex items-center justify-center mr-4 transition-all
              ${task.completed 
                ? 'bg-game-success animate-task-complete' 
                : 'bg-transparent border-2 border-gray-600 hover:border-game-accent'}`}
          >
            {task.completed && <Check size={16} className="text-white" />}
          </button>
          
          <div className="flex items-center">
            {task.icon && (
              <div className={`mr-3 ${task.completed ? 'text-game-success' : 'text-game-accent'}`}>
                <DynamicIcon name={task.icon} size={18} />
              </div>
            )}
            
            <span 
              className={`font-medium transition-all ${
                task.completed 
                  ? 'line-through text-gray-400' 
                  : 'text-game-text'
              }`}
            >
              {task.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {task.category === 'daily' && task.streak && task.streak > 1 && (
            <div className="flex items-center bg-game-background bg-opacity-50 px-2 py-0.5 rounded text-xs">
              <Flame size={12} className="mr-1 text-game-secondary" />
              <span className="text-game-secondary font-bold">{task.streak}</span>
            </div>
          )}
          
          <button
            onClick={() => deleteTask(task.id)}
            className="text-gray-500 hover:text-game-error transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
