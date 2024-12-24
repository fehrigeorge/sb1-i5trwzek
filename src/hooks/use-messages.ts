import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useMessages(participantId: string, limit = 50) {
  return useInfiniteQuery({
    queryKey: ['messages', participantId],
    queryFn: async ({ pageParam = null }) => {
      const query = supabase
        .from('messages')
        .select('*')
        .eq('participant_id', participantId)
        .order('timestamp', { ascending: true }) // Changed to ascending
        .limit(limit);

      if (pageParam) {
        query.gt('timestamp', pageParam); // Changed to gt for ascending order
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage) => 
      lastPage.length === limit ? lastPage[lastPage.length - 1].timestamp : undefined,
  });
}