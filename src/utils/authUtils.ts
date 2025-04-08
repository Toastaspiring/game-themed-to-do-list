
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const generateSHA256Hash = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const findUserByUsername = async (username: string) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, email, hashpasswd')
    .eq('username', username);
  
  if (profileError) {
    console.error("Profile lookup error:", profileError);
    toast.error(`Error looking up username: ${profileError.message}`);
    throw new Error(`Error looking up username: ${profileError.message}`);
  }
  
  if (!profileData || profileData.length === 0) {
    console.error("No profile found for username:", username);
    toast.error(`User not found. Please check your username.`);
    throw new Error('User not found');
  }
  
  return profileData[0];
};

export const validatePassword = (storedHash: string, inputHash: string) => {
  if (storedHash !== inputHash) {
    console.error("Password does not match");
    toast.error('Invalid password. Please try again.');
    throw new Error('Invalid password');
  }
  return true;
};

export const createMockUser = (profile: any) => {
  return {
    id: profile.id,
    email: profile.email || '',
    user_metadata: {
      username: profile.username
    }
  };
};
