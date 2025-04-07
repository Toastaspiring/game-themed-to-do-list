
import React from 'react';
import { Trophy } from 'lucide-react';

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <Trophy size={48} className="text-game-secondary animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-game-accent mb-2">Achievement Gardens</h1>
      <p className="text-game-text-muted">Log in to track your progress</p>
    </div>
  );
};

export default LoginHeader;
