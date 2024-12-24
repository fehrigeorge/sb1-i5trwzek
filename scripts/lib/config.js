import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnv({ path: join(__dirname, '../../.env') });

export const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    shouldBypassRLS: true
  },
  import: {
    batchSize: 50, // Reduced batch size for better reliability
    maxRetries: 3,
    retryDelay: 500 // Increased delay between retries
  }
};