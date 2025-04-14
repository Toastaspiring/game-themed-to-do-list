
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: { name: string } | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signInDirect: (username: string, hashedPassword: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAdminUser: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  setUserName: (name: string) => void;
  logoutUser: () => void;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  hashpasswd?: string;
}
