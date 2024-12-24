import { createEnv } from "@t3-oss/env-core";
import { serverSchema } from "./schema";

export const serverEnv = createEnv({
  server: serverSchema,
  runtimeEnv: process.env,
});