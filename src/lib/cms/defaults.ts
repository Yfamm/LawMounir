/**
 * The DIWAN source content expressed in the CMS model. Used to seed the
 * database, and as the public site's fallback whenever the database is
 * unreachable or has not been seeded. Must not import image files, so the
 * seed script can load it outside Next.js.
 *
 * Every string here traces to src/content/* — see CONTENT_CHECKLIST.md for
 * the sources, recorded edits and VERIFY items.
 */
import { mission, values, vision, whoWeAre } from "@/content/firm";
import { insights } from "@/content/insights";
import { people } from "@/content/people";
import { practiceAreas } from "@/content/practiceAreas";
import { primaryNav, site } from "@/content/site";
import { serializeBody } from "./text";
import type {
  FirmValue,
  InsightRecord,
  NavItem,
  PersonRecord,
  PracticeAreaRecord,
  SectionMap,
  SiteSettings,
} from "./types";

export const defaultSettings: SiteSettings = {
  siteName: site.name,
  siteNameAr: site.nameAr,
  descriptor: site.descriptor,
  city: site.city,
  location: site.location,
  browserTitle: `${site.name} — ${site.descriptor}, ${site.city}`,
  description: site.description,
  defaultSeoDescription: site.description,
  canonicalUrl: "",
  email: site.contact.email,
  phone: site.contact.phone,
  whatsapp: site.contact.whatsapp,
  address: [...site.contact.office],
  hours: site.contact.hours,
  social: [],
  footerDescription: `Law and legal consultancy in ${site.city} — companies and investment, civil and real-estate transactions, and personal status.`,
  copyright: "All rights reserved.",
  disclaimer: "The content of this website is general information and does not constitute legal advice.",
  navCtaText: "Let’s talk",
  navCtaUrl: "/contact",
};

export const defaultNavigation: NavItem[] = primaryNav.map((item, i) => ({
  label: item.label,
  href: item.href,
  visible: true,
  sortOrder: i,
}));

const practiceIntro =
  "Companies and investment, civil and real-estate transactions, and personal status — the areas named in the firm's own introduction, with representation before judicial and administrative bodies.";

const teamIntro =
  "Counsel and lawyers specialized in branches of the law. Profiles of the team will be published once confirmed by the firm.";

const insightsIntro =
  "Sample notes on Egyptian law, pending legal review by the firm. They are general information, not legal advice from DIWAN.";

