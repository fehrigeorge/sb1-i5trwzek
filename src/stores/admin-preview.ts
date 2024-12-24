import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminPreviewState {
  previewUserMode: boolean;
  togglePreviewMode: () => void;
}

export const useAdminPreview = create<AdminPreviewState>()(
  persist(
    (set) => ({
      previewUserMode: false,
      togglePreviewMode: () => set((state) => ({ 
        previewUserMode: !state.previewUserMode 
      })),
    }),
    {
      name: 'admin-preview-storage',
    }
  )
);