import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAdminUser: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    try {
      const isEmail = identifier.includes('@');
      
      let authResponse;
      
      if (isEmail) {
        authResponse = await supabase.auth.signInWithPassword({ 
          email: identifier, 
          password 
        });
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();
        
        if (profileError || !profileData?.email) {
          toast.error('User not found. Please check your username.');
          throw new Error('User not found');
        }
        
        authResponse = await supabase.auth.signInWithPassword({ 
          email: profileData.email, 
          password 
        });
      }
      
      const { error } = authResponse;
      
      if (error) {
        toast.error(`Login failed: ${error.message}`);
        throw error;
      }
      
      toast.success("Logged in successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data: existingUser, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        toast.error('Username is already taken. Please choose another one.');
        throw new Error('Username already taken');
      }
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) {
        toast.error(`Registration failed: ${error.message}`);
        throw error;
      }
      
      toast.success("Registration successful! Please check your email for confirmation.");
      navigate('/login');
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
  };

  const createAdminUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: 'admin',
            role: 'admin'
          }
        }
      });

      if (error) {
        toast.error(`Admin creation failed: ${error.message}`);
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: 'admin'
          });

        if (profileError) {
          toast.error(`Admin profile creation failed: ${profileError.message}`);
          throw profileError;
        }
      }
      
      toast.success("Admin user created successfully!");
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast.error(`Password reset failed: ${error.message}`);
        throw error;
      }

      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error("Error during password reset:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      createAdminUser, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
