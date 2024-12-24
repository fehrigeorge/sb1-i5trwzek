import { supabase } from '../supabase';
import { REMCO_ID } from '../constants';

export interface MessageStats {
  participant_id: string;
  total_count: number;
  last_message?: {
    message: string;
    timestamp: string;
    sender_id: string;
  };
}

export async function fetchMessageStats(): Promise<MessageStats[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_message_stats', { remco_id: REMCO_ID });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch message stats:', error);
    return [];
  }
}