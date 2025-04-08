
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const loginUser = async (identifier, password) => {
    const user = await authService.login(identifier, password);
    setUser(user);
  };

  const registerUser = async (email, username, password) => {
    await authService.register(email, username, password);
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
