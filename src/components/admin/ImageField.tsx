"use client";

import { useRef, useState } from "react";
import { staticImageCatalogue } from "@/lib/cms/images";
import type { ImageRef, StaticImageKey } from "@/lib/cms/types";
import { uploadImage, type MediaItem } from "./upload";
import styles from "./admin.module.css";

const catalogue = staticImageCatalogue();

type Props = { id: string; value: ImageRef; onChange: (value: ImageRef) => void };

/**
 * Image reference editor: pick one of the static architectural plates or an
 * image from the media library (or upload one), then set alt text, caption
 * and framing. An empty value keeps the section's original plate.
 */
export function ImageField({ id, value, onChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [media, setMedia] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const current =
    value.mediaId && value.url
      ? { src: value.url, label: "Media library" }
      : value.plate
        ? { src: catalogue.find((c) => c.key === value.plate)?.preview ?? "", label: labelFor(value.plate) }
        : null;

  const open = async () => {
    dialog.current?.showModal();
    if (media) return;
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; media?: MediaItem[]; error?: string };
      if (!json.ok) throw new Error(json.error);
      setMedia(json.media ?? []);
    } catch {
      setError("The media library could not be loaded.");
      setMedia([]);
    }
  };

  // A new image brings its own description: alt text and caption describe the
  // previous image, so they are replaced (plates fall back to their own).
  const choosePlate = (key: StaticImageKey) => {
    onChange({ plate: key });
    dialog.current?.close();
  };

  const chooseMedia = (item: MediaItem) => {
    // Alt text and captions come from the media library unless overridden here.
    onChange({ mediaId: item.id, url: item.url });
    dialog.current?.close();
  };

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const result = await uploadImage(file, {
      alt: value.alt?.en,
      altAr: value.alt?.ar,
      caption: value.caption?.en,
      captionAr: value.caption?.ar,
    });
    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMedia((m) => [result.media, ...(m ?? [])]);
    chooseMedia(result.media);
  };

  const setText = (key: "alt" | "caption", lang: "en" | "ar", v: string) =>
    onChange({ ...value, [key]: { en: value[key]?.en ?? "", ar: value[key]?.ar ?? "", [lang]: v } });
  const setPosition = (v: string) => onChange({ ...value, position: v });

  return (
    <div className={styles.imageField} id={id} role="group" aria-labelledby={`${id}-label`}>
      <div className={styles.thumb}>
        {current?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.src} alt="" style={value.position ? { objectPosition: value.position } : undefined} />
        ) : (
          <span className={styles.thumbEmpty}>Original image</span>
        )}
      </div>
      <div className={styles.imageMeta}>
        <span className={styles.help}>{current ? current.label : "Using the section’s original architectural plate."}</span>
        <span className={styles.tools}>
          <button type="button" className={styles.buttonGhost} onClick={open}>
            Choose image
          </button>
          {(value.plate || value.mediaId) && (
            <button type="button" className={styles.iconButton} onClick={() => onChange({})}>
              Reset to original
            </button>
          )}
        </span>
        {(["alt", "caption"] as const).map((key) => (
          <div key={key} className={styles.field}>
            <span className={styles.label}>
              {key === "alt" ? "Alt text" : "Caption"}
              <span className={styles.labelAr} lang="ar">
                {" "}
                · {key === "alt" ? "النص البديل" : "التعليق"}
              </span>
            </span>
            <div className={styles.pair}>
              <input
                className={styles.input}
                aria-label={`${key === "alt" ? "Alt text" : "Caption"} — English`}
                value={value[key]?.en ?? ""}
                maxLength={key === "alt" ? 300 : 200}
                onChange={(e) => setText(key, "en", e.target.value)}
                placeholder={key === "alt" ? "English — leave empty to use the image’s own" : "English — leave empty for the image’s own"}
              />
              <input
                className={`${styles.input} ${styles.rtl}`}
                dir="rtl"
                lang="ar"
                aria-label={`${key === "alt" ? "Alt text" : "Caption"} — Arabic`}
                value={value[key]?.ar ?? ""}
                maxLength={key === "alt" ? 300 : 200}
                onChange={(e) => setText(key, "ar", e.target.value)}
                placeholder="العربية"
              />
            </div>
          </div>
        ))}
        <label className={styles.field}>
          <span className={styles.label}>Framing (x% y%)</span>
          <input className={styles.input} dir="ltr" value={value.position ?? ""} maxLength={20} onChange={(e) => setPosition(e.target.value)} placeholder="50% 50%" />
        </label>
      </div>

      <dialog ref={dialog} className={styles.dialog} aria-label="Choose an image">
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Choose an image</h2>
          <button type="button" className={styles.iconButton} onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <div className={styles.dialogBody}>
          <section className={styles.list}>
            <span className={styles.label}>Architectural plates</span>
            <div className={styles.gallery}>
              {catalogue.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`${styles.tile} ${value.plate === c.key && !value.mediaId ? styles.tileActive : ""}`}
                  onClick={() => choosePlate(c.key)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.preview} alt="" />
                  <span>{labelFor(c.key)}</span>
                </button>
              ))}
            </div>
          </section>
          <section className={styles.list}>
            <span className={styles.label}>Media library</span>
            <label className={styles.check}>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={uploading} onChange={(e) => onUpload(e.target.files?.[0])} />
              {uploading ? "Uploading…" : "Upload a new image (max 8 MB)"}
            </label>
            {error && (
              <span className={styles.statusError} role="alert">
                {error}
              </span>
            )}
            {media === null ? (
              <span className={styles.help}>Loading…</span>
            ) : media.length === 0 ? (
              <span className={styles.help}>No uploaded images yet.</span>
            ) : (
              <div className={styles.gallery}>
                {media.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.tile} ${value.mediaId === m.id ? styles.tileActive : ""}`}
                    onClick={() => chooseMedia(m)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt="" />
                    <span>{m.alt || m.alt_ar || m.caption || "Untitled"}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </dialog>
    </div>
  );
}

function labelFor(key: StaticImageKey) {
  const c = catalogue.find((x) => x.key === key);
  if (!c) return key;
  return key === "hero" ? "Hero — Justice" : `Pl. ${c.plateNo} — ${c.caption}`;
}
