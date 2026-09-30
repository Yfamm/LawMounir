"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/fields";
import type { ImageRef } from "@/lib/cms/types";
import { ImageField } from "./ImageField";
import styles from "./admin.module.css";

type Values = Record<string, unknown>;
export type RefOptions = Partial<Record<"people" | "insights", { value: string; label: string }[]>>;

type Props = {
  fields: Field[];
  initial: Values;
  action: (data: Values) => Promise<ActionResult>;
  submitLabel?: string;
  refOptions?: RefOptions;
  /** After creating a record, go to `${createdPath}/${id}`. */
  createdPath?: string;
  /** Shown in the save bar, e.g. "Saving publishes to the live site." */
  note?: string;
};

const WIDE = new Set(["textarea", "headline", "lines", "image", "list", "refs"]);

/** Renders field definitions as a form and submits the values to a server action. */
export function FieldForm({ fields, initial, action, submitLabel = "Save & publish", refOptions, createdPath, note }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (name: string, value: unknown) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
    setStatus(null);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await action(values);
      if (!result.ok) {
        setStatus({ kind: "error", text: result.error });
        return;
      }
      setDirty(false);
      setStatus({ kind: "ok", text: "Saved. The live site is updated." });
      if (createdPath && result.id) router.replace(`${createdPath}/${result.id}`);
      else router.refresh();
    });
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.fieldGrid}>
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(v) => update(field.name, v)}
            refOptions={refOptions}
          />
        ))}
      </div>
      <div className={styles.saveBar}>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <span
          className={`${styles.status} ${status?.kind === "ok" ? styles.statusOk : ""} ${status?.kind === "error" ? styles.statusError : ""}`}
          role={status?.kind === "error" ? "alert" : "status"}
        >
          {status?.text ?? (dirty ? "Unsaved changes" : note ?? "")}
        </span>
      </div>
    </form>
  );
}

type InputProps = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  refOptions?: RefOptions;
  idPrefix?: string;
};

