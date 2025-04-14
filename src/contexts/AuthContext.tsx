
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUserName: (name: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const setUserName = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      setUserName, 
      clearUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
