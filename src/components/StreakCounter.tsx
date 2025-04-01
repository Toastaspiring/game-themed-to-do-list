
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Flame } from 'lucide-react';

const StreakCounter: React.FC = () => {
  const { streak } = useTaskContext();

  return (
    <div className={`flex items-center bg-game-background rounded-md px-3 py-1 pixel-border border-${streak > 0 ? 'game-secondary' : 'gray-600'}`}>
      <Flame 
        size={18} 
        className={`mr-2 ${streak > 0 ? 'text-game-secondary' : 'text-gray-500'}`} 
      />
      <div className="flex items-center">
        <span className="text-sm font-medium">Streak:</span>
        <span className={`ml-1 text-sm font-bold ${streak > 0 ? 'text-game-secondary' : 'text-gray-500'}`}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      </div>
    </div>
  );
};

export default StreakCounter;
