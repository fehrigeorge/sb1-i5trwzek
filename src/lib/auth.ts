import { supabase } from './supabase';
import { create } from 'zustand';
import type { AuthState } from '@/types/auth';
import { isAdmin } from './constants';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  signIn: async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Auth error:', error);
      throw new Error('Invalid email or password');
    }
    
    if (user) {
      set({
        user: {
          id: user.id,
          email: user.email!,
          isAdmin: isAdmin(user.email!),
          avatarUrl: user.user_metadata.avatar_url,
          createdAt: user.created_at,
        }
      });
    }
  },
  signUp: async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
    
    if (user) {
      set({
        user: {
          id: user.id,
          email: user.email!,
          isAdmin: isAdmin(user.email!),
          avatarUrl: user.user_metadata.avatar_url,
          createdAt: user.created_at,
        }
      });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.setState({ 
    user: session ? {
      id: session.user.id,
      email: session.user.email!,
      isAdmin: isAdmin(session.user.email!),
      avatarUrl: session.user.user_metadata.avatar_url,
      createdAt: session.user.created_at,
    } : null,
    isLoading: false 
  });
});