"use client";

import { useId, useState, type FormEvent } from "react";
import { practiceAreas } from "@/content/practiceAreas";
import { site } from "@/content/site";
import { Button } from "./Button";
import styles from "./ContactForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "mail" }
  | { kind: "error"; message: string };

type Payload = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  practice: string;
  message: string;
};

function mailtoFor(data: Payload) {
  const subject = `Enquiry — ${data.practice || "General"} — ${data.name}`;
  const details = [
    `Name: ${data.name}`,
    data.organization && `Organization: ${data.organization}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
  ].filter(Boolean);
  const body = [data.message, "", ...details].join("\n");
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Enquiry form. Submits to /api/contact; if no delivery endpoint is
 * configured on the server, it hands the enquiry to the visitor's email
 * client instead so nothing is silently lost.
 */
export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const data: Payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      organization: String(fd.get("organization") ?? "").trim(),
      practice: String(fd.get("practice") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
    };

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, company: String(fd.get("company") ?? "") }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };

      if (res.ok && json.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      if (json.fallback === "mailto") {
        window.location.href = mailtoFor(data);
        setStatus({ kind: "mail" });
        return;
      }
      setStatus({ kind: "error", message: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Please try again, or email us directly." });
    }
  }

  if (status.kind === "sent" || status.kind === "mail") {
    return (
      <div className={styles.done} role="status">
        <p className="label">{status.kind === "sent" ? "Received" : "One more step"}</p>
        <p className={`serif ${styles.doneTitle}`}>
          {status.kind === "sent" ? "Thank you. We will be in touch shortly." : "Your email is ready to send."}
        </p>
        <p className={styles.doneText}>
          {status.kind === "sent"
            ? "A member of the team will review your enquiry and respond by email or phone."
            : `Your email application has opened with the enquiry prepared. If it did not, write to us at ${site.contact.email}.`}
        </p>
        <button type="button" className={styles.again} onClick={() => setStatus({ kind: "idle" })}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row}>
        <Field id={`${id}-name`} name="name" label="Full name" autoComplete="name" required />
        <Field id={`${id}-org`} name="organization" label="Organization" autoComplete="organization" />
      </div>
      <div className={styles.row}>
        <Field id={`${id}-email`} name="email" label="Email" type="email" autoComplete="email" required />
        <Field id={`${id}-phone`} name="phone" label="Phone" type="tel" autoComplete="tel" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-practice`} className={styles.label}>
          Area of law
        </label>
        <select id={`${id}-practice`} name="practice" className={styles.input} defaultValue="">
          <option value="">Not sure yet</option>
          {practiceAreas.map((a) => (
            <option key={a.slug} value={a.title}>
              {a.title}
            </option>
          ))}
        </select>
        <span className={styles.focusLine} aria-hidden="true" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-message`} className={styles.label}>
          How can we help?
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          required
          minLength={10}
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

      <label className={styles.consent}>
        <input type="checkbox" name="consent" required />
        <span>
          I understand that submitting this form does not create a lawyer–client relationship, and that I should not
          send confidential information until one exists.
        </span>
      </label>

      <div className={styles.submit}>
        <Button type="submit" variant="solid" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending" : "Send enquiry"}
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
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({ id, name, label, type = "text", autoComplete, required }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={200}
        className={styles.input}
      />
      <span className={styles.focusLine} aria-hidden="true" />
    </div>
  );
}
