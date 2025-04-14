
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Trophy } from 'lucide-react';
import StreakCounter from './StreakCounter';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { achievements } = useTaskContext();
  const isMobile = useIsMobile();
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <header className="bg-game-primary border-b-4 border-game-secondary py-3 md:py-4 px-2 md:px-6 mb-4 md:mb-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <h1 className="text-lg md:text-2xl font-bold text-white tracking-wider animate-pixel-bounce">
            Nostalgia Achievements
          </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center bg-game-background px-2 md:px-3 py-1 rounded-md pixel-border border-game-accent">
            <Trophy size={isMobile ? 14 : 18} className="text-game-secondary mr-1 md:mr-2" />
            <span className="text-xs md:text-sm font-medium">
              {unlockedAchievements}/{totalAchievements}
            </span>
          </div>
          <StreakCounter />
        </div>
      </div>
    </header>
  );
};

export default Header;
