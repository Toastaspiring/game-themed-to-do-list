
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import NamePrompt from '@/components/NamePrompt';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);

  // Show minimal content while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-game-background text-game-text flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  // Show name prompt if no user is set
  if (!user) {
    return (
      <div className="min-h-screen bg-game-background text-game-text flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <NamePrompt />
        </div>
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-game-background text-game-text">
        <Navigation />
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 pb-16">
          <div className="animate-pixel-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-game-accent">Tasks</h2>
              
              <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                <DialogTrigger asChild>
                  <Button className="pixel-button">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-game-background border-2 border-game-primary">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-game-accent">Add New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm onTaskAdded={() => setIsTaskFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
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
