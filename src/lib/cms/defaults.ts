/**
 * The DIWAN source content in the bilingual CMS model. Used to seed the
 * database, to fill Arabic into databases seeded before the bilingual
 * upgrade (never overwriting), and as the public fallback whenever the
 * database is unreachable or not seeded. Must not import image files, so
 * the seed script can load it outside Next.js.
 *
 * Arabic sources: vision, who we are, values and mission are the firm's own
 * Arabic text (docs/sources/introduction-ar.md). Every other Arabic string
 * is a translation of the approved English copy, flagged
 * `needs_review` for the firm. Insight article bodies are NOT translated —
 * they are unreviewed legal content; Arabic visitors are shown the English
 * text with a notice.
 */
import { mission, values, vision, whoWeAre } from "@/content/firm";
import { insights } from "@/content/insights";
import { people } from "@/content/people";
import { practiceAreas } from "@/content/practiceAreas";
import { site } from "@/content/site";
import { L } from "@/lib/i18n";
import { serializeBody } from "./text";
import { defaultUi } from "./ui";
import type {
  FirmValue,
  InsightRecord,
  NavItem,
  PersonRecord,
  PracticeAreaRecord,
  SectionMap,
  SiteSettings,
  TranslationFlags,
} from "./types";

const REVIEW_AR: TranslationFlags = { ar: "needs_review" };

const practiceIntro = L(
  "Companies and investment, civil and real-estate transactions, and personal status — the areas named in the firm's own introduction, with representation before judicial and administrative bodies.",
  "الشركات والاستثمار، والمعاملات المدنية والعقارية، والأحوال الشخصية — المجالات التي يذكرها المكتب في تعريفه بنفسه، إلى جانب التمثيل أمام الجهات القضائية والإدارية.",
);

const teamIntro = L(
  "Counsel and lawyers specialized in branches of the law. Profiles of the team will be published once confirmed by the firm.",
  "مستشارون ومحامون متخصصون في فروع القانون. ستُنشر ملفات أعضاء الفريق بعد تأكيدها من المكتب.",
);

const insightsIntro = L(
  "Sample notes on Egyptian law, pending legal review by the firm. They are general information, not legal advice from DIWAN.",
  "ملاحظات نموذجية حول القانون المصري، بانتظار المراجعة القانونية من المكتب. وهي معلومات عامة، وليست استشارة قانونية من ديوان.",
);

export const defaultSettings: SiteSettings = {
  brandName: L(site.name, "ديوان"),
  wordmark: site.name,
  firmName: L(site.descriptor, site.nameAr),
  city: L(site.city, site.cityAr),
  location: L(site.location, "كفر الشيخ — مصر"),
  browserTitle: L(`${site.name} — ${site.descriptor}, ${site.city}`, `${site.nameAr} — ${site.cityAr}`),
  description: L(
    site.description,
    "ديوان للمحاماه والأستشارات القانونية مكتب مصري للمحاماة والاستشارات القانونية في كفر الشيخ، يعمل في مجالات الشركات والاستثمار، والمعاملات المدنية والعقارية، وقضايا الأحوال الشخصية.",
  ),
  defaultSeoDescription: L(
    site.description,
    "ديوان للمحاماه والأستشارات القانونية مكتب مصري للمحاماة والاستشارات القانونية في كفر الشيخ، يعمل في مجالات الشركات والاستثمار، والمعاملات المدنية والعقارية، وقضايا الأحوال الشخصية.",
  ),
  canonicalUrl: "",
  defaultLanguage: "ar",
  email: site.contact.email,
  phone: site.contact.phone,
  whatsapp: site.contact.whatsapp,
  address: { en: [...site.contact.office], ar: ["[عنوان المكتب]", "كفر الشيخ، مصر"] },
  hours: L(site.contact.hours, "[مواعيد العمل]"),
  social: [],
  footerDescription: L(
    `Law and legal consultancy in ${site.city} — companies and investment, civil and real-estate transactions, and personal status.`,
    "محاماة واستشارات قانونية في كفر الشيخ — الشركات والاستثمار، والمعاملات المدنية والعقارية، والأحوال الشخصية.",
  ),
  copyright: L("All rights reserved.", "جميع الحقوق محفوظة."),
  disclaimer: L(
    "The content of this website is general information and does not constitute legal advice.",
    "محتوى هذا الموقع معلومات عامة ولا يُعد استشارة قانونية.",
  ),
  navCta: { text: L("Let’s talk", "تواصل معنا"), url: "/contact" },
  logo: {},
  favicon: {},
  shareImage: {},
  _translation: REVIEW_AR,
};