export const defaultSections: SectionMap = {
  "home.hero": {
    eyebrow: `${site.descriptor} — ${site.city}`,
    // From the firm's vision: "القانون ليس مجرد نصوص جامدة، بل هو حصن الأمان".
    headline: "More than\nrigid text.\nA *fortress.*",
    headlineAr: vision.headlineAr,
    text: "Legal counsel for investors, company owners and individuals — in companies and investment, civil and real-estate transactions, and personal status.",
    textAr: "",
    ctaText: "Let’s talk",
    ctaUrl: "/contact",
    secondaryCtaText: "Practice areas",
    secondaryCtaUrl: "/practice-areas",
    image: {
      plate: "hero",
      alt: "Bronze statue of Justice holding scales at sunset, with the pyramids and the Nile in the distance",
    },
  },
  "home.intro": {
    label: "The Firm",
    labelAr: "المكتب",
    statement: "A *fortress* that protects the rights of individuals and supports the growth of companies.",
    statementAr: vision.statementAr,
    body: whoWeAre.en.join("\n\n"),
    image: { plate: "hallAislePortrait" },
    ctaText: "About the firm",
    ctaUrl: "/about",
  },
  "home.practice": {
    label: "Practice Areas",
    labelAr: "مجالات الممارسة",
    title: "Practice\nAreas",
    intro: practiceIntro,
    note: "Each practice links to a detailed overview of scope and forums.",
    ctaText: "All practice areas",
    ctaUrl: "/practice-areas",
  },
  "home.landscape": {
    label: "The Egyptian legal landscape",
    labelAr: "المشهد القانوني المصري",
    frames: [
      { text: "Egyptian law is not\nsimply a collection\n*of statutes.*" },
      { text: "It is a living framework,\nshaped by courts, regulation,\ncommerce — and the realities\n*of the market.*" },
      { text: "Good counsel reads\n*all three at once.*" },
    ],
    // VERIFY: general statements about Egyptian courts and regulators.
    pillars: [
      {
        title: "Courts",
        text: "From courts of first instance to the Court of Cassation, with specialized Economic, Family and administrative courts alongside.",
      },
      {
        title: "Regulators",
        text: "Investment, financial, banking and sector authorities whose decisions shape what a business may do — and when.",
      },
      {
        title: "Markets",
        text: "The commercial customs, negotiating habits and market realities that no statute records but every dispute reveals.",
      },
    ],
    image: { plate: "hallAisle", alt: "" },
  },
  "home.values": {
    label: values.labelEn,
    labelAr: values.labelAr,
    title: "Why clients\n*choose us.*",
    intro: "Four core values the firm sets out as the basis of its work.",
    image: { plate: "colonnadeDetail" },
  },
  "home.experience": {
    label: "Experience",
    labelAr: "الخبرة",
    title: "The practice,\n*in four movements.*",
    intro: "Not a list of figures — a map of where the work sits, where it is decided and how it is carried through.",
    hint: "Scroll to continue",
    image: { plate: "hallRows" },
    // Source: the firm's introduction document (areas, mission, values).
    movements: [
      {
        number: "01",
        label: "Practice areas",
        title: "The areas the firm names as its own.",
        text: "Companies and investment, civil and real-estate transactions, and personal status cases — with representation running through all of them.",
        items: [],
        autoPracticeAreas: true,
      },
      {
        number: "02",
        label: "Forums",
        title: "Before judicial and administrative bodies.",
        text: "The firm's mission commits it to the faithful defence of rights before all judicial and administrative bodies.",
        // VERIFY: named courts.
        items: ["Judicial bodies", "Administrative bodies", "Civil Courts", "Family Courts"],
        autoPracticeAreas: false,
      },
      {
        number: "03",
        label: "Clients",
        title: "For investors, company owners and citizens.",
        text: "The mission names those the firm serves: everyone seeking legal security in Egypt.",
        items: ["Investors", "Company owners", "Citizens"],
        autoPracticeAreas: false,
      },
      {
        number: "04",
        label: "Approach",
        title: "Simpler procedures. Clearer advice.",
        text: "Simplifying procedures, offering clear advice and faithfully defending rights — completed efficiently, with the client kept informed.",
        items: ["Simplify procedures", "Clear advice", "Company formation", "Contract drafting", "Administrative procedures", "Defence of rights"],
        autoPracticeAreas: false,
      },
    ],
  },
  "home.people": {
    label: "Our People",
    labelAr: "فريقنا",
    title: "Our counsel\n*and lawyers.*",
    intro: teamIntro,
    ctaText: "Meet the team",
    ctaUrl: "/people",
    selected: [],
  },
  "home.insights": {
    label: "Insights",
    labelAr: "رؤى قانونية",
    title: "Notes on\n*Egyptian law.*",
    intro: insightsIntro,
    ctaText: "All insights",
    ctaUrl: "/insights",
    selected: [],
  },
  "home.contact": {
    label: "Contact",
    labelAr: "تواصل معنا",
    title: "Let’s talk about\n*what comes next.*",
    description: "",
    submitText: "Send enquiry",
    notice:
      "Submitting this form does not create a lawyer–client relationship. Please do not send confidential information until one exists.",
    successTitle: "Thank you. We will be in touch shortly.",
    successText: "A member of the team will review your enquiry and respond by phone or email.",
  },
  "about.vision": {
    enabled: true,
    label: vision.labelEn,
    titleAr: vision.labelAr,
    title: "More than\n*rigid text.*",
    bodyEn: vision.en,
    bodyAr: vision.ar,
    image: { plate: "hallRows", position: "88% 62%" },
  },
  "about.who": {
    enabled: true,
    label: whoWeAre.labelEn,
    titleAr: whoWeAre.labelAr,
    title: "An Egyptian firm\n*of counsel and lawyers.*",
    bodyEn: whoWeAre.en.join("\n\n"),
    bodyAr: whoWeAre.ar,
    image: { plate: "colonnade", position: "72% 40%" },
  },
  "about.values": {
    enabled: true,
    label: values.labelEn,
    titleAr: values.labelAr,
    title: "Why clients\n*choose us.*",
    bodyEn: "Four core values the firm sets out as the basis of its work.",
    bodyAr: "",
    image: { plate: "colonnadeDetail" },
  },
  "about.mission": {
    enabled: true,
    label: mission.labelEn,
    titleAr: mission.labelAr,
    title: "A trusted\n*legal partner.*",
    bodyEn: mission.en,
    bodyAr: mission.ar,
    image: { plate: "hallAisle" },
  },
};

export const defaultValues: FirmValue[] = values.items.map((v, i) => ({
  titleEn: v.titleEn,
  titleAr: v.titleAr,
  bodyEn: v.textEn,
  bodyAr: v.textAr,
  published: true,
  sortOrder: i,
}));

export const defaultPracticeAreas: PracticeAreaRecord[] = practiceAreas.map((a, i) => ({
  slug: a.slug,
  title: a.title,
  titleAr: a.titleAr ?? "",
  summary: a.summary,
  overview: a.overview,
  scope: [...a.scope],
  forums: [...a.forums],
  image: { plate: a.plate, position: a.focus },
  seoTitle: "",
  seoDescription: "",
  published: true,
  sortOrder: i,
  sources: [...a.sources],
  verify: [...a.verify],
}));

export const defaultPeople: PersonRecord[] = people.map((p, i) => ({
  id: `default-${p.id}`,
  nameEn: p.name,
  nameAr: "",
  titleEn: p.role,
  titleAr: "",
  practice: p.practice,
  bioShort: p.bio,
  bioFull: "",
  portrait: {},
  education: "",
  languages: "",
  admission: "",
  published: true,
  sortOrder: i,
}));

export const defaultInsights: InsightRecord[] = insights.map((n, i) => ({
  slug: n.slug,
  title: n.title,
  titleAr: "",
  excerpt: n.standfirst,
  excerptAr: "",
  body: serializeBody(n.body),
  author: "",
  cover: { plate: n.plate },
  category: n.category,
  publishedOn: n.date,
  readingTime: n.readingTime,
  seoTitle: "",
  seoDescription: "",
  // Published as before, still flagged as pending legal review.
  status: "published",
  legalReview: n.reviewed ? "approved" : "pending",
  verify: [...n.verify],
  sortOrder: i,
}));

export const defaultInsightCategories = [
  "Legal Updates",
  "Egyptian Law",
  "Case Analysis",
  "Regulatory Changes",
  "Business & Investment",
  "Legal Guides",
];
