import { supabase } from './supabase';
import type { ChatMessage, ImportStats } from './types';

const BATCH_SIZE = 1000;

export async function importMessages(participantId: string, messages: ChatMessage[]): Promise<ImportStats> {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);
    
    try {
      const { error } = await supabase.rpc('import_chat_messages', {
        p_participant_id: participantId,
        p_messages: batch
      });

      if (error) {
        console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`Progress: ${successCount}/${messages.length} messages imported`);
      }
    } catch (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error);
      errorCount += batch.length;
    }

    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return {
    total: messages.length,
    success: successCount,
    failed: errorCount
  };
}