export const defaultNavigation: NavItem[] = [
  { label: L("About", "من نحن"), href: "/about", visible: true, sortOrder: 0 },
  { label: L("Practice Areas", "مجالات الممارسة"), href: "/practice-areas", visible: true, sortOrder: 1 },
  { label: L("Our People", "فريقنا"), href: "/people", visible: true, sortOrder: 2 },
  { label: L("Insights", "رؤى قانونية"), href: "/insights", visible: true, sortOrder: 3 },
  { label: L("Contact", "تواصل معنا"), href: "/contact", visible: true, sortOrder: 4 },
];

export const defaultSections: SectionMap = {
  "home.layout": {
    order: ["intro", "practice", "landscape", "values", "experience", "people", "insights"],
    hidden: [],
  },
  "home.hero": {
    eyebrow: L(`${site.descriptor} — ${site.city}`, `للمحاماة والاستشارات القانونية — ${site.cityAr}`),
    // From the firm's vision: "القانون ليس مجرد نصوص جامدة، بل هو حصن الأمان".
    headline: L("More than\nrigid text.\nA *fortress.*", "القانون ليس\nمجرد نصوص جامدة،\nبل هو *حصن الأمان*"),
    supporting: L(
      "Legal counsel for investors, company owners and individuals — in companies and investment, civil and real-estate transactions, and personal status.",
      "استشارات قانونية للمستثمرين وأصحاب الشركات والأفراد — في الشركات والاستثمار، والمعاملات المدنية والعقارية، وقضايا الأحوال الشخصية.",
    ),
    primary: { text: L("Let’s talk", "تواصل معنا"), url: "/contact" },
    secondary: { text: L("Practice areas", "مجالات الممارسة"), url: "/practice-areas" },
    image: { plate: "hero" },
    _translation: REVIEW_AR,
  },
  "home.intro": {
    label: L("The Firm", "المكتب"),
    statement: L(
      "A *fortress* that protects the rights of individuals and supports the growth of companies.",
      `*${vision.statementAr.split(" ").slice(0, 2).join(" ")}* ${vision.statementAr.split(" ").slice(2).join(" ")}`,
    ),
    body: L(whoWeAre.en.join("\n\n"), whoWeAre.ar),
    image: { plate: "hallAislePortrait" },
    cta: { text: L("About the firm", "عن المكتب"), url: "/about" },
  },
  "home.practice": {
    label: L("Practice Areas", "مجالات الممارسة"),
    title: L("Practice\nAreas", "مجالات\nالممارسة"),
    intro: practiceIntro,
    note: L("Each practice links to a detailed overview of scope and forums.", "يقود كل مجال إلى عرض مفصل لنطاق العمل والجهات المختصة."),
    cta: { text: L("All practice areas", "جميع مجالات الممارسة"), url: "/practice-areas" },
    _translation: REVIEW_AR,
  },
  "home.landscape": {
    label: L("The Egyptian legal landscape", "المشهد القانوني المصري"),
    frames: [
      { text: L("Egyptian law is not\nsimply a collection\n*of statutes.*", "القانون المصري ليس\nمجرد مجموعة\n*من النصوص.*") },
      {
        text: L(
          "It is a living framework,\nshaped by courts, regulation,\ncommerce — and the realities\n*of the market.*",
          "إنه إطار حيّ،\nتشكّله المحاكم والتنظيم\nوالتجارة — وحقائق\n*السوق.*",
        ),
      },
      { text: L("Good counsel reads\n*all three at once.*", "والمشورة الجيدة تقرأ\n*الثلاثة معاً.*") },
    ],
    // VERIFY: general statements about Egyptian courts and regulators.
    pillars: [
      {
        title: L("Courts", "المحاكم"),
        text: L(
          "From courts of first instance to the Court of Cassation, with specialized Economic, Family and administrative courts alongside.",
          "من محاكم أول درجة إلى محكمة النقض، وإلى جانبها المحاكم المتخصصة: المحاكم الاقتصادية ومحاكم الأسرة والقضاء الإداري.",
        ),
      },
      {
        title: L("Regulators", "الجهات التنظيمية"),
        text: L(
          "Investment, financial, banking and sector authorities whose decisions shape what a business may do — and when.",
          "هيئات الاستثمار والرقابة المالية والمصرفية والقطاعية التي تحدد قراراتها ما يجوز للنشاط التجاري — ومتى.",
        ),
      },
      {
        title: L("Markets", "الأسواق"),
        text: L(
          "The commercial customs, negotiating habits and market realities that no statute records but every dispute reveals.",
          "الأعراف التجارية وعادات التفاوض وحقائق السوق التي لا يدوّنها نص، لكن يكشفها كل نزاع.",
        ),
      },
    ],
    image: { plate: "hallAisle" },
    _translation: REVIEW_AR,
  },
  "home.values": {
    label: L(values.labelEn, values.labelAr),
    title: L("Why clients\n*choose us.*", "لماذا يختارنا\n*عملاؤنا؟*"),
    intro: L("Four core values the firm sets out as the basis of its work.", "أربع قيم أساسية يضعها المكتب أساساً لعمله."),
    image: { plate: "colonnadeDetail" },
  },
  "home.experience": {
    label: L("Experience", "الخبرة"),
    title: L("The practice,\n*in four movements.*", "الممارسة\n*في أربعة محاور.*"),
    intro: L(
      "Not a list of figures — a map of where the work sits, where it is decided and how it is carried through.",
      "ليست قائمة أرقام — بل خريطة لمواضع العمل، وأين يُفصل فيه، وكيف يُنجز.",
    ),
    hint: L("Scroll to continue", "مرّر للمتابعة"),
    image: { plate: "hallRows" },
    // Source: the firm's introduction document (areas, mission, values).
    movements: [
      {
        number: "01",
        label: L("Practice areas", "مجالات الممارسة"),
        title: L("The areas the firm names as its own.", "المجالات التي يحددها المكتب لنفسه."),
        text: L(
          "Companies and investment, civil and real-estate transactions, and personal status cases — with representation running through all of them.",
          "الشركات والاستثمار، والمعاملات المدنية والعقارية، وقضايا الأحوال الشخصية — والتمثيل القانوني حاضر فيها جميعاً.",
        ),
        items: { en: [], ar: [] },
        autoPracticeAreas: true,
      },
      {
        number: "02",
        label: L("Forums", "الجهات"),
        title: L("Before judicial and administrative bodies.", "أمام الجهات القضائية والإدارية."),
        text: L(
          "The firm's mission commits it to the faithful defence of rights before all judicial and administrative bodies.",
          "تُلزم رسالة المكتب بالدفاع المخلص عن الحقوق أمام كافة الجهات القضائية والإدارية.",
        ),
        // VERIFY: named courts.
        items: {
          en: ["Judicial bodies", "Administrative bodies", "Civil Courts", "Family Courts"],
          ar: ["الجهات القضائية", "الجهات الإدارية", "المحاكم المدنية", "محاكم الأسرة"],
        },
        autoPracticeAreas: false,
      },
      {
        number: "03",
        label: L("Clients", "العملاء"),
        title: L("For investors, company owners and citizens.", "للمستثمرين وأصحاب الشركات والمواطنين."),
        text: L(
          "The mission names those the firm serves: everyone seeking legal security in Egypt.",
          "تسمّي الرسالة من يخدمهم المكتب: كل من يبحث عن الأمان القانوني في مصر.",
        ),
        items: { en: ["Investors", "Company owners", "Citizens"], ar: ["المستثمرون", "أصحاب الشركات", "المواطنون"] },
        autoPracticeAreas: false,
      },
      {
        number: "04",
        label: L("Approach", "المنهج"),
        title: L("Simpler procedures. Clearer advice.", "إجراءات أبسط. ومشورة أوضح."),
        text: L(
          "Simplifying procedures, offering clear advice and faithfully defending rights — completed efficiently, with the client kept informed.",
          "تبسيط الإجراءات، وتقديم استشارات واضحة، والدفاع المخلص عن الحقوق — بكفاءة، مع إبقاء العميل على اطلاع دائم.",
        ),
        items: {
          en: ["Simplify procedures", "Clear advice", "Company formation", "Contract drafting", "Administrative procedures", "Defence of rights"],
          ar: ["تبسيط الإجراءات", "استشارات واضحة", "تأسيس الشركات", "صياغة العقود", "الإجراءات الإدارية", "الدفاع عن الحقوق"],
        },
        autoPracticeAreas: false,
      },
    ],
    _translation: REVIEW_AR,
  },
  "home.people": {
    label: L("Our People", "فريقنا"),
    title: L("Our counsel\n*and lawyers.*", "مستشارونا\n*ومحامونا.*"),
    intro: teamIntro,
    cta: { text: L("Meet the team", "تعرّف على الفريق"), url: "/people" },
    selected: [],
    _translation: REVIEW_AR,
  },
  "home.insights": {
    label: L("Insights", "رؤى قانونية"),
    title: L("Notes on\n*Egyptian law.*", "ملاحظات حول\n*القانون المصري.*"),
    intro: insightsIntro,
    cta: { text: L("All insights", "جميع المقالات"), url: "/insights" },
    selected: [],
    _translation: REVIEW_AR,
  },
  "home.contact": {
    label: L("Contact", "تواصل معنا"),
    title: L("Let’s talk about\n*what comes next.*", "لنتحدث عن\n*الخطوة التالية.*"),
    description: L("", ""),
    submitText: L("Send enquiry", "إرسال الاستفسار"),
    notice: L(
      "Submitting this form does not create a lawyer–client relationship. Please do not send confidential information until one exists.",
      "إرسال هذا النموذج لا يُنشئ علاقة بين محامٍ وموكّل. يرجى عدم إرسال معلومات سرية قبل نشوء هذه العلاقة.",
    ),
    successTitle: L("Thank you. We will be in touch shortly.", "شكراً لك. سنتواصل معك قريباً."),
    successText: L(
      "A member of the team will review your enquiry and respond by phone or email.",
      "سيراجع أحد أعضاء الفريق استفسارك ويرد عليك هاتفياً أو عبر البريد الإلكتروني.",
    ),
    image: { plate: "mashrabiya" },
    _translation: REVIEW_AR,
  },
  "about.blocks": {
    blocks: [
      {
        id: "vision",
        layout: "header",
        enabled: true,
        label: L(vision.labelEn, vision.labelAr),
        title: L("More than\n*rigid text.*", "أكثر من\n*نصوص جامدة.*"),
        body: L(vision.en, vision.ar),
        image: { plate: "hallRows", position: "88% 62%" },
      },
      {
        id: "who",
        layout: "story",
        enabled: true,
        label: L(whoWeAre.labelEn, whoWeAre.labelAr),
        title: L("An Egyptian firm\n*of counsel and lawyers.*", "مؤسسة قانونية مصرية\n*من المستشارين والمحامين.*"),
        body: L(whoWeAre.en.join("\n\n"), whoWeAre.ar),
        image: { plate: "colonnade", position: "72% 40%" },
      },
      {
        id: "values",
        layout: "values",
        enabled: true,
        label: L(values.labelEn, values.labelAr),
        title: L("Why clients\n*choose us.*", `لماذا يختارنا\n*عملاؤنا؟*`),
        body: L("Four core values the firm sets out as the basis of its work.", "أربع قيم أساسية يضعها المكتب أساساً لعمله."),
        image: { plate: "colonnadeDetail" },
      },
      {
        id: "mission",
        layout: "statement",
        enabled: true,
        label: L(mission.labelEn, mission.labelAr),
        title: L("A trusted\n*legal partner.*", "شريك قانوني\n*موثوق.*"),
        body: L(mission.en, mission.ar),
        image: { plate: "hallAisle" },
      },
    ],
    _translation: REVIEW_AR,
  },
  "practice.index": {
    label: L("Practice Areas", "مجالات الممارسة"),
    title: L("Practice\nAreas", "مجالات\nالممارسة"),
    intro: practiceIntro,
    image: { plate: "colonnade", position: "50% 40%" },
    _translation: REVIEW_AR,
  },
  "people.index": {
    label: L("Our People", "فريقنا"),
    title: L("Our\nPeople", "فريقنا"),
    intro: teamIntro,
    image: {},
    _translation: REVIEW_AR,
  },
  "insights.index": {
    label: L("Insights", "رؤى قانونية"),
    title: L("Insights", "رؤى قانونية"),
    intro: insightsIntro,
    image: {},
    _translation: REVIEW_AR,
  },
  "contact.page": {
    label: L("What happens next", "ماذا بعد"),
    title: L("What you\n*can expect.*", "ما الذي\n*يمكنك توقّعه.*"),
    // Source: the firm's values and mission (introduction document).
    steps: [
      {
        title: L("In confidence", "بسرية تامة"),
        text: L(
          "Your privacy, your data and your case are treated with absolute confidentiality from the first message.",
          "تُعامل خصوصيتك وبياناتك وقضيتك بسرية مطلقة منذ الرسالة الأولى.",
        ),
      },
      {
        title: L("Clear advice", "مشورة واضحة"),
        text: L(
          "A clear view of your legal position and the procedures ahead, set out simply.",
          "رؤية واضحة لموقفك القانوني وللإجراءات المقبلة، مقدّمة ببساطة.",
        ),
      },
      {
        title: L("Kept informed", "على اطلاع دائم"),
        text: L(
          "You are kept up to date with every development in your case and its legal position, through direct and digital channels.",
          "نبقيك على اطلاع بكل مستجدات قضيتك وموقفها القانوني، عبر قنواتنا المباشرة والرقمية.",
        ),
      },
    ],
    _translation: REVIEW_AR,
  },
  "seo.pages": {
    home: {
      title: L(`${site.name} — ${site.descriptor}, ${site.city}`, `${site.nameAr} — ${site.cityAr}`),
      description: L(
        site.description,
        "ديوان للمحاماه والأستشارات القانونية مكتب مصري للمحاماة والاستشارات القانونية في كفر الشيخ، يعمل في مجالات الشركات والاستثمار، والمعاملات المدنية والعقارية، وقضايا الأحوال الشخصية.",
      ),
    },
    about: {
      title: L("About the Firm", "عن المكتب"),
      description: L(
        "DIWAN — ديوان للمحاماه والأستشارات القانونية — law and legal consultancy in Kafr el Sheikh: our vision, who we are, our values and our mission.",
        "ديوان للمحاماه والأستشارات القانونية في كفر الشيخ: رؤيتنا، ومن نحن، وقيمنا الأساسية، ورسالتنا.",
      ),
    },
    practice: {
      title: L("Practice Areas", "مجالات الممارسة"),
      description: L(
        "Companies and investment, civil and real-estate transactions, personal status, and representation before judicial and administrative bodies — DIWAN, Kafr el Sheikh.",
        "الشركات والاستثمار، والمعاملات المدنية والعقارية، والأحوال الشخصية، والتمثيل أمام الجهات القضائية والإدارية — ديوان، كفر الشيخ.",
      ),
    },
    people: {
      title: L("Our People", "فريقنا"),
      description: L("The counsel and lawyers of DIWAN — team profiles to follow.", "مستشارو ومحامو ديوان — ملفات الفريق قريباً."),
    },
    insights: {
      title: L("Insights", "رؤى قانونية"),
      description: L(
        "Commentary on Egyptian legislation, regulation and the practice of the courts.",
        "تعليقات على التشريعات واللوائح المصرية وأحكام المحاكم.",
      ),
    },
    contact: {
      title: L("Contact", "تواصل معنا"),
      description: L("Contact DIWAN — law and legal consultancy in Kafr el Sheikh.", "تواصل مع ديوان — محاماة واستشارات قانونية في كفر الشيخ."),
    },
    _translation: REVIEW_AR,
  },
  "ui.strings": { strings: defaultUi, _translation: REVIEW_AR },
};

