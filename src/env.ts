import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Separate client and server env schemas
const clientSchema = {
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_ADMIN_EMAIL_1: z.string().email().optional(),
  VITE_ADMIN_EMAIL_2: z.string().email().optional(),
};

const serverSchema = {
  DOCKER_DB_HOST: z.string().default("localhost"),
  DOCKER_DB_PORT: z.string().default("5432"),
  DOCKER_DB_NAME: z.string().default("chat_history"),
  DOCKER_DB_USER: z.string().default("postgres"),
  DOCKER_DB_PASSWORD: z.string().default("postgres"),
};

// Create separate env configurations for client and server
export const clientEnv = createEnv({
  client: clientSchema,
  runtimeEnv: {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_ADMIN_EMAIL_1: import.meta.env.VITE_ADMIN_EMAIL_1,
    VITE_ADMIN_EMAIL_2: import.meta.env.VITE_ADMIN_EMAIL_2,
  },
});

// Only use server env in Node.js environment
export const serverEnv = typeof process !== 'undefined' ? createEnv({
  server: serverSchema,
  runtimeEnv: process.env,
}) : null;

// Export a combined env object for convenience
export const env = {
  ...clientEnv,
  ...(serverEnv || {}),
} as const;