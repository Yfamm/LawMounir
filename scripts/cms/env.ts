import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

/** Loads .env.local / .env when present (the deployment platform supplies them otherwise). */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) if (existsSync(file)) process.loadEnvFile(file);
}

/** Service-role client for command-line maintenance tasks. Never used in the browser. */
export function adminClient() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example).");
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