export const defaultValues: FirmValue[] = values.items.map((v, i) => ({
  title: L(v.titleEn, v.titleAr),
  body: L(v.textEn, v.textAr),
  published: true,
  sortOrder: i,
  translations: {},
}));

/** Arabic for the six confirmed practice areas (translation of the English copy). */
const practiceAr: Record<string, { title: string; summary: string; overview: string; scope: string[]; forums: string[] }> = {
  "corporate-commercial": {
    title: "الشركات والعقود",
    summary: "تأسيس الشركات، وصياغة العقود، والإجراءات الإدارية التي يعتمد عليها نمو الأعمال.",
    overview:
      "الشركات هي أول مجال يذكره المكتب في تعريفه بنفسه. ويشمل العمل تأسيس الشركات، وصياغة العقود التي يقوم عليها النشاط، وإنهاء الإجراءات الإدارية اللاحقة — بكفاءة وسرعة، كما تنص قيم المكتب.",
    scope: ["تأسيس الشركات", "صياغة العقود ومراجعتها", "إنهاء الإجراءات الإدارية", "الاستشارات القانونية لأصحاب الشركات"],
    forums: ["السجل التجاري", "الهيئة العامة للاستثمار والمناطق الحرة"],
  },
  "investment-business-setup": {
    title: "الاستثمار وتأسيس الأعمال",
    summary: "دعم قانوني للمستثمرين في تأسيس أعمالهم وتنميتها في مصر.",
    overview:
      "يأتي الاستثمار إلى جانب الشركات في تعريف المكتب، وتذكر رسالته المستثمرين ضمن من يخدمهم. ويشمل العمل تأسيس النشاط، والإجراءات المصاحبة له، وتقديم مشورة واضحة حول الموقف القانوني للمستثمر.",
    scope: ["تأسيس نشاط أو استثمار جديد", "تأسيس الشركات والإجراءات المرتبطة بها", "مشورة واضحة حول الإطار القانوني للمستثمرين", "العقود الداعمة للاستثمار"],
    forums: ["الهيئة العامة للاستثمار والمناطق الحرة"],
  },
  "civil-transactions": {
    title: "المعاملات المدنية",
    summary: "العقود والالتزامات المدنية بين الأفراد والشركات، والنزاعات الناشئة عنها.",
    overview:
      "المعاملات المدنية من المجالات الأساسية التي يذكرها المكتب في تعريفه. ويشمل العمل عقود الحياة المدنية اليومية والتزاماتها، والدفاع عن الحقوق عند المنازعة فيها.",
    scope: ["صياغة العقود المدنية ومراجعتها", "الاستشارات في الحقوق والالتزامات المدنية", "الدعاوى المدنية والتمثيل أمام المحاكم"],
    forums: ["المحاكم المدنية"],
  },
  "real-estate": {
    title: "المعاملات العقارية",
    summary: "بيع العقارات وشراؤها وتوثيقها، وحماية الملكية عند المنازعة فيها.",
    overview:
      "المعاملات العقارية من المجالات التي يذكرها المكتب في تعريفه. ويشمل العمل بيع العقارات وشراءها وتوثيقها، والدفاع عن حقوق المالك عند المنازعة في الملكية.",
    scope: ["عقود البيع والشراء", "فحص الملكية قبل التعامل", "توثيق العقارات وتسجيلها", "المنازعات العقارية"],
    forums: ["مصلحة الشهر العقاري والتوثيق", "المحاكم المدنية"],
  },
  "family-personal-status": {
    title: "الأحوال الشخصية",
    summary: "قضايا الزواج والطلاق والحضانة والنفقة والمواريث، بسرية تامة.",
    overview:
      "قضايا الأحوال الشخصية من المجالات التي يذكرها المكتب في تعريفه. وهي تمس أكثر جوانب حياة العميل خصوصية، ولذلك تُتولى بالسرية المطلقة التي يضعها المكتب قيمة أساسية.",
    scope: ["الزواج والطلاق", "الحضانة والرؤية", "النفقة", "المواريث"],
    forums: ["محاكم الأسرة"],
  },
  "litigation-dispute-resolution": {
    title: "التقاضي والتمثيل",
    summary: "الدفاع المخلص عن حقوق العملاء أمام الجهات القضائية والإدارية.",
    overview:
      "تُلزم رسالة المكتب بالدفاع المخلص عن الحقوق أمام كافة الجهات القضائية والإدارية. ويمتد التمثيل عبر كل المجالات السابقة — من الدعاوى المدنية والعقارية إلى قضايا الأحوال الشخصية — مع إبقاء العميل على اطلاع في كل مرحلة.",
    scope: ["التمثيل أمام المحاكم", "التمثيل أمام الجهات الإدارية", "متابعة القضايا وإبلاغ العميل بكل مستجد"],
    forums: ["المحاكم المدنية", "محاكم الأسرة", "الجهات الإدارية"],
  },
};

