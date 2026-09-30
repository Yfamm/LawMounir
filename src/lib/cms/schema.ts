import { z } from "zod";
import type { Field } from "./fields";
import type { StaticImageKey } from "./types";

/**
 * Builds a strict zod schema from field definitions. Unknown keys are
 * stripped; every string is trimmed and length-limited; links are limited
 * to safe schemes; image references may only point at the site's own
 * media bucket.
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

export const imageSchema = z
  .object({
    plate: z.enum(STATIC_KEYS).optional(),
    mediaId: z.uuid().optional(),
    url: z.string().trim().max(1000).optional(),
    alt: z.string().trim().max(300).optional(),
    caption: z.string().trim().max(200).optional(),
    position: z
      .string()
      .trim()
      .max(20)
      .refine((v) => v === "" || /^\d{1,3}% \d{1,3}%$/.test(v), "Framing must look like “50% 50%”.")
      .optional(),
  })
  .refine((v) => !v.url || (v.mediaId && v.url.startsWith(mediaPrefix())), "Choose images from the media library.");

const text = (max = 2000) => z.string().trim().max(max);
const required = (s: z.ZodString, label: string) => s.min(1, `${label} is required.`);

function fieldSchema(field: Field): z.ZodType {
  switch (field.type) {
    case "text": {
      let s = text(field.max ?? 300);
      if (field.pattern) s = s.regex(new RegExp(field.pattern), `${field.label} has an invalid format.`);
      return field.required ? required(s, field.label) : s;
    }
    case "textarea": {
      const s = text(field.max ?? 4000);
      return field.required ? required(s, field.label) : s;
    }
    case "headline": {
      const s = text(600);
      return field.required ? required(s, field.label) : s;
    }
    case "url":
      return field.required ? hrefSchema.refine((v) => v !== "", `${field.label} is required.`) : hrefSchema;
    case "slug":
      return z
        .string()
        .trim()
        .toLowerCase()
        .max(120)
        .refine((v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Use lower-case letters, digits and hyphens.");
    case "email":
      return z.union([z.literal(""), z.email().max(200)]);
    case "lines":
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
    case "list": {
      let a = z.array(objectSchema(field.fields));
      if (field.min !== undefined) a = a.min(field.min, `${field.label}: at least ${field.min} required.`);
      if (field.max !== undefined) a = a.max(field.max, `${field.label}: at most ${field.max} allowed.`);
      return a;
    }
  }
}

export function objectSchema(fields: Field[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

/** First human-readable validation message. */
export function firstIssue(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Invalid input.";
  const path = issue.path.filter((p) => typeof p === "string").join(" › ");
  return path && !issue.message.includes("required") ? `${path}: ${issue.message}` : issue.message;
}
