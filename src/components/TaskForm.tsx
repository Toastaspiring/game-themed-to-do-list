
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'custom' as 'daily' | 'goal' | 'custom'
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim() === '') return;
    
    addTask({
      title: newTask.title,
      category: newTask.category,
      streak: 0
    });
    
    setNewTask({
      title: '',
      category: 'custom'
    });
    
    setIsExpanded(false);
  };

  const handleAddTaskClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to add custom tasks.",
        duration: 4000,
      });
      navigate('/login');
      return;
    }
    
    setIsExpanded(true);
  };

  return (
    <div className="mb-8">
      {!isExpanded ? (
        <button
          onClick={handleAddTaskClick}
          className="w-full py-3 px-4 rounded-lg pixel-border border-game-accent bg-game-background hover:bg-opacity-80 transition-colors text-left flex items-center"
        >
          {isLoggedIn ? (
            <Plus size={20} className="mr-2 text-game-accent" />
          ) : (
            <Lock size={20} className="mr-2 text-game-accent" />
          )}
          <span>{isLoggedIn ? 'Add new task...' : 'Login to add tasks...'}</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-game-background rounded-lg p-4 pixel-border border-game-accent animate-pixel-fade-in">
          <div className="mb-4">
            <input
              type="text"
              placeholder="What do you need to do?"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full bg-transparent border-b-2 border-game-accent pb-2 focus:outline-none focus:border-game-secondary transition-colors"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Task type:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="daily"
                  checked={newTask.category === 'daily'}
                  onChange={() => setNewTask({ ...newTask, category: 'daily' })}
                  className="mr-2"
                />
                Daily
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="goal"
                  checked={newTask.category === 'goal'}
                  onChange={() => setNewTask({ ...newTask, category: 'goal' })}
                  className="mr-2"
                />
                Goal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="custom"
                  checked={newTask.category === 'custom'}
                  onChange={() => setNewTask({ ...newTask, category: 'custom' })}
                  className="mr-2"
                />
                Custom
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pixel-button"
              disabled={newTask.title.trim() === ''}
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
