
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy } from 'lucide-react';

const LoginHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="mb-8 text-center">
      <button 
        onClick={handleBackToHome} 
        className="inline-flex items-center text-game-text hover:text-game-accent mb-6"
      >
        <ChevronLeft size={20} />
        <span className="ml-1">Back to Home</span>
      </button>
      <div className="flex justify-center mb-4">
        <Trophy size={48} className="text-game-secondary animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-game-accent mb-2">Achievement Gardens</h1>
      <p className="text-game-text-muted">Log in to track your progress</p>
    </div>
  );
};

export default LoginHeader;
