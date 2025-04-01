
import React, { useState } from 'react';
import { Achievement } from '@/data/achievements';
import * as Icons from 'lucide-react';
import AchievementDetailsModal from './AchievementDetailsModal';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get the correct icon component
  const IconComponent = achievement.icon in Icons
    ? (Icons[achievement.icon as keyof typeof Icons] as React.ElementType)
    : Icons.Award;
  
  return (
    <>
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div 
          className={`achievement-badge mb-2 ${achievement.unlocked 
            ? 'bg-game-secondary animate-badge-unlock' 
            : 'bg-gray-700 text-gray-500 opacity-50'}`}
        >
          <IconComponent size={24} />
        </div>
        <h3 className={`text-sm font-bold text-center ${achievement.unlocked ? 'text-game-secondary' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>
      </div>
      
      <AchievementDetailsModal
        achievement={achievement}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AchievementBadge;
