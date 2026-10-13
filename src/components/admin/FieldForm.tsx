"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { completeness, type Field } from "@/lib/cms/fields";
import type { ImageRef, TranslationFlags } from "@/lib/cms/types";
import { ImageField } from "./ImageField";
import styles from "./admin.module.css";

type Values = Record<string, unknown>;
type Loc = { en: string; ar: string };
type LocList = { en: string[]; ar: string[] };
export type RefOptions = Partial<Record<"people" | "insights", { value: string; label: string }[]>>;

type Props = {
  fields: Field[];
  initial: Values;
  action: (data: Values) => Promise<ActionResult>;
  submitLabel?: string;
  refOptions?: RefOptions;
  /** After creating a record, go to `${createdPath}/${id}`. */
  createdPath?: string;
  /** Language-neutral public path for the preview links, e.g. "/about". */
  previewPath?: string;
  /** Show the translation-status bar (default true when the form has localized fields). */
  translationBar?: boolean;
};

const WIDE = new Set(["textarea", "headline", "lines", "image", "list", "refs", "group", "link"]);

/**
 * Renders field definitions as a form and submits the values to a server
 * action. Localized fields are edited side by side (English · العربية);
 * a status bar shows which language is complete, and lets an editor mark a
 * language as reviewed.
 */
export function FieldForm({ fields, initial, action, submitLabel = "Save & publish", refOptions, createdPath, previewPath, translationBar }: Props) {
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

  const flags = useMemo(() => (values._translation ?? {}) as TranslationFlags, [values._translation]);
  const state = useMemo(() => completeness(fields, values, flags), [fields, values, flags]);
  const hasLocalized = useMemo(() => JSON.stringify(fields).includes('"localized":true') || JSON.stringify(fields).includes('"type":"link"'), [fields]);
  const showBar = translationBar ?? hasLocalized;

  const update = (name: string, value: unknown) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
    setStatus(null);
  };

  const setFlag = (lang: "ar" | "en", reviewed: boolean) => update("_translation", { ...flags, [lang]: reviewed ? "reviewed" : "needs_review" });

  const cancel = () => {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setValues(initial);
    setDirty(false);
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
      {showBar && (
        <div className={styles.translationBar}>
          {(["ar", "en"] as const).map((lang) => {
            const s = state[lang];
            const name = lang === "ar" ? "العربية · Arabic" : "English";
            return (
              <div key={lang} className={styles.translationItem}>
                <span className={`${styles.badge} ${s.complete ? styles.badgeOutline : s.missing ? styles.badgeDanger : styles.badgeMuted}`}>
                  {name}: {s.missing ? `${s.missing} missing` : s.needsReview ? "needs review" : "complete"}
                </span>
                <label className={styles.check}>
                  <input type="checkbox" checked={flags[lang] !== "needs_review"} onChange={(e) => setFlag(lang, e.target.checked)} />
                  {lang === "ar" ? "Arabic text reviewed" : "English text reviewed"}
                </label>
              </div>
            );
          })}
          {previewPath && (
            <span className={styles.tools}>
              <a className={styles.iconButton} href={previewPath === "/" ? "/ar" : `/ar${previewPath}`} target="_blank" rel="noopener">
                Preview AR ↗
              </a>
              <a className={styles.iconButton} href={previewPath === "/" ? "/en" : `/en${previewPath}`} target="_blank" rel="noopener">
                Preview EN ↗
              </a>
            </span>
          )}
        </div>
      )}

      <div className={styles.fieldGrid}>
        {fields.map((field) => (
          <FieldInput key={field.name} field={field} value={values[field.name]} onChange={(v) => update(field.name, v)} refOptions={refOptions} />
        ))}
      </div>
      <div className={styles.saveBar}>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <button type="button" className={styles.buttonGhost} disabled={pending || !dirty} onClick={cancel}>
          Cancel changes
        </button>
        <span
          className={`${styles.status} ${status?.kind === "ok" ? styles.statusOk : ""} ${status?.kind === "error" ? styles.statusError : ""}`}
          role={status?.kind === "error" ? "alert" : "status"}
        >
          {status?.text ?? (dirty ? "Unsaved changes" : "")}
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

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  const required = "required" in field && field.required;
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} className={styles.label}>
      {field.label}
      {field.labelAr && (
        <span className={styles.labelAr} lang="ar">
          {" "}
          · {field.labelAr}
        </span>
      )}
      {required && <span className={styles.required}> *</span>}
    </Tag>
  );
}

