import { clientSchema } from "./schema";

// Validate at runtime
const _clientEnv = clientSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_ADMIN_EMAIL_1: import.meta.env.VITE_ADMIN_EMAIL_1,
  VITE_ADMIN_EMAIL_2: import.meta.env.VITE_ADMIN_EMAIL_2,
});

if (!_clientEnv.success) {
  console.error("❌ Invalid environment variables:", _clientEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const clientEnv = _clientEnv.data;