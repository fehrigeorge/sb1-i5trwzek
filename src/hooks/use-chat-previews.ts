import { useQuery } from '@tanstack/react-query';
import type { ChatPreview } from '@/types';
import { fetchMessageStats } from '@/lib/queries/message-stats';
import { fetchParticipants } from '@/lib/queries/participants';

export function useChatPreviews() {
  return useQuery({
    queryKey: ['chat-previews'],
    queryFn: async () => {
      try {
        const [stats, participants] = await Promise.all([
          fetchMessageStats(),
          fetchParticipants()
        ]);

        const statsMap = new Map(
          stats.map(stat => [stat.participant_id, stat])
        );

        return participants.map(participant => ({
          id: participant.id,
          name: participant.name,
          avatarUrl: participant.avatar_url,
          lastActive: participant.last_active,
          messageCount: statsMap.get(participant.id)?.total_count ?? 0,
          lastMessage: statsMap.get(participant.id)?.last_message
        }));
      } catch (error) {
        console.error('Error in useChatPreviews:', error);
        return [];
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}