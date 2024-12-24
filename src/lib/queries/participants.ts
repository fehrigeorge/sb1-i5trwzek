import { supabase } from '../supabase';
import { REMCO_ID } from '../constants';

export async function fetchParticipants() {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select(`
        id,
        name,
        avatar_url,
        last_active,
        messages!messages_participant_id_fkey (
          message,
          timestamp,
          sender_id
        )
      `)
      .neq('id', REMCO_ID)
      .order('last_active', { ascending: false });

    if (error) {
      console.error('Failed to fetch participants:', error);
      return [];
    }

    return data?.map(participant => ({
      ...participant,
      messages: participant.messages?.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 1) || []
    })) ?? [];
  } catch (error) {
    console.error('Error in fetchParticipants:', error);
    return [];
  }
}