
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn, createAdminUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCreator, setShowAdminCreator] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    email: 'admin@example.com',
    password: 'admin'
  });
  const [adminCreating, setAdminCreating] = useState(false);

  // Listen for Ctrl+Shift+A key combination to show admin creator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminCreator(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Error is already handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreating(true);
    
    try {
      await createAdminUser(adminFormData.email, adminFormData.password);
    } catch (error) {
      // Error is already handled in the createAdminUser function
    } finally {
      setAdminCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-game-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-game-text hover:text-game-accent mb-6">
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Home</span>
          </Link>
          <div className="flex justify-center mb-4">
            <Trophy size={48} className="text-game-secondary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-game-accent mb-2">Achievement Gardens</h1>
          <p className="text-game-text-muted">Log in to track your progress</p>
        </div>

        <div className="pixel-border border-game-primary bg-game-background p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block text-game-text">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium block text-game-text">
                  Password
                </label>
                <a href="#" className="text-sm text-game-accent hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full pixel-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-game-text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-game-accent hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
        
        {/* Hidden admin creator - press Ctrl+Shift+A to reveal */}
        {showAdminCreator && (
          <div className="mt-8 pixel-border border-red-500 bg-game-background p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-500 mb-4">Create Admin User</h2>
            <form onSubmit={handleAdminCreate} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="adminEmail" className="text-sm font-medium block text-game-text">
                  Admin Email
                </label>
                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  value={adminFormData.email}
                  onChange={handleAdminChange}
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-red-500 focus:border-red-300 outline-none transition-colors"
                  placeholder="Admin email"
                  disabled={adminCreating}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="adminPassword" className="text-sm font-medium block text-game-text">
                  Admin Password
                </label>
                <input
                  id="adminPassword"
                  name="password"
                  type="password"
                  value={adminFormData.password}
                  onChange={handleAdminChange}
                  className="w-full px-3 py-2 bg-transparent border-b-2 border-red-500 focus:border-red-300 outline-none transition-colors"
                  placeholder="Admin password"
                  disabled={adminCreating}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-500 text-white hover:bg-red-600"
                disabled={adminCreating}
              >
                {adminCreating ? 'Creating...' : 'Create Admin User'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