export const defaultPracticeAreas: PracticeAreaRecord[] = practiceAreas.map((a, i) => {
  const ar = practiceAr[a.slug];
  return {
    slug: a.slug,
    title: L(a.title, ar?.title ?? a.titleAr ?? ""),
    summary: L(a.summary, ar?.summary ?? ""),
    overview: L(a.overview, ar?.overview ?? ""),
    scope: { en: [...a.scope], ar: ar?.scope ?? [] },
    forums: { en: [...a.forums], ar: ar?.forums ?? [] },
    image: { plate: a.plate, position: a.focus },
    seoTitle: L("", ""),
    seoDescription: L("", ""),
    published: true,
    sortOrder: i,
    sources: [...a.sources],
    verify: [...a.verify],
    translations: REVIEW_AR,
  };
});

export const defaultPeople: PersonRecord[] = people.map((p, i) => ({
  id: `default-${p.id}`,
  name: L(p.name, "[اسم المحامي]"),
  title: L(p.role, "[المسمى الوظيفي]"),
  practice: L(p.practice, "[مجال الممارسة]"),
  bioShort: L(p.bio, "[نبذة مختصرة]"),
  bioFull: L("", ""),
  portrait: {},
  education: L("", ""),
  languages: L("", ""),
  admission: L("", ""),
  published: true,
  sortOrder: i,
  translations: {},
}));

