"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteMedia, updateMedia } from "@/app/admin/actions";
import { uploadImage, type MediaItem } from "./upload";
import styles from "./admin.module.css";

export function MediaUploader() {
  const router = useRouter();
  const file = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = file.current?.files?.[0];
    if (!f) {
      setStatus({ kind: "error", text: "Choose an image first." });
      return;
    }
    setBusy(true);
    const result = await uploadImage(f, alt, caption);
    setBusy(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      return;
    }
    setStatus({ kind: "ok", text: "Uploaded." });
    setAlt("");
    setCaption("");
    if (file.current) file.current.value = "";
    router.refresh();
  };

  return (
    <form className={styles.upload} onSubmit={submit}>
      <label className={styles.field}>
        <span className={styles.label}>Image (JPEG, PNG, WebP, AVIF, GIF — max 8 MB)</span>
        <input ref={file} className={styles.input} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Alt text</span>
        <input className={styles.input} value={alt} maxLength={300} onChange={(e) => setAlt(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Caption</span>
        <input className={styles.input} value={caption} maxLength={200} onChange={(e) => setCaption(e.target.value)} />
      </label>
      <button type="submit" className={styles.button} disabled={busy}>
        {busy ? "Uploading…" : "Upload"}
      </button>
      {status && (
        <span className={status.kind === "ok" ? styles.statusOk : styles.statusError} role={status.kind === "error" ? "alert" : "status"}>
          {status.text}
        </span>
      )}
    </form>
  );
}

export function MediaCard({ item, uses }: { item: MediaItem; uses: number }) {
  const router = useRouter();
  const [alt, setAlt] = useState(item.alt);
  const [caption, setCaption] = useState(item.caption);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const save = () =>
    start(async () => {
      const r = await updateMedia(item.id, { alt, caption });
      setMessage(r.ok ? { kind: "ok", text: "Saved." } : { kind: "error", text: r.error });
    });

  const remove = () => {
    if (!window.confirm("Delete this image permanently?")) return;
    start(async () => {
      const r = await deleteMedia(item.id);
      if (!r.ok) setMessage({ kind: "error", text: r.error });
      else router.refresh();
    });
  };

  return (
    <article className={styles.mediaCard}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt={item.alt} loading="lazy" />
      <span className={styles.mono}>
        {item.width && item.height ? `${item.width} × ${item.height}` : "—"} · {uses > 0 ? `used ${uses}×` : "unused"}
      </span>
      <label className={styles.field}>
        <span className={styles.label}>Alt text</span>
        <input className={styles.input} value={alt} maxLength={300} onChange={(e) => setAlt(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Caption</span>
        <input className={styles.input} value={caption} maxLength={200} onChange={(e) => setCaption(e.target.value)} />
      </label>
      <span className={styles.tools}>
        <button type="button" className={styles.iconButton} disabled={pending} onClick={save}>
          Save
        </button>
        <button
          type="button"
          className={styles.iconButton}
          disabled={pending || uses > 0}
          title={uses > 0 ? "In use on the site — replace it there first" : undefined}
          onClick={remove}
        >
          Delete
        </button>
      </span>
      {message && (
        <span className={message.kind === "ok" ? styles.statusOk : styles.statusError} role={message.kind === "error" ? "alert" : "status"}>
          {message.text}
        </span>
      )}
    </article>
  );
}
