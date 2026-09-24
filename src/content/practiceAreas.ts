import type { PlateKey } from "./plates";

export type PracticeArea = {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  scope: string[];
  forums: string[];
  /** Architectural plate used for this area's imagery. */
  plate: PlateKey;
  /** Background/object position used to frame that plate. */
  focus: string;
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: "corporate-commercial",
    title: "Corporate & Commercial",
    summary:
      "Formation, governance, transactions and the commercial contracts that hold a business together.",
    overview:
      "We advise Egyptian and foreign-owned companies across their full life cycle — from choosing the right corporate vehicle to restructuring, acquisitions and exit. The work is anchored in the Companies Law, the Investment Law and the practical requirements of the authorities that apply them.",
    scope: [
      "Company formation and corporate structuring",
      "Shareholder agreements and governance frameworks",
      "Mergers, acquisitions and share transfers",
      "Commercial agency, distribution and franchise arrangements",
      "Joint ventures, reorganizations and exits",
    ],
    forums: ["General Authority for Investment and Free Zones", "Commercial Registry", "Economic Courts"],
    plate: "colonnade",
    focus: "62% 45%",
  },
  {
    slug: "litigation-dispute-resolution",
    title: "Litigation & Dispute Resolution",
    summary:
      "Civil, commercial and Economic Court litigation, and domestic and international arbitration.",
    overview:
      "Disputes are won in preparation. We build each case around the forum that will decide it — the civil and commercial courts, the Economic Courts or an arbitral tribunal — and carry it through appeal, cassation and enforcement.",
    scope: [
      "Commercial and contractual disputes",
      "Economic Court proceedings",
      "Domestic and international arbitration",
      "Appeals and challenges before the Court of Cassation",
      "Enforcement of judgments and arbitral awards",
    ],
    forums: ["Civil & Commercial Courts", "Economic Courts", "Court of Cassation", "Arbitral tribunals"],
    plate: "colonnadeDetail",
    focus: "50% 35%",
  },
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
  },
  {
    slug: "real-estate-construction",
    title: "Real Estate & Construction",
    summary:
      "Acquisitions, development, title and construction disputes across Egypt's property market.",
    overview:
      "Egyptian real estate carries its own realities — unregistered title, chains of primary contracts, phased payments and developer obligations. We structure acquisitions and developments with those realities in view, and act when projects or titles are contested.",
    scope: [
      "Title due diligence and registration",
      "Development and off-plan sale agreements",
      "Leasing and property management",
      "Construction contracts, including FIDIC-based agreements",
      "Construction and developer disputes",
    ],
    forums: ["Real Estate Publicity Department", "Civil Courts", "Arbitral tribunals"],
    plate: "colonnade",
    focus: "30% 75%",
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
  },
  {
    slug: "family-personal-status",
    title: "Family & Personal Status",
    summary: "Marriage, divorce, custody, guardianship and succession — handled with discretion.",
    overview:
      "Personal status matters in Egypt are governed by distinct rules and heard before specialized family courts. We advise individuals and families discreetly, including in matters that cross borders.",
    scope: [
      "Marriage and divorce proceedings",
      "Custody, visitation and guardianship",
      "Alimony and maintenance",
      "Inheritance and succession planning",
      "Cross-border family matters",
    ],
    forums: ["Family Courts", "Personal Status Registry"],
    plate: "hallAislePortrait",
    focus: "50% 62%",
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
  },
  {
    slug: "investment-business-setup",
    title: "Investment & Business Setup",
    summary: "Market entry, investment incentives and establishing operations in Egypt.",
    overview:
      "For investors entering Egypt, the first decisions shape everything after. We advise on the vehicle, the location and the incentives available under the Investment Law, and manage setup with the General Authority for Investment and Free Zones.",
    scope: [
      "Market-entry structuring",
      "Investment incentives and free zones",
      "Company setup and GAFI procedures",
      "Foreign ownership and sector restrictions",
      "Branches and representative offices",
    ],
    forums: ["General Authority for Investment and Free Zones", "Commercial Registry"],
    plate: "hallAisle",
    focus: "28% 72%",
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
  },
];

export function getPracticeArea(slug: string) {
  return practiceAreas.find((area) => area.slug === slug);
}

export function practiceNumber(slug: string) {
  const index = practiceAreas.findIndex((area) => area.slug === slug);
  return String(index + 1).padStart(2, "0");
}
