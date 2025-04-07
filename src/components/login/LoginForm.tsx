
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
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
    setIsLoading(true);
    
    try {
      await signIn(formData.identifier, formData.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-border border-game-primary bg-game-background p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-sm font-medium block text-game-text">
            Email or Username
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
            placeholder="Enter your email or username"
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
  );
};

export default LoginForm;
