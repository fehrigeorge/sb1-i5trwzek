import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DateRange } from '../types';

interface ChatFiltersState {
  showFavorites: boolean;
  sortOrder: 'asc' | 'desc';
  dateRange: DateRange | null;
  toggleFavorites: () => void;
  toggleSortOrder: () => void;
  setDateRange: (range: DateRange | null) => void;
}

export const useChatFilters = create<ChatFiltersState>()(
  persist(
    (set) => ({
      showFavorites: false,
      sortOrder: 'asc',
      dateRange: null,
      toggleFavorites: () => set((state) => ({ 
        showFavorites: !state.showFavorites 
      })),
      toggleSortOrder: () => set((state) => ({ 
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
      })),
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'chat-filters',
    }
  )
);