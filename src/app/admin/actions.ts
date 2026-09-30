"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin, UnauthorizedError } from "@/lib/cms/auth";
import { defaultSettings } from "@/lib/cms/defaults";
import { collectionFields, footerFields, sectionFields, settingsFields, type CollectionKey } from "@/lib/cms/fields";
import { slugify, tables, toRow } from "@/lib/cms/records";
import { firstIssue, objectSchema } from "@/lib/cms/schema";
import { allow } from "@/lib/server/rateLimit";
import { clientIp, rateKey } from "@/lib/server/request";
import { sessionClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const GENERIC = "The change could not be saved. Please try again.";

/** Purges every public page so edits appear on the next request. */
function publish() {
  revalidatePath("/", "layout");
}

/** Runs an admin mutation: verifies the session server-side and hides internal errors. */
async function guarded(fn: (userId: string) => Promise<ActionResult>): Promise<ActionResult> {
  try {
    const admin = await assertAdmin();
    return await fn(admin.userId);
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, error: "Your session has ended. Please sign in again." };
    console.error("[admin]", error instanceof Error ? error.message : error);
    return { ok: false, error: GENERIC };
  }
}

function dbError(error: { code?: string; message: string } | null): ActionResult | null {
  if (!error) return null;
  if (error.code === "23505") return { ok: false, error: "That slug is already used by another entry." };
  console.error("[admin] database:", error.code, error.message);
  return { ok: false, error: GENERIC };
}

/* ------------------------------------------------------------------ auth */

export async function signIn(
  _prev: { error?: string; email?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; email?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!email || !password || email.length > 200 || password.length > 200) {
    return { error: "Enter your email address and password.", email };
  }

  const ip = clientIp(await headers());
  const allowance = await allow(rateKey("login", ip), 10, 900);
  if (allowance === "unavailable") return { error: "Sign-in is temporarily unavailable. Please try again shortly.", email };
  if (allowance === "limited") return { error: "Too many sign-in attempts. Please wait a few minutes and try again.", email };

  const db = await sessionClient();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Incorrect email or password.", email };

  const { data: member } = await db.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!member) {
    await db.auth.signOut();
    return { error: "This account does not have access to the admin.", email };
  }

  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function signOut() {
  const db = await sessionClient();
  await db.auth.signOut();
  redirect("/admin/login");
}

/* -------------------------------------------------------------- sections */

export async function saveSection(key: string, data: unknown): Promise<ActionResult> {
  return guarded(async (userId) => {
    const fields = sectionFields[key];
    if (!fields) return { ok: false, error: "Unknown section." };
    const parsed = objectSchema(fields).safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const db = await sessionClient();
    const { error } = await db
      .from("page_sections")
      .upsert({ key, data: parsed.data, enabled: true, updated_by: userId }, { onConflict: "key" });
    const failed = dbError(error);
    if (failed) return failed;
    publish();
    return { ok: true };
  });
}

/* -------------------------------------------------------------- settings */

export async function saveSettings(group: "settings" | "footer", data: unknown): Promise<ActionResult> {
  return guarded(async (userId) => {
    const fields = group === "settings" ? settingsFields : footerFields;
    const parsed = objectSchema(fields).safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const db = await sessionClient();
    const { data: current, error: readError } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
    if (readError) return dbError(readError)!;
    const merged = { ...defaultSettings, ...((current?.data as object) ?? {}), ...parsed.data };
    const { error } = await db.from("site_settings").upsert({ id: 1, data: merged, updated_by: userId });
    const failed = dbError(error);
    if (failed) return failed;
    publish();
    return { ok: true };
  });
}

/* ----------------------------------------------------------- collections */

const collectionKey = z.enum(["values", "navigation", "practice", "people", "insights"]);
const uuid = z.uuid();

export async function saveRecord(collection: CollectionKey, id: string | null, data: unknown): Promise<ActionResult> {
  return guarded(async () => {
    const key = collectionKey.parse(collection);
    if (id !== null && !uuid.safeParse(id).success) return { ok: false, error: "Unknown entry." };
    const parsed = objectSchema(collectionFields[key]).safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const record = parsed.data as Record<string, unknown>;

    if ("slug" in record) {
      record.slug = String(record.slug || slugify(String(record.title ?? "")));
      if (!record.slug) return { ok: false, error: "Add a title or slug." };
    }

    const db = await sessionClient();
    const table = tables[key];
    const row = toRow[key](record);

    if (id) {
      const { error } = await db.from(table).update(row).eq("id", id);
      const failed = dbError(error);
      if (failed) return failed;
      publish();
      return { ok: true, id };
    }

    const { data: last } = await db.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { data: created, error } = await db
      .from(table)
      .insert({ ...row, sort_order: Number(last?.sort_order ?? -1) + 1 })
      .select("id")
      .single();
    const failed = dbError(error);
    if (failed) return failed;
    publish();
    return { ok: true, id: String(created?.id) };
  });
}

