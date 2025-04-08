
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  hashpasswd: string | null;
}

const AdminProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Load profiles data
    async function loadProfiles() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email, hashpasswd');
          
        if (error) {
          throw error;
        }
        
        setProfiles(data || []);
      } catch (error: any) {
        toast.error(`Error loading profiles: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfiles();
  }, [user, navigate]);

  // Function to generate SHA-256 hash of a string
  const generateSHA256Hash = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Function to generate/update a hash password
  const updateHashPassword = async (profileId: string, username: string | null) => {
    if (!username) return;
    
    try {
      // Generate a SHA-256 hash of the username + timestamp
      const timestamp = Date.now().toString();
      const textToHash = `${username}-${timestamp}`;
      const shaHash = await generateSHA256Hash(textToHash);
      
      const { error } = await supabase
        .from('profiles')
        .update({ hashpasswd: shaHash })
        .eq('id', profileId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setProfiles(profiles.map(p => 
        p.id === profileId ? { ...p, hashpasswd: shaHash } : p
      ));
      
      toast.success("SHA-256 hash password generated!");
    } catch (error: any) {
      toast.error(`Error updating hash: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20 pt-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-game-text hover:text-game-accent mb-4"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold text-game-accent">User Profiles</h1>
        <p className="text-game-text-muted">View and manage user profile data</p>
      </div>

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <Table>
          <TableCaption>List of user profiles with hashed passwords</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hashed Password</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No profiles found</TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-mono text-sm">{profile.id.substring(0, 8)}...</TableCell>
                  <TableCell>{profile.username || 'N/A'}</TableCell>
                  <TableCell>{profile.email || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-xs">{profile.hashpasswd || 'Not set'}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateHashPassword(profile.id, profile.username)}
                    >
                      Generate Hash
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      <Navigation />
    </div>
  );
};

export default AdminProfiles;
