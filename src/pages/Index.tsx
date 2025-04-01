
import React, { useEffect } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import AchievementList from '@/components/AchievementList';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Optional: Uncomment this section if you want to force login
  /*
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  */

  return (
    <TaskProvider>
      <div className="min-h-screen bg-game-background text-game-text">
        <Navigation />
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 pb-16">
          <div className="mb-8">
            <AchievementList />
          </div>
          
          <div className="animate-pixel-fade-in">
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
