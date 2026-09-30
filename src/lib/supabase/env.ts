/** Supabase connection settings. The anon key is public by design; the service-role key is server-only. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** fetch with a hard timeout, so an unreachable database never hangs a render. */
export function fetchWithTimeout(ms: number): typeof fetch {
  return (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(ms) });
}
