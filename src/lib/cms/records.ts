/**
 * Mapping between database rows (snake_case) and CMS records (camelCase).
 * Shared by the repository, the admin actions and the seed script.
 */
import type { CollectionKey } from "./fields";
import type { FirmValue, ImageRef, InsightRecord, NavItem, PersonRecord, PracticeAreaRecord } from "./types";

type Row = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const img = (v: unknown) => (v && typeof v === "object" ? (v as ImageRef) : {});

export const tables: Record<CollectionKey, string> = {
  values: "firm_values",
  navigation: "navigation_items",
  practice: "practice_areas",
  people: "people",
  insights: "insights",
};

export const valueFromRow = (r: Row): FirmValue => ({
  id: str(r.id),
  titleEn: str(r.title_en),
  titleAr: str(r.title_ar),
  bodyEn: str(r.body_en),
  bodyAr: str(r.body_ar),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
});

export const valueToRow = (v: Omit<FirmValue, "id" | "sortOrder">) => ({
  title_en: v.titleEn,
  title_ar: v.titleAr,
  body_en: v.bodyEn,
  body_ar: v.bodyAr,
  published: v.published,
});

export const navFromRow = (r: Row): NavItem => ({
  id: str(r.id),
  label: str(r.label),
  href: str(r.href),
  visible: Boolean(r.visible),
  sortOrder: Number(r.sort_order ?? 0),
});

export const navToRow = (v: Omit<NavItem, "id" | "sortOrder">) => ({ label: v.label, href: v.href, visible: v.visible });

export const practiceFromRow = (r: Row): PracticeAreaRecord => ({
  id: str(r.id),
  slug: str(r.slug),
  title: str(r.title),
  titleAr: str(r.title_ar),
  summary: str(r.summary),
  overview: str(r.overview),
  scope: arr(r.scope),
  forums: arr(r.forums),
  image: img(r.image),
  seoTitle: str(r.seo_title),
  seoDescription: str(r.seo_description),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
  sources: arr(r.sources),
  verify: arr(r.verify),
});

export const practiceToRow = (v: Omit<PracticeAreaRecord, "id" | "sortOrder" | "sources"> & { sources?: string[] }) => ({
  slug: v.slug,
  title: v.title,
  title_ar: v.titleAr,
  summary: v.summary,
  overview: v.overview,
  scope: v.scope,
  forums: v.forums,
  image: v.image,
  seo_title: v.seoTitle,
  seo_description: v.seoDescription,
  published: v.published,
  verify: v.verify,
  ...(v.sources ? { sources: v.sources } : {}),
});

export const personFromRow = (r: Row): PersonRecord => ({
  id: str(r.id),
  nameEn: str(r.name_en),
  nameAr: str(r.name_ar),
  titleEn: str(r.title_en),
  titleAr: str(r.title_ar),
  practice: str(r.practice),
  bioShort: str(r.bio_short),
  bioFull: str(r.bio_full),
  portrait: img(r.portrait),
  education: str(r.education),
  languages: str(r.languages),
  admission: str(r.admission),
  published: Boolean(r.published),
  sortOrder: Number(r.sort_order ?? 0),
});

export const personToRow = (v: Omit<PersonRecord, "id" | "sortOrder">) => ({
  name_en: v.nameEn,
  name_ar: v.nameAr,
  title_en: v.titleEn,
  title_ar: v.titleAr,
  practice: v.practice,
  bio_short: v.bioShort,
  bio_full: v.bioFull,
  portrait: v.portrait,
  education: v.education,
  languages: v.languages,
  admission: v.admission,
  published: v.published,
});

export const insightFromRow = (r: Row): InsightRecord => ({
  id: str(r.id),
  slug: str(r.slug),
  title: str(r.title),
  titleAr: str(r.title_ar),
  excerpt: str(r.excerpt),
  excerptAr: str(r.excerpt_ar),
  body: str(r.body),
  author: str(r.author),
  cover: img(r.cover),
  category: str(r.category),
  publishedOn: typeof r.published_on === "string" ? r.published_on : null,
  readingTime: str(r.reading_time),
  seoTitle: str(r.seo_title),
  seoDescription: str(r.seo_description),
  status: r.status === "published" ? "published" : "draft",
  legalReview: r.legal_review === "approved" ? "approved" : "pending",
  verify: arr(r.verify),
  sortOrder: Number(r.sort_order ?? 0),
});

export const insightToRow = (v: Omit<InsightRecord, "id" | "sortOrder">) => ({
  slug: v.slug,
  title: v.title,
  title_ar: v.titleAr,
  excerpt: v.excerpt,
  excerpt_ar: v.excerptAr,
  body: v.body,
  author: v.author,
  cover: v.cover,
  category: v.category,
  published_on: v.publishedOn,
  reading_time: v.readingTime,
  seo_title: v.seoTitle,
  seo_description: v.seoDescription,
  status: v.status,
  legal_review: v.legalReview,
  verify: v.verify,
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

/** Converts a title into a URL slug. */
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
