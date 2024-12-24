import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const dockerDb = new Client({
  host: process.env.DOCKER_DB_HOST || 'localhost',
  port: parseInt(process.env.DOCKER_DB_PORT || '5432'),
  database: process.env.DOCKER_DB_NAME || 'chat_history',
  user: process.env.DOCKER_DB_USER || 'postgres',
  password: process.env.DOCKER_DB_PASSWORD || 'postgres',
});

async function migrateToSupabase() {
  try {
    console.log('Starting migration to Supabase...');
    await dockerDb.connect();

    // Migrate participants
    const { rows: participants } = await dockerDb.query(
      'SELECT * FROM participants'
    );

    for (const participant of participants) {
      const { error } = await supabase.from('participants').upsert({
        id: participant.id,
        name: participant.name,
        last_active: participant.last_active,
        avatar_url: participant.avatar_url,
        created_at: participant.created_at,
      });

      if (error) throw error;
    }
    console.log(`Migrated ${participants.length} participants`);

    // Migrate messages in batches
    const batchSize = 1000;
    let offset = 0;

    while (true) {
      const { rows: messages } = await dockerDb.query(
        'SELECT * FROM messages ORDER BY id LIMIT $1 OFFSET $2',
        [batchSize, offset]
      );

      if (!messages.length) break;

      const { error } = await supabase.from('messages').upsert(
        messages.map((msg) => ({
          id: msg.id,
          participant_id: msg.participant_id,
          sender_id: msg.sender_id,
          message: msg.message,
          timestamp: msg.timestamp,
          is_read: msg.is_read,
          created_at: msg.created_at,
        }))
      );

      if (error) throw error;

      offset += messages.length;
      console.log(`Migrated ${messages.length} messages`);
    }

    // Migrate protected chats
    const { rows: protectedChats } = await dockerDb.query(
      'SELECT * FROM protected_chats'
    );

    for (const chat of protectedChats) {
      const { error } = await supabase.from('protected_chats').upsert({
        participant_id: chat.participant_id,
        pin_hash: chat.pin_hash,
        last_attempt: chat.last_attempt,
        attempt_count: chat.attempt_count,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
      });

      if (error) throw error;
    }
    console.log(`Migrated ${protectedChats.length} protected chats`);

    console.log('Migration to Supabase completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await dockerDb.end();
  }
}
