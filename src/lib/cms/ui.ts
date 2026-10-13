/**
 * Interface text: every visible word that is not page content — buttons,
 * labels, form messages, accessibility labels, the 404 page. Editable in
 * Admin → Interface text; these are the defaults and the fallback.
 *
 * Grouped for the admin. `{n}` and similar tokens are replaced at runtime.
 */
import type { L } from "@/lib/i18n";

type Entry = { en: string; ar: string; note: string };

const g = <T extends Record<string, Entry>>(entries: T) => entries;

export const uiGroups = {
  "Navigation & page frame": g({
    skipToContent: { en: "Skip to content", ar: "انتقل إلى المحتوى", note: "Keyboard skip link" },
    navPrimary: { en: "Primary", ar: "القائمة الرئيسية", note: "Screen-reader name of the main navigation" },
    navHome: { en: "{name} — home", ar: "{name} — الصفحة الرئيسية", note: "Screen-reader name of the logo link" },
    menuOpen: { en: "Menu", ar: "القائمة", note: "Mobile menu button" },
    menuClose: { en: "Close", ar: "إغلاق", note: "Mobile menu button (open)" },
    menuCall: { en: "Call", ar: "اتصل", note: "Mobile menu label" },
    menuWrite: { en: "Write", ar: "راسلنا", note: "Mobile menu label" },
    menuVisit: { en: "Visit", ar: "زُرنا", note: "Mobile menu label" },
    languageSwitch: { en: "Choose language", ar: "اختر اللغة", note: "Screen-reader name of the language switcher" },
    scrollCue: { en: "Scroll", ar: "مرّر", note: "Hero scroll cue" },
    plate: { en: "Pl.", ar: "لوحة", note: "Prefix before a plate number in captions" },
  }),
  Footer: g({
    footerNav: { en: "Footer", ar: "تذييل الصفحة", note: "Screen-reader name of the footer navigation" },
    footerFirm: { en: "The Firm", ar: "المكتب", note: "Footer column heading" },
    footerPractice: { en: "Practice", ar: "مجالات الممارسة", note: "Footer column heading" },
    footerContact: { en: "Contact", ar: "تواصل", note: "Footer column heading" },
    backToTop: { en: "Back to top", ar: "العودة إلى الأعلى", note: "Footer button" },
  }),
  "Contact details & form": g({
    phone: { en: "Phone", ar: "الهاتف", note: "Contact detail label" },
    whatsapp: { en: "WhatsApp", ar: "واتساب", note: "Contact detail label" },
    email: { en: "Email", ar: "البريد الإلكتروني", note: "Contact detail label" },
    office: { en: "Office", ar: "المكتب", note: "Contact detail label" },
    hours: { en: "Hours", ar: "مواعيد العمل", note: "Contact detail label" },
    formName: { en: "Name", ar: "الاسم", note: "Form field" },
    formPhone: { en: "Phone number", ar: "رقم الهاتف", note: "Form field" },
    formEmail: { en: "Email", ar: "البريد الإلكتروني", note: "Form field" },
    formOptional: { en: "optional", ar: "اختياري", note: "Marks an optional field" },
    formIssue: { en: "Issue / question", ar: "الموضوع / السؤال", note: "Form field" },
    formSending: { en: "Sending", ar: "جارٍ الإرسال", note: "Submit button while sending" },
    formReceived: { en: "Received", ar: "تم الاستلام", note: "Label above the success message" },
    formAgain: { en: "Send another enquiry", ar: "إرسال استفسار آخر", note: "Button after success" },
    errNameRequired: { en: "Please enter your name.", ar: "يرجى كتابة الاسم.", note: "Validation" },
    errPhoneRequired: { en: "Please enter a phone number.", ar: "يرجى كتابة رقم الهاتف.", note: "Validation" },
    errPhoneInvalid: { en: "Please enter a valid phone number.", ar: "يرجى كتابة رقم هاتف صحيح.", note: "Validation" },
    errEmailInvalid: {
      en: "Please enter a valid email address, or leave it empty.",
      ar: "يرجى كتابة بريد إلكتروني صحيح، أو ترك الحقل فارغاً.",
      note: "Validation",
    },
    errMessageRequired: { en: "Please describe your issue or question.", ar: "يرجى وصف موضوعك أو سؤالك.", note: "Validation" },
    errTooLong: { en: "Your message is too long.", ar: "رسالتك طويلة جداً.", note: "Validation" },
    errRateLimited: {
      en: "Too many enquiries were sent from your connection. Please try again in a few minutes.",
      ar: "أُرسل عدد كبير من الاستفسارات من اتصالك. يرجى المحاولة مرة أخرى بعد بضع دقائق.",
      note: "Error",
    },
    errUnavailable: {
      en: "Online enquiries are temporarily unavailable. Please try again later.",
      ar: "استقبال الاستفسارات عبر الموقع غير متاح مؤقتاً. يرجى المحاولة لاحقاً.",
      note: "Error",
    },
    errGeneric: { en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. يرجى المحاولة مرة أخرى.", note: "Error" },
    errNetwork: {
      en: "We couldn't reach the server. Please check your connection and try again.",
      ar: "تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
      note: "Error",
    },
  }),
  "Practice areas": g({
    practiceArea: { en: "Practice Area", ar: "مجال الممارسة", note: "Label on a practice-area page" },
    overview: { en: "Overview", ar: "نظرة عامة", note: "Practice-area page heading" },
    whatWeHandle: { en: "What we handle", ar: "ما نتولاه", note: "Practice-area page heading" },
    forums: { en: "Forums & authorities", ar: "الجهات والمحاكم", note: "Practice-area page heading" },
    nextPractice: { en: "Next practice area", ar: "مجال الممارسة التالي", note: "Link at the foot of a practice-area page" },
    allPracticeAreas: { en: "All practice areas", ar: "جميع مجالات الممارسة", note: "Screen-reader name of the practice list" },
  }),
  People: g({
    team: { en: "The team", ar: "الفريق", note: "Screen-reader name of the team grid" },
    portraitToFollow: { en: "Portrait to follow", ar: "الصورة لاحقاً", note: "Placeholder portrait" },
    portraitOf: { en: "Portrait of {name}", ar: "صورة {name}", note: "Default portrait alt text" },
    education: { en: "Education", ar: "التعليم", note: "Profile detail" },
    languages: { en: "Languages", ar: "اللغات", note: "Profile detail" },
    admission: { en: "Admission", ar: "القيد بالنقابة", note: "Profile detail" },
    noPeople: { en: "Profiles of the team will be published soon.", ar: "ستُنشر ملفات الفريق قريباً.", note: "Empty state" },
  }),
  Insights: g({
    allInsights: { en: "All insights", ar: "جميع المقالات", note: "Link back to the index" },
    filterLabel: { en: "Filter insights by category", ar: "تصفية المقالات حسب التصنيف", note: "Screen-reader name of the filter" },
    filterAll: { en: "All", ar: "الكل", note: "Filter button" },
    issue: { en: "No.", ar: "رقم", note: "Before an issue number" },
    read: { en: "Read", ar: "اقرأ", note: "Card link" },
    inThisNote: { en: "In this note", ar: "في هذا المقال", note: "Article contents heading" },
    furtherReading: { en: "Further reading", ar: "قراءات أخرى", note: "Heading below an article" },
    publicationDate: { en: "[PUBLICATION DATE]", ar: "[تاريخ النشر]", note: "Shown until a publication date is set" },
    disclaimer: {
      en: "This note is general information about Egyptian law as it stood at the date of publication. It is not legal advice from {name} and should not be relied on for any specific matter.",
      ar: "هذا المقال معلومات عامة عن القانون المصري كما كان في تاريخ النشر. وهو ليس استشارة قانونية من {name} ولا يُعتمد عليه في أي مسألة بعينها.",
      note: "Article disclaimer",
    },
    draftNotice: {
      en: "[DRAFT — PENDING LEGAL REVIEW BY THE FIRM]",
      ar: "[مسودة — بانتظار المراجعة القانونية من المكتب]",
      note: "Shown on articles whose legal review is pending",
    },
    otherLanguageOnly: {
      en: "This article is currently available in Arabic only.",
      ar: "هذا المقال متاح حالياً باللغة الإنجليزية فقط.",
      note: "Shown when an article has not been translated",
    },
    noInsights: { en: "No articles have been published yet.", ar: "لم تُنشر مقالات بعد.", note: "Empty state" },
  }),
  "Page not found": g({
    notFoundCode: { en: "Error 404", ar: "خطأ 404", note: "404 page label" },
    notFoundTitle: { en: "Not on\n*the record.*", ar: "ليست\n*في السجل.*", note: "404 page headline (one line per row)" },
    notFoundText: {
      en: "The page you are looking for has moved, or never existed. Let us take you somewhere useful.",
      ar: "الصفحة التي تبحث عنها نُقلت أو لم تكن موجودة. دعنا نأخذك إلى مكان مفيد.",
      note: "404 page text",
    },
    notFoundHome: { en: "Return home", ar: "العودة إلى الرئيسية", note: "404 page button" },
    notFoundMeta: { en: "Page not found", ar: "الصفحة غير موجودة", note: "404 browser title" },
  }),
} as const;

export type UiKey = { [G in keyof typeof uiGroups]: keyof (typeof uiGroups)[G] }[keyof typeof uiGroups];

export const defaultUi: Record<UiKey, L> = Object.fromEntries(
  Object.values(uiGroups).flatMap((group) => Object.entries(group).map(([k, v]) => [k, { en: v.en, ar: v.ar }])),
) as Record<UiKey, L>;

export const uiKeys = Object.keys(defaultUi) as UiKey[];
