import { createEnv } from "@t3-oss/env-core";
import { clientSchema, serverSchema } from "../src/env/schema";

// Server-side env configuration for scripts
export const env = createEnv({
  server: serverSchema,
  client: clientSchema,
  runtimeEnv: process.env,
});