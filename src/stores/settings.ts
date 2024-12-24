import { create } from 'zustand';

type SettingsSection = 'general' | 'appearance' | 'admin';

interface SettingsState {
  isOpen: boolean;
  activeSection: SettingsSection;
  open: () => void;
  close: () => void;
  setSection: (section: SettingsSection) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  isOpen: false,
  activeSection: 'general',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setSection: (section) => set({ activeSection: section }),
}));