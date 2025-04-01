
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trophy, Menu, Home } from 'lucide-react';
import StreakCounter from './StreakCounter';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || 'User';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    
    toast({
      title: "Logged out successfully",
      description: "Come back soon!"
    });
    
    navigate('/login');
  };

  // Mobile Menu Items Component
  const MenuItems = () => (
    <div className="flex flex-col space-y-4 w-full">
      <Link to="/" className="w-full" onClick={() => setMobileMenuOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          <Home size={18} className="mr-2" />
          Home
        </Button>
      </Link>
      
      <Link to="/achievements" className="w-full" onClick={() => setMobileMenuOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          <Trophy size={18} className="mr-2" />
          Achievements
        </Button>
      </Link>
      
      {isLoggedIn ? (
        <div className="space-y-4 pt-2 border-t border-game-primary">
          <div className="flex items-center space-x-2 py-2">
            <User size={18} />
            <span className="font-medium">{username}</span>
          </div>
          <div className="text-xs text-gray-400 truncate">
            {localStorage.getItem('userEmail') || 'user@example.com'}
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-game-error mt-2" 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 pt-2 border-t border-game-primary">
          <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Login
            </Button>
          </Link>
          <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
            <Button className="bg-game-primary hover:bg-opacity-90 w-full">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-game-background border-b border-game-primary py-2 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        {/* Logo always visible */}
        <Link to="/" className="flex items-center">
          <Trophy size={24} className="text-game-secondary mr-2" />
          <span className="font-bold text-game-accent">Achievement Gardens</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {/* Streak Counter visible on main bar if space permits */}
          {!isMobile && <StreakCounter />}
          
          {/* Sheet for mobile navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-game-background border-l border-game-primary">
              <div className="py-6 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <Trophy size={24} className="text-game-secondary mr-2" />
                  <span className="font-bold text-game-accent">Menu</span>
                </div>
                
                {/* Mobile only: Show streak at the top of menu */}
                <div className="mb-4">
                  <StreakCounter />
                </div>
                
                <MenuItems />
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop navigation buttons */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/achievements">
                <Button variant="outline" className="border-game-primary text-game-text">
                  <Trophy size={16} className="mr-2" />
                  Achievements
                </Button>
              </Link>
              
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="border-game-primary text-game-text"
                  onClick={handleLogout}
                >
                  <User size={16} className="mr-2" />
                  {username}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="border-game-primary text-game-text">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-game-primary hover:bg-opacity-90">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
