import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessages } from '../services/queries';

export function useChatMessages(participantId: string, limit = 50) {
  return useInfiniteQuery({
    queryKey: ['messages', participantId],
    queryFn: async ({ pageParam = null }) => {
      const messages = await fetchMessages(participantId, limit);
      return messages;
    },
    getNextPageParam: (lastPage) => 
      lastPage.length === limit ? lastPage[lastPage.length - 1].timestamp : undefined,
  });
}