/**
 * Declarative field definitions. One definition drives the admin form
 * (rendering, side-by-side Arabic/English editing, completeness) and the
 * server-side validation schema (schema.ts). Pure data: safe on client and
 * server.
 *
 * `localized: true` stores { en, ar } and is edited side by side.
 */
import { uiGroups } from "./ui";

type Base = { name: string; label: string; labelAr?: string; help?: string };

export type Field =
  | (Base & { type: "text"; localized?: boolean; required?: boolean; max?: number; placeholder?: string; pattern?: string })
  | (Base & { type: "textarea"; localized?: boolean; required?: boolean; max?: number; rows?: number })
  /** Display headline: one line per row, *emphasis*. */
  | (Base & { type: "headline"; localized?: boolean; required?: boolean; rows?: number })
  /** Site path ("/contact"), absolute http(s) URL, mailto: or tel:. */
  | (Base & { type: "url"; required?: boolean })
  /** Button / link: localized text + URL. */
  | (Base & { type: "link"; required?: boolean })
  | (Base & { type: "slug" })
  /** Array of strings, one per line. */
  | (Base & { type: "lines"; localized?: boolean; max?: number })
  | (Base & { type: "image"; required?: boolean })
  | (Base & { type: "checkbox" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "date" })
  | (Base & { type: "email" })
  /** Ordered selection from a list of records supplied by the page. */
  | (Base & { type: "refs"; source: "people" | "insights" })
  /** Kept with the record but not shown (internal ids). */
  | (Base & { type: "hidden" })
  /** Nested object of fields. */
  | (Base & { type: "group"; fields: Field[] })
  /** Repeatable group of sub-fields with add / remove / reorder / hide. */
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; min?: number; max?: number; titleField?: string });

const HEADLINE_HELP = "One line per row. Wrap words in *asterisks* for the gold italic.";
const LINK_HELP = "Write site links without a language, e.g. /contact — /ar or /en is added automatically.";

const label = (): Field[] => [
  { type: "text", name: "label", label: "Section label", labelAr: "عنوان القسم", localized: true, required: true, max: 120 },
];

