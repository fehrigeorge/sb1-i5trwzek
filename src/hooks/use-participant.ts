import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useParticipant(participantId: string) {
  return useQuery({
    queryKey: ['participant', participantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('id', participantId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Participant not found');

      return data;
    },
    enabled: Boolean(participantId),
  });
}