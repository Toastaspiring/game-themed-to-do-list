
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { findUserByUsername, validatePassword, createMockUser } from '@/utils/authUtils';

export const signInWithSupabase = async (identifier: string, password: string) => {
  const isEmail = identifier.includes('@');
  
  let authResponse;
  
  if (isEmail) {
    console.log("Signing in with email:", identifier);
    authResponse = await supabase.auth.signInWithPassword({ 
      email: identifier, 
      password 
    });
  } else {
    console.log("Looking up email for username:", identifier);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identifier);
    
    if (profileError) {
      console.error("Profile lookup error:", profileError);
      toast.error(`Error looking up username: ${profileError.message}`);
      throw new Error(`Error looking up username: ${profileError.message}`);
    }
    
    if (!profileData || profileData.length === 0) {
      console.error("No profile found for username:", identifier);
      toast.error(`User not found. Please check your username.`);
      throw new Error('User not found');
    }
    
    if (profileData.length > 1) {
      console.error("Multiple profiles found for username:", identifier);
      toast.error('Multiple accounts found with this username. Please use your email to sign in.');
      throw new Error('Multiple accounts found');
    }
    
    console.log("Found email for username:", profileData[0].email);
    authResponse = await supabase.auth.signInWithPassword({ 
      email: profileData[0].email, 
      password 
    });
  }
  
  const { error } = authResponse;
  
  if (error) {
    console.error("Auth error:", error);
    toast.error(`Login failed: ${error.message}`);
    throw error;
  }
  
  toast.success("Logged in successfully!");
  return authResponse;
};

export const signInDirect = async (username: string, hashedPassword: string) => {
  console.log("Signing in directly with username:", username);
  
  const profile = await findUserByUsername(username);
  
  validatePassword(profile.hashpasswd, hashedPassword);
  
  const mockUser = createMockUser(profile);
  
  localStorage.setItem('directAuthUser', JSON.stringify({
    id: profile.id,
    username: username,
    email: profile.email
  }));
  
  toast.success("Logged in successfully!");
  return mockUser;
};

export const signUpWithSupabase = async (email: string, password: string, username: string) => {
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
};

export const signOutUser = async () => {
  localStorage.removeItem('directAuthUser');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast.error(`Sign out failed: ${error.message}`);
    throw error;
  }
  
  toast.success("Signed out successfully");
};

export const createAdmin = async (email: string, password: string) => {
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
};

export const resetUserPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  if (error) {
    toast.error(`Password reset failed: ${error.message}`);
    throw error;
  }

  toast.success('Password reset email sent. Please check your inbox.');
};