export const sectionFields: Record<string, Field[]> = {
  "home.hero": [
    { type: "text", name: "eyebrow", label: "Eyebrow", labelAr: "السطر التمهيدي", localized: true, max: 160 },
    { type: "headline", name: "headline", label: "Headline", labelAr: "العنوان الرئيسي", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "supporting", label: "Supporting text", labelAr: "النص المساند", localized: true, max: 600, rows: 3 },
    { type: "link", name: "primary", label: "Primary button", labelAr: "الزر الرئيسي", help: LINK_HELP },
    { type: "link", name: "secondary", label: "Secondary button", labelAr: "الزر الثانوي" },
    { type: "image", name: "image", label: "Hero image", labelAr: "صورة الواجهة" },
  ],
  "home.intro": [
    ...label(),
    { type: "headline", name: "statement", label: "Statement", labelAr: "العبارة", localized: true, required: true, help: "Lights up word by word on scroll. Wrap a word in *asterisks* for emphasis." },
    { type: "textarea", name: "body", label: "Body", labelAr: "النص", localized: true, rows: 6, max: 3000, help: "Separate paragraphs with a blank line." },
    { type: "image", name: "image", label: "Image (with caption)", labelAr: "الصورة" },
    { type: "link", name: "cta", label: "Button", labelAr: "الزر" },
  ],
  "home.practice": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: "The number of published areas is added after the last line." },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
    { type: "text", name: "note", label: "Footnote", labelAr: "ملاحظة", localized: true, max: 200 },
    { type: "link", name: "cta", label: "Button", labelAr: "الزر" },
  ],
  "home.landscape": [
    ...label(),
    {
      type: "list",
      name: "frames",
      label: "Statements",
      labelAr: "العبارات",
      itemLabel: "Statement",
      min: 3,
      max: 3,
      help: "Exactly three statements play through the pinned scene, in this order. The pillars appear with the third.",
      fields: [{ type: "headline", name: "text", label: "Statement", labelAr: "العبارة", localized: true, required: true, help: HEADLINE_HELP }],
    },
    {
      type: "list",
      name: "pillars",
      label: "Pillars",
      labelAr: "الركائز",
      itemLabel: "Pillar",
      max: 4,
      titleField: "title",
      fields: [
        { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 60 },
        { type: "textarea", name: "text", label: "Text", labelAr: "النص", localized: true, max: 400, rows: 3 },
      ],
    },
    { type: "image", name: "image", label: "Background image", labelAr: "صورة الخلفية" },
  ],
  "home.values": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
    { type: "image", name: "image", label: "Image", labelAr: "الصورة" },
  ],
  "home.experience": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 600, rows: 3 },
    { type: "text", name: "hint", label: "Scroll hint", labelAr: "تلميح التمرير", localized: true, max: 60 },
    { type: "image", name: "image", label: "Image (with caption)", labelAr: "الصورة" },
    {
      type: "list",
      name: "movements",
      label: "Movements",
      labelAr: "المحاور",
      itemLabel: "Movement",
      min: 1,
      max: 6,
      titleField: "label",
      fields: [
        { type: "text", name: "number", label: "Number", labelAr: "الرقم", required: true, max: 3, pattern: "^\\d{1,3}$", help: "Digits only, e.g. 01 — counts up on entry." },
        { type: "text", name: "label", label: "Label", labelAr: "العنوان القصير", localized: true, required: true, max: 60 },
        { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 160 },
        { type: "textarea", name: "text", label: "Description", labelAr: "الوصف", localized: true, max: 600, rows: 3 },
        { type: "checkbox", name: "autoPracticeAreas", label: "List the published practice areas instead of the items below" },
        { type: "lines", name: "items", label: "Items (one per line)", labelAr: "العناصر (سطر لكل عنصر)", localized: true, max: 20 },
      ],
    },
  ],
  "home.people": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
    { type: "link", name: "cta", label: "Button", labelAr: "الزر" },
    { type: "refs", name: "selected", label: "People shown, in order", labelAr: "الأشخاص المعروضون بالترتيب", source: "people", help: "Leave empty to show the first three published people." },
  ],
  "home.insights": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
    { type: "link", name: "cta", label: "Button", labelAr: "الزر" },
    { type: "refs", name: "selected", label: "Articles shown, in order", labelAr: "المقالات المعروضة بالترتيب", source: "insights", help: "Leave empty to show the first three published articles." },
  ],
  "home.contact": [
    ...label(),
    { type: "headline", name: "title", label: "Heading", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    { type: "textarea", name: "description", label: "Description", labelAr: "الوصف", localized: true, max: 800, rows: 3, help: "Optional. Shown beneath the heading." },
    { type: "text", name: "submitText", label: "Button text", labelAr: "نص الزر", localized: true, required: true, max: 40 },
    { type: "textarea", name: "notice", label: "Notice beneath the form", labelAr: "التنبيه أسفل النموذج", localized: true, max: 600, rows: 3 },
    { type: "text", name: "successTitle", label: "Success heading", labelAr: "عنوان رسالة النجاح", localized: true, required: true, max: 160 },
    { type: "textarea", name: "successText", label: "Success text", labelAr: "نص رسالة النجاح", localized: true, max: 400, rows: 2 },
    { type: "image", name: "image", label: "Background image (behind the contact section)", labelAr: "صورة الخلفية" },
  ],
  "about.blocks": [
    {
      type: "list",
      name: "blocks",
      label: "Sections",
      labelAr: "الأقسام",
      itemLabel: "Section",
      min: 1,
      max: 12,
      titleField: "label",
      help: "The first visible section opens the page. Hide a section with “Show on the site”; numbering follows the visible sections.",
      fields: [
        { type: "checkbox", name: "enabled", label: "Show on the site" },
        {
          type: "select",
          name: "layout",
          label: "Layout",
          options: [
            { value: "header", label: "Opening — large title, text and wide image" },
            { value: "story", label: "Story — title, portrait image and paragraphs" },
            { value: "values", label: "Values — title, image and the list of values" },
            { value: "statement", label: "Statement — title, text and wide image band" },
          ],
        },
        { type: "text", name: "label", label: "Label", labelAr: "العنوان القصير", localized: true, required: true, max: 80 },
        { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
        { type: "textarea", name: "body", label: "Body", labelAr: "النص", localized: true, rows: 6, max: 5000, help: "Separate paragraphs with a blank line." },
        { type: "image", name: "image", label: "Image", labelAr: "الصورة" },
        { type: "hidden", name: "id", label: "Internal id" },
      ],
    },
  ],
  "practice.index": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: "The number of published areas is added after the last line." },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
    { type: "image", name: "image", label: "Wide image under the title", labelAr: "الصورة العريضة" },
  ],
  "people.index": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: "The number of published people is added after the last line." },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
  ],
  "insights.index": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: "The number of published articles is added after the last line." },
    { type: "textarea", name: "intro", label: "Introduction", labelAr: "المقدمة", localized: true, max: 800, rows: 3 },
  ],
  "contact.page": [
    ...label(),
    { type: "headline", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, help: HEADLINE_HELP },
    {
      type: "list",
      name: "steps",
      label: "Steps",
      labelAr: "الخطوات",
      itemLabel: "Step",
      max: 6,
      titleField: "title",
      fields: [
        { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 80 },
        { type: "textarea", name: "text", label: "Text", labelAr: "النص", localized: true, max: 500, rows: 3 },
      ],
    },
  ],
  "seo.pages": (["home", "about", "practice", "people", "insights", "contact"] as const).map(
    (page): Field => ({
      type: "group",
      name: page,
      label: { home: "Homepage", about: "About", practice: "Practice areas", people: "Our people", insights: "Insights", contact: "Contact" }[page],
      fields: [
        { type: "text", name: "title", label: "Browser / search title", labelAr: "عنوان الصفحة في محركات البحث", localized: true, max: 120 },
        { type: "textarea", name: "description", label: "Search description", labelAr: "وصف الصفحة في محركات البحث", localized: true, max: 300, rows: 2 },
      ],
    }),
  ),
  "ui.strings": [
    {
      type: "group",
      name: "strings",
      label: "Interface text",
      fields: Object.entries(uiGroups).flatMap(([group, entries]) =>
        Object.entries(entries).map(
          ([key, entry]): Field => ({
            type: entry.en.length > 70 ? "textarea" : "text",
            name: key,
            label: entry.note,
            help: group,
            localized: true,
            required: true,
            max: 600,
          }),
        ),
      ),
    },
  ],
};

