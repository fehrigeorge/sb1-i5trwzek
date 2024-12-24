```typescript
interface ImportCallbacks {
  onProgress: (progress: number) => void;
  onStatus: (status: string) => void;
}

export async function importChat(file: File, callbacks: ImportCallbacks) {
  const { onProgress, onStatus } = callbacks;

  try {
    // Read and parse file
    onStatus('Reading file...');
    const content = await file.text();
    const messages = JSON.parse(content);

    if (!Array.isArray(messages)) {
      throw new Error('Invalid file format: expected an array of messages');
    }

    // Validate messages
    onStatus('Validating messages...');
    messages.forEach((msg, i) => {
      if (!msg.name || !msg.message || !msg.timestamp) {
        throw new Error(`Invalid message at index ${i}: missing required fields`);
      }
    });

    // Create participant
    onStatus('Creating participant...');
    const participantName = messages[0].name;
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({ name: participantName })
      .select('id')
      .single();

    if (participantError) throw participantError;

    // Import messages in batches
    const BATCH_SIZE = 100;
    let imported = 0;

    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      
      onStatus(`Importing messages (${imported} of ${messages.length})...`);
      onProgress((imported / messages.length) * 100);

      const { error } = await supabase.rpc('import_chat_messages', {
        p_participant_id: participant.id,
        p_messages: batch
      });

      if (error) throw error;
      imported += batch.length;
    }

    onStatus('Import completed successfully!');
    onProgress(100);

    return participant.id;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}
```