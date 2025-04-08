import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

export const register = async (email: string, username: string, password: string) => {
  const hash = await bcrypt.hash(password, 10);

  const { error } = await supabase
  .from('profiles')
  .insert([
    {
      email,
      username,
      hashpassword: hash,
    }
  ] as any);

  if (error) throw new Error(error.message);
};

export const login = async (identifier: string, password: string) => {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .limit(1);

  if (error) throw new Error(error.message);
  if (!users || users.length === 0) throw new Error('User not found');

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.hashpassword);

  if (!isMatch) throw new Error('Invalid password');

  localStorage.setItem('user', JSON.stringify(user));

  return user;
};

export const logout = () => {
  localStorage.removeItem('user');
};
