import { supabase } from '../src/lib/supabase';

async function verifyCleanup() {
  try {
    // Check remaining participants
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, name');
    
    if (participantsError) throw participantsError;
    
    console.log('\nRemaining participants:', participants.length);
    console.log(participants.map(p => ({ id: p.id, name: p.name })));

    // Check message counts
    const { data: messageCounts, error: countsError } = await supabase
      .from('messages')
      .select('participant_id, count(*)')
      .group_by('participant_id');

    if (countsError) throw countsError;

    console.log('\nMessage counts per participant:');
    console.table(messageCounts);

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyCleanup();