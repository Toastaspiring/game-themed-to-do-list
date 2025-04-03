
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import LoginHeader from '@/components/login/LoginHeader';
import LoginForm from '@/components/login/LoginForm';
import AdminCreator from '@/components/login/AdminCreator';

const Login: React.FC = () => {
  const [showAdminCreator, setShowAdminCreator] = useState(false);

  // Listen for Ctrl+Shift+A key combination to show admin creator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminCreator(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-game-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
        <AdminCreator visible={showAdminCreator} />
      </div>
    </div>
  );
};

export default Login;