const asLoc = (v: unknown): Loc => {
  if (typeof v === "string") return { en: v, ar: "" };
  const o = (v ?? {}) as Partial<Loc>;
  return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
};

const asLocList = (v: unknown): LocList => {
  if (Array.isArray(v)) return { en: v as string[], ar: [] };
  const o = (v ?? {}) as Partial<LocList>;
  return { en: Array.isArray(o.en) ? o.en : [], ar: Array.isArray(o.ar) ? o.ar : [] };
};

/** Two inputs (English · Arabic) for one localized value. */
function LocalizedInputs({
  id,
  value,
  onChange,
  multiline,
  rows,
  max,
  headline,
  placeholder,
}: {
  id: string;
  value: Loc;
  onChange: (v: Loc) => void;
  multiline: boolean;
  rows?: number;
  max?: number;
  headline?: boolean;
  placeholder?: string;
}) {
  const missing = (lang: "en" | "ar") => !value[lang].trim() && Boolean(value[lang === "en" ? "ar" : "en"].trim());
  return (
    <div className={styles.pair}>
      {(["en", "ar"] as const).map((lang) => {
        const common = {
          id: `${id}-${lang}`,
          value: value[lang],
          dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
          lang,
          maxLength: max,
          className: `${styles.input} ${lang === "ar" ? styles.rtl : ""} ${headline ? styles.headlineInput : ""} ${missing(lang) ? styles.inputMissing : ""}`,
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [lang]: e.target.value }),
        };
        return (
          <div key={lang} className={styles.pairCol}>
            <label htmlFor={common.id} className={styles.langTag}>
              {lang === "en" ? "English" : "العربية"}
              {missing(lang) && <span className={styles.missing}>{lang === "en" ? "missing" : "ناقص · missing"}</span>}
            </label>
            {multiline ? <textarea rows={rows ?? 3} {...common} /> : <input type="text" placeholder={lang === "en" ? placeholder : undefined} {...common} />}
          </div>
        );
      })}
    </div>
  );
}

