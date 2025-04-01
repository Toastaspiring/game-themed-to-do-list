
import React from 'react';
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
import { LogOut, User, Trophy } from 'lucide-react';
import StreakCounter from './StreakCounter';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || 'User';

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
        
        <div className="flex items-center space-x-4">
          <StreakCounter />
          
          {isLoggedIn ? (
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
      </div>
    </div>
  );
};

export default Navigation;
