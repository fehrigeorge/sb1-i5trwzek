import { z } from "zod";

export const clientSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_ADMIN_EMAIL_1: z.string().email().optional(),
  VITE_ADMIN_EMAIL_2: z.string().email().optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;