export const insightCategoryAr: Record<string, string> = {
  "Legal Updates": "مستجدات قانونية",
  "Egyptian Law": "القانون المصري",
  "Case Analysis": "تحليل القضايا",
  "Regulatory Changes": "تغييرات تنظيمية",
  "Business & Investment": "الأعمال والاستثمار",
  "Legal Guides": "أدلة قانونية",
};

/** Arabic titles and excerpts only — article bodies await the firm's own Arabic text. */
const insightAr: Record<string, { title: string; excerpt: string }> = {
  "economic-courts-and-the-commercial-dispute": {
    title: "المحاكم الاقتصادية والنزاع التجاري",
    excerpt: "لماذا أصبحت محكمة متخصصة أُنشئت عام 2008 في قلب كثير من نزاعات الأعمال في مصر — وما يعنيه ذلك لطريقة إعداد القضية.",
  },
  "buying-property-where-title-is-not-registered": {
    title: "شراء عقار غير مسجل الملكية",
    excerpt: "نسبة كبيرة من العقارات في مصر تنتقل دون ملكية مسجلة. دليل لما يعنيه ذلك للمشتري، وكيف يقلل المخاطر.",
  },
  "personal-data-in-egypt-law-151-of-2020": {
    title: "البيانات الشخصية في مصر: ما يطلبه القانون رقم 151 لسنة 2020 من الشركات",
    excerpt:
      "ينقل قانون حماية البيانات الشخصية المصري التعامل مع البيانات من شأن تقني إلى شأن قانوني. الالتزامات التي ينبغي لكل نشاط يعتمد على البيانات أن يحددها.",
  },
  "anatomy-of-a-commercial-dispute": {
    title: "تشريح نزاع تجاري، من الإنذار إلى التنفيذ",
    excerpt: "جولة توضيحية في نزاع توريد في مصر — القرارات التي تحدد النتيجة، واللحظات التي تُكسب فيها القضايا أو تُخسر بهدوء.",
  },
  "choosing-a-corporate-vehicle-in-egypt": {
    title: "اختيار الشكل القانوني للشركة في مصر",
    excerpt: "شركة ذات مسؤولية محدودة، أو شركة مساهمة، أو شركة الشخص الواحد: قرار يحدد الحوكمة والتمويل والتخارج لسنوات قادمة.",
  },
  "employment-documentation-under-the-new-labor-law": {
    title: "مراجعة مستندات التوظيف في ظل قانون العمل الجديد",
    excerpt: "حلّ قانون العمل المصري الجديد محل إطار حكم التوظيف في القطاع الخاص لأكثر من عقدين. من أين يبدأ أصحاب العمل.",
  },
};

const readingTimeAr = (en: string) => {
  const n = en.match(/\d+/)?.[0];
  return n ? `${n} دقائق قراءة` : "";
};

export const defaultInsights: InsightRecord[] = insights.map((n, i) => ({
  slug: n.slug,
  title: L(n.title, insightAr[n.slug]?.title ?? ""),
  excerpt: L(n.standfirst, insightAr[n.slug]?.excerpt ?? ""),
  body: L(serializeBody(n.body), ""),
  author: L("", ""),
  cover: { plate: n.plate },
  category: L(n.category, insightCategoryAr[n.category] ?? ""),
  publishedOn: n.date,
  readingTime: L(n.readingTime, readingTimeAr(n.readingTime)),
  seoTitle: L("", ""),
  seoDescription: L("", ""),
  // Published as before, still flagged as pending legal review.
  status: "published",
  legalReview: n.reviewed ? "approved" : "pending",
  verify: [...n.verify],
  sortOrder: i,
  translations: REVIEW_AR,
}));

export const defaultInsightCategories = Object.keys(insightCategoryAr).map((en) => L(en, insightCategoryAr[en]));
