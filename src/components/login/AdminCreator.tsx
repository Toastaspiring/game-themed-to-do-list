
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface AdminCreatorProps {
  visible: boolean;
}

const AdminCreator: React.FC<AdminCreatorProps> = ({ visible }) => {
  const { createAdminUser } = useAuth();
  const [adminFormData, setAdminFormData] = useState({
    email: 'admin@example.com',
    password: 'admin'
  });
  const [adminCreating, setAdminCreating] = useState(false);

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreating(true);
    
    try {
      await createAdminUser(adminFormData.email, adminFormData.password);
    } catch (error) {
      // Error is already handled in the createAdminUser function
    } finally {
      setAdminCreating(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="mt-8 pixel-border border-red-500 bg-game-background p-6 rounded-lg">
      <h2 className="text-xl font-bold text-red-500 mb-4">Create Admin User</h2>
      <form onSubmit={handleAdminCreate} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="adminEmail" className="text-sm font-medium block text-game-text">
            Admin Email
          </label>
          <input
            id="adminEmail"
            name="email"
            type="email"
            value={adminFormData.email}
            onChange={handleAdminChange}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-red-500 focus:border-red-300 outline-none transition-colors"
            placeholder="Admin email"
            disabled={adminCreating}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="adminPassword" className="text-sm font-medium block text-game-text">
            Admin Password
          </label>
          <input
            id="adminPassword"
            name="password"
            type="password"
            value={adminFormData.password}
            onChange={handleAdminChange}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-red-500 focus:border-red-300 outline-none transition-colors"
            placeholder="Admin password"
            disabled={adminCreating}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-500 text-white hover:bg-red-600"
          disabled={adminCreating}
        >
          {adminCreating ? 'Creating...' : 'Create Admin User'}
        </Button>
      </form>
    </div>
  );
};

export default AdminCreator;
