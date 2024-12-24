import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/lib/themes';

interface ThemeState {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);