export async function deleteRecord(collection: CollectionKey, id: string): Promise<ActionResult> {
  return guarded(async () => {
    const key = collectionKey.parse(collection);
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown entry." };
    const db = await sessionClient();
    const failed = dbError((await db.from(tables[key]).delete().eq("id", id)).error);
    if (failed) return failed;
    publish();
    return { ok: true };
  });
}

export async function moveRecord(collection: CollectionKey, id: string, direction: "up" | "down"): Promise<ActionResult> {
  return guarded(async () => {
    const key = collectionKey.parse(collection);
    const db = await sessionClient();
    const table = tables[key];
    const { data, error } = await db.from(table).select("id").order("sort_order").order("created_at");
    if (error) return dbError(error)!;
    const ids = (data ?? []).map((r) => String(r.id));
    const from = ids.indexOf(id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= ids.length) return { ok: true };
    [ids[from], ids[to]] = [ids[to], ids[from]];
    for (const [i, rowId] of ids.entries()) {
      const failed = dbError((await db.from(table).update({ sort_order: i }).eq("id", rowId)).error);
      if (failed) return failed;
    }
    publish();
    return { ok: true };
  });
}

export async function setPublished(collection: CollectionKey, id: string, published: boolean): Promise<ActionResult> {
  return guarded(async () => {
    const key = collectionKey.parse(collection);
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown entry." };
    const patch =
      key === "insights" ? { status: published ? "published" : "draft" } : key === "navigation" ? { visible: published } : { published };
    const db = await sessionClient();
    const failed = dbError((await db.from(tables[key]).update(patch).eq("id", id)).error);
    if (failed) return failed;
    publish();
    return { ok: true };
  });
}

/* ------------------------------------------------------------- enquiries */

const enquiryPatch = z.object({
  status: z.enum(["new", "in_progress", "resolved"]).optional(),
  internalNote: z.string().max(10000).optional(),
});

export async function updateEnquiry(id: string, patch: unknown): Promise<ActionResult> {
  return guarded(async (userId) => {
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown enquiry." };
    const parsed = enquiryPatch.safeParse(patch);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const update: Record<string, unknown> = { handled_by: userId };
    if (parsed.data.status) update.status = parsed.data.status;
    if (parsed.data.internalNote !== undefined) update.internal_note = parsed.data.internalNote;
    const db = await sessionClient();
    const failed = dbError((await db.from("enquiries").update(update).eq("id", id)).error);
    if (failed) return failed;
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

export async function markEnquiryRead(id: string): Promise<ActionResult> {
  return guarded(async () => {
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown enquiry." };
    const db = await sessionClient();
    const failed = dbError(
      (await db.from("enquiries").update({ read_at: new Date().toISOString() }).eq("id", id).is("read_at", null)).error,
    );
    if (failed) return failed;
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  return guarded(async () => {
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown enquiry." };
    const db = await sessionClient();
    const failed = dbError((await db.from("enquiries").delete().eq("id", id)).error);
    if (failed) return failed;
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

/* ----------------------------------------------------------------- media */

const mediaPatch = z.object({ alt: z.string().trim().max(300), caption: z.string().trim().max(200) });

export async function updateMedia(id: string, patch: unknown): Promise<ActionResult> {
  return guarded(async () => {
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown image." };
    const parsed = mediaPatch.safeParse(patch);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const db = await sessionClient();
    const failed = dbError((await db.from("media").update(parsed.data).eq("id", id)).error);
    if (failed) return failed;
    revalidatePath("/admin/media");
    return { ok: true };
  });
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  return guarded(async () => {
    if (!uuid.safeParse(id).success) return { ok: false, error: "Unknown image." };
    const db = await sessionClient();
    const { data: uses, error: usageError } = await db.rpc("media_usage", { p_media: id });
    if (usageError) return dbError(usageError)!;
    if (Number(uses) > 0) return { ok: false, error: "This image is in use on the site. Replace it there first." };
    const { data: item, error: readError } = await db.from("media").select("storage_path").eq("id", id).maybeSingle();
    if (readError) return dbError(readError)!;
    if (!item) return { ok: true };
    const { error: storageError } = await db.storage.from("media").remove([String(item.storage_path)]);
    if (storageError) {
      console.error("[admin] storage:", storageError.message);
      return { ok: false, error: GENERIC };
    }
    const failed = dbError((await db.from("media").delete().eq("id", id)).error);
    if (failed) return failed;
    revalidatePath("/admin/media");
    return { ok: true };
  });
}
