import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useParticipants(page = 1, limit = 25) {
  return useQuery({
    queryKey: ['participants', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .range((page - 1) * limit, page * limit - 1)
        .order('last_active', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}