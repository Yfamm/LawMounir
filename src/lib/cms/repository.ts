import "server-only";
import { cache } from "react";
import { localizeHref, other, pickL, tr, trList, type L, type Lang } from "@/lib/i18n";
import { publicClient } from "@/lib/supabase/public";
import { defaultInsights, defaultNavigation, defaultPeople, defaultPracticeAreas, defaultSettings, defaultValues, defaultInsightCategories } from "./defaults";
import { resolveImage, type MediaMap, type ResolvedImage } from "./images";
import { normalizeSection, normalizeSettings } from "./normalize";
import { insightFromRow, navFromRow, personFromRow, practiceFromRow, valueFromRow } from "./records";
import { isPlaceholder, pad2, paragraphs, parseBody, plain, type BodyBlock } from "./text";
import { defaultUi, type UiKey } from "./ui";
import type {
  FirmValue,
  ImageRef,
  InsightRecord,
  Link,
  NavItem,
  PersonRecord,
  PracticeAreaRecord,
  SectionKey,
  SectionMap,
  SiteSettings,
  StaticImageKey,
} from "./types";

/**
 * Public read model. Supabase → these functions → pages → presentation
 * components. Reads use the anonymous client, so row-level security only
 * ever returns published content. Every getter takes the page language and
 * returns ready-to-render strings; a missing translation falls back to the
 * other language (never a blank page or a raw key).
 *
 * Fallback: if Supabase is not configured, unreachable, or not seeded (no
 * site_settings row), the DIWAN source content in defaults.ts is used. Once
 * seeded, the database is authoritative — an empty collection stays empty.
 */

type Rows = Record<string, unknown>[];

type Snapshot = {
  live: boolean;
  settings: SiteSettings;
  sections: Record<string, unknown>;
  nav: NavItem[];
  values: FirmValue[];
  practice: PracticeAreaRecord[];
  people: PersonRecord[];
  insights: InsightRecord[];
  media: MediaMap;
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
  media: new Map(),
};

/** Loads every public table once per request (and once per static render). */
const snapshot = cache(async (): Promise<Snapshot> => {
  const db = publicClient();
  if (!db) return fallback;
  try {
    const [settings, sections, nav, values, practice, people, insights, media] = await Promise.all([
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
      db.from("media").select("id, url, alt, alt_ar, caption, caption_ar"),
    ]);
    const failed = [settings, sections, nav, values, practice, people, insights, media].find((r) => r.error);
    if (failed?.error) throw failed.error;
    if (!settings.data) return fallback; // not seeded yet

    return {
      live: true,
      settings: normalizeSettings(settings.data.data),
      sections: Object.fromEntries(((sections.data ?? []) as Rows).map((r) => [String(r.key), r.data])),
      nav: ((nav.data ?? []) as Rows).map(navFromRow).filter((n) => n.visible),
      values: ((values.data ?? []) as Rows).map(valueFromRow).filter((v) => v.published),
      practice: ((practice.data ?? []) as Rows).map(practiceFromRow).filter((p) => p.published),
      people: ((people.data ?? []) as Rows).map(personFromRow).filter((p) => p.published),
      insights: ((insights.data ?? []) as Rows).map(insightFromRow).filter((i) => i.status === "published"),
      media: new Map(
        ((media.data ?? []) as Rows).map((m) => [
          String(m.id),
          {
            url: String(m.url),
            alt: { en: String(m.alt ?? ""), ar: String(m.alt_ar ?? "") },
            caption: { en: String(m.caption ?? ""), ar: String(m.caption_ar ?? "") },
          },
        ]),
      ),
    };
  } catch (error) {
    const message = error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
    console.error(`[cms] database unavailable, showing source content: ${message}`);
    return fallback;
  }
});

/** A page section in the current bilingual shape. */
export async function getSection<K extends SectionKey>(key: K): Promise<SectionMap[K]> {
  return normalizeSection(key, (await snapshot()).sections);
}

export async function image(ref: ImageRef | undefined, fallbackPlate: StaticImageKey, lang: Lang): Promise<ResolvedImage> {
  return resolveImage(ref, fallbackPlate, lang, (await snapshot()).media);
}

/* --------------------------------------------------------------- interface text */

export type Ui = Record<UiKey, string>;

export const getUi = cache(async (lang: Lang): Promise<Ui> => {
  const stored = (await getSection("ui.strings")).strings as Record<string, L>;
  return Object.fromEntries(Object.keys(defaultUi).map((k) => [k, tr(stored[k] ?? defaultUi[k as UiKey], lang)])) as Ui;
});

/* ------------------------------------------------------------------ site */

export type LinkView = { text: string; href: string };

export function linkView(link: Link | undefined, lang: Lang): LinkView | undefined {
  const text = link ? tr(link.text, lang) : "";
  return text && link?.url ? { text, href: localizeHref(link.url, lang) } : undefined;
}

