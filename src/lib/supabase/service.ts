import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fetchWithTimeout, supabaseUrl } from "./env";

let client: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses row-level security, so it is used only for
 * narrowly scoped server tasks: storing public enquiries and rate limiting.
 * The key comes from SUPABASE_SERVICE_ROLE_KEY and never reaches the browser.
 */
export function serviceClient(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) return null;
  client ??= createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout(8000) },
  });
  return client;
}
