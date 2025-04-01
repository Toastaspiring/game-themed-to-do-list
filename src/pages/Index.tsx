
import React, { useEffect } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If not loading and not logged in, redirect to login
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show minimal content while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-game-background text-game-text flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  // Only show main content if logged in
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-game-background text-game-text">
        <Navigation />
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 pb-16">
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
