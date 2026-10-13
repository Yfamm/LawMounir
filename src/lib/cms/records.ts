/**
 * Mapping between database rows and bilingual CMS records. Unsuffixed text
 * columns hold English; *_ar columns hold Arabic (see the bilingual
 * migration). Shared by the repository, the admin actions and the scripts.
 */
import type { CollectionKey } from "./fields";
import { normalizeImage } from "./normalize";
import type { FirmValue, InsightRecord, L, LL, NavItem, PersonRecord, PracticeAreaRecord, TranslationFlags } from "./types";

type Row = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const loc = (r: Row, en: string, ar: string): L => ({ en: str(r[en]), ar: str(r[ar]) });
const locList = (r: Row, en: string, ar: string): LL => ({ en: arr(r[en]), ar: arr(r[ar]) });
const flags = (v: unknown): TranslationFlags => {
  const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  const ok = (x: unknown) => (x === "needs_review" || x === "reviewed" ? x : undefined);
  const out: TranslationFlags = {};
  if (ok(o.ar)) out.ar = ok(o.ar);
  if (ok(o.en)) out.en = ok(o.en);
  return out;
};

export const tables: Record<CollectionKey, string> = {
  values: "firm_values",
  navigation: "navigation_items",
  practice: "practice_areas",
  people: "people",
  insights: "insights",
};

export const valueFromRow = (r: Row): FirmValue => ({
  id: str(r.id),
  title: loc(r, "title_en", "title_ar"),
  body: loc(r, "body_en", "body_ar"),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
  translations: flags(r.translations),
});

export const valueToRow = (v: Omit<FirmValue, "id" | "sortOrder">) => ({
  title_en: v.title.en,
  title_ar: v.title.ar,
  body_en: v.body.en,
  body_ar: v.body.ar,
  published: v.published,
  translations: v.translations ?? {},
});

export const navFromRow = (r: Row): NavItem => ({
  id: str(r.id),
  label: loc(r, "label", "label_ar"),
  href: str(r.href),
  visible: Boolean(r.visible),
  sortOrder: Number(r.sort_order ?? 0),
});

/** The DB requires a non-empty English label; Arabic-only labels are mirrored into it. */
export const navToRow = (v: Omit<NavItem, "id" | "sortOrder">) => ({
  label: v.label.en || v.label.ar,
  label_ar: v.label.ar,
  href: v.href,
  visible: v.visible,
});

export const practiceFromRow = (r: Row): PracticeAreaRecord => ({
  id: str(r.id),
  slug: str(r.slug),
  title: loc(r, "title", "title_ar"),
  summary: loc(r, "summary", "summary_ar"),
  overview: loc(r, "overview", "overview_ar"),
  scope: locList(r, "scope", "scope_ar"),
  forums: locList(r, "forums", "forums_ar"),
  image: normalizeImage(r.image),
  seoTitle: loc(r, "seo_title", "seo_title_ar"),
  seoDescription: loc(r, "seo_description", "seo_description_ar"),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
  sources: arr(r.sources),
  verify: arr(r.verify),
  translations: flags(r.translations),
});

export const practiceToRow = (v: Omit<PracticeAreaRecord, "id" | "sortOrder" | "sources"> & { sources?: string[] }) => ({
  slug: v.slug,
  title: v.title.en || v.title.ar,
  title_ar: v.title.ar,
  summary: v.summary.en,
  summary_ar: v.summary.ar,
  overview: v.overview.en,
  overview_ar: v.overview.ar,
  scope: v.scope.en,
  scope_ar: v.scope.ar,
  forums: v.forums.en,
  forums_ar: v.forums.ar,
  image: v.image,
  seo_title: v.seoTitle.en,
  seo_title_ar: v.seoTitle.ar,
  seo_description: v.seoDescription.en,
  seo_description_ar: v.seoDescription.ar,
  published: v.published,
  verify: v.verify,
  translations: v.translations ?? {},
  ...(v.sources ? { sources: v.sources } : {}),
});

