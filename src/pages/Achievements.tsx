
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AchievementList from '@/components/AchievementList';

const Achievements: React.FC = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-game-background text-game-text">
        <Navigation />
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 pb-16">
          <div className="mb-8">
            <AchievementList />
          </div>
        </main>
        
        <footer className="text-center py-4 text-xs text-game-text-muted">
          <p>Nostalgic Achievement Gardens &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </TaskProvider>
  );
};

export default Achievements;
