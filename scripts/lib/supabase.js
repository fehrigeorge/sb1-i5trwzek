import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

if (!config.supabase.url || !config.supabase.key) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create client with service role key to bypass RLS
export const supabase = createClient(
  config.supabase.url,
  config.supabase.key,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    // Enable RLS bypass if using service role key
    db: {
      schema: 'public'
    }
  }
);

// Constants
export const REMCO_ID = '77777777-7777-7777-7777-777777777777';