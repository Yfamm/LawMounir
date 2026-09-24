/**
 * Firm-wide details used across navigation, footer, contact and metadata.
 * Replace the contact values below with the firm's real details before launch.
 */
export const site = {
  name: "Mounir",
  legalName: "Mounir Law Firm",
  descriptor: "Attorneys at Law",
  city: "Cairo",
  url: "https://mounirlaw.com",
  description:
    "An Egyptian law firm advising companies, investors and families across corporate, disputes, regulatory and personal matters — with a commercially aware reading of Egyptian law.",
  contact: {
    phone: "+20 2 0000 0000",
    phoneHref: "tel:+20200000000",
    email: "contact@mounirlaw.com",
    office: ["Zamalek", "Cairo", "Arab Republic of Egypt"],
    hours: "Sunday – Thursday, 09:00 – 17:00",
  },
  coordinates: "30.0444° N — 31.2357° E",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "Our People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
