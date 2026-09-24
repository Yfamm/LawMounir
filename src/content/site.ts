/**
 * Firm-wide details used across navigation, footer, contact, metadata and
 * the page-transition curtain.
 *
 * PLACEHOLDERS: every value in square brackets is a placeholder awaiting the
 * firm's confirmed details. Nothing here should be replaced with invented
 * information. See CONTENT_CHECKLIST.md.
 */

/** True while a value is still a "[PLACEHOLDER]". */
export function isPlaceholder(value: string | null | undefined) {
  return !value || /^\[.*\]$/.test(value.trim());
}

const phone = "[PHONE]";
const email = "[EMAIL]";

export const site = {
  /** Short name used in the logo, curtain and footer wordmark. */
  name: "[LAW FIRM NAME]",
  /** Full legal name used in metadata and the copyright line. */
  legalName: "[LAW FIRM NAME]",
  descriptor: "Attorneys at Law",
  /** Arabic name and tagline, set in Amiri. PLACEHOLDERS. */
  nameAr: "[اسم مكتب المحاماة]",
  taglineAr: "[شعار المكتب بالعربية]",
  city: "[CITY]",
  /** Public website shown to visitors. PLACEHOLDER. */
  website: "[WEBSITE]",
  /**
   * Canonical origin used for metadata, sitemap and robots. Set
   * NEXT_PUBLIC_SITE_URL in the deployment environment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "An Egyptian law firm advising companies, investors and families across corporate, disputes, regulatory and personal matters.", // VERIFY: scope of practice and clientele
  contact: {
    phone,
    /** Only linked once a real number is supplied. */
    phoneHref: isPlaceholder(phone) ? null : `tel:${phone.replace(/[^\d+]/g, "")}`,
    email,
    /** Only linked once a real address is supplied. */
    emailHref: isPlaceholder(email) ? null : `mailto:${email}`,
    office: ["[OFFICE ADDRESS]"],
    hours: "[OFFICE HOURS]",
  },
  /** Office coordinates shown as a typographic detail in the hero and footer. PLACEHOLDER. */
  coordinates: "[OFFICE COORDINATES]",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "Our People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
