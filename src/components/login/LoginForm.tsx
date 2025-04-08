import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { generateSHA256Hash } from '@/utils/authUtils';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signInDirect } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
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
      // Generate hash of the entered password
      const hashedPassword = await generateSHA256Hash(formData.password);
      
      // Call the direct sign-in method
      await signInDirect(formData.username, hashedPassword);
      
      if (onSuccess) onSuccess();
      navigate('/');
    } catch (error) {
      // Error is already handled in the signInDirect function
      console.error("Login form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
            placeholder="Enter your username"
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
