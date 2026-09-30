import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import {
  defaultInsightCategories,
  defaultInsights,
  defaultNavigation,
  defaultPeople,
  defaultPracticeAreas,
  defaultSections,
  defaultSettings,
  defaultValues,
} from "./defaults";
import { resolveImage, type ResolvedImage } from "./images";
import { insightFromRow, navFromRow, personFromRow, practiceFromRow, valueFromRow } from "./records";
import { isPlaceholder, pad2, parseBody, type BodyBlock } from "./text";
import type {
  AboutBlock,
  FirmValue,
  InsightRecord,
  NavItem,
  PersonRecord,
  PracticeAreaRecord,
  SectionKey,
  SectionMap,
  SiteSettings,
} from "./types";

/**
 * Public read model. Supabase → these functions → pages → presentation
 * components. Reads use the anonymous client, so row-level security only
 * ever returns published content.
 *
 * Fallback: if Supabase is not configured, unreachable, or has not been
 * seeded (no site_settings row), every function returns the DIWAN source
 * content from defaults.ts. Once seeded, the database is authoritative —
 * an empty collection stays empty. Errors are logged on the server and
 * never shown to visitors.
 */

type Rows = Record<string, unknown>[];

type Snapshot = {
  live: boolean;
  settings: SiteSettings;
  sections: Partial<Record<string, unknown>>;
  nav: NavItem[];
  values: FirmValue[];
  practice: PracticeAreaRecord[];
  people: PersonRecord[];
  insights: InsightRecord[];
};

const fallback: Snapshot = {
  live: false,
  settings: defaultSettings,
  sections: {},
  nav: defaultNavigation,
  values: defaultValues,
  practice: defaultPracticeAreas,
  people: defaultPeople,
  insights: defaultInsights,
};

/** Loads every public table once per request (and once per static render). */
const snapshot = cache(async (): Promise<Snapshot> => {
  const db = publicClient();
  if (!db) return fallback;
  try {
    const [settings, sections, nav, values, practice, people, insights] = await Promise.all([
      db.from("site_settings").select("data").eq("id", 1).maybeSingle(),
      db.from("page_sections").select("key, data"),
      db.from("navigation_items").select("*").order("sort_order").order("created_at"),
      db.from("firm_values").select("*").order("sort_order").order("created_at"),
      db.from("practice_areas").select("*").order("sort_order").order("created_at"),
      db.from("people").select("*").order("sort_order").order("created_at"),
      db
        .from("insights")
        .select("*")
        .order("sort_order")
        .order("published_on", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }),
    ]);
    const failed = [settings, sections, nav, values, practice, people, insights].find((r) => r.error);
    if (failed?.error) throw failed.error;
    if (!settings.data) return fallback; // not seeded yet

    return {
      live: true,
      settings: { ...defaultSettings, ...(settings.data.data as Partial<SiteSettings>) },
      sections: Object.fromEntries(((sections.data ?? []) as Rows).map((r) => [String(r.key), r.data])),
      nav: ((nav.data ?? []) as Rows).map(navFromRow).filter((n) => n.visible),
      values: ((values.data ?? []) as Rows).map(valueFromRow).filter((v) => v.published),
      practice: ((practice.data ?? []) as Rows).map(practiceFromRow).filter((p) => p.published),
      people: ((people.data ?? []) as Rows).map(personFromRow).filter((p) => p.published),
      insights: ((insights.data ?? []) as Rows).map(insightFromRow).filter((i) => i.status === "published"),
    };
  } catch (error) {
    const message = error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
    console.error(`[cms] database unavailable, showing source content: ${message}`);
    return fallback;
  }
});

/* ------------------------------------------------------------------ site */

export type SiteView = SiteSettings & {
  phoneHref: string | null;
  emailHref: string | null;
  whatsappHref: string | null;
  url: string;
};

export type SiteContextValue = {
  site: SiteView;
  nav: { label: string; href: string }[];
  practiceLinks: { slug: string; title: string }[];
};

const envUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export function siteView(s: SiteSettings): SiteView {
  const phone = s.phone.trim();
  const email = s.email.trim();
  const whatsapp = s.whatsapp.trim();
  return {
    ...s,
    phoneHref: isPlaceholder(phone) ? null : `tel:${phone.replace(/[^\d+]/g, "")}`,
    emailHref: isPlaceholder(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : `mailto:${email}`,
    whatsappHref: isPlaceholder(whatsapp) ? null : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`,
    url: (/^https?:\/\//.test(s.canonicalUrl.trim()) ? s.canonicalUrl.trim() : envUrl()).replace(/\/$/, ""),
  };
}

export const getSite = cache(async (): Promise<SiteView> => siteView((await snapshot()).settings));

export const getSiteContext = cache(async (): Promise<SiteContextValue> => {
  const snap = await snapshot();
  return {
    site: siteView(snap.settings),
    nav: snap.nav.map(({ label, href }) => ({ label, href })),
    practiceLinks: snap.practice.map(({ slug, title }) => ({ slug, title })),
  };
});

/* -------------------------------------------------------------- sections */

/** A page section, with any field missing from the stored JSON filled from the source content. */
export async function getSection<K extends SectionKey>(key: K): Promise<SectionMap[K]> {
  const stored = (await snapshot()).sections[key];
  const base = defaultSections[key];
  if (!stored || typeof stored !== "object") return base;
  return { ...base, ...(stored as Partial<SectionMap[K]>) };
}

export async function getAbout(): Promise<Record<"vision" | "who" | "values" | "mission", AboutBlock>> {
  const [vision, who, values, mission] = await Promise.all([
    getSection("about.vision"),
    getSection("about.who"),
    getSection("about.values"),
    getSection("about.mission"),
  ]);
  return { vision, who, values, mission };
}

export async function getValues() {
  return (await snapshot()).values.map((v, i) => ({
    numeral: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][i] ?? String(i + 1),
    title: v.titleEn,
    titleAr: v.titleAr,
    text: v.bodyEn,
    textAr: v.bodyAr,
  }));
}

export type ValueView = Awaited<ReturnType<typeof getValues>>[number];

/* ---------------------------------------------------------------- practice */

export type PracticeAreaView = {
  slug: string;
  number: string;
  title: string;
  titleAr: string;
  summary: string;
  overview: string;
  scope: string[];
  forums: string[];
  image: ResolvedImage;
  seoTitle: string;
  seoDescription: string;
};

export const getPracticeAreas = cache(async (): Promise<PracticeAreaView[]> =>
  (await snapshot()).practice.map((a, i) => ({
    slug: a.slug,
    number: pad2(i + 1),
    title: a.title,
    titleAr: a.titleAr,
    summary: a.summary,
    overview: a.overview,
    scope: a.scope,
    forums: a.forums,
    image: resolveImage(a.image, "colonnade"),
    seoTitle: a.seoTitle || a.title,
    seoDescription: a.seoDescription || a.summary,
  })),
);

export async function getPracticeArea(slug: string) {
  return (await getPracticeAreas()).find((a) => a.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ people */

export type PersonView = {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  practice: string;
  bio: string;
  bioFull: string;
  education: string;
  languages: string;
  admission: string;
  image?: string;
  imageAlt?: string;
};

export const getPeople = cache(async (): Promise<PersonView[]> =>
  (await snapshot()).people.map((p, i) => ({
    id: p.id || `person-${i}`,
    name: p.nameEn,
    nameAr: p.nameAr,
    role: p.titleEn,
    roleAr: p.titleAr,
    practice: p.practice,
    bio: p.bioShort,
    bioFull: p.bioFull,
    education: p.education,
    languages: p.languages,
    admission: p.admission,
    image: p.portrait.mediaId && p.portrait.url ? p.portrait.url : undefined,
    imageAlt: p.portrait.alt || undefined,
  })),
);

/* ---------------------------------------------------------------- insights */

export type InsightView = {
  slug: string;
  issue: string;
  title: string;
  titleAr: string;
  standfirst: string;
  standfirstAr: string;
  category: string;
  date: string | null;
  readingTime: string;
  author: string;
  cover: ResolvedImage;
  body: BodyBlock[];
  reviewed: boolean;
  seoTitle: string;
  seoDescription: string;
};

export const getInsights = cache(async (): Promise<InsightView[]> =>
  (await snapshot()).insights.map((n, i) => ({
    slug: n.slug,
    issue: pad2(i + 1),
    title: n.title,
    titleAr: n.titleAr,
    standfirst: n.excerpt,
    standfirstAr: n.excerptAr,
    category: n.category,
    date: n.publishedOn,
    readingTime: n.readingTime,
    author: n.author,
    cover: resolveImage(n.cover, "colonnade"),
    body: parseBody(n.body),
    reviewed: n.legalReview === "approved",
    seoTitle: n.seoTitle || n.title,
    seoDescription: n.seoDescription || n.excerpt,
  })),
);

export async function getInsight(slug: string) {
  return (await getInsights()).find((n) => n.slug === slug) ?? null;
}

export async function getInsightCategories() {
  const used = (await getInsights()).map((n) => n.category);
  return [...new Set([...defaultInsightCategories, ...used])];
}

/** Items chosen for a home-page preview, in the chosen order; defaults to the first three. */
export function pick<T>(all: T[], selected: string[], keyOf: (item: T) => string, count = 3): T[] {
  const chosen = selected.map((k) => all.find((item) => keyOf(item) === k)).filter((x): x is T => Boolean(x));
  return chosen.length ? chosen : all.slice(0, count);
}
