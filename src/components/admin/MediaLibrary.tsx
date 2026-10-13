"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { deleteMedia, updateMedia } from "@/app/admin/actions";
import { uploadImage, type MediaItem } from "./upload";
import styles from "./admin.module.css";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";

export function MediaUploader() {
  const router = useRouter();
  const file = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState({ alt: "", altAr: "", caption: "", captionAr: "" });
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
    const result = await uploadImage(f, meta);
    setBusy(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      return;
    }
    setStatus({ kind: "ok", text: "Uploaded." });
    setMeta({ alt: "", altAr: "", caption: "", captionAr: "" });
    if (file.current) file.current.value = "";
    router.refresh();
  };

  const input = (key: keyof typeof meta, label: string, rtl = false) => (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        className={`${styles.input} ${rtl ? styles.rtl : ""}`}
        dir={rtl ? "rtl" : "ltr"}
        value={meta[key]}
        maxLength={key.startsWith("alt") ? 300 : 200}
        onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>
        <span className={styles.label}>Image (JPEG, PNG, WebP, AVIF, GIF — max 8 MB)</span>
        <input ref={file} className={styles.input} type="file" accept={ACCEPT} />
      </label>
      <div className={styles.fieldGrid}>
        {input("alt", "Alt text — English")}
        {input("altAr", "النص البديل — العربية", true)}
        {input("caption", "Caption — English")}
        {input("captionAr", "التعليق — العربية", true)}
      </div>
      <div className={styles.tools}>
        <button type="submit" className={styles.button} disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
        {status && (
          <span className={status.kind === "ok" ? styles.statusOk : styles.statusError} role={status.kind === "error" ? "alert" : "status"}>
            {status.text}
          </span>
        )}
      </div>
    </form>
  );
}

/** Searchable grid of uploaded images. */
export function MediaBrowser({ items, usage }: { items: MediaItem[]; usage: Record<string, string[]> }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "used" | "unused" | "untranslated">("all");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((m) => {
      const used = (usage[m.id] ?? []).length > 0;
      if (filter === "used" && !used) return false;
      if (filter === "unused" && used) return false;
      if (filter === "untranslated" && m.alt && m.alt_ar) return false;
      if (!q) return true;
      return [m.alt, m.alt_ar, m.caption, m.caption_ar, ...(usage[m.id] ?? [])].join(" ").toLowerCase().includes(q);
    });
  }, [items, usage, query, filter]);

  return (
    <>
      <div className={styles.searchBar}>
        <label className={styles.field} style={{ flex: "1 1 18rem" }}>
          <span className={styles.label}>Search</span>
          <input className={styles.input} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Alt text, caption or where it is used" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Show</span>
          <select className={styles.input} value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All images</option>
            <option value="used">In use</option>
            <option value="unused">Not in use</option>
            <option value="untranslated">Missing alt text</option>
          </select>
        </label>
      </div>
      {visible.length === 0 ? (
        <p className={styles.help}>{items.length ? "No images match." : "No images uploaded yet."}</p>
      ) : (
        <div className={styles.mediaGrid}>
          {visible.map((item) => (
            <MediaCard key={item.id} item={item} uses={usage[item.id] ?? []} />
          ))}
        </div>
      )}
    </>
  );
}

function MediaCard({ item, uses }: { item: MediaItem; uses: string[] }) {
  const router = useRouter();
  const replaceInput = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState({ alt: item.alt, alt_ar: item.alt_ar, caption: item.caption, caption_ar: item.caption_ar });
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState(false);

  const save = () =>
    start(async () => {
      const r = await updateMedia(item.id, meta);
      setMessage(r.ok ? { kind: "ok", text: "Saved." } : { kind: "error", text: r.error });
      if (r.ok) router.refresh();
    });

  const remove = () => {
    if (uses.length) {
      window.alert(`This image is in use and cannot be deleted:\n\n• ${uses.join("\n• ")}\n\nChoose another image there first.`);
      return;
    }
    if (!window.confirm("Delete this image permanently? This cannot be undone.")) return;
    start(async () => {
      const r = await deleteMedia(item.id);
      if (!r.ok) setMessage({ kind: "error", text: r.error });
      else router.refresh();
    });
  };

  const replace = async (file: File | undefined) => {
    if (!file) return;
    if (!window.confirm(uses.length ? `Replace this image everywhere it is used (${uses.length} place${uses.length > 1 ? "s" : ""})?` : "Replace this image?")) return;
    setBusy(true);
    const r = await uploadImage(file, { replace: item.id });
    setBusy(false);
    if (replaceInput.current) replaceInput.current.value = "";
    setMessage(r.ok ? { kind: "ok", text: "Replaced." } : { kind: "error", text: r.error });
    if (r.ok) router.refresh();
  };

  const field = (key: keyof typeof meta, label: string, rtl = false) => (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        className={`${styles.input} ${rtl ? styles.rtl : ""}`}
        dir={rtl ? "rtl" : "ltr"}
        value={meta[key]}
        maxLength={key.startsWith("alt") ? 300 : 200}
        onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <article className={styles.mediaCard}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt={item.alt} loading="lazy" />
      <span className={styles.mono}>
        {item.width && item.height ? `${item.width} × ${item.height}` : "—"} · {uses.length ? `used in ${uses.length}` : "unused"}
      </span>
      {uses.length > 0 && (
        <ul className={styles.usageList} aria-label="Where this image is used">
          {uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      )}
      {field("alt", "Alt text — English")}
      {field("alt_ar", "النص البديل — العربية", true)}
      {field("caption", "Caption — English")}
      {field("caption_ar", "التعليق — العربية", true)}
      <span className={styles.tools}>
        <button type="button" className={styles.iconButton} disabled={pending} onClick={save}>
          Save
        </button>
        <label className={styles.iconButton}>
          {busy ? "Replacing…" : "Replace file"}
          <input ref={replaceInput} type="file" accept={ACCEPT} hidden disabled={busy} onChange={(e) => replace(e.target.files?.[0])} />
        </label>
        <button type="button" className={styles.iconButton} disabled={pending} onClick={remove} title={uses.length ? "In use — replace it where it is used first" : undefined}>
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
