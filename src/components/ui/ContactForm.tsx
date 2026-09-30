"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "./Button";
import styles from "./ContactForm.module.css";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

type Props = {
  submitText: string;
  notice: string;
  successTitle: string;
  successText: string;
};

/**
 * Enquiry form. Posts to /api/contact, which validates the enquiry and
 * stores it in the firm's confidential enquiries inbox.
 */
export function ContactForm({ submitText, notice, successTitle, successText }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      company: String(fd.get("company") ?? ""),
      path: window.location.pathname,
    };

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      setStatus({ kind: "error", message: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Please check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className={styles.done} role="status">
        <p className="label">Received</p>
        <p className={`serif ${styles.doneTitle}`}>{successTitle}</p>
        {successText && <p className={styles.doneText}>{successText}</p>}
        <button type="button" className={styles.again} onClick={() => setStatus({ kind: "idle" })}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row}>
        <Field id={`${id}-name`} name="name" label="Name" autoComplete="name" required maxLength={200} />
        <Field
          id={`${id}-phone`}
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          required
          minLength={5}
          maxLength={40}
        />
      </div>
      <Field
        id={`${id}-email`}
        name="email"
        label="Email"
        hint="optional"
        type="email"
        autoComplete="email"
        maxLength={200}
      />

      <div className={styles.field}>
        <label htmlFor={`${id}-message`} className={styles.label}>
          Issue / question<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          required
          maxLength={4000}
          className={`${styles.input} ${styles.textarea}`}
        />
        <span className={styles.focusLine} aria-hidden="true" />
      </div>

      {/* Honeypot for automated submissions */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {notice && <p className={styles.notice}>{notice}</p>}

      <div className={styles.submit}>
        <Button type="submit" variant="solid" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending" : submitText}
        </Button>
        {status.kind === "error" && (
          <p className={styles.error} role="alert">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

function Field({ id, name, label, hint, type = "text", autoComplete, required, minLength, maxLength }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {hint && <span className={styles.hint}> ({hint})</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={styles.input}
      />
      <span className={styles.focusLine} aria-hidden="true" />
    </div>
  );
}
