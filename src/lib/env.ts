import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_ADMIN_EMAIL_1: z.string().email().optional(),
  VITE_ADMIN_EMAIL_2: z.string().email().optional(),
});

// Validate environment variables at runtime
const _env = envSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_ADMIN_EMAIL_1: import.meta.env.VITE_ADMIN_EMAIL_1,
  VITE_ADMIN_EMAIL_2: import.meta.env.VITE_ADMIN_EMAIL_2,
});

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(_env.error.format(), null, 2)
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
