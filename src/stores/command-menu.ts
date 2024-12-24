import { create } from 'zustand';

interface CommandMenuState {
  isOpen: boolean;
  toggle: (force?: boolean) => void;
}

export const useCommandMenu = create<CommandMenuState>((set) => ({
  isOpen: false,
  toggle: (force?: boolean) => set((state) => ({ 
    isOpen: force !== undefined ? force : !state.isOpen 
  })),
}));