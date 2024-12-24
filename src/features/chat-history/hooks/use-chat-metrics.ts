import { useQuery } from '@tanstack/react-query';
import { fetchChatMetrics } from '../services/queries';
import type { ChatMetrics } from '../types/metrics';

export function useChatMetrics(chatId: string) {
  return useQuery<ChatMetrics>({
    queryKey: ['chat-metrics', chatId],
    queryFn: () => fetchChatMetrics(chatId),
  });
}