export const settingsFields: Field[] = [
  { type: "text", name: "brandName", label: "Brand name (used in text and titles)", labelAr: "اسم العلامة", localized: true, required: true, max: 60 },
  { type: "text", name: "wordmark", label: "Logo wordmark (Latin letters, shown in both languages)", required: true, max: 20 },
  { type: "text", name: "firmName", label: "Logo descriptor / full firm name", labelAr: "الاسم الكامل للمكتب", localized: true, required: true, max: 120 },
  { type: "image", name: "logo", label: "Logo image (optional — replaces the typographic wordmark)", labelAr: "صورة الشعار" },
  { type: "image", name: "favicon", label: "Favicon (optional — square PNG, at least 192×192)", labelAr: "أيقونة الموقع" },
  { type: "image", name: "shareImage", label: "Social sharing image (1200×630 recommended)", labelAr: "صورة المشاركة" },
  {
    type: "select",
    name: "defaultLanguage",
    label: "Default language for new visitors",
    labelAr: "اللغة الافتراضية",
    options: [
      { value: "ar", label: "Arabic — العربية" },
      { value: "en", label: "English" },
    ],
  },
  { type: "text", name: "city", label: "City", labelAr: "المدينة", localized: true, required: true, max: 60 },
  { type: "text", name: "location", label: "Location line", labelAr: "سطر الموقع", localized: true, max: 80 },
  { type: "text", name: "browserTitle", label: "Browser title (home page)", labelAr: "عنوان المتصفح", localized: true, required: true, max: 120 },
  { type: "textarea", name: "description", label: "Site description", labelAr: "وصف الموقع", localized: true, max: 400, rows: 3 },
  { type: "textarea", name: "defaultSeoDescription", label: "Default SEO description", labelAr: "وصف محركات البحث الافتراضي", localized: true, max: 300, rows: 2 },
  { type: "url", name: "canonicalUrl", label: "Canonical URL", help: "e.g. https://www.example.com — leave empty to use the NEXT_PUBLIC_SITE_URL environment variable." },
  { type: "text", name: "email", label: "Contact email", max: 120, help: "Placeholders in [BRACKETS] are shown as text and never linked." },
  { type: "text", name: "phone", label: "Phone", max: 40 },
  { type: "text", name: "whatsapp", label: "WhatsApp", max: 40 },
  { type: "lines", name: "address", label: "Address (one line per row)", labelAr: "العنوان (سطر لكل جزء)", localized: true, max: 5 },
  { type: "text", name: "hours", label: "Office hours", labelAr: "مواعيد العمل", localized: true, max: 120 },
  {
    type: "list",
    name: "social",
    label: "Social links",
    labelAr: "روابط التواصل الاجتماعي",
    itemLabel: "Link",
    max: 8,
    titleField: "label",
    fields: [
      { type: "text", name: "label", label: "Label", labelAr: "الاسم", localized: true, required: true, max: 40 },
      { type: "url", name: "url", label: "URL", required: true },
    ],
  },
];

