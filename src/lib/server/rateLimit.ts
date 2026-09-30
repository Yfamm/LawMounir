import "server-only";
import { serviceClient } from "@/lib/supabase/service";

export type Allowance = "ok" | "limited" | "unavailable";

/**
 * Sliding-window rate limit stored in Postgres (hit_rate_limit), so it holds
 * across server instances. Fails closed: when the database cannot be reached
 * the request is refused as "unavailable".
 */
export async function allow(key: string, limit: number, windowSeconds: number): Promise<Allowance> {
  const db = serviceClient();
  if (!db) return "unavailable";
  const { data, error } = await db.rpc("hit_rate_limit", { p_key: key, p_limit: limit, p_window_seconds: windowSeconds });
  if (error) {
    console.error("[rate-limit]", error.message);
    return "unavailable";
  }
  return data === true ? "ok" : "limited";
}
