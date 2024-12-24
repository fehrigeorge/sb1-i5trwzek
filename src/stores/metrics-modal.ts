import { create } from 'zustand';

interface MetricsModalState {
  isOpen: boolean;
  chatId: string | null;
  chatName: string | null;
  open: (chatId: string, chatName: string) => void;
  close: () => void;
}

export const useMetricsModal = create<MetricsModalState>((set) => ({
  isOpen: false,
  chatId: null,
  chatName: null,
  open: (chatId, chatName) => set({ isOpen: true, chatId, chatName }),
  close: () => set({ isOpen: false, chatId: null, chatName: null }),
}));