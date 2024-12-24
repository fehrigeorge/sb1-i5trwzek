export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
  username?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
import { crea