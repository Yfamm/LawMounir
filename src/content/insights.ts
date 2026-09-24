import type { PlateKey } from "./plates";

export const insightCategories = [
  "Legal Updates",
  "Egyptian Law",
  "Case Analysis",
  "Regulatory Changes",
  "Business & Investment",
  "Legal Guides",
] as const;

export type InsightCategory = (typeof insightCategories)[number];

export type InsightBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Insight = {
  slug: string;
  plate: PlateKey;
  category: InsightCategory;
  title: string;
  standfirst: string;
  date: string;
  readingTime: string;
  body: InsightBlock[];
};

export const insights: Insight[] = [
  {
    slug: "economic-courts-and-the-commercial-dispute",
    plate: "colonnade",
    category: "Egyptian Law",
    title: "The Economic Courts and the commercial dispute",
    standfirst:
      "Why a specialized forum created in 2008 now sits at the center of so many business disputes in Egypt — and what that means for how a case is prepared.",
    date: "2026-09-10",
    readingTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Egypt's Economic Courts were established by Law No. 120 of 2008 to give commercial disputes a specialized home. Rather than hearing every claim, they take jurisdiction over disputes arising under a defined list of economic statutes — among them the laws governing companies, the capital market, investment, banking, intellectual property, competition and consumer protection.",
      },
      {
        type: "p",
        text: "For a business, the first practical question is therefore not simply whether it has a claim, but where that claim belongs. A shareholder dispute, a trademark infringement or a dispute under a financing arrangement may fall within the Economic Courts; a routine contractual claim may not. Getting the forum wrong costs time that a commercial client rarely has.",
      },
      { type: "h", text: "A forum built around preparation" },
      {
        type: "p",
        text: "One of the distinctive features of the system is the preparatory stage. Before a case is heard, a preparatory panel examines the dispute, gathers the parties' documents and positions, and attempts to bring them to settlement. Many parties treat this as a formality. It is better treated as the first hearing — the moment when the shape of the case is fixed on the record.",
      },
      {
        type: "quote",
        text: "The file that reaches the judge is largely the file that was built before the first session.",
      },
      {
        type: "p",
        text: "In practice, that means the documentary case should be assembled early: the contract and its amendments, correspondence, invoices, board resolutions and any formal notices. Where technical or accounting questions are central, the likely scope of an expert's mandate should be anticipated rather than left to chance.",
      },
      { type: "h", text: "What clients should take from this" },
      {
        type: "list",
        items: [
          "Confirm early whether the dispute falls within the Economic Courts' jurisdiction.",
          "Treat the preparatory stage as substantive, not procedural.",
          "Assemble the documentary record before proceedings are filed.",
          "Plan for enforcement from the outset, including any precautionary measures.",
        ],
      },
      {
        type: "p",
        text: "Specialized courts reward specialized preparation. The advantage lies with the party that arrives with a coherent file, a clear theory of the case and a realistic view of how judgment will be enforced.",
      },
    ],
  },
  {
    slug: "buying-property-where-title-is-not-registered",
    plate: "mashrabiya",
    category: "Legal Guides",
    title: "Buying property where the title is not registered",
    standfirst:
      "A large share of Egyptian real estate changes hands without registered title. A guide to what that means for a buyer, and how to reduce the risk.",
    date: "2026-08-21",
    readingTime: "7 min read",
    body: [
      {
        type: "p",
        text: "In Egypt, ownership of real estate is transferred through registration with the Real Estate Publicity Department. In reality, a significant portion of the market operates on primary contracts — sale agreements between buyer and seller that are valid between the parties but have never been registered. Many apartments in established Cairo neighborhoods have passed through several such contracts.",
      },
      {
        type: "p",
        text: "This is not, in itself, a reason to walk away. But it changes what a buyer is actually acquiring, and it changes the diligence required.",
      },
      { type: "h", text: "Following the chain" },
      {
        type: "p",
        text: "The core exercise is to trace the chain of contracts back to a registered owner or to the original developer, confirming at each step that the seller had the right to sell. Gaps in the chain, inconsistencies in descriptions of the unit or missing original documents are the points where disputes later arise.",
      },
      {
        type: "list",
        items: [
          "The full chain of sale contracts, in original where possible.",
          "The developer's title to the land and the project's building permits.",
          "Evidence of payment and any outstanding installments to the developer.",
          "Utility accounts, property tax position and any service charges.",
          "Confirmation that the unit is not subject to attachment or competing claims.",
        ],
      },
      { type: "h", text: "Court actions that support a primary contract" },
      {
        type: "p",
        text: "Egyptian practice recognizes two actions commonly used alongside unregistered contracts. A validity of signature action confirms that the seller signed the contract; it does not, on its own, transfer ownership. A validity and enforceability action goes further, seeking a judgment that the sale is valid and effective — a judgment that can then support registration.",
      },
      {
        type: "quote",
        text: "The question is never only whether the contract is valid. It is what the buyer will be able to prove, register and defend in five years.",
      },
      {
        type: "p",
        text: "Each route has its own requirements, timeline and cost, and the right one depends on the history of the property. The decision is best made before the price is paid, not after.",
      },
    ],
  },
  {
    slug: "personal-data-in-egypt-law-151-of-2020",
    plate: "hallRows",
    category: "Regulatory Changes",
    title: "Personal data in Egypt: what Law No. 151 of 2020 asks of a business",
    standfirst:
      "Egypt's Personal Data Protection Law moves data handling from an IT concern to a legal one. The obligations every data-heavy business should map.",
    date: "2026-07-30",
    readingTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Law No. 151 of 2020 on the Protection of Personal Data gave Egypt its first comprehensive data protection framework. It applies to personal data processed electronically, and it places obligations on both those who determine how data is used and those who process it on their behalf.",
      },
      {
        type: "p",
        text: "The law also establishes the Personal Data Protection Center as the regulator responsible for supervising compliance, issuing licenses and permits, and receiving complaints. Much of the practical detail sits in the implementing framework, which is why businesses should read the statute and the regulator's requirements together.",
      },
      { type: "h", text: "The obligations to map" },
      {
        type: "list",
        items: [
          "A lawful basis — most often consent — for each purpose of processing.",
          "Licensing or permits from the Center where the law requires them.",
          "A designated data protection officer within the organization.",
          "Processes to honor data subjects' rights of access, correction and deletion.",
          "Restrictions on transferring personal data outside Egypt.",
          "Procedures to notify the Center promptly of a personal data breach.",
        ],
      },
      { type: "h", text: "Where businesses most often fall short" },
      {
        type: "p",
        text: "The most common gaps are not dramatic. They are data collected for one purpose and quietly reused for another, vendor contracts silent on data protection, and customer data held on servers abroad without any assessment of whether the transfer is permitted.",
      },
      {
        type: "quote",
        text: "Compliance starts with an honest inventory: what data you hold, why you hold it, where it lives and who can see it.",
      },
      {
        type: "p",
        text: "For companies in financial services, health, e-commerce and technology, data protection now sits alongside sector regulation. A program built early costs far less than one assembled in response to a complaint.",
      },
    ],
  },
  {
    slug: "anatomy-of-a-commercial-dispute",
    plate: "colonnadeDetail",
    category: "Case Analysis",
    title: "Anatomy of a commercial dispute, from notice to enforcement",
    standfirst:
      "An illustrative walk through a supply dispute in Egypt — the decisions that shape the outcome, and the moments where cases are quietly won or lost.",
    date: "2026-07-09",
    readingTime: "8 min read",
    body: [
      {
        type: "p",
        text: "The scenario below is illustrative. It combines features common to many commercial disputes rather than describing any single matter, and it is intended to show how the stages of an Egyptian dispute connect.",
      },
      {
        type: "p",
        text: "A manufacturer supplies equipment to a distributor under a long-term agreement. After a change in market conditions, the distributor stops paying invoices, alleging defects. The manufacturer wants its money; the distributor wants to exit the contract.",
      },
      { type: "h", text: "Stage one: reading the contract" },
      {
        type: "p",
        text: "Before any letter is sent, the contract decides the battlefield. Does it contain an arbitration clause, or will the courts decide? What notice does it require before termination? Are there limits on liability, or a defined procedure for raising defects? Answers to these questions set everything that follows.",
      },
      { type: "h", text: "Stage two: the formal record" },
      {
        type: "p",
        text: "A formal notice to the distributor fixes the claim on the record and satisfies any contractual or statutory notice requirement. Where there is a real risk that assets will be moved, precautionary attachment may be considered to protect eventual recovery.",
      },
      { type: "h", text: "Stage three: the forum" },
      {
        type: "p",
        text: "If the dispute proceeds to court, technical questions — here, whether the equipment was defective — are frequently referred to a court-appointed expert. The expert's report often carries decisive weight, which is why the questions put to the expert, and the documents placed before them, deserve as much attention as the pleadings.",
      },
      {
        type: "quote",
        text: "In many Egyptian disputes, the expert's report is where the case is really argued.",
      },
      { type: "h", text: "Stage four: judgment and enforcement" },
      {
        type: "p",
        text: "A judgment is only as good as its enforcement. Once it becomes enforceable, it must carry the executory formula before execution against assets. Where the losing party has anticipated this, the value of the judgment depends on the steps taken months earlier.",
      },
      {
        type: "p",
        text: "The lesson is consistent: disputes are decided by decisions made early — on the forum, the record, the expert and enforcement. Advice that begins at the first hearing is already late.",
      },
    ],
  },
  {
    slug: "choosing-a-corporate-vehicle-in-egypt",
    plate: "hallAisle",
    category: "Business & Investment",
    title: "Choosing a corporate vehicle in Egypt",
    standfirst:
      "Limited liability company, joint stock company or one-person company: the decision that shapes governance, financing and exit for years to come.",
    date: "2026-06-18",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Most businesses in Egypt are established under the Companies Law, Law No. 159 of 1981, with incorporation handled through the General Authority for Investment and Free Zones. Where investment incentives are relevant, the Investment Law, Law No. 72 of 2017, adds a second layer to consider.",
      },
      { type: "h", text: "The three common vehicles" },
      {
        type: "p",
        text: "The limited liability company is the familiar choice for closely held businesses: a limited number of partners, managers rather than a board, and relatively simple governance. The joint stock company is built for scale — a board of directors, freely transferable shares and access to capital markets. The one-person company, introduced by amendment in 2018, allows a single founder to operate with limited liability.",
      },
      {
        type: "list",
        items: [
          "How many owners are there today, and how many will there be?",
          "Will the business raise equity from investors, or list in future?",
          "How should control and decision-making be divided?",
          "Is the activity subject to foreign ownership limits or special licensing?",
          "What incentives, zones or regimes might apply to the project?",
        ],
      },
      {
        type: "quote",
        text: "The right vehicle is the one that still fits when the business has doubled.",
      },
      {
        type: "p",
        text: "Changing vehicle later is possible, but it is rarely as simple as choosing well at the start. The conversation about structure is best held alongside the conversation about the business plan.",
      },
    ],
  },
  {
    slug: "employment-documentation-under-the-new-labor-law",
    plate: "hallAislePortrait",
    category: "Legal Updates",
    title: "Reviewing employment documentation under the new Labor Law",
    standfirst:
      "Egypt's new Labor Law replaced a framework that had governed private-sector employment for more than two decades. Where employers should start.",
    date: "2026-05-27",
    readingTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Egypt's new Labor Law, issued as Law No. 14 of 2025, replaced Law No. 12 of 2003 as the principal framework for private-sector employment. For employers, the change is less a single event than a documentation exercise: contracts, internal regulations and procedures drafted under the old law now need to be read against the new one.",
      },
      { type: "h", text: "Where to begin" },
      {
        type: "list",
        items: [
          "Standard employment contracts, including fixed-term and project arrangements.",
          "Internal work regulations and disciplinary procedures.",
          "Termination processes and the documentation that supports them.",
          "Leave, working hours and remuneration policies.",
          "Arrangements for foreign employees and their permits.",
        ],
      },
      {
        type: "p",
        text: "The priority should follow risk. Terminations and disciplinary action are where disputes arise, so the procedures behind them deserve the earliest review. Contracts can then be updated as they are renewed or re-issued.",
      },
      {
        type: "quote",
        text: "An employment dispute is usually decided by the paperwork that existed before it began.",
      },
      {
        type: "p",
        text: "Employers should also watch the implementing decrees and ministerial decisions that give the law its practical detail. A short, structured review now is considerably cheaper than defending an outdated procedure before a labor court.",
      },
    ],
  },
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
