import { supabase } from '@/shared/services/supabase/client';
import type { ChatMessage, ChatPreview } from '../types';

export async function fetchMessages(participantId: string, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('participant_id', participantId)
    .order('timestamp', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as ChatMessage[];
}

export async function fetchChatPreviews(): Promise<ChatPreview[]> {
  const { data: stats, error } = await supabase.rpc('get_message_stats', { 
    remco_id: '77777777-7777-7777-7777-777777777777' 
  });

  if (error) throw error;
  return stats;
}