import { z } from "zod";
import type { Field } from "./fields";
import type { StaticImageKey } from "./types";

/**
 * Builds a strict zod schema from field definitions. Unknown keys are
 * stripped; every string is trimmed and length-limited; links are limited
 * to safe schemes; image references may only point at the site's own
 * media bucket. Localized fields accept { en, ar } (or a legacy plain
 * string, read as English); a required localized field needs at least one
 * language — missing translations are reported, not rejected.
 */

const STATIC_KEYS = ["hero", "hallAisle", "hallAislePortrait", "hallRows", "colonnade", "colonnadeDetail", "mashrabiya"] as const satisfies readonly StaticImageKey[];

const SAFE_HREF = /^(\/(?!\/)[^\s]*|#[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s()-]+)$/i;

export const hrefSchema = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || SAFE_HREF.test(v), "Use a site path such as /contact, or a full https:// link.");

function mediaPrefix() {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/media/`;
}

const text = (max = 2000) => z.string().trim().max(max);

/** { en, ar } with a legacy plain string read as English. */
function localized(max: number, label: string, required: boolean) {
  const shape = z.object({ en: text(max).default(""), ar: text(max).default("") });
  const base = z.preprocess((v) => (typeof v === "string" ? { en: v, ar: "" } : (v ?? { en: "", ar: "" })), shape);
  return required ? base.refine((v) => Boolean(v.en || v.ar), `${label} is required (in at least one language).`) : base;
}

function localizedLines(max: number) {
  const list = z
    .array(text(400))
    .max(max)
    .transform((a) => a.filter(Boolean));
  return z.preprocess(
    (v) => (Array.isArray(v) ? { en: v, ar: [] } : (v ?? { en: [], ar: [] })),
    z.object({ en: list.default([]), ar: list.default([]) }),
  );
}

export const imageSchema = z
  .object({
    plate: z.enum(STATIC_KEYS).optional(),
    mediaId: z.uuid().optional(),
    url: z.string().trim().max(1000).optional(),
    alt: localized(300, "Alt text", false).optional(),
    caption: localized(200, "Caption", false).optional(),
    position: z
      .string()
      .trim()
      .max(20)
      .refine((v) => v === "" || /^\d{1,3}% \d{1,3}%$/.test(v), "Framing must look like “50% 50%”.")
      .optional(),
  })
  .refine((v) => !v.url || (v.mediaId && v.url.startsWith(mediaPrefix())), "Choose images from the media library.");

const required = (s: z.ZodString, label: string) => s.min(1, `${label} is required.`);

function fieldSchema(field: Field): z.ZodType {
  switch (field.type) {
    case "text": {
      if (field.localized) return localized(field.max ?? 300, field.label, Boolean(field.required));
      let s = text(field.max ?? 300);
      if (field.pattern) s = s.regex(new RegExp(field.pattern), `${field.label} has an invalid format.`);
      return field.required ? required(s, field.label) : s;
    }
    case "textarea": {
      if (field.localized) return localized(field.max ?? 4000, field.label, Boolean(field.required));
      const s = text(field.max ?? 4000);
      return field.required ? required(s, field.label) : s;
    }
    case "headline":
      if (field.localized) return localized(600, field.label, Boolean(field.required));
      return field.required ? required(text(600), field.label) : text(600);
    case "url":
      return field.required ? hrefSchema.refine((v) => v !== "", `${field.label} is required.`) : hrefSchema;
    case "link":
      return z.object({
        text: localized(80, `${field.label} text`, false),
        url: field.required ? hrefSchema.refine((v) => v !== "", `${field.label} link is required.`) : hrefSchema,
      });
    case "slug":
      return z
        .string()
        .trim()
        .toLowerCase()
        .max(120)
        .refine((v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Use lower-case Latin letters, digits and hyphens.");
    case "email":
      return z.union([z.literal(""), z.email().max(200)]);
    case "lines":
      if (field.localized) return localizedLines(field.max ?? 50);
      return z.array(text(400)).max(field.max ?? 50).transform((a) => a.filter(Boolean));
    case "image":
      return imageSchema;
    case "checkbox":
      return z.boolean();
    case "select":
      return z.enum(field.options.map((o) => o.value) as [string, ...string[]]);
    case "date":
      return z.union([z.iso.date(), z.null()]);
    case "refs":
      return z.array(z.string().trim().max(200)).max(12);
    case "hidden":
      return z.string().trim().max(64).optional();
    case "group":
      return objectSchema(field.fields);
    case "list": {
      let a = z.array(objectSchema(field.fields));
      if (field.min !== undefined) a = a.min(field.min, `${field.label}: at least ${field.min} required.`);
      if (field.max !== undefined) a = a.max(field.max, `${field.label}: at most ${field.max} allowed.`);
      return a;
    }
  }
}

const flagsSchema = z
  .object({ ar: z.enum(["needs_review", "reviewed"]).optional(), en: z.enum(["needs_review", "reviewed"]).optional() })
  .optional();

/** Schema for a form; `_translation` review flags travel with every form. */
export function objectSchema(fields: Field[], withFlags = false) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) shape[f.name] = fieldSchema(f);
  if (withFlags) shape._translation = flagsSchema;
  return z.object(shape);
}

/** First human-readable validation message. */
export function firstIssue(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Invalid input.";
  const path = issue.path.filter((p) => typeof p === "string" && p !== "en" && p !== "ar").join(" › ");
  return path && !issue.message.includes("required") ? `${path}: ${issue.message}` : issue.message;
}
