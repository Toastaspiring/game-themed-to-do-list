
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Don't show navigation on login or register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-game-primary p-4 z-10 shadow-lg border-t-2 border-game-secondary">
      <div className="flex justify-around max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center text-sm ${
            location.pathname === '/' ? 'text-game-accent' : 'text-game-text'
          } hover:text-game-accent transition-colors`}
        >
          <Home size={20} />
          <span className="mt-1">Home</span>
        </Link>
        
        <Link 
          to="/achievements" 
          className={`flex flex-col items-center text-sm ${
            location.pathname === '/achievements' ? 'text-game-accent' : 'text-game-text'
          } hover:text-game-accent transition-colors`}
        >
          <Trophy size={20} />
          <span className="mt-1">Achievements</span>
        </Link>
        
        {user ? (
          <button
            onClick={() => signOut()}
            className="flex flex-col items-center text-sm text-game-text hover:text-game-accent transition-colors"
          >
            <LogOut size={20} />
            <span className="mt-1">Sign Out</span>
          </button>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`flex flex-col items-center text-sm ${
                location.pathname === '/login' ? 'text-game-accent' : 'text-game-text'
              } hover:text-game-accent transition-colors`}
            >
              <LogIn size={20} />
              <span className="mt-1">Login</span>
            </Link>
            
            <Link 
              to="/register" 
              className={`flex flex-col items-center text-sm ${
                location.pathname === '/register' ? 'text-game-accent' : 'text-game-text'
              } hover:text-game-accent transition-colors`}
            >
              <UserPlus size={20} />
              <span className="mt-1">Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
