export type Person = {
  name: string;
  role: string;
  practice: string;
  bio: string;
  /** Optional portrait. Without one, a typographic portrait is rendered. */
  image?: string;
};

/**
 * Placeholder team profiles. Replace names, roles, biographies and add
 * portrait paths (e.g. "/images/people/name.jpg") with the firm's real team.
 */
export const people: Person[] = [
  {
    name: "Nour El-Din Fahmy",
    role: "Managing Partner",
    practice: "Corporate & Commercial",
    bio: "Leads the firm's corporate practice, advising shareholders and boards on structuring, transactions and governance.",
  },
  {
    name: "Salma Abdel Rahman",
    role: "Partner",
    practice: "Litigation & Arbitration",
    bio: "Heads the disputes team, running commercial litigation and arbitration from first notice to enforcement.",
  },
  {
    name: "Karim Soliman",
    role: "Partner",
    practice: "Banking, Finance & Tax",
    bio: "Advises lenders, borrowers and non-bank financial institutions on financing, restructuring and tax exposure.",
  },
  {
    name: "Dina Rashed",
    role: "Counsel",
    practice: "Administrative & Regulatory",
    bio: "Works where business meets the state — licensing, government contracts and challenges before the Council of State.",
  },
  {
    name: "Ahmed Zaki",
    role: "Senior Associate",
    practice: "Real Estate & Construction",
    bio: "Handles title due diligence, development agreements and construction disputes across Egypt's property market.",
  },
  {
    name: "Farida Nassar",
    role: "Associate",
    practice: "Technology & Data Protection",
    bio: "Builds data protection programs and negotiates technology contracts for digital and data-heavy businesses.",
  },
];
