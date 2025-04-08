
import React from 'react';
import LoginHeader from '@/components/login/LoginHeader';
import LoginForm from '@/components/login/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-game-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
