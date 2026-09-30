import "server-only";
import { sessionClient } from "@/lib/supabase/server";
import { defaultSections, defaultSettings } from "./defaults";
import { fromRow, tables } from "./records";
import type { CollectionKey } from "./fields";
import type { SectionKey, SectionMap, SiteSettings } from "./types";

/**
 * Admin reads, through the signed-in admin's session. Row-level security
 * lets admins see unpublished and draft entries. Callers must already have
 * passed requireAdmin().
 */

export async function adminSections<K extends SectionKey>(keys: K[]): Promise<{ [P in K]: SectionMap[P] }> {
  const db = await sessionClient();
  const { data, error } = await db.from("page_sections").select("key, data").in("key", keys);
  if (error) throw new Error(error.message);
  const stored = new Map((data ?? []).map((r) => [String(r.key), r.data as object]));
  return Object.fromEntries(keys.map((k) => [k, { ...defaultSections[k], ...(stored.get(k) ?? {}) }])) as {
    [P in K]: SectionMap[P];
  };
}

export async function adminSettings(): Promise<SiteSettings> {
  const db = await sessionClient();
  const { data, error } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return { ...defaultSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) };
}

export async function adminList<K extends CollectionKey>(collection: K): Promise<ReturnType<(typeof fromRow)[K]>[]> {
  const db = await sessionClient();
  const { data, error } = await db.from(tables[collection]).select("*").order("sort_order").order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => fromRow[collection](row)) as ReturnType<(typeof fromRow)[K]>[];
}

export async function adminGet<K extends CollectionKey>(collection: K, id: string): Promise<ReturnType<(typeof fromRow)[K]> | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const db = await sessionClient();
  const { data, error } = await db.from(tables[collection]).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? (fromRow[collection](data) as ReturnType<(typeof fromRow)[K]>) : null;
}