export const personFromRow = (r: Row): PersonRecord => ({
  id: str(r.id),
  name: loc(r, "name_en", "name_ar"),
  title: loc(r, "title_en", "title_ar"),
  practice: loc(r, "practice", "practice_ar"),
  bioShort: loc(r, "bio_short", "bio_short_ar"),
  bioFull: loc(r, "bio_full", "bio_full_ar"),
  portrait: normalizeImage(r.portrait),
  education: loc(r, "education", "education_ar"),
  languages: loc(r, "languages", "languages_ar"),
  admission: loc(r, "admission", "admission_ar"),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
  translations: flags(r.translations),
});

export const personToRow = (v: Omit<PersonRecord, "id" | "sortOrder">) => ({
  name_en: v.name.en || v.name.ar,
  name_ar: v.name.ar,
  title_en: v.title.en,
  title_ar: v.title.ar,
  practice: v.practice.en,
  practice_ar: v.practice.ar,
  bio_short: v.bioShort.en,
  bio_short_ar: v.bioShort.ar,
  bio_full: v.bioFull.en,
  bio_full_ar: v.bioFull.ar,
  portrait: v.portrait,
  education: v.education.en,
  education_ar: v.education.ar,
  languages: v.languages.en,
  languages_ar: v.languages.ar,
  admission: v.admission.en,
  admission_ar: v.admission.ar,
  published: v.published,
  translations: v.translations ?? {},
});

export const insightFromRow = (r: Row): InsightRecord => ({
  id: str(r.id),
  slug: str(r.slug),
  title: loc(r, "title", "title_ar"),
  excerpt: loc(r, "excerpt", "excerpt_ar"),
  body: loc(r, "body", "body_ar"),
  author: loc(r, "author", "author_ar"),
  cover: normalizeImage(r.cover),
  category: loc(r, "category", "category_ar"),
  publishedOn: typeof r.published_on === "string" ? r.published_on : null,
  readingTime: loc(r, "reading_time", "reading_time_ar"),
  seoTitle: loc(r, "seo_title", "seo_title_ar"),
  seoDescription: loc(r, "seo_description", "seo_description_ar"),
  status: r.status === "published" ? "published" : r.status === "review" ? "review" : "draft",
  legalReview: r.legal_review === "approved" ? "approved" : "pending",
  verify: arr(r.verify),
  sortOrder: Number(r.sort_order ?? 0),
  translations: flags(r.translations),
});

export const insightToRow = (v: Omit<InsightRecord, "id" | "sortOrder">) => ({
  slug: v.slug,
  title: v.title.en || v.title.ar,
  title_ar: v.title.ar,
  excerpt: v.excerpt.en,
  excerpt_ar: v.excerpt.ar,
  body: v.body.en,
  body_ar: v.body.ar,
  author: v.author.en,
  author_ar: v.author.ar,
  cover: v.cover,
  category: v.category.en || v.category.ar || "Legal Updates",
  category_ar: v.category.ar,
  published_on: v.publishedOn,
  reading_time: v.readingTime.en,
  reading_time_ar: v.readingTime.ar,
  seo_title: v.seoTitle.en,
  seo_title_ar: v.seoTitle.ar,
  seo_description: v.seoDescription.en,
  seo_description_ar: v.seoDescription.ar,
  status: v.status,
  legal_review: v.legalReview,
  verify: v.verify,
  translations: v.translations ?? {},
});

export const fromRow = {
  values: valueFromRow,
  navigation: navFromRow,
  practice: practiceFromRow,
  people: personFromRow,
  insights: insightFromRow,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toRow: Record<CollectionKey, (v: any) => Row> = {
  values: valueToRow,
  navigation: navToRow,
  practice: practiceToRow,
  people: personToRow,
  insights: insightToRow,
};

/** Converts a title into a URL slug (Latin letters; Arabic-only titles need a slug typed by hand). */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
