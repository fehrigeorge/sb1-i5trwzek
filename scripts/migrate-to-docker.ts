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

// Rest of the file remains the same...