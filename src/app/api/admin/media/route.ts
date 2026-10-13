import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/cms/auth";
import { sessionClient } from "@/lib/supabase/server";

const MAX_BYTES = 8 * 1024 * 1024;

/** Accepted types, checked against the file's own signature, not just its declared type. */
const TYPES: Record<string, { ext: string; test: (b: Uint8Array) => boolean }> = {
  "image/jpeg": { ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/gif": { ext: "gif", test: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  "image/webp": {
    ext: "webp",
    test: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  },
  "image/avif": { ext: "avif", test: (b) => String.fromCharCode(...b.slice(4, 12)).startsWith("ftypavi") },
};

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Media library listing for the admin image picker. */
export async function GET() {
  if (!(await getAdmin())) return fail("Not authorized.", 401);
  const db = await sessionClient();
  const { data, error } = await db
    .from("media")
    .select("id, url, alt, alt_ar, caption, caption_ar, width, height, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return fail("The media library could not be loaded.", 500);
  return NextResponse.json({ ok: true, media: data }, { headers: { "Cache-Control": "no-store" } });
}

/**
 * Upload an image to Supabase Storage (bucket "media") and register it — or,
 * with a `replace` id, swap the file behind an existing library entry. Pages
 * reference images by id, so a replacement appears everywhere it is used.
 */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return fail("Not authorized.", 401);
  if (!sameOrigin(request)) return fail("Invalid request origin.", 403);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 64_000) return fail("Images must be 8 MB or smaller.", 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Invalid upload.", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return fail("Choose an image to upload.", 400);
  if (file.size === 0 || file.size > MAX_BYTES) return fail("Images must be 8 MB or smaller.", 413);

  const type = TYPES[file.type];
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!type || !type.test(bytes)) return fail("Upload a JPEG, PNG, WebP, AVIF or GIF image.", 415);

  const alt = String(form.get("alt") ?? "").trim().slice(0, 300);
  const altAr = String(form.get("alt_ar") ?? "").trim().slice(0, 300);
  const caption = String(form.get("caption") ?? "").trim().slice(0, 200);
  const captionAr = String(form.get("caption_ar") ?? "").trim().slice(0, 200);
  const replace = String(form.get("replace") ?? "");
  if (replace && !/^[0-9a-f-]{36}$/i.test(replace)) return fail("Unknown image.", 400);
  const width = Math.round(Number(form.get("width"))) || null;
  const height = Math.round(Number(form.get("height"))) || null;

  const now = new Date();
  const path = `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${type.ext}`;
  const db = await sessionClient();
  let previousPath: string | null = null;
  if (replace) {
    const { data: existing } = await db.from("media").select("storage_path").eq("id", replace).maybeSingle();
    if (!existing) return fail("Unknown image.", 404);
    previousPath = String(existing.storage_path);
  }
  const { error: uploadError } = await db.storage.from("media").upload(path, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) {
    console.error("[media] upload failed:", uploadError.message);
    return fail("The image could not be uploaded. Please try again.", 500);
  }

  const url = db.storage.from("media").getPublicUrl(path).data.publicUrl;

  if (replace) {
    const { data, error } = await db
      .from("media")
      .update({ storage_path: path, url, mime_type: file.type, size_bytes: file.size, width, height })
      .eq("id", replace)
      .select("id, url, alt, alt_ar, caption, caption_ar, width, height, created_at")
      .single();
    if (error) {
      console.error("[media] replace failed:", error.message);
      await db.storage.from("media").remove([path]);
      return fail("The image could not be replaced. Please try again.", 500);
    }
    if (previousPath) await db.storage.from("media").remove([previousPath]);
    // Pages embed the file URL; regenerate them so every use shows the new file.
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, media: data });
  }

  const { data, error } = await db
    .from("media")
    .insert({
      storage_path: path,
      url,
      alt,
      alt_ar: altAr,
      caption,
      caption_ar: captionAr,
      mime_type: file.type,
      size_bytes: file.size,
      width,
      height,
      created_by: admin.userId,
    })
    .select("id, url, alt, alt_ar, caption, caption_ar, width, height, created_at")
    .single();
  if (error) {
    console.error("[media] register failed:", error.message);
    await db.storage.from("media").remove([path]);
    return fail("The image could not be saved. Please try again.", 500);
  }
  return NextResponse.json({ ok: true, media: data });
}