function FieldInput({ field, value, onChange, refOptions, idPrefix = "f" }: InputProps) {
  const id = `${idPrefix}-${field.name}`;
  const wide = WIDE.has(field.type) || ("localized" in field && field.localized) ? styles.wide : "";
  const help = field.help ? <span className={styles.help}>{field.help}</span> : null;
  const str = typeof value === "string" ? value : "";

  switch (field.type) {
    case "hidden":
      return null;
    case "text":
    case "textarea":
    case "headline": {
      if (field.localized) {
        const multiline = field.type !== "text";
        return (
          <div className={`${styles.field} ${wide}`}>
            <Label field={field} />
            <LocalizedInputs
              id={id}
              value={asLoc(value)}
              onChange={onChange}
              multiline={multiline}
              rows={"rows" in field ? field.rows : field.type === "headline" ? 3 : undefined}
              max={"max" in field ? field.max : undefined}
              headline={field.type === "headline"}
              placeholder={"placeholder" in field ? field.placeholder : undefined}
            />
            {help}
          </div>
        );
      }
      if (field.type === "text") {
        return (
          <div className={styles.field}>
            <Label field={field} htmlFor={id} />
            <input id={id} className={styles.input} type="text" value={str} maxLength={field.max} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
            {help}
          </div>
        );
      }
      return (
        <div className={`${styles.field} ${wide}`}>
          <Label field={field} htmlFor={id} />
          <textarea
            id={id}
            className={`${styles.input} ${field.type === "headline" ? styles.headlineInput : ""}`}
            rows={field.rows ?? 3}
            value={str}
            maxLength={"max" in field ? field.max : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
    }
    case "url":
    case "slug":
    case "email":
      return (
        <div className={styles.field}>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            className={styles.input}
            type={field.type === "email" ? "email" : "text"}
            dir="ltr"
            value={str}
            placeholder={field.type === "url" ? "/contact" : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
    case "link": {
      const link = (value ?? { text: { en: "", ar: "" }, url: "" }) as { text: Loc; url: string };
      return (
        <div className={`${styles.field} ${wide}`}>
          <Label field={field} />
          <div className={styles.linkGrid}>
            <LocalizedInputs id={`${id}-text`} value={asLoc(link.text)} onChange={(t) => onChange({ ...link, text: t })} multiline={false} max={80} />
            <div className={styles.pairCol}>
              <label htmlFor={`${id}-url`} className={styles.langTag}>
                Link
              </label>
              <input id={`${id}-url`} className={styles.input} dir="ltr" value={link.url ?? ""} placeholder="/contact" onChange={(e) => onChange({ ...link, url: e.target.value })} />
            </div>
          </div>
          {help ?? <span className={styles.help}>Leave the text empty to hide the button.</span>}
        </div>
      );
    }
    case "lines": {
      if (field.localized) {
        const v = asLocList(value);
        return (
          <div className={`${styles.field} ${wide}`}>
            <Label field={field} />
            <div className={styles.pair}>
              {(["en", "ar"] as const).map((lang) => (
                <div key={lang} className={styles.pairCol}>
                  <label htmlFor={`${id}-${lang}`} className={styles.langTag}>
                    {lang === "en" ? "English" : "العربية"}
                    {!v[lang].some((s) => s.trim()) && v[lang === "en" ? "ar" : "en"].some((s) => s.trim()) && <span className={styles.missing}>missing</span>}
                  </label>
                  <textarea
                    id={`${id}-${lang}`}
                    className={`${styles.input} ${lang === "ar" ? styles.rtl : ""}`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    lang={lang}
                    rows={Math.min(10, Math.max(3, v[lang].length + 1))}
                    value={v[lang].join("\n")}
                    onChange={(e) => onChange({ ...v, [lang]: e.target.value.split("\n") })}
                  />
                </div>
              ))}
            </div>
            {help}
          </div>
        );
      }
      const lines = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className={`${styles.field} ${wide}`}>
          <Label field={field} htmlFor={id} />
          <textarea id={id} className={styles.input} rows={Math.min(10, Math.max(3, lines.length + 1))} value={lines.join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} />
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
          <Label field={field} htmlFor={id} />
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
          <Label field={field} htmlFor={id} />
          <input id={id} type="date" className={styles.input} value={str} onChange={(e) => onChange(e.target.value || null)} />
          {help}
        </div>
      );
    case "image":
      return (
        <div className={`${styles.field} ${wide}`}>
          <span id={`${id}-label`}>
            <Label field={field} />
          </span>
          <ImageField id={id} value={(value as ImageRef) ?? {}} onChange={onChange} />
          {help}
        </div>
      );
    case "refs":
      return (
        <div className={`${styles.field} ${wide}`}>
          <Label field={field} htmlFor={id} />
          <RefsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} options={refOptions?.[field.source] ?? []} onChange={onChange} />
          {help}
        </div>
      );
    case "group":
      return (
        <fieldset className={`${styles.group} ${wide}`}>
          <legend className={styles.groupLegend}>{field.label}</legend>
          {help}
          <div className={styles.fieldGrid}>
            {field.fields.map((sub) => {
              const v = (value ?? {}) as Values;
              return (
                <FieldInput
                  key={sub.name}
                  field={sub}
                  value={v[sub.name]}
                  idPrefix={id}
                  refOptions={refOptions}
                  onChange={(nv) => onChange({ ...v, [sub.name]: nv })}
                />
              );
            })}
          </div>
        </fieldset>
      );
    case "list":
      return (
        <div className={`${styles.field} ${wide}`}>
          <Label field={field} />
          {help}
          <ListInput field={field} value={Array.isArray(value) ? (value as Values[]) : []} onChange={onChange} idPrefix={id} refOptions={refOptions} />
        </div>
      );
  }
}

function emptyItem(fields: Field[]): Values {
  const item: Values = {};
  for (const f of fields) {
    if ((f.type === "text" || f.type === "textarea" || f.type === "headline") && f.localized) item[f.name] = { en: "", ar: "" };
    else if (f.type === "lines") item[f.name] = f.localized ? { en: [], ar: [] } : [];
    else if (f.type === "link") item[f.name] = { text: { en: "", ar: "" }, url: "" };
    else if (f.type === "checkbox") item[f.name] = f.name === "enabled";
    else if (f.type === "list" || f.type === "refs") item[f.name] = [];
    else if (f.type === "image") item[f.name] = {};
    else if (f.type === "date") item[f.name] = null;
    else if (f.type === "select") item[f.name] = f.options[0]?.value ?? "";
    else item[f.name] = "";
  }
  return item;
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function itemTitle(field: Extract<Field, { type: "list" }>, item: Values) {
  if (!field.titleField) return "";
  const v = item[field.titleField];
  const loc = asLoc(v);
  return loc.en || loc.ar;
}

function ListInput({
  field,
  value,
  onChange,
  idPrefix,
  refOptions,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Values[];
  onChange: (v: unknown) => void;
  idPrefix: string;
  refOptions?: RefOptions;
}) {
  const fixed = field.min !== undefined && field.min === field.max;
  return (
    <div className={styles.list}>
      {value.map((item, i) => {
        const title = itemTitle(field, item);
        const hidden = "enabled" in item && item.enabled === false;
        return (
          <div key={i} className={`${styles.item} ${hidden ? styles.itemHidden : ""}`}>
            <div className={styles.itemHead}>
              <span className={styles.itemLabel}>
                {field.itemLabel} {String(i + 1).padStart(2, "0")}
                {title && <span className={styles.itemTitle}> — {title}</span>}
                {hidden && <span className={styles.itemTitle}> (hidden)</span>}
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
                    onClick={() => {
                      if (window.confirm(`Remove ${field.itemLabel.toLowerCase()} ${i + 1}${title ? ` (“${title}”)` : ""}? It is deleted when you save.`)) {
                        onChange(value.filter((_, j) => j !== i));
                      }
                    }}
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
                  refOptions={refOptions}
                  onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
                />
              ))}
            </div>
          </div>
        );
      })}
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

function RefsInput({ id, value, options, onChange }: { id: string; value: string[]; options: { value: string; label: string }[]; onChange: (v: unknown) => void }) {
  const available = options.filter((o) => !value.includes(o.value));
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? `${v} (unpublished or removed)`;
  return (
    <div className={styles.list}>
      {value.length === 0 && <span className={styles.help}>Automatic: the first three published.</span>}
      {value.map((v, i) => (
        <div key={v} className={`${styles.itemHead} ${styles.refRow}`}>
          <span>
            <span className={styles.itemLabel}>{String(i + 1).padStart(2, "0")}</span> {labelOf(v)}
          </span>
          <span className={styles.tools}>
            <button type="button" className={styles.iconButton} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label="Move up">
              ↑
            </button>
            <button type="button" className={styles.iconButton} disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} aria-label="Move down">
              ↓
            </button>
            <button type="button" className={styles.iconButton} onClick={() => onChange(value.filter((x) => x !== v))}>
              Remove
            </button>
          </span>
        </div>
      ))}
      {available.length > 0 && value.length < 12 && (
        <select id={id} className={styles.input} value="" onChange={(e) => e.target.value && onChange([...value, e.target.value])}>
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
