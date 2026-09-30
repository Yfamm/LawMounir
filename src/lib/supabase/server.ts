import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { fetchWithTimeout, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Session-bound client for the admin: requests carry the signed-in user's
 * JWT, so row-level security applies to every read and write.
 */
export async function sessionClient() {
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead.
        }
      },
    },
    global: { fetch: fetchWithTimeout(10000) },
  });
}
