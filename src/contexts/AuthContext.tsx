
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
