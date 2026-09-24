/**
 * Source registry. Every firm-specific statement on the site should trace to
 * one of these sources (see `firm.ts`, `practiceAreas.ts` and
 * CONTENT_CHECKLIST.md). Anything without a source is marked VERIFY.
 */
export const sources = {
  facebook: {
    label: "Public Facebook page",
    title: "ديوان للمحاماه والأستشارات القانونية",
    url: "https://web.facebook.com/people/%D8%AF%D9%8A%D9%88%D8%A7%D9%86-%D9%84%D9%84%D9%85%D8%AD%D8%A7%D9%85%D8%A7%D9%87-%D9%88%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9/61563232199590/",
    supports: ["Arabic firm name (public-page name)", "Location: Kafr el Sheikh, Egypt"],
    note:
      "The page could not be opened from the build environment (network egress blocked). Name and location are taken as stated in the client brief that cites this page.",
  },
  introDoc: {
    label: "Arabic introduction document",
    title: "المقدمة / رؤيتنا — من نحن؟ — قيمنا الأساسية — رسالتنا",
    file: "docs/sources/introduction-ar.md (verbatim transcript of the supplied .docx)",
    supports: [
      "Vision / introduction",
      "Who we are",
      "Practice areas: companies and investment, civil and real-estate transactions, personal status",
      "Four core values",
      "Mission, incl. defence of rights before judicial and administrative bodies",
    ],
  },
  clientBrief: {
    label: "Client brief (content instructions)",
    supports: [
      "English wordmark DIWAN and subtitle LAW & LEGAL CONSULTANCY — a branding choice, not an official registered English name",
      "Editorial adaptations of the introduction document (see edits in firm.ts)",
    ],
  },
} as const;

export type SourceId = keyof typeof sources;
