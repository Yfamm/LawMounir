import type { PlateKey } from "./plates";
import type { SourceId } from "./sources";

export type PracticeArea = {
  slug: string;
  title: string;
  /** Arabic name, where the source gives one. */
  titleAr?: string;
  summary: string;
  overview: string;
  scope: string[];
  forums: string[];
  /** Architectural plate used for this area's imagery. */
  plate: PlateKey;
  /** Background/object position used to frame that plate. */
  focus: string;
  /** "confirmed" = named in the supplied sources; "pending" = not shown on the site. */
  status: "confirmed" | "pending";
  sources: SourceId[];
  /** Statements in this entry that the firm must confirm. */
  verify: string[];
};

const FORUMS_VERIFY = "Forums/authorities listed are general statements about the Egyptian system — confirm they reflect where the firm acts.";

/**
 * Practice areas published on the site. Each is supported by the firm's
 * introduction document (docs/sources/introduction-ar.md):
 * - "الشركات والاستثمار" → Companies & Contracts, Investment
 * - "المعاملات المدنية والعقارية" → Civil Transactions, Real Estate
 * - "قضايا الأحوال الشخصية" → Personal Status
 * - Mission: "الدفاع المخلص عن الحقوق أمام كافة الجهات القضائية والإدارية" → Litigation & Representation
 * - Value IV: "إنهاء الإجراءات الإدارية، تأسيس الشركات، وصياغة العقود"
 * Counts on the site follow this list.
 */
export const practiceAreas: PracticeArea[] = [
  {
    slug: "corporate-commercial",
    title: "Companies & Contracts",
    titleAr: "الشركات",
    summary: "Company formation, contract drafting and the administrative procedures a growing business depends on.",
    overview:
      "Companies are the first area named in the firm's introduction. The work covers forming companies, drafting the contracts that hold a business together, and completing the administrative procedures that follow — efficiently and promptly, as the firm's values set out.",
    scope: [
      "Company formation",
      "Drafting and reviewing contracts",
      "Completing administrative procedures",
      "Legal advice to company owners",
    ],
    forums: ["Commercial Registry", "General Authority for Investment and Free Zones"],
    plate: "colonnade",
    focus: "62% 45%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY],
  },
  {
    slug: "investment-business-setup",
    title: "Investment & Business Setup",
    titleAr: "الاستثمار",
    summary: "Legal support for investors establishing and growing a business in Egypt.",
    overview:
      "Investment sits alongside companies in the firm's introduction, and its mission names investors among the clients it serves. The work covers setting up a business, the procedures that come with it, and clear advice on the investor's legal position.",
    scope: [
      "Setting up a new business or investment",
      "Company setup and related procedures",
      "Clear advice on the legal framework for investors",
      "Contracts supporting the investment",
    ],
    forums: ["General Authority for Investment and Free Zones"],
    plate: "hallAisle",
    focus: "28% 72%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY],
  },
  {
    slug: "civil-transactions",
    title: "Civil Transactions",
    titleAr: "المعاملات المدنية",
    summary: "Civil contracts and obligations between individuals and businesses, and the disputes that arise from them.",
    overview:
      "Civil transactions are named in the firm's introduction as a core area. The work covers the contracts and obligations of everyday civil life, and the defence of rights when they are contested.",
    scope: [
      "Drafting and reviewing civil contracts",
      "Advice on civil rights and obligations",
      "Civil claims and representation before the courts",
    ],
    forums: ["Civil Courts"],
    plate: "hallRows",
    focus: "40% 55%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY],
  },
  {
    slug: "real-estate",
    title: "Real Estate Transactions",
    titleAr: "المعاملات العقارية",
    summary: "Buying, selling and documenting property, and protecting title when it is contested.",
    overview:
      "Real-estate transactions are named in the firm's introduction. The work covers the sale, purchase and documentation of property, and the defence of the owner's rights when title is contested.",
    scope: [
      "Sale and purchase contracts",
      "Review of title before a transaction",
      "Documentation and registration of property",
      "Real-estate disputes",
    ],
    forums: ["Real Estate Publicity Department", "Civil Courts"],
    plate: "colonnade",
    focus: "30% 75%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY, "Scope items are a general description of real-estate transaction work — confirm."],
  },
  {
    slug: "family-personal-status",
    title: "Personal Status",
    titleAr: "قضايا الأحوال الشخصية",
    summary: "Marriage, divorce, custody, maintenance and inheritance cases, handled in confidence.",
    overview:
      "Personal status cases are named in the firm's introduction. They concern the most private parts of a client's life, and are handled with the absolute confidentiality the firm sets as a core value.",
    scope: ["Marriage and divorce", "Custody and visitation", "Alimony and maintenance", "Inheritance"],
    forums: ["Family Courts"],
    plate: "hallAislePortrait",
    focus: "50% 62%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY, "Scope items are the usual heads of personal status work — confirm."],
  },
  {
    slug: "litigation-dispute-resolution",
    title: "Litigation & Representation",
    titleAr: "التقاضي والتمثيل",
    summary: "Faithful defence of clients' rights before judicial and administrative bodies.",
    overview:
      "The firm's mission commits it to the faithful defence of rights before all judicial and administrative bodies. Representation runs through each of the areas above — from civil and real-estate claims to personal status cases — with the client kept informed at every stage.",
    scope: [
      "Representation before the courts",
      "Representation before administrative bodies",
      "Following cases and reporting each development to the client",
    ],
    forums: ["Civil Courts", "Family Courts", "Administrative bodies"],
    plate: "colonnadeDetail",
    focus: "50% 35%",
    status: "confirmed",
    sources: ["introDoc"],
    verify: [FORUMS_VERIFY],
  },
];