function FieldInput({ field, value, onChange, refOptions, idPrefix = "f" }: InputProps) {
  const id = `${idPrefix}-${field.name}`;
  const wide = WIDE.has(field.type) ? styles.wide : "";
  const required = "required" in field && field.required;
  const labelEl =
    field.type === "checkbox" ? null : field.type === "image" ? (
      <span id={`${id}-label`} className={styles.label}>
        {field.label}
      </span>
    ) : (
      <label htmlFor={id} className={styles.label}>
        {field.label}
        {required && <span className={styles.required}> *</span>}
      </label>
    );
  const help = field.help ? <span className={styles.help}>{field.help}</span> : null;
  const rtl = "dir" in field && field.dir === "rtl" ? styles.rtl : "";
  const str = typeof value === "string" ? value : "";

  switch (field.type) {
    case "text":
    case "url":
    case "slug":
    case "email":
      return (
        <div className={styles.field}>
          {labelEl}
          <input
            id={id}
            className={`${styles.input} ${rtl}`}
            type={field.type === "email" ? "email" : "text"}
            value={str}
            dir={rtl ? "rtl" : undefined}
            maxLength={"max" in field ? field.max : undefined}
            placeholder={field.type === "url" ? "/contact" : "placeholder" in field ? field.placeholder : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
    case "textarea":
    case "headline":
      return (
        <div className={`${styles.field} ${wide}`}>
          {labelEl}
          <textarea
            id={id}
            className={`${styles.input} ${rtl} ${field.type === "headline" ? styles.headlineInput : ""}`}
            rows={field.rows ?? (field.type === "headline" ? 3 : 4)}
            value={str}
            dir={rtl ? "rtl" : undefined}
            maxLength={"max" in field ? field.max : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
    case "lines": {
      const lines = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className={`${styles.field} ${wide}`}>
          {labelEl}
          <textarea
            id={id}
            className={`${styles.input} ${rtl}`}
            rows={Math.min(10, Math.max(3, lines.length + 1))}
            value={lines.join("\n")}
            dir={rtl ? "rtl" : undefined}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
          {help}
        </div>
      );
    }
    case "checkbox":
      return (
        <div className={styles.field}>
          <label className={styles.check}>
            <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            {field.label}
          </label>
          {help}
        </div>
      );
    case "select":
      return (
        <div className={styles.field}>
          {labelEl}
          <select id={id} className={styles.input} value={str} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );
    case "date":
      return (
        <div className={styles.field}>
          {labelEl}
          <input
            id={id}
            type="date"
            className={styles.input}
            value={str}
            onChange={(e) => onChange(e.target.value || null)}
          />
          {help}
        </div>
      );
    case "image":
      return (
        <div className={`${styles.field} ${wide}`}>
          {labelEl}
          <ImageField id={id} value={(value as ImageRef) ?? {}} onChange={onChange} />
          {help}
        </div>
      );
    case "refs":
      return (
        <div className={`${styles.field} ${wide}`}>
          {labelEl}
          <RefsInput
            id={id}
            value={Array.isArray(value) ? (value as string[]) : []}
            options={refOptions?.[field.source] ?? []}
            onChange={onChange}
          />
          {help}
        </div>
      );
    case "list":
      return (
        <div className={`${styles.field} ${wide}`}>
          <span className={styles.label}>{field.label}</span>
          {help}
          <ListInput field={field} value={Array.isArray(value) ? (value as Values[]) : []} onChange={onChange} idPrefix={id} />
        </div>
      );
  }
}

function emptyItem(fields: Field[]): Values {
  const item: Values = {};
  for (const f of fields) {
    item[f.name] =
      f.type === "checkbox" ? false : f.type === "lines" || f.type === "list" || f.type === "refs" ? [] : f.type === "image" ? {} : f.type === "date" ? null : "";
  }
  return item;
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ListInput({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Values[];
  onChange: (v: unknown) => void;
  idPrefix: string;
}) {
  const fixed = field.min !== undefined && field.min === field.max;
  return (
    <div className={styles.list}>
      {value.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.itemHead}>
            <span className={styles.itemLabel}>
              {field.itemLabel} {String(i + 1).padStart(2, "0")}
            </span>
            <span className={styles.tools}>
              <button type="button" className={styles.iconButton} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label={`Move ${field.itemLabel} ${i + 1} up`}>
                ↑ Up
              </button>
              <button
                type="button"
                className={styles.iconButton}
                disabled={i === value.length - 1}
                onClick={() => onChange(move(value, i, i + 1))}
                aria-label={`Move ${field.itemLabel} ${i + 1} down`}
              >
                ↓ Down
              </button>
              {!fixed && (
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={field.min !== undefined && value.length <= field.min}
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              )}
            </span>
          </div>
          <div className={styles.fieldGrid}>
            {field.fields.map((sub) => (
              <FieldInput
                key={sub.name}
                field={sub}
                value={item[sub.name]}
                idPrefix={`${idPrefix}-${i}`}
                onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
              />
            ))}
          </div>
        </div>
      ))}
      {!fixed && (field.max === undefined || value.length < field.max) && (
        <div>
          <button type="button" className={styles.buttonGhost} onClick={() => onChange([...value, emptyItem(field.fields)])}>
            + Add {field.itemLabel.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  );
}

function RefsInput({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (v: unknown) => void;
}) {
  const available = options.filter((o) => !value.includes(o.value));
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? `${v} (unpublished or removed)`;
  return (
    <div className={styles.list}>
      {value.length === 0 && <span className={styles.help}>Automatic: the first three published.</span>}
      {value.map((v, i) => (
        <div key={v} className={styles.itemHead} style={{ padding: "0.6rem 0.9rem", border: "1px solid var(--line)" }}>
          <span>
            <span className={styles.itemLabel}>{String(i + 1).padStart(2, "0")}</span> {labelOf(v)}
          </span>
          <span className={styles.tools}>
            <button type="button" className={styles.iconButton} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))}>
              ↑
            </button>
            <button type="button" className={styles.iconButton} disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))}>
              ↓
            </button>
            <button type="button" className={styles.iconButton} onClick={() => onChange(value.filter((x) => x !== v))}>
              Remove
            </button>
          </span>
        </div>
      ))}
      {available.length > 0 && value.length < 12 && (
        <select
          id={id}
          className={styles.input}
          value=""
          onChange={(e) => e.target.value && onChange([...value, e.target.value])}
        >
          <option value="">+ Add…</option>
          {available.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
