
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const NamePrompt: React.FC = () => {
  const { setUserName } = useUser();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      setUserName(name.trim());
      toast.success(`Welcome, ${name}!`);
    } catch (error) {
      console.error("Error saving name:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-border border-game-primary bg-game-background p-4 md:p-6 rounded-lg w-full max-w-xs md:max-w-md mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-game-accent mb-3 md:mb-4">Welcome to TaskMaster!</h2>
      <p className="text-sm md:text-base text-game-text mb-4">Please enter your name to continue:</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs md:text-sm font-medium block text-game-text">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors text-sm md:text-base"
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full pixel-button text-sm md:text-base"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </form>
    </div>
  );
};

export default NamePrompt;