/**
 * VERIFY — pending confirmation. These areas existed in the prototype but are
 * NOT named in the supplied sources. They are not rendered anywhere and have
 * no routes. Move an entry into `practiceAreas` (status "confirmed", with
 * sources) only once the firm confirms it offers the service, and review its
 * wording first.
 */
export const pendingPracticeAreas: PracticeArea[] = [
  {
    slug: "criminal-law",
    title: "Criminal Law",
    summary: "Defense and advisory work in white-collar, financial and general criminal matters.",
    overview:
      "Criminal exposure moves quickly and carries personal consequences. We advise individuals and companies from the first summons, through investigation by the Public Prosecution, to trial and appeal — with particular attention to financial and corporate offenses.",
    scope: [
      "White-collar and financial crime",
      "Representation during Public Prosecution investigations",
      "Criminal trials and appeals",
      "Corporate criminal exposure and internal investigations",
      "Cheque and breach-of-trust cases",
    ],
    forums: ["Public Prosecution", "Misdemeanor & Felony Courts", "Economic Courts"],
    plate: "hallRows",
    focus: "40% 55%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "banking-finance",
    title: "Banking & Finance",
    summary: "Lending, security, restructuring and the regulatory perimeter of Egyptian finance.",
    overview:
      "We act for borrowers, lenders and non-bank financial institutions on financing transactions and the regulatory questions around them, within the frameworks administered by the Central Bank of Egypt and the Financial Regulatory Authority.",
    scope: [
      "Corporate and syndicated lending",
      "Security packages and movable collateral",
      "Non-bank financial services, including leasing and factoring",
      "Debt restructuring and recovery",
      "Regulatory licensing and compliance",
    ],
    forums: ["Central Bank of Egypt", "Financial Regulatory Authority", "Economic Courts"],
    plate: "hallAisle",
    focus: "55% 30%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "tax-customs",
    title: "Tax & Customs",
    summary: "Structuring, audits and disputes, and customs valuation and classification matters.",
    overview:
      "Tax and customs positions are often decided long before a dispute begins. We advise on structuring and compliance, represent clients during audits and before appeal committees, and resolve customs valuation and classification disputes.",
    scope: [
      "Corporate income tax and VAT advisory",
      "Tax audits, objections and appeal committees",
      "Tax litigation",
      "Customs valuation, classification and clearance",
      "Tax structuring of transactions",
    ],
    forums: ["Egyptian Tax Authority", "Egyptian Customs Authority", "Appeal committees"],
    plate: "mashrabiya",
    focus: "62% 50%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "labor-employment",
    title: "Labor & Employment",
    summary: "Employment contracts, workforce restructuring, social insurance and labor disputes.",
    overview:
      "We help employers build compliant workforces and manage change — from contracts and internal work regulations to restructuring and disputes before the labor courts — with close attention to social insurance and the rules governing foreign staff.",
    scope: [
      "Employment contracts and internal work regulations",
      "Workforce restructuring and terminations",
      "Social insurance compliance",
      "Work permits for foreign employees",
      "Labor disputes and litigation",
    ],
    forums: ["Ministry of Labor", "National Organization for Social Insurance", "Labor courts"],
    plate: "hallRows",
    focus: "82% 72%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "intellectual-property",
    title: "Intellectual Property",
    summary: "Protection, licensing and enforcement of trademarks, patents, copyright and designs.",
    overview:
      "Brands and know-how are among a company's most valuable assets. We secure protection in Egypt, structure licensing and technology transfer, and enforce rights against infringement and counterfeiting.",
    scope: [
      "Trademark clearance, registration and oppositions",
      "Patents and industrial designs",
      "Copyright and software",
      "Licensing and technology transfer",
      "Anti-counterfeiting and infringement actions",
    ],
    forums: ["Trademarks Office", "Egyptian Patent Office", "Economic Courts"],
    plate: "mashrabiya",
    focus: "8% 40%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "administrative-regulatory",
    title: "Administrative & Regulatory",
    summary: "Licensing, government contracts and challenges before the Council of State.",
    overview:
      "Where a business meets the state — a license, a tender, a decision — the rules are administrative. We advise on regulatory strategy and represent clients before the administrative judiciary of the Council of State.",
    scope: [
      "Licensing and permits",
      "Public procurement and government contracts",
      "Challenges to administrative decisions",
      "Regulatory investigations and compliance",
      "Public–private partnership structures",
    ],
    forums: ["Council of State", "Sector regulators", "Ministries and governorates"],
    plate: "colonnade",
    focus: "86% 38%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
  {
    slug: "technology-data-protection",
    title: "Technology & Data Protection",
    summary: "Personal data compliance, technology contracts, e-commerce and fintech regulation.",
    overview:
      "Egypt's Personal Data Protection Law has moved data from an IT concern to a legal one. We help technology companies and data-heavy businesses build compliance programs and negotiate the contracts that support digital operations.",
    scope: [
      "Personal data protection compliance",
      "Technology, SaaS and outsourcing contracts",
      "E-commerce and consumer protection",
      "Fintech and digital payments regulation",
      "Cybersecurity incidents and response",
    ],
    forums: ["Personal Data Protection Center", "National Telecom Regulatory Authority", "Central Bank of Egypt"],
    plate: "mashrabiya",
    focus: "72% 32%",
    status: "pending",
    sources: [],
    verify: ["Not named in the supplied sources — confirm whether the firm offers this area before publishing it."],
  },
];

export function getPracticeArea(slug: string) {
  return practiceAreas.find((area) => area.slug === slug);
}

export function practiceNumber(slug: string) {
  const index = practiceAreas.findIndex((area) => area.slug === slug);
  return String(index + 1).padStart(2, "0");
}
