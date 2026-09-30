/**
 * Declarative field definitions. One definition drives both the admin form
 * (rendering) and the server-side validation schema (schema.ts), so the two
 * can never drift apart. Pure data: safe on client and server.
 */

type Base = { name: string; label: string; help?: string };

export type Field =
  | (Base & { type: "text"; required?: boolean; max?: number; dir?: "rtl"; placeholder?: string; pattern?: string })
  | (Base & { type: "textarea"; required?: boolean; max?: number; rows?: number; dir?: "rtl" })
  /** Display headline: one line per row, *emphasis*. */
  | (Base & { type: "headline"; required?: boolean; rows?: number })
  /** Site-relative path, absolute http(s) URL, mailto: or tel:. */
  | (Base & { type: "url"; required?: boolean })
  /** Slug, lower-case kebab. */
  | (Base & { type: "slug" })
  /** Array of strings, edited one per line. */
  | (Base & { type: "lines"; max?: number; dir?: "rtl" })
  | (Base & { type: "image" })
  | (Base & { type: "checkbox" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "date" })
  | (Base & { type: "email" })
  /** Ordered selection from a list of records supplied by the page. */
  | (Base & { type: "refs"; source: "people" | "insights" })
  /** Repeatable group of sub-fields with add / remove / reorder. */
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; min?: number; max?: number });

const label = (): Field[] => [
  { type: "text", name: "label", label: "Section heading", required: true, max: 80 },
  { type: "text", name: "labelAr", label: "Arabic heading", dir: "rtl", max: 120 },
];

const cta = (prefix = "cta", title = "Button"): Field[] => [
  { type: "text", name: `${prefix}Text`, label: `${title} text`, max: 60 },
  { type: "url", name: `${prefix}Url`, label: `${title} link` },
];

const HEADLINE_HELP = "One line per row. Wrap words in *asterisks* for the gold italic.";

