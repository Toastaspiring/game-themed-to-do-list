
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import AchievementBadge from './AchievementBadge';

const AchievementList: React.FC = () => {
  const { achievements } = useTaskContext();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-game-secondary">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {achievements.map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementList;
