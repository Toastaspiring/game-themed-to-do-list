
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import AchievementList from '@/components/AchievementList';

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-game-background text-game-text">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 pb-16">
          <div className="mb-8">
            <AchievementList />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-game-accent">Tasks</h2>
            <TaskForm />
            <TaskList />
          </div>
        </main>
        
        <footer className="text-center py-4 text-xs text-game-text-muted">
          <p>Nostalgic Achievement Gardens &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </TaskProvider>
  );
};

export default Index;