export const sectionFields: Record<string, Field[]> = {
  "home.hero": [
    { type: "text", name: "eyebrow", label: "Eyebrow", max: 120 },
    { type: "headline", name: "headline", label: "English headline", required: true, help: HEADLINE_HELP },
    { type: "text", name: "headlineAr", label: "Arabic headline", dir: "rtl", max: 200 },
    { type: "textarea", name: "text", label: "Supporting text", max: 600, rows: 3 },
    { type: "textarea", name: "textAr", label: "Arabic supporting text", dir: "rtl", max: 600, rows: 3, help: "Shown beneath the English text when filled in." },
    ...cta("cta", "Primary button"),
    ...cta("secondaryCta", "Secondary button"),
    { type: "image", name: "image", label: "Hero image" },
  ],
  "home.intro": [
    ...label(),
    { type: "headline", name: "statement", label: "Statement", required: true, help: "Lights up word by word on scroll. Wrap a word in *asterisks* for emphasis." },
    { type: "text", name: "statementAr", label: "Arabic statement", dir: "rtl", max: 300 },
    { type: "textarea", name: "body", label: "Body", rows: 6, max: 3000, help: "Separate paragraphs with a blank line." },
    { type: "image", name: "image", label: "Image (with caption)" },
    ...cta("cta", "Button"),
  ],
  "home.practice": [
    ...label(),
    { type: "headline", name: "title", label: "Title", required: true, help: "The number of published areas is added after the last line." },
    { type: "textarea", name: "intro", label: "Introduction", max: 800, rows: 3 },
    { type: "text", name: "note", label: "Footnote", max: 200 },
    ...cta("cta", "Button"),
  ],
  "home.landscape": [
    ...label(),
    {
      type: "list",
      name: "frames",
      label: "Statements",
      itemLabel: "Statement",
      min: 3,
      max: 3,
      help: "Exactly three statements play through the pinned scene, in this order. The pillars appear with the third.",
      fields: [{ type: "headline", name: "text", label: "Statement", required: true, help: HEADLINE_HELP }],
    },
    {
      type: "list",
      name: "pillars",
      label: "Pillars",
      itemLabel: "Pillar",
      max: 4,
      fields: [
        { type: "text", name: "title", label: "Title", required: true, max: 60 },
        { type: "textarea", name: "text", label: "Text", max: 400, rows: 3 },
      ],
    },
    { type: "image", name: "image", label: "Background image" },
  ],
  "home.values": [
    ...label(),
    { type: "headline", name: "title", label: "Title", required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", max: 800, rows: 3 },
    { type: "image", name: "image", label: "Image" },
  ],
  "home.experience": [
    ...label(),
    { type: "headline", name: "title", label: "Title", required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", max: 600, rows: 3 },
    { type: "text", name: "hint", label: "Scroll hint", max: 60 },
    { type: "image", name: "image", label: "Image (with caption)" },
    {
      type: "list",
      name: "movements",
      label: "Movements",
      itemLabel: "Movement",
      min: 1,
      max: 6,
      fields: [
        { type: "text", name: "number", label: "Number", required: true, max: 3, pattern: "^\\d{1,3}$", help: "Digits only, e.g. 01 — counts up on entry." },
        { type: "text", name: "label", label: "Label", required: true, max: 60 },
        { type: "text", name: "title", label: "Title", required: true, max: 160 },
        { type: "textarea", name: "text", label: "Description", max: 600, rows: 3 },
        { type: "checkbox", name: "autoPracticeAreas", label: "List the published practice areas instead of the items below" },
        { type: "lines", name: "items", label: "Items (one per line)", max: 20 },
      ],
    },
  ],
  "home.people": [
    ...label(),
    { type: "headline", name: "title", label: "Title", required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", max: 800, rows: 3 },
    ...cta("cta", "Button"),
    { type: "refs", name: "selected", label: "People shown, in order", source: "people", help: "Leave empty to show the first three published people." },
  ],
  "home.insights": [
    ...label(),
    { type: "headline", name: "title", label: "Title", required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", max: 800, rows: 3 },
    ...cta("cta", "Button"),
    { type: "refs", name: "selected", label: "Articles shown, in order", source: "insights", help: "Leave empty to show the first three published articles." },
  ],
  "home.contact": [
    ...label(),
    { type: "headline", name: "title", label: "Heading", required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "description", label: "Description", max: 800, rows: 3, help: "Optional. Shown beneath the heading." },
    { type: "text", name: "submitText", label: "Button text", required: true, max: 40 },
    { type: "textarea", name: "notice", label: "Notice beneath the form", max: 600, rows: 3 },
    { type: "text", name: "successTitle", label: "Success heading", required: true, max: 160 },
    { type: "textarea", name: "successText", label: "Success text", max: 400, rows: 2 },
  ],
};

const aboutBlock: Field[] = [
  { type: "checkbox", name: "enabled", label: "Show this section" },
  { type: "text", name: "label", label: "Label", required: true, max: 60 },
  { type: "text", name: "titleAr", label: "Arabic title", dir: "rtl", max: 120 },
  { type: "headline", name: "title", label: "English title", required: true, help: HEADLINE_HELP },
  { type: "textarea", name: "bodyEn", label: "English body", rows: 6, max: 4000, help: "Separate paragraphs with a blank line." },
  { type: "textarea", name: "bodyAr", label: "Arabic body", rows: 6, max: 4000, dir: "rtl" },
  { type: "image", name: "image", label: "Image" },
];

for (const key of ["about.vision", "about.who", "about.values", "about.mission"]) sectionFields[key] = aboutBlock;

export const settingsFields: Field[] = [
  { type: "text", name: "siteName", label: "Site name (English wordmark)", required: true, max: 40 },
  { type: "text", name: "siteNameAr", label: "Arabic name", required: true, dir: "rtl", max: 120 },
  { type: "text", name: "descriptor", label: "Descriptor", required: true, max: 80 },
  { type: "text", name: "city", label: "City", required: true, max: 60 },
  { type: "text", name: "location", label: "Location line", max: 80 },
  { type: "text", name: "browserTitle", label: "Browser title (home page)", required: true, max: 120 },
  { type: "textarea", name: "description", label: "Site description", max: 400, rows: 3 },
  { type: "textarea", name: "defaultSeoDescription", label: "Default SEO description", max: 300, rows: 2 },
  { type: "url", name: "canonicalUrl", label: "Canonical URL", help: "e.g. https://www.example.com — leave empty to use the NEXT_PUBLIC_SITE_URL environment variable." },
  { type: "text", name: "email", label: "Contact email", max: 120, help: "Placeholders in [BRACKETS] are shown as text and never linked." },
  { type: "text", name: "phone", label: "Phone", max: 40 },
  { type: "text", name: "whatsapp", label: "WhatsApp", max: 40 },
  { type: "lines", name: "address", label: "Address (one line per row)", max: 5 },
  { type: "text", name: "hours", label: "Office hours", max: 120 },
  {
    type: "list",
    name: "social",
    label: "Social links",
    itemLabel: "Link",
    max: 8,
    fields: [
      { type: "text", name: "label", label: "Label", required: true, max: 40 },
      { type: "url", name: "url", label: "URL", required: true },
    ],
  },
];

export const footerFields: Field[] = [
  { type: "textarea", name: "footerDescription", label: "Footer description", max: 400, rows: 3 },
  { type: "text", name: "copyright", label: "Copyright line", max: 160, help: "Follows “© year, site name · Arabic name.”" },
  { type: "textarea", name: "disclaimer", label: "Disclaimer", max: 400, rows: 2 },
  { type: "text", name: "navCtaText", label: "Navigation button text", required: true, max: 40 },
  { type: "url", name: "navCtaUrl", label: "Navigation button link", required: true },
];

export const collectionFields = {
  values: [
    { type: "text", name: "titleEn", label: "English title", required: true, max: 120 },
    { type: "text", name: "titleAr", label: "Arabic title", dir: "rtl", max: 120 },
    { type: "textarea", name: "bodyEn", label: "Description", rows: 4, max: 1000 },
    { type: "textarea", name: "bodyAr", label: "Arabic description", rows: 4, max: 1000, dir: "rtl" },
    { type: "checkbox", name: "published", label: "Published" },
  ],
  navigation: [
    { type: "text", name: "label", label: "Label", required: true, max: 60 },
    { type: "url", name: "href", label: "Link", required: true },
    { type: "checkbox", name: "visible", label: "Visible" },
  ],
  practice: [
    { type: "text", name: "title", label: "Title", required: true, max: 120 },
    { type: "text", name: "titleAr", label: "Arabic title", dir: "rtl", max: 120 },
    { type: "slug", name: "slug", label: "Slug", help: "Lower-case words joined by hyphens. Changing it changes the page address." },
    { type: "textarea", name: "summary", label: "Short description", rows: 2, max: 400, required: true },
    { type: "textarea", name: "overview", label: "Full description", rows: 6, max: 4000 },
    { type: "lines", name: "scope", label: "What we handle (one per line)", max: 20 },
    { type: "lines", name: "forums", label: "Forums & authorities (one per line)", max: 20 },
    { type: "image", name: "image", label: "Image (alt text, caption, framing)" },
    { type: "text", name: "seoTitle", label: "SEO title", max: 120, help: "Defaults to the title." },
    { type: "textarea", name: "seoDescription", label: "SEO description", rows: 2, max: 300, help: "Defaults to the short description." },
    { type: "checkbox", name: "published", label: "Published" },
    { type: "lines", name: "verify", label: "Verification notes (internal, one per line)", max: 20 },
  ],
  people: [
    { type: "text", name: "nameEn", label: "English name", required: true, max: 120 },
    { type: "text", name: "nameAr", label: "Arabic name", dir: "rtl", max: 120 },
    { type: "text", name: "titleEn", label: "Title", max: 120 },
    { type: "text", name: "titleAr", label: "Arabic title", dir: "rtl", max: 120 },
    { type: "text", name: "practice", label: "Practice focus", max: 160 },
    { type: "textarea", name: "bioShort", label: "Short bio", rows: 3, max: 600 },
    { type: "textarea", name: "bioFull", label: "Full bio", rows: 6, max: 4000 },
    { type: "image", name: "portrait", label: "Portrait (with alt text)" },
    { type: "textarea", name: "education", label: "Education", rows: 2, max: 600 },
    { type: "text", name: "languages", label: "Languages", max: 200 },
    { type: "textarea", name: "admission", label: "Bar / admission", rows: 2, max: 600 },
    { type: "checkbox", name: "published", label: "Published" },
  ],
  insights: [
    { type: "text", name: "title", label: "Title", required: true, max: 200 },
    { type: "text", name: "titleAr", label: "Arabic title", dir: "rtl", max: 200 },
    { type: "slug", name: "slug", label: "Slug", help: "Lower-case words joined by hyphens. Changing it changes the page address." },
    { type: "textarea", name: "excerpt", label: "Excerpt", rows: 3, max: 600, required: true },
    { type: "textarea", name: "excerptAr", label: "Arabic excerpt", rows: 3, max: 600, dir: "rtl" },
    {
      type: "textarea",
      name: "body",
      label: "Body",
      rows: 18,
      max: 40000,
      help: "Blank line between paragraphs. Start a paragraph with “## ” for a heading, “> ” for a quotation, or “- ” on each line for a list.",
    },
    { type: "text", name: "author", label: "Author", max: 120 },
    { type: "image", name: "cover", label: "Cover image" },
    { type: "text", name: "category", label: "Category", required: true, max: 60 },
    { type: "date", name: "publishedOn", label: "Publication date", help: "Leave empty to show [PUBLICATION DATE]." },
    { type: "text", name: "readingTime", label: "Reading time", max: 30, placeholder: "6 min read" },
    { type: "text", name: "seoTitle", label: "SEO title", max: 120 },
    { type: "textarea", name: "seoDescription", label: "SEO description", rows: 2, max: 300 },
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { value: "draft", label: "Draft — not public" },
        { value: "published", label: "Published" },
      ],
    },
    {
      type: "select",
      name: "legalReview",
      label: "Legal review",
      options: [
        { value: "pending", label: "Pending — shows the draft notice" },
        { value: "approved", label: "Approved by the firm" },
      ],
    },
    { type: "lines", name: "verify", label: "Statements to verify (internal, one per line)", max: 20 },
  ],
} satisfies Record<string, Field[]>;

export type CollectionKey = keyof typeof collectionFields;
