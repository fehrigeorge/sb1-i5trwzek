import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types';

export function useChatSearch(participantId: string) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: searchResults,
    isLoading,
    error
  } = useQuery({
    queryKey: ['chat-search', participantId, searchQuery],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('participant_id', participantId)
        .ilike('message', `%${searchQuery}%`)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: Boolean(searchQuery.trim()),
  });

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
  };
}
