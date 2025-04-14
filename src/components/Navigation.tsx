
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-game-primary p-2 md:p-4 z-10 shadow-lg border-t-2 border-game-secondary">
      <div className="flex justify-around max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center text-xs md:text-sm ${
            location.pathname === '/' ? 'text-game-accent' : 'text-game-text'
          } hover:text-game-accent transition-colors`}
        >
          <Home size={isMobile ? 18 : 20} />
          <span className="mt-1">{t('home')}</span>
        </Link>
        
        <Link 
          to="/achievements" 
          className={`flex flex-col items-center text-xs md:text-sm ${
            location.pathname === '/achievements' ? 'text-game-accent' : 'text-game-text'
          } hover:text-game-accent transition-colors`}
        >
          <Trophy size={isMobile ? 18 : 20} />
          <span className="mt-1">{t('achievements')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
