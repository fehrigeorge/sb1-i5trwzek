import { config } from './config.js';
import { REMCO_ID } from './supabase.js';

export async function importMessages(supabase, participantId, messages) {
  let successCount = 0;
  let errorCount = 0;
  let retryCount = 0;
  
  console.log(`\nStarting message import in batches of ${config.import.batchSize}...`);

  for (let i = 0; i < messages.length; i += config.import.batchSize) {
    const batch = messages.slice(i, Math.min(i + config.import.batchSize, messages.length));
    let attempt = 0;
    let success = false;

    while (!success && attempt < config.import.maxRetries) {
      try {
        // Transform messages to match the expected format
        const formattedBatch = batch.map(msg => ({
          participant_id: participantId,
          sender_id: msg.name === 'Remco' ? REMCO_ID : participantId,
          message: msg.message,
          timestamp: msg.timestamp,
          is_read: true
        }));

        // Insert messages directly instead of using RPC
        const { error } = await supabase
          .from('messages')
          .insert(formattedBatch);

        if (error) throw error;

        successCount += batch.length;
        success = true;

        // Progress update
        const progress = ((i + batch.length) / messages.length * 100).toFixed(1);
        console.log(`Progress: ${successCount}/${messages.length} messages (${progress}%)`);

      } catch (error) {
        attempt++;
        retryCount++;

        if (attempt === config.import.maxRetries) {
          console.error(`\nBatch ${i / config.import.batchSize + 1} failed after ${config.import.maxRetries} attempts:`, error.message);
          errorCount += batch.length;
        } else {
          console.warn(`\nRetrying batch ${i / config.import.batchSize + 1} (attempt ${attempt + 1}/${config.import.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, config.import.retryDelay * attempt));
        }
      }
    }

    // Delay between batches
    await new Promise(resolve => setTimeout(resolve, config.import.retryDelay));
  }

  return {
    total: messages.length,
    success: successCount,
    failed: errorCount,
    retries: retryCount
  };
}