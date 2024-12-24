import { supabase } from '../supabase';
import { REMCO_ID } from '../constants';

export interface MessageCount {
  participant_id: string;
  count: number;
}

export async function fetchMessageCounts(): Promise<MessageCount[]> {
  try {
    // Simple count query grouped by participant_id
    const { data, error } = await supabase
      .from('messages')
      .select('participant_id, count(*)')
      .neq('participant_id', REMCO_ID)
      .group_by('participant_id');

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return (data ?? []).map(row => ({
      participant_id: row.participant_id,
      count: parseInt(row.count, 10) || 0
    }));
  } catch (error) {
    console.error('Failed to fetch message counts:', error);
    return [];
  }
}