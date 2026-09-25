/**
 * Firm-wide details used across navigation, footer, contact, metadata and
 * the page-transition curtain.
 *
 * Sources (see sources.ts): the Arabic name and the Kafr el Sheikh location
 * come from the firm's public Facebook page; the English wordmark and
 * subtitle are a branding choice from the client brief. Values in square
 * brackets are placeholders awaiting confirmed details — never replace them
 * with assumed information. See CONTENT_CHECKLIST.md.
 */

/** True while a value is still a "[PLACEHOLDER]". */
export function isPlaceholder(value: string | null | undefined) {
  return !value || /^\[.*\]$/.test(value.trim());
}

const phone = "[PHONE]";
const email = "[EMAIL]";

export const site = {
  /**
   * English visual wordmark (client brief). Not an official registered
   * English name — do not present it as one.
   */
  name: "DIWAN",
  /** Name used in metadata and the copyright line. */
  legalName: "DIWAN",
  /** Descriptive subtitle for the wordmark (client brief). */
  descriptor: "Law & Legal Consultancy",
  /**
   * Arabic firm identity, exactly as the public Facebook page writes it.
   * VERIFY (source spelling): "المحاماه" (ه rather than ة) and "الأستشارات"
   * (أ rather than ا) — the introduction document uses "المحاماة والاستشارات".
   * The firm must confirm the final Arabic spelling before launch.
   */
  nameAr: "ديوان للمحاماه والأستشارات القانونية",
  /** Confirmed location (Facebook page). */
  city: "Kafr el Sheikh",
  cityAr: "كفر الشيخ",
  /** Location line shown as a typographic detail in the hero and footer. Exact office coordinates are not supplied. */
  location: "Kafr el Sheikh — Egypt",
  /** Public website domain. PLACEHOLDER. */
  website: "[WEBSITE]",
  /**
   * Canonical origin used for metadata, sitemap and robots. Set
   * NEXT_PUBLIC_SITE_URL in the deployment environment.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  /** Derived from the introduction document (who we are) and the Facebook page (location). */
  description:
    "DIWAN (ديوان للمحاماه والأستشارات القانونية) is an Egyptian law and legal consultancy firm in Kafr el Sheikh, working in companies and investment, civil and real-estate transactions, and personal status cases.",
  contact: {
    phone,
    /** Only linked once a real number is supplied. */
    phoneHref: isPlaceholder(phone) ? null : `tel:${phone.replace(/[^\d+]/g, "")}`,
    /** PLACEHOLDER — add if the firm uses a separate WhatsApp number. */
    whatsapp: "[WHATSAPP]",
    email,
    /** Only linked once a real address is supplied. */
    emailHref: isPlaceholder(email) ? null : `mailto:${email}`,
    /** Street address is a PLACEHOLDER; the city is confirmed. */
    office: ["[STREET ADDRESS]", "Kafr el Sheikh, Egypt"],
    hours: "[OFFICE HOURS]",
  },
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "Our People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