export type SiteView = {
  lang: Lang;
  brandName: string;
  wordmark: string;
  firmName: string;
  /** Firm name in the other language, for the bilingual logo lockup. */
  firmNameOther: string;
  city: string;
  location: string;
  browserTitle: string;
  description: string;
  defaultSeoDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  phoneHref: string | null;
  emailHref: string | null;
  whatsappHref: string | null;
  address: string[];
  hours: string;
  social: { label: string; url: string }[];
  footerDescription: string;
  copyright: string;
  disclaimer: string;
  navCta?: LinkView;
  logo: { src: string; alt: string } | null;
  favicon: string | null;
  shareImage: string | null;
  url: string;
  defaultLanguage: Lang;
};

export type SiteContextValue = {
  lang: Lang;
  site: SiteView;
  nav: { label: string; href: string }[];
  practiceLinks: { slug: string; title: string; href: string }[];
  ui: Ui;
};

const envUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

function placeholderAr(value: string, ar: string, lang: Lang) {
  return lang === "ar" && isPlaceholder(value) ? ar : value;
}

export function siteView(s: SiteSettings, lang: Lang, media: MediaMap = new Map()): SiteView {
  const phone = s.phone.trim();
  const email = s.email.trim();
  const whatsapp = s.whatsapp.trim();
  const mediaUrl = (ref: ImageRef) => (ref.mediaId ? (media.get(ref.mediaId)?.url ?? ref.url ?? null) : null);
  const logoUrl = mediaUrl(s.logo);
  return {
    lang,
    brandName: tr(s.brandName, lang),
    wordmark: s.wordmark,
    firmName: tr(s.firmName, lang),
    firmNameOther: tr(s.firmName, other(lang)),
    city: tr(s.city, lang),
    location: tr(s.location, lang),
    browserTitle: tr(s.browserTitle, lang),
    description: tr(s.description, lang),
    defaultSeoDescription: tr(s.defaultSeoDescription, lang) || tr(s.description, lang),
    email: placeholderAr(email, "[البريد الإلكتروني]", lang),
    phone: placeholderAr(phone, "[رقم الهاتف]", lang),
    whatsapp: placeholderAr(whatsapp, "[رقم واتساب]", lang),
    phoneHref: isPlaceholder(phone) ? null : `tel:${phone.replace(/[^\d+]/g, "")}`,
    emailHref: isPlaceholder(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : `mailto:${email}`,
    whatsappHref: isPlaceholder(whatsapp) ? null : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`,
    address: trList(s.address, lang),
    hours: tr(s.hours, lang),
    social: s.social.map((l) => ({ label: tr(l.label, lang), url: l.url })).filter((l) => l.label && l.url),
    footerDescription: tr(s.footerDescription, lang),
    copyright: tr(s.copyright, lang),
    disclaimer: tr(s.disclaimer, lang),
    navCta: linkView(s.navCta, lang),
    logo: logoUrl ? { src: logoUrl, alt: tr(s.logo.alt, lang) || tr(s.brandName, lang) } : null,
    favicon: mediaUrl(s.favicon),
    shareImage: mediaUrl(s.shareImage),
    url: (/^https?:\/\//.test(s.canonicalUrl.trim()) ? s.canonicalUrl.trim() : envUrl()).replace(/\/$/, ""),
    defaultLanguage: s.defaultLanguage,
  };
}

export const getSite = cache(async (lang: Lang): Promise<SiteView> => {
  const snap = await snapshot();
  return siteView(snap.settings, lang, snap.media);
});

/** Settings needed by the proxy and robots, language-independent. */
export async function getDefaultLanguage(): Promise<Lang> {
  return (await snapshot()).settings.defaultLanguage;
}

export const getSiteContext = cache(async (lang: Lang): Promise<SiteContextValue> => {
  const snap = await snapshot();
  return {
    lang,
    site: siteView(snap.settings, lang, snap.media),
    nav: snap.nav.map(({ label, href }) => ({ label: tr(label, lang), href: localizeHref(href, lang) })).filter((n) => n.label),
    practiceLinks: snap.practice.map(({ slug, title }) => ({ slug, title: tr(title, lang), href: `/${lang}/practice-areas/${slug}` })),
    ui: await getUi(lang),
  };
});

/* -------------------------------------------------------------- values */

export type ValueView = { numeral: string; title: string; text: string };

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export async function getValues(lang: Lang): Promise<ValueView[]> {
  return (await snapshot()).values.map((v, i) => ({ numeral: NUMERALS[i] ?? String(i + 1), title: tr(v.title, lang), text: tr(v.body, lang) }));
}

/* ------------------------------------------------------------ practice */

export type PracticeAreaView = {
  slug: string;
  href: string;
  number: string;
  title: string;
  summary: string;
  overview: string;
  scope: string[];
  forums: string[];
  image: ResolvedImage;
  seoTitle: string;
  seoDescription: string;
};

export const getPracticeAreas = cache(async (lang: Lang): Promise<PracticeAreaView[]> => {
  const snap = await snapshot();
  return snap.practice.map((a, i) => ({
    slug: a.slug,
    href: `/${lang}/practice-areas/${a.slug}`,
    number: pad2(i + 1),
    title: tr(a.title, lang),
    summary: tr(a.summary, lang),
    overview: tr(a.overview, lang),
    scope: trList(a.scope, lang),
    forums: trList(a.forums, lang),
    image: resolveImage(a.image, "colonnade", lang, snap.media),
    seoTitle: tr(a.seoTitle, lang) || tr(a.title, lang),
    seoDescription: tr(a.seoDescription, lang) || tr(a.summary, lang),
  }));
});

/* --------------------------------------------------------------- people */

export type PersonView = {
  id: string;
  name: string;
  role: string;
  practice: string;
  bio: string;
  bioFull: string;
  education: string;
  languages: string;
  admission: string;
  image?: string;
  imageAlt?: string;
};

export const getPeople = cache(async (lang: Lang): Promise<PersonView[]> => {
  const snap = await snapshot();
  return snap.people.map((p, i) => {
    const portrait = p.portrait.mediaId ? resolveImage(p.portrait, "hallAislePortrait", lang, snap.media) : null;
    return {
      id: p.id || `person-${i}`,
      name: tr(p.name, lang),
      role: tr(p.title, lang),
      practice: tr(p.practice, lang),
      bio: tr(p.bioShort, lang),
      bioFull: tr(p.bioFull, lang),
      education: tr(p.education, lang),
      languages: tr(p.languages, lang),
      admission: tr(p.admission, lang),
      image: portrait && typeof portrait.src === "string" ? portrait.src : undefined,
      imageAlt: portrait?.alt || undefined,
    };
  });
});

/* ------------------------------------------------------------- insights */

export type InsightView = {
  slug: string;
  href: string;
  issue: string;
  title: string;
  /** Language the title/excerpt are shown in (differs from the page when untranslated). */
  titleLang: Lang;
  standfirst: string;
  category: string;
  date: string | null;
  dateLabel: string;
  readingTime: string;
  author: string;
  cover: ResolvedImage;
  body: BodyBlock[];
  bodyLang: Lang;
  /** True when the body is shown in the other language. */
  bodyFallback: boolean;
  reviewed: boolean;
  seoTitle: string;
  seoDescription: string;
};

export function formatDate(iso: string | null, lang: Lang, placeholder: string) {
  if (!iso) return placeholder;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const getInsights = cache(async (lang: Lang): Promise<InsightView[]> => {
  const snap = await snapshot();
  const ui = await getUi(lang);
  return snap.insights.map((n, i) => {
    const title = pickL(n.title, lang);
    const body = pickL(n.body, lang);
    return {
      slug: n.slug,
      href: `/${lang}/insights/${n.slug}`,
      issue: pad2(i + 1),
      title: title.text,
      titleLang: title.lang,
      standfirst: tr(n.excerpt, title.lang === lang ? lang : title.lang),
      category: tr(n.category, lang),
      date: n.publishedOn,
      dateLabel: formatDate(n.publishedOn, lang, ui.publicationDate),
      readingTime: tr(n.readingTime, lang),
      author: tr(n.author, lang),
      cover: resolveImage(n.cover, "colonnade", lang, snap.media),
      body: parseBody(body.text),
      bodyLang: body.lang,
      bodyFallback: body.fallback,
      reviewed: n.legalReview === "approved",
      seoTitle: tr(n.seoTitle, lang) || title.text,
      seoDescription: tr(n.seoDescription, lang) || tr(n.excerpt, lang),
    };
  });
});

export async function getInsightCategories(lang: Lang) {
  const used = (await getInsights(lang)).map((n) => n.category);
  return [...new Set([...defaultInsightCategories.map((c) => tr(c, lang)), ...used])].filter(Boolean);
}

/* -------------------------------------------------------------- helpers */

/** Items chosen for a home-page preview, in the chosen order; defaults to the first three. */
export function pick<T>(all: T[], selected: string[], keyOf: (item: T) => string, count = 3): T[] {
  const chosen = selected.map((k) => all.find((item) => keyOf(item) === k)).filter((x): x is T => Boolean(x));
  return chosen.length ? chosen : all.slice(0, count);
}

/** A label/heading in the page language plus its counterpart in the other language. */
export function pair(v: L | undefined, lang: Lang) {
  return { text: tr(v, lang), other: plain(v?.[other(lang)] ?? ""), otherLang: other(lang) };
}

export { paragraphs };

/** Public slugs for static generation. */
export async function getSlugs() {
  const snap = await snapshot();
  return { practice: snap.practice.map((p) => p.slug), insights: snap.insights.map((i) => i.slug) };
}

/** Heading data for an editorial section in one language. */
export function headingView(
  section: { label: L; title: L; intro?: L; cta?: Link },
  lang: Lang,
): { label: string; labelOther: string; otherLang: Lang; title: string; intro: string; cta?: LinkView } {
  return {
    label: tr(section.label, lang),
    labelOther: plain(section.label[other(lang)] ?? ""),
    otherLang: other(lang),
    title: tr(section.title, lang),
    intro: section.intro ? tr(section.intro, lang) : "",
    cta: linkView(section.cta, lang),
  };
}
