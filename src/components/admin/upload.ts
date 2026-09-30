export type MediaItem = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

async function dimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: 0, height: 0 };
  }
}

/** Uploads an image to the media library through the admin API. */
export async function uploadImage(
  file: File,
  alt: string,
  caption: string,
): Promise<{ ok: true; media: MediaItem } | { ok: false; error: string }> {
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: "Images must be 8 MB or smaller." };
  const { width, height } = await dimensions(file);
  const form = new FormData();
  form.set("file", file);
  form.set("alt", alt);
  form.set("caption", caption);
  if (width) form.set("width", String(width));
  if (height) form.set("height", String(height));
  try {
    const res = await fetch("/api/admin/media", { method: "POST", body: form });
    const json = (await res.json()) as { ok: boolean; media?: MediaItem; error?: string };
    if (!json.ok || !json.media) return { ok: false, error: json.error ?? "The image could not be uploaded." };
    return { ok: true, media: json.media };
  } catch {
    return { ok: false, error: "The image could not be uploaded." };
  }
}
