import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

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

async function verifyMigration() {
  try {
    console.log('Starting migration verification...');
    await dockerDb.connect();

    // Verify participants
    const { data: supabaseParticipants } = await supabase
      .from('participants')
      .select('count');

    const {
      rows: [{ count: dockerParticipants }],
    } = await dockerDb.query('SELECT COUNT(*) FROM participants');

    console.log('Participants count:', {
      supabase: supabaseParticipants?.[0]?.count || 0,
      docker: parseInt(dockerParticipants),
    });

    // Verify messages
    const { data: supabaseMessages } = await supabase
      .from('messages')
      .select('count');

    const {
      rows: [{ count: dockerMessages }],
    } = await dockerDb.query('SELECT COUNT(*) FROM messages');

    console.log('Messages count:', {
      supabase: supabaseMessages?.[0]?.count || 0,
      docker: parseInt(dockerMessages),
    });

    // Verify protected chats
    const { data: supabaseProtectedChats } = await supabase
      .from('protected_chats')
      .select('count');

    const {
      rows: [{ count: dockerProtectedChats }],
    } = await dockerDb.query('SELECT COUNT(*) FROM protected_chats');

    console.log('Protected chats count:', {
      supabase: supabaseProtectedChats?.[0]?.count || 0,
      docker: parseInt(dockerProtectedChats),
    });

    console.log('Verification completed!');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await dockerDb.end();
  }
}
