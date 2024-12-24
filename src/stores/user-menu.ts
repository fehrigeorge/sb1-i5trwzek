import { create } from 'zustand';

interface UserMenuState {
  isOpen: boolean;
  toggle: (force?: boolean) => void;
}

export const useUserMenu = create<UserMenuState>((set) => ({
  isOpen: false,
  toggle: (force?: boolean) => set((state) => ({ 
    isOpen: force !== undefined ? force : !state.isOpen 
  })),
}));