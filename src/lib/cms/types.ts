/**
 * CMS content model. Pure types — safe to import from server code, client
 * components and the seed script.
 *
 * Text conventions used by editors:
 * - Display headlines: one line per row; wrap words in *asterisks* to set
 *   them in the gold italic.
 * - Body text: paragraphs separated by a blank line.
 */

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
 * Reference to an image: one of the static plates, or an uploaded image from
 * the media library. Alt text and caption override the image's defaults.
 */
export type ImageRef = {
  plate?: StaticImageKey;
  mediaId?: string;
  url?: string;
  alt?: string;
  caption?: string;
  /** CSS object-position used to frame the image, e.g. "62% 45%". */
  position?: string;
};

export type SocialLink = { label: string; url: string };

export type SiteSettings = {
  siteName: string;
  siteNameAr: string;
  descriptor: string;
  city: string;
  location: string;
  browserTitle: string;
  description: string;
  defaultSeoDescription: string;
  /** Canonical origin. Empty = NEXT_PUBLIC_SITE_URL. */
  canonicalUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string[];
  hours: string;
  social: SocialLink[];
  footerDescription: string;
  copyright: string;
  disclaimer: string;
  navCtaText: string;
  navCtaUrl: string;
};

export type NavItem = { id?: string; label: string; href: string; visible: boolean; sortOrder: number };

export type HomeHero = {
  eyebrow: string;
  headline: string;
  headlineAr: string;
  text: string;
  textAr: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  image: ImageRef;
};

export type HomeIntro = {
  label: string;
  labelAr: string;
  statement: string;
  statementAr: string;
  body: string;
  image: ImageRef;
  ctaText: string;
  ctaUrl: string;
};

export type HomePractice = {
  label: string;
  labelAr: string;
  title: string;
  intro: string;
  note: string;
  ctaText: string;
  ctaUrl: string;
};

export type LandscapePillar = { title: string; text: string };

export type HomeLandscape = {
  label: string;
  labelAr: string;
  /** Exactly three statements play through the pinned stage; pillars follow the last. */
  frames: { text: string }[];
  pillars: LandscapePillar[];
  image: ImageRef;
};

export type HomeValues = {
  label: string;
  labelAr: string;
  title: string;
  intro: string;
  image: ImageRef;
};

export type ExperienceMovement = {
  number: string;
  label: string;
  title: string;
  text: string;
  items: string[];
  /** When true, the list shows the published practice-area titles instead of `items`. */
  autoPracticeAreas: boolean;
};

export type HomeExperience = {
  label: string;
  labelAr: string;
  title: string;
  intro: string;
  hint: string;
  image: ImageRef;
  movements: ExperienceMovement[];
};

export type HomePeople = {
  label: string;
  labelAr: string;
  title: string;
  intro: string;
  ctaText: string;
  ctaUrl: string;
  /** Person ids in display order; empty = the first three published. */
  selected: string[];
};

export type HomeInsights = {
  label: string;
  labelAr: string;
  title: string;
  intro: string;
  ctaText: string;
  ctaUrl: string;
  /** Insight slugs in display order; empty = the first three published. */
  selected: string[];
};

export type ContactContent = {
  label: string;
  labelAr: string;
  title: string;
  description: string;
  submitText: string;
  notice: string;
  successTitle: string;
  successText: string;
};

export type AboutBlock = {
  enabled: boolean;
  label: string;
  /** Arabic title, set at the end of the label rule. */
  titleAr: string;
  /** English display title. */
  title: string;
  bodyEn: string;
  bodyAr: string;
  image: ImageRef;
};

export type SectionMap = {
  "home.hero": HomeHero;
  "home.intro": HomeIntro;
  "home.practice": HomePractice;
  "home.landscape": HomeLandscape;
  "home.values": HomeValues;
  "home.experience": HomeExperience;
  "home.people": HomePeople;
  "home.insights": HomeInsights;
  "home.contact": ContactContent;
  "about.vision": AboutBlock;
  "about.who": AboutBlock;
  "about.values": AboutBlock;
  "about.mission": AboutBlock;
};

export type SectionKey = keyof SectionMap;

export type FirmValue = {
  id?: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  published: boolean;
  sortOrder: number;
};

export type PracticeAreaRecord = {
  id?: string;
  slug: string;
  title: string;
  titleAr: string;
  summary: string;
  overview: string;
  scope: string[];
  forums: string[];
  image: ImageRef;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sortOrder: number;
  sources: string[];
  verify: string[];
};

export type PersonRecord = {
  id?: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  practice: string;
  bioShort: string;
  bioFull: string;
  portrait: ImageRef;
  education: string;
  languages: string;
  admission: string;
  published: boolean;
  sortOrder: number;
};

export type InsightRecord = {
  id?: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  /** Plain-text body: blank-line paragraphs, "## " headings, "> " quotes, "- " list items. */
  body: string;
  author: string;
  cover: ImageRef;
  category: string;
  publishedOn: string | null;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  legalReview: "pending" | "approved";
  verify: string[];
  sortOrder: number;
};
