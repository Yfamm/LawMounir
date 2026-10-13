/**
 * CMS content model (bilingual). Pure types — safe on client, server and in
 * scripts. Every visitor-facing string is an `L` ({ en, ar }); lists are `LL`.
 *
 * Text conventions used by editors:
 * - Display headlines: one line per row; wrap words in *asterisks* to set
 *   them in the gold italic.
 * - Body text: paragraphs separated by a blank line.
 * - Links: site paths are written without a language ("/contact"); the
 *   site adds /ar or /en automatically.
 */
import type { L, LL } from "@/lib/i18n";

export type { L, LL };

/** Keys of the six architectural plates plus the hero photograph. */
export type StaticImageKey =
  | "hero"
  | "hallAisle"
  | "hallAislePortrait"
  | "hallRows"
  | "colonnade"
  | "colonnadeDetail"
  | "mashrabiya";

/**
 * Reference to an image: one of the built-in plates, or an uploaded image
 * from the media library. Alt text and caption override the image's own.
 */
export type ImageRef = {
  plate?: StaticImageKey;
  mediaId?: string;
  url?: string;
  alt?: L;
  caption?: L;
  /** CSS object-position used to frame the image, e.g. "62% 45%". */
  position?: string;
};

/** Review flags per language; "needs_review" marks an unreviewed translation. */
export type TranslationFlags = Partial<Record<"ar" | "en", "needs_review" | "reviewed">>;

export type Link = { text: L; url: string };

export type SocialLink = { label: L; url: string };

export type SiteSettings = {
  /** Brand name used in running text and titles (e.g. DIWAN / ديوان). */
  brandName: L;
  /** Latin wordmark set in the logo lockup in both languages. */
  wordmark: string;
  /** Lockup descriptor: English descriptor / full Arabic firm name. */
  firmName: L;
  city: L;
  location: L;
  browserTitle: L;
  description: L;
  defaultSeoDescription: L;
  /** Canonical origin. Empty = NEXT_PUBLIC_SITE_URL. */
  canonicalUrl: string;
  defaultLanguage: "ar" | "en";
  email: string;
  phone: string;
  whatsapp: string;
  address: LL;
  hours: L;
  social: SocialLink[];
  footerDescription: L;
  copyright: L;
  disclaimer: L;
  navCta: Link;
  /** Optional logo image replacing the typographic wordmark. */
  logo: ImageRef;
  /** Optional favicon (square PNG recommended). */
  favicon: ImageRef;
  /** Default social sharing image. */
  shareImage: ImageRef;
  _translation?: TranslationFlags;
};

export type NavItem = { id?: string; label: L; href: string; visible: boolean; sortOrder: number };

type Base = { _translation?: TranslationFlags };

export type HomeLayout = {
  /** Order of the movable homepage sections. Hero is always first, contact always last. */
  order: HomeSectionId[];
  hidden: HomeSectionId[];
};

export type HomeSectionId = "intro" | "practice" | "landscape" | "values" | "experience" | "people" | "insights";

export type HomeHero = Base & {
  eyebrow: L;
  headline: L;
  supporting: L;
  primary: Link;
  secondary: Link;
  image: ImageRef;
};

export type HomeIntro = Base & {
  label: L;
  statement: L;
  body: L;
  image: ImageRef;
  cta: Link;
};

export type HomePractice = Base & { label: L; title: L; intro: L; note: L; cta: Link };

export type HomeLandscape = Base & {
  label: L;
  /** Exactly three statements play through the pinned stage; pillars follow the last. */
  frames: { text: L }[];
  pillars: { title: L; text: L }[];
  image: ImageRef;
};

export type HomeValues = Base & { label: L; title: L; intro: L; image: ImageRef };

export type ExperienceMovement = {
  number: string;
  label: L;
  title: L;
  text: L;
  items: LL;
  /** When true, the list shows the published practice-area titles instead of `items`. */
  autoPracticeAreas: boolean;
};

export type HomeExperience = Base & {
  label: L;
  title: L;
  intro: L;
  hint: L;
  image: ImageRef;
  movements: ExperienceMovement[];
};

export type HomePeople = Base & { label: L; title: L; intro: L; cta: Link; selected: string[] };
export type HomeInsights = Base & { label: L; title: L; intro: L; cta: Link; selected: string[] };

export type ContactContent = Base & {
  label: L;
  title: L;
  description: L;
  submitText: L;
  notice: L;
  successTitle: L;
  successText: L;
  image: ImageRef;
};

export type AboutLayout = "header" | "story" | "values" | "statement";

export type AboutBlock = {
  id: string;
  layout: AboutLayout;
  enabled: boolean;
  label: L;
  title: L;
  body: L;
  image: ImageRef;
};

export type AboutContent = Base & { blocks: AboutBlock[] };

export type IndexPage = Base & { label: L; title: L; intro: L; image: ImageRef };

export type ContactPage = Base & {
  label: L;
  title: L;
  steps: { title: L; text: L }[];
};

export type PageMeta = { title: L; description: L };

export type SeoPages = Base & {
  home: PageMeta;
  about: PageMeta;
  practice: PageMeta;
  people: PageMeta;
  insights: PageMeta;
  contact: PageMeta;
};

/** Interface text (buttons, labels, messages). Keys are fixed; values are editable. */
export type UiStrings = Base & { strings: Record<string, L> };

export type SectionMap = {
  "home.layout": HomeLayout;
  "home.hero": HomeHero;
  "home.intro": HomeIntro;
  "home.practice": HomePractice;
  "home.landscape": HomeLandscape;
  "home.values": HomeValues;
  "home.experience": HomeExperience;
  "home.people": HomePeople;
  "home.insights": HomeInsights;
  "home.contact": ContactContent;
  "about.blocks": AboutContent;
  "practice.index": IndexPage;
  "people.index": IndexPage;
  "insights.index": IndexPage;
  "contact.page": ContactPage;
  "seo.pages": SeoPages;
  "ui.strings": UiStrings;
};

export type SectionKey = keyof SectionMap;

export type FirmValue = {
  id?: string;
  title: L;
  body: L;
  published: boolean;
  sortOrder: number;
  translations: TranslationFlags;
};

export type PracticeAreaRecord = {
  id?: string;
  slug: string;
  title: L;
  summary: L;
  overview: L;
  scope: LL;
  forums: LL;
  image: ImageRef;
  seoTitle: L;
  seoDescription: L;
  published: boolean;
  sortOrder: number;
  sources: string[];
  verify: string[];
  translations: TranslationFlags;
};

export type PersonRecord = {
  id?: string;
  name: L;
  title: L;
  practice: L;
  bioShort: L;
  bioFull: L;
  portrait: ImageRef;
  education: L;
  languages: L;
  admission: L;
  published: boolean;
  sortOrder: number;
  translations: TranslationFlags;
};

export type InsightStatus = "draft" | "review" | "published";

export type InsightRecord = {
  id?: string;
  slug: string;
  title: L;
  excerpt: L;
  /** Body text: blank-line paragraphs, "## " headings, "> " quotes, "- " list items. */
  body: L;
  author: L;
  cover: ImageRef;
  category: L;
  publishedOn: string | null;
  readingTime: L;
  seoTitle: L;
  seoDescription: L;
  status: InsightStatus;
  legalReview: "pending" | "approved";
  verify: string[];
  sortOrder: number;
  translations: TranslationFlags;
};
