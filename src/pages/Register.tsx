
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Register: React.FC = () => {
  const { registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerUser(formData.username, formData.email, formData.password);
      toast({
        title: "Account created",
        description: "You can now log in.",
        variant: "default"
      });
      navigate('/login');
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
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
          <p className="text-game-text-muted">Create your account</p>
        </div>

        <div className="pixel-border border-game-primary bg-game-background p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium block text-game-text">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                placeholder="Choose a username"
                disabled={isLoading}
              />
            </div>

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
              <label htmlFor="password" className="text-sm font-medium block text-game-text">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                placeholder="Create a password"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium block text-game-text">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full pixel-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-game-text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-game-accent hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
