
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import AchievementBadge from './AchievementBadge';

const AchievementList: React.FC = () => {
  const { achievements } = useTaskContext();
  
  return (
    <div className="mb-8 animate-pixel-fade-in">
      <h2 className="text-xl font-bold mb-4 text-game-secondary">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {achievements.map((achievement, index) => (
          <div 
            key={achievement.id} 
            className="transform transition-all hover:scale-110"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AchievementBadge achievement={achievement} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementList;
