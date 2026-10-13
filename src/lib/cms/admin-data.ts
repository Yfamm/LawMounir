import "server-only";
import { sessionClient } from "@/lib/supabase/server";
import { normalizeSection, normalizeSettings } from "./normalize";
import { fromRow, tables } from "./records";
import type { CollectionKey } from "./fields";
import type { SectionKey, SectionMap, SiteSettings } from "./types";

/**
 * Admin reads, through the signed-in admin's session. Row-level security
 * lets admins see unpublished and draft entries. Callers must already have
 * passed requireAdmin(). Stored content is returned in the current bilingual
 * shape (older single-language content is converted on read).
 */

export async function allSectionsRaw(): Promise<Record<string, unknown>> {
  const db = await sessionClient();
  const { data, error } = await db.from("page_sections").select("key, data");
  if (error) throw new Error(error.message);
  return Object.fromEntries((data ?? []).map((r) => [String(r.key), r.data]));
}

export async function adminSections<K extends SectionKey>(keys: K[]): Promise<{ [P in K]: SectionMap[P] }> {
  const raw = await allSectionsRaw();
  return Object.fromEntries(keys.map((k) => [k, normalizeSection(k, raw)])) as { [P in K]: SectionMap[P] };
}

export async function adminSettings(): Promise<SiteSettings> {
  const db = await sessionClient();
  const { data, error } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeSettings(data?.data);
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

/** Where an uploaded image is used, for the media library. */
export async function mediaUsage(): Promise<Map<string, string[]>> {
  const db = await sessionClient();
  const [sections, settings, practice, people, insights] = await Promise.all([
    db.from("page_sections").select("key, data"),
    db.from("site_settings").select("data").eq("id", 1).maybeSingle(),
    db.from("practice_areas").select("title, image"),
    db.from("people").select("name_en, portrait"),
    db.from("insights").select("title, cover"),
  ]);
  const usage = new Map<string, string[]>();
  const scan = (value: unknown, where: string) => {
    const text = JSON.stringify(value ?? "");
    for (const m of text.matchAll(/"mediaId":"([0-9a-f-]{36})"/g)) {
      const list = usage.get(m[1]) ?? [];
      if (!list.includes(where)) list.push(where);
      usage.set(m[1], list);
    }
  };
  for (const r of sections.data ?? []) scan(r.data, `Page section · ${r.key}`);
  scan(settings.data?.data, "Site settings");
  for (const r of practice.data ?? []) scan(r.image, `Practice area · ${r.title}`);
  for (const r of people.data ?? []) scan(r.portrait, `Person · ${r.name_en}`);
  for (const r of insights.data ?? []) scan(r.cover, `Insight · ${r.title}`);
  return usage;
}
