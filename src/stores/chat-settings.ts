import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatSettings {
  useInfiniteScroll: boolean;
  autoLoadOnInSight: boolean;
  updateSettings: (settings: Partial<Pick<ChatSettings, 'useInfiniteScroll' | 'autoLoadOnInSight'>>) => void;
}

export const useChatSettings = create<ChatSettings>()(
  persist(
    (set) => ({
      useInfiniteScroll: false,
      autoLoadOnInSight: false,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'chat-settings',
    }
  )
);
