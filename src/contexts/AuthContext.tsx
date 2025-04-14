
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUserName: (name: string) => void;
  logoutUser: () => void;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const setUserName = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const loginUser = async (username: string, password: string) => {
    // Since we're using local storage only, this is a simplified version
    // that just sets the user's name from the username
    setUserName(username);
  };

  const registerUser = async (username: string, email: string, password: string) => {
    // Simple registration that just sets the user's name
    setUserName(username);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      setUserName, 
      logoutUser,
      loginUser,
      registerUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
