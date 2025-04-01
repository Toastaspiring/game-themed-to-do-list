
import React, { useEffect, useState } from 'react';
import { Achievement } from '@/data/achievements';
import * as Icons from 'lucide-react';

interface BadgeUnlockAnimationProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({ 
  achievement, 
  onComplete 
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (achievement) {
      setVisible(true);
      
      // Show animation for 4 seconds, then hide
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onComplete(), 500); // Wait for fade-out animation to complete
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);
  
  if (!achievement) return null;
  
  const IconComponent = Icons[achievement.icon as keyof typeof Icons] as React.ElementType;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center animate-grow-and-shake">
        <div className="relative inline-block">
          <div className="achievement-badge-large mb-4 mx-auto">
            {IconComponent && <IconComponent size={64} />}
          </div>
          <div className="absolute -top-3 -right-3">
            <div className="animate-star-burst w-10 h-10 bg-game-secondary rounded-full opacity-0"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-game-secondary">{achievement.title}</h2>
        <p className="text-sm text-game-text-muted">{achievement.description}</p>
      </div>
    </div>
  );
};

export default BadgeUnlockAnimation;
