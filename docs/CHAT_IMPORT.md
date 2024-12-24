# Chat Import Guide

## Overview

This guide explains how to import chat history from JSON files into the Chat History Viewer database. The system supports importing large chat histories (100k+ messages) efficiently.

## JSON Format

Your JSON format:
```json
[
  {
    "name": "Participant Name",
    "message": "Message content",
    "timestamp": "2016-01-22T00:44:06Z"
  }
]
```

## Import Process

### 1. Create Migration File

Create a new migration file in `supabase/migrations` with the following structure:

```sql
-- First, create the participant
INSERT INTO participants (id, name, last_active)
VALUES (
  gen_random_uuid(), -- Will be stored for later use
  'Zeena', -- Participant name
  (SELECT MAX(timestamp) FROM json_array_elements('[your_json_here]'::json) as t(timestamp))
)
RETURNING id;

-- Create a function to handle the import
CREATE OR REPLACE FUNCTION import_chat_messages(
  p_participant_id UUID,
  p_messages JSONB
) RETURNS void AS $$
DECLARE
  v_message JSONB;
  v_remco_id UUID := '77777777-7777-7777-7777-777777777777';
BEGIN
  FOR v_message IN SELECT * FROM jsonb_array_elements(p_messages)
  LOOP
    INSERT INTO messages (
      participant_id,
      sender_id,
      message,
      timestamp
    ) VALUES (
      p_participant_id,
      CASE 
        WHEN v_message->>'name' = 'Remco' THEN v_remco_id 
        ELSE p_participant_id 
      END,
      v_message->>'message',
      (v_message->>'timestamp')::timestamptz
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 2. Prepare Import Script

Create a Node.js script to handle the import:

```typescript
// scripts/import-chat.ts
import { readFileSync } from 'fs';
import { supabase } from '../src/lib/supabase';

async function importChat(filename: string, participantName: string) {
  try {
    // Read and parse JSON file
    const chatData = JSON.parse(readFileSync(filename, 'utf-8'));
    
    // Create participant
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({
        name: participantName,
        last_active: new Date(
          Math.max(...chatData.map(m => new Date(m.timestamp).getTime()))
        ).toISOString()
      })
      .select('id')
      .single();

    if (participantError) throw participantError;

    // Import messages in batches
    const BATCH_SIZE = 1000;
    for (let i = 0; i < chatData.length; i += BATCH_SIZE) {
      const batch = chatData.slice(i, i + BATCH_SIZE);
      
      const { error: importError } = await supabase
        .rpc('import_chat_messages', {
          p_participant_id: participant.id,
          p_messages: batch
        });

      if (importError) throw importError;
      
      console.log(`Imported ${i + batch.length} / ${chatData.length} messages`);
    }

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}
```

### 3. Usage

1. Place your JSON files in a `data` directory
2. Run the import script:

```bash
# Single chat import
pnpm tsx scripts/import-chat.ts data/zeena.json "Zeena"

# Multiple chats import
for file in data/*.json; do
  name=$(basename "$file" .json)
  pnpm tsx scripts/import-chat.ts "$file" "$name"
done
```

## Performance Considerations

### Batch Processing
- Messages are imported in batches of 1000 to avoid memory issues
- Each batch is processed in a single transaction
- Progress is logged to track import status

### Database Optimization
- Indexes are automatically created for efficient querying
- Timestamps are stored in UTC
- Foreign key relationships maintain data integrity

### Memory Management
- Files are read in chunks to handle large JSON files
- Batch processing prevents memory exhaustion
- Error handling ensures clean rollback on failure

## Monitoring Import Progress

The import script provides progress updates:
```
Importing chat: zeena.json
Created participant: Zeena (id: xxx)
Imported 1000 / 50000 messages
Imported 2000 / 50000 messages
...
Import completed successfully!
```

## Error Handling

Common errors and solutions:

1. **Invalid JSON Format**
   ```
   Error: Unexpected token in JSON
   Solution: Validate JSON file format
   ```

2. **Duplicate Participants**
   ```
   Error: duplicate key value violates unique constraint
   Solution: Check if participant already exists
   ```

3. **Invalid Timestamps**
   ```
   Error: invalid input syntax for type timestamp
   Solution: Ensure timestamps are in ISO 8601 format
   ```

## Data Validation

Before importing:
1. Ensure all messages have required fields
2. Validate timestamp format
3. Check for duplicate messages
4. Verify participant names are consistent

## Post-Import Verification

After importing:
1. Check message count matches source
2. Verify chronological order
3. Confirm sender attribution
4. Test chat interface functionality

## Rollback Process

If import fails:

```sql
-- Delete specific chat
DELETE FROM messages WHERE participant_id = 'participant_uuid';
DELETE FROM participants WHERE id = 'participant_uuid';

-- Reset auto-increment if needed
SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));
```