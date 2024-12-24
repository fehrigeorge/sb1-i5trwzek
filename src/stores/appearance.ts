import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppearanceState } from '@/types/appearance';

export const useAppearance = create<AppearanceState>()(
  persist(
    (set) => ({
      animations: true,
      glassFactor: 80,
      blurStrength: 8,
      updateSettings: (settings) => set((state) => ({
        ...state,
        ...settings,
      })),
    }),
    {
      name: 'appearance-storage',
    }
  )
);