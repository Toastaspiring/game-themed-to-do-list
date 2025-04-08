
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
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
      // Check if identifier is a username to provide better error messages
      if (!formData.identifier.includes('@')) {
        // It's a username, let's first check if it exists
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('email, username')
          .eq('username', formData.identifier);
        
        console.log("Profile lookup result:", { profileData, error });
        
        if (error) {
          toast.error(`Error looking up username: ${error.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!profileData || profileData.length === 0) {
          toast.error(`Username "${formData.identifier}" not found. Please check your username or use your email address.`);
          setIsLoading(false);
          return;
        }
        
        if (profileData.length > 1) {
          toast.error('Multiple accounts found with this username. Please use your email to sign in.');
          setIsLoading(false);
          return;
        }
        
        // If we made it here, we have a single profile with this username
        // Now attempt sign in with the associated email
        await signIn(profileData[0].email, formData.password);
      } else {
        // It's an email, sign in directly
        await signIn(formData.identifier, formData.password);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled in the signIn function
      console.error("Login form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      toast.error('Please enter your email first');
      return;
    }

    // If the identifier looks like an email
    if (formData.identifier.includes('@')) {
      try {
        await resetPassword(formData.identifier);
      } catch (error) {
        // Error handling is done in the resetPassword function
      }
    } else {
      // If it's a username, first fetch the associated email
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', formData.identifier);

        if (error || !profileData || profileData.length === 0) {
          toast.error('Could not find an email for this username');
          return;
        }

        await resetPassword(profileData[0].email);
      } catch (error) {
        // Error handling is done in the resetPassword function
      }
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
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-sm text-game-accent hover:underline"
            >
              Forgot password?
            </button>
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
