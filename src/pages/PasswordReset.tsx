
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Extract token and email from URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const expiresIn = searchParams.get('expires_in');
  const type = searchParams.get('type');

  useEffect(() => {
    // If we don't have the access_token, this is not a valid reset password link
    if (!accessToken) {
      toast.error('Invalid password reset link. Please request a new one.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [accessToken, navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // First set the access token in the session
      if (accessToken && refreshToken && expiresIn && type === 'recovery') {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        // Then update the user's password
        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          throw error;
        }

        toast.success('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Invalid password reset link. Please request a new one.');
      }
    } catch (error: any) {
      toast.error(`Error resetting password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-game-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-game-text mb-2">Reset Password</h1>
          <p className="text-game-text-muted">Enter your new password below</p>
        </div>
        
        <div className="pixel-border border-game-primary bg-game-background p-6 rounded-lg">
          {accessToken ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium block text-game-text">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-game-text-muted" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                    placeholder="Enter your new password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium block text-game-text">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-game-text-muted" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 px-3 py-2 bg-transparent border-b-2 border-game-primary focus:border-game-secondary outline-none transition-colors"
                    placeholder="Confirm your new password"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full pixel-button"
                disabled={loading}
              >
                {loading ? 'Resetting password...' : 'Reset Password'}
                {!loading && <ArrowRight className="ml-2" size={16} />}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <Mail className="mx-auto h-12 w-12 text-game-primary mb-4" />
              <p className="text-game-text">Validating your reset link...</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-game-text-muted">
            Remember your password?{" "}
            <button 
              onClick={() => navigate('/login')} 
              className="text-game-accent hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
