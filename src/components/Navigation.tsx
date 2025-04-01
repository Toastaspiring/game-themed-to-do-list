
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trophy, Menu, X } from 'lucide-react';
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-game-background border-b border-game-primary py-2">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <div className="flex items-center">
              <Trophy size={24} className="text-game-secondary mr-2" />
              <span className="font-bold text-game-accent">Achievement Gardens</span>
            </div>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            onClick={toggleMobileMenu} 
            className="block md:hidden text-game-text"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        
        {/* Desktop navigation */}
        {(!isMobile || mobileMenuOpen) && (
          <div className={`
            ${isMobile ? 
              "absolute top-14 left-0 right-0 bg-game-background border-b border-game-primary z-50 px-4 py-4 shadow-lg" : 
              "flex items-center space-x-4"}
          `}>
            <div className={`flex ${isMobile ? "flex-col space-y-4" : "items-center space-x-4"}`}>
              
              {/* Achievement link for both mobile and desktop */}
              <Link to="/achievements" className={`${isMobile ? "py-2" : ""}`}>
                <Button variant="outline" className="border-game-primary text-game-text w-full justify-start">
                  <Trophy size={16} className="mr-2" />
                  Achievements
                </Button>
              </Link>
              
              <StreakCounter />
              
              {isLoggedIn ? (
                isMobile ? (
                  // Mobile logged-in menu
                  <div className="space-y-2 w-full">
                    <div className="flex items-center space-x-2 py-2">
                      <User size={18} />
                      <span>{username}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate py-1">
                      {localStorage.getItem('userEmail') || 'user@example.com'}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-game-error mt-2" 
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  // Desktop logged-in dropdown
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-game-background hover:bg-game-primary hover:text-white">
                          <User size={18} className="mr-2" />
                          {username}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[200px] p-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Signed in as</p>
                              <p className="text-xs text-gray-400 truncate">
                                {localStorage.getItem('userEmail') || 'user@example.com'}
                              </p>
                            </div>
                            <div className="mt-4">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start text-game-error" 
                                onClick={handleLogout}
                              >
                                <LogOut size={16} className="mr-2" />
                                Sign out
                              </Button>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )
              ) : (
                // Login/Register links
                <div className={`${isMobile ? "flex flex-col space-y-2 w-full" : "flex items-center space-x-2"}`}>
                  <Link to="/login" className={`${isMobile ? "w-full" : ""}`}>
                    <Button variant="outline" className="border-game-primary text-game-text w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className={`${isMobile ? "w-full" : ""}`}>
                    <Button className="bg-game-primary hover:bg-opacity-90 w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
