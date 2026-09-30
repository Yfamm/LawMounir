"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteEnquiry, markEnquiryRead, updateEnquiry } from "@/app/admin/actions";
import styles from "./admin.module.css";

/** Marks an enquiry as read once an admin opens it. */
export function MarkRead({ id, unread }: { id: string; unread: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!unread) return;
    markEnquiryRead(id).then(() => router.refresh());
  }, [id, unread, router]);
  return null;
}

export function EnquiryControls({ id, status, note }: { id: string; status: string; note: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [text, setText] = useState(note);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const save = () =>
    start(async () => {
      const r = await updateEnquiry(id, { status: value, internalNote: text });
      setMessage(r.ok ? { kind: "ok", text: "Saved." } : { kind: "error", text: r.error });
      if (r.ok) router.refresh();
    });

  const remove = () => {
    if (!window.confirm("Delete this enquiry permanently? This cannot be undone.")) return;
    start(async () => {
      const r = await deleteEnquiry(id);
      if (!r.ok) setMessage({ kind: "error", text: r.error });
      else router.push("/admin/enquiries");
    });
  };

  return (
    <div className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Status</span>
        <select className={styles.input} value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Internal note</span>
        <textarea className={styles.input} rows={6} value={text} maxLength={10000} onChange={(e) => setText(e.target.value)} />
        <span className={styles.private}>Visible to administrators only — never shown on the website.</span>
      </label>
      <span className={styles.tools}>
        <button type="button" className={styles.button} disabled={pending} onClick={save}>
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.buttonDanger} disabled={pending} onClick={remove}>
          Delete enquiry
        </button>
      </span>
      {message && (
        <span className={message.kind === "ok" ? styles.statusOk : styles.statusError} role={message.kind === "error" ? "alert" : "status"}>
          {message.text}
        </span>
      )}
    </div>
  );
}
