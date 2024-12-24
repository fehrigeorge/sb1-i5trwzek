import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export function useFavorites() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('participant_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return favorites.map(f => f.participant_id);
    },
    enabled: !!user,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ participantId, isFavorite }: { participantId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Must be authenticated');

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('participant_id', participantId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ 
            participant_id: participantId,
            user_id: user.id 
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}