export const footerFields: Field[] = [
  { type: "textarea", name: "footerDescription", label: "Footer description", labelAr: "وصف التذييل", localized: true, max: 400, rows: 3 },
  { type: "text", name: "copyright", label: "Copyright line", labelAr: "سطر حقوق النشر", localized: true, max: 160, help: "Follows “© year, firm name.”" },
  { type: "textarea", name: "disclaimer", label: "Disclaimer", labelAr: "إخلاء المسؤولية", localized: true, max: 400, rows: 2 },
  { type: "link", name: "navCta", label: "Navigation button", labelAr: "زر القائمة", required: true },
];

export const collectionFields = {
  values: [
    { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 120 },
    { type: "textarea", name: "body", label: "Description", labelAr: "الوصف", localized: true, rows: 4, max: 1000 },
    { type: "checkbox", name: "published", label: "Published" },
  ],
  navigation: [
    { type: "text", name: "label", label: "Label", labelAr: "النص", localized: true, required: true, max: 60 },
    { type: "url", name: "href", label: "Link", required: true, help: LINK_HELP },
    { type: "checkbox", name: "visible", label: "Visible" },
  ],
  practice: [
    { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 120 },
    { type: "slug", name: "slug", label: "Slug (address)", help: "Shared by both languages: /ar/practice-areas/slug and /en/practice-areas/slug. Lower-case Latin words joined by hyphens." },
    { type: "textarea", name: "summary", label: "Short description", labelAr: "الوصف المختصر", localized: true, rows: 2, max: 400, required: true },
    { type: "textarea", name: "overview", label: "Full description", labelAr: "الوصف الكامل", localized: true, rows: 6, max: 4000 },
    { type: "lines", name: "scope", label: "What we handle (one per line)", labelAr: "ما نتولاه (سطر لكل بند)", localized: true, max: 20 },
    { type: "lines", name: "forums", label: "Forums & authorities (one per line)", labelAr: "الجهات والمحاكم (سطر لكل بند)", localized: true, max: 20 },
    { type: "image", name: "image", label: "Image (alt text, caption, framing)", labelAr: "الصورة" },
    { type: "text", name: "seoTitle", label: "SEO title", labelAr: "عنوان محركات البحث", localized: true, max: 120, help: "Defaults to the title." },
    { type: "textarea", name: "seoDescription", label: "SEO description", labelAr: "وصف محركات البحث", localized: true, rows: 2, max: 300, help: "Defaults to the short description." },
    { type: "checkbox", name: "published", label: "Published" },
    { type: "lines", name: "verify", label: "Verification notes (internal, one per line)", max: 20 },
  ],
  people: [
    { type: "text", name: "name", label: "Name", labelAr: "الاسم", localized: true, required: true, max: 120 },
    { type: "text", name: "title", label: "Title", labelAr: "المسمى", localized: true, max: 120 },
    { type: "text", name: "practice", label: "Practice focus", labelAr: "مجال التخصص", localized: true, max: 160 },
    { type: "textarea", name: "bioShort", label: "Short bio", labelAr: "نبذة مختصرة", localized: true, rows: 3, max: 600 },
    { type: "textarea", name: "bioFull", label: "Full bio", labelAr: "السيرة الكاملة", localized: true, rows: 6, max: 4000 },
    { type: "image", name: "portrait", label: "Portrait (with alt text)", labelAr: "الصورة الشخصية" },
    { type: "textarea", name: "education", label: "Education", labelAr: "التعليم", localized: true, rows: 2, max: 600 },
    { type: "text", name: "languages", label: "Languages", labelAr: "اللغات", localized: true, max: 200 },
    { type: "textarea", name: "admission", label: "Bar / admission (verified only)", labelAr: "القيد بالنقابة (الموثق فقط)", localized: true, rows: 2, max: 600 },
    { type: "checkbox", name: "published", label: "Published" },
  ],
  insights: [
    { type: "text", name: "title", label: "Title", labelAr: "العنوان", localized: true, required: true, max: 200 },
    { type: "slug", name: "slug", label: "Slug (address)", help: "Shared by both languages. Lower-case Latin words joined by hyphens." },
    { type: "textarea", name: "excerpt", label: "Excerpt", labelAr: "المقتطف", localized: true, rows: 3, max: 600, required: true },
    {
      type: "textarea",
      name: "body",
      label: "Body",
      labelAr: "نص المقال",
      localized: true,
      rows: 18,
      max: 40000,
      help: "Blank line between paragraphs. Start a paragraph with “## ” for a heading, “> ” for a quotation, or “- ” on each line for a list.",
    },
    { type: "text", name: "author", label: "Author", labelAr: "الكاتب", localized: true, max: 120 },
    { type: "image", name: "cover", label: "Cover image", labelAr: "صورة الغلاف" },
    { type: "text", name: "category", label: "Category", labelAr: "التصنيف", localized: true, required: true, max: 60 },
    { type: "date", name: "publishedOn", label: "Publication date", help: "Leave empty to show the publication-date placeholder." },
    { type: "text", name: "readingTime", label: "Reading time", labelAr: "مدة القراءة", localized: true, max: 30, placeholder: "6 min read" },
    { type: "text", name: "seoTitle", label: "SEO title", labelAr: "عنوان محركات البحث", localized: true, max: 120 },
    { type: "textarea", name: "seoDescription", label: "SEO description", labelAr: "وصف محركات البحث", localized: true, rows: 2, max: 300 },
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { value: "draft", label: "Draft — not public" },
        { value: "review", label: "In review — not public" },
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

/** Every localized leaf value in a form, for completeness indicators. */
export function localizedValues(fields: Field[], data: Record<string, unknown>): { label: string; en: boolean; ar: boolean }[] {
  const out: { label: string; en: boolean; ar: boolean }[] = [];
  const has = (v: unknown) => (Array.isArray(v) ? v.some((s) => typeof s === "string" && s.trim()) : typeof v === "string" && v.trim() !== "");
  const walk = (fs: Field[], d: Record<string, unknown>, prefix: string) => {
    for (const f of fs) {
      const v = d?.[f.name];
      const name = prefix ? `${prefix} › ${f.label}` : f.label;
      if ((f.type === "text" || f.type === "textarea" || f.type === "headline" || f.type === "lines") && f.localized) {
        const o = (v ?? {}) as { en?: unknown; ar?: unknown };
        out.push({ label: name, en: has(o.en), ar: has(o.ar) });
      } else if (f.type === "link") {
        const o = ((v as { text?: { en?: unknown; ar?: unknown } })?.text ?? {}) as { en?: unknown; ar?: unknown };
        out.push({ label: name, en: has(o.en), ar: has(o.ar) });
      } else if (f.type === "group") {
        walk(f.fields, (v ?? {}) as Record<string, unknown>, name);
      } else if (f.type === "list" && Array.isArray(v)) {
        v.forEach((item, i) => walk(f.fields, item as Record<string, unknown>, `${name} ${i + 1}`));
      }
    }
  };
  walk(fields, data, "");
  return out;
}

/**
 * Translation completeness: a language is complete when every localized
 * field filled in either language is filled in it too, and it has not been
 * flagged as needing review.
 */
export function completeness(
  fields: Field[],
  data: Record<string, unknown>,
  flags?: Partial<Record<"ar" | "en", string>>,
): Record<"ar" | "en", { missing: number; needsReview: boolean; complete: boolean }> {
  const vals = localizedValues(fields, data).filter((v) => v.en || v.ar);
  const result = (lang: "ar" | "en") => {
    const missing = vals.filter((v) => !v[lang]).length;
    const needsReview = flags?.[lang] === "needs_review";
    return { missing, needsReview, complete: missing === 0 && !needsReview };
  };
  return { ar: result("ar"), en: result("en") };
}
