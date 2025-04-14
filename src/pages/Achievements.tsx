
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AchievementList from '@/components/AchievementList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/TranslationContext';

const Achievements: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-game-background text-game-text">
      <TaskProvider>
        <LanguageSwitcher />
        <Navigation />
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 pb-16">
          <div className="mb-8">
            <AchievementList />
          </div>
        </main>
        
        <footer className="text-center py-4 text-xs text-game-text-muted">
          <p>{t('copyright')} {new Date().getFullYear()}</p>
        </footer>
      </TaskProvider>
    </div>
  );
};

export default Achievements;
