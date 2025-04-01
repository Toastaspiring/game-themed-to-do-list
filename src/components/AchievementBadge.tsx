
import React from 'react';
import { Achievement } from '@/data/achievements';
import * as Icons from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const IconComponent = Icons[achievement.icon as keyof typeof Icons] as React.ElementType;
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`achievement-badge mb-2 ${achievement.unlocked 
          ? 'bg-game-secondary animate-badge-unlock' 
          : 'bg-gray-700 text-gray-500 opacity-50'}`}
      >
        {IconComponent && <IconComponent size={24} />}
      </div>
      <div className="text-center">
        <h3 className={`text-sm font-bold mb-1 ${achievement.unlocked ? 'text-game-secondary' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>
        <p className="text-xs text-game-text-muted">
          {achievement.description}
        </p>
        
        {achievement.progress !== undefined && achievement.maxProgress && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-game-text-muted">Progress</span>
              <span className="text-game-text-muted">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <div className="pixel-progress w-full h-2 bg-gray-800">
              <div 
                style={{ 
                  width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                }} 
                className="bg-game-accent h-full"
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
