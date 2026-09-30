import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fetchWithTimeout, supabaseAnonKey, supabaseConfigured, supabaseUrl } from "./env";

let client: SupabaseClient | null = null;

/**
 * Anonymous, cookie-less client for public reads. Row-level security limits
 * it to published content. Returns null when Supabase is not configured.
 */
export function publicClient(): SupabaseClient | null {
  if (!supabaseConfigured()) return null;
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout(5000) },
  });
  return client;
}
