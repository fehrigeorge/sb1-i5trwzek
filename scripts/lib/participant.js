import { parseISO } from 'date-fns';

export async function createParticipant(supabase, name, messages) {
  if (!messages?.length) {
    throw new Error('No messages provided to determine last active timestamp');
  }

  // Find most recent valid timestamp
  const timestamps = messages
    .map(m => {
      try {
        return parseISO(m.timestamp).getTime();
      } catch {
        return 0;
      }
    })
    .filter(t => t > 0);

  if (!timestamps.length) {
    throw new Error('No valid timestamps found in messages');
  }

  const lastActive = new Date(Math.max(...timestamps)).toISOString();

  try {
    const { data: participant, error } = await supabase
      .from('participants')
      .insert({ name, last_active: lastActive })
      .select('id')
      .single();

    if (error) throw error;
    return participant;
  } catch (error) {
    throw new Error(`Failed to create participant: ${error.message}`);
  }
}