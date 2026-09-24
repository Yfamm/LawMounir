# Content checklist and source log — DIWAN

The site's firm content comes from two sources. Every statement is either
traced to one of them, adapted with the change recorded, left as a visible
`[PLACEHOLDER]`, or marked `VERIFY` (`grep -rn VERIFY src`). Nothing has been
invented to fill a gap.

## Sources

| ID | Source | What it supports |
| --- | --- | --- |
| `facebook` | Public Facebook page — ديوان للمحاماه والأستشارات القانونية ([link](https://web.facebook.com/people/%D8%AF%D9%8A%D9%88%D8%A7%D9%86-%D9%84%D9%84%D9%85%D8%AD%D8%A7%D9%85%D8%A7%D9%87-%D9%88%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9/61563232199590/)) | Arabic firm name; location Kafr el Sheikh, Egypt |
| `introDoc` | Arabic introduction document — verbatim transcript in [`docs/sources/introduction-ar.md`](docs/sources/introduction-ar.md) | Vision, who we are, practice areas, four values, mission |
| `clientBrief` | Client content brief | English wordmark **DIWAN** and subtitle **LAW & LEGAL CONSULTANCY** (branding only — not an official registered English name) |

> **Not independently checked:** the Facebook page could not be opened from
> the build environment (network egress blocked). The name and location are
> used exactly as stated in the client brief that cites the page.

Machine-readable versions: `src/content/sources.ts` (registry) and
`src/content/firm.ts` (each passage with `sources`, `edits` and `verify`).

## Source-derived content and where it appears

| Content | Source | Where on the site | Adaptations |
| --- | --- | --- | --- |
| Arabic name ديوان للمحاماه والأستشارات القانونية | facebook | Logo, curtain, mobile menu, footer, copyright, metadata | None — spelling kept as published (see §1) |
| DIWAN / Law & Legal Consultancy | clientBrief | Logo, curtain, hero eyebrow, titles | Branding only |
| Kafr el Sheikh, Egypt | facebook | Hero eyebrow and location line, footer, contact office, metadata | — |
| Vision (رؤيتنا) | introDoc | Hero line + Arabic, home introduction, About §01 | Office name inserted; Cairo founding phrase removed and rewritten around Kafr el Sheikh; no founding date |
| Who we are (من نحن؟) | introDoc | Home introduction, About §02, people intro | "رائدة" and "نخبة" removed; "نتميز بالقدرة على" softened |
| Practice areas: companies & investment, civil & real-estate transactions, personal status | introDoc | Practice list, practice pages, experience track, contact form | Split into five areas |
| Litigation & Representation | introDoc (mission: defence before judicial and administrative bodies) | Practice list and page | — |
| Company formation, contract drafting, administrative procedures | introDoc (value IV) | Companies & Contracts, Investment, experience track | — |
| Four values (قيمنا الأساسية) | introDoc | Home §05 and About §03 | Value I: "يترأسها خبراء" omitted; Value IV: no speed superlative |
| Mission (رسالتنا) | introDoc | About §04, experience track | "والأول" removed so it is not read as a ranking |
| Contact page "What happens next" | introDoc (values II, III; mission) | Contact page | Written from confidentiality, communication and clear-advice commitments |

## 1. Source-verification items (firm must confirm)

- **Arabic spelling of the firm name.** The public page writes
  "ديوان للمحاماه والأستشارات القانونية" — "المحاماه" (ه rather than ة) and
  "الأستشارات" (أ rather than ا). The introduction document uses
  "المحاماة والاستشارات". The site uses the public-page spelling unchanged;
  the firm should confirm the final spelling (`src/content/site.ts` → `nameAr`).
- **Softened wording in "Who we are".** Confirm whether "رائدة" (leading) and
  "نخبة" (select) should be restored — they are presented only as the firm's
  own language if restored.
- **Specialization in international law** ("والدولي") in "Who we are".
- **"يترأسها خبراء"** (sections headed by experts) in value I — omitted pending
  confirmation of the team.
- **English name.** DIWAN is a visual wordmark; confirm whether the firm has an
  official English name.

## 2. Placeholders still to supply

| Placeholder | Where | Edit in |
| --- | --- | --- |
| `[PHONE]` | Contact section, footer, mobile menu (becomes a `tel:` link) | `src/content/site.ts` |
| `[WHATSAPP]` | Not rendered yet — add if used | `site.ts` → `contact.whatsapp` |
| `[EMAIL]` | Contact section, footer, mobile menu, form fallback (becomes a `mailto:` link) | `site.ts` |
| `[STREET ADDRESS]` | Contact section, footer, mobile menu (city is confirmed) | `site.ts` → `contact.office` |
| `[OFFICE HOURS]` | Contact section, footer | `site.ts` → `contact.hours` |
| `[WEBSITE]` | Reference value; also set `NEXT_PUBLIC_SITE_URL` | `site.ts` |
| `[LAWYER NAME]`, `[TITLE]`, `[PRACTICE AREA]`, `[SHORT BIO]` | Six team cards | `src/content/people.ts` |
| `[PUBLICATION DATE]` | Insight cards and articles | `src/content/insights.ts` |
| Favicon mark | Browser tab | `src/app/icon.svg` |

Exact office coordinates are not supplied; the hero and footer show the
confirmed location line ("Kafr el Sheikh — Egypt") instead.

## 3. Pending confirmation — not shown on the site

`pendingPracticeAreas` in `src/content/practiceAreas.ts` holds seven areas from
the prototype that the sources do not mention: Criminal Law, Banking & Finance,
Tax & Customs, Labor & Employment, Intellectual Property, Administrative &
Regulatory, Technology & Data Protection. They are not rendered and have no
routes. Move an area into `practiceAreas` only once the firm confirms it.

## 4. VERIFY — statements not covered by the sources

- **Forums and authorities** on each practice page (e.g. Commercial Registry,
  General Authority for Investment and Free Zones, Real Estate Publicity
  Department, Civil/Family Courts) — general statements about the Egyptian
  system; confirm they reflect where the firm acts.
- **Scope lists** for Real Estate Transactions and Personal Status — general
  descriptions of the work.
- **Experience track "Forums"** — named courts.
- **Egyptian legal landscape section** (home) — general statements about
  courts and regulators.
- **Insights** — six sample notes, each `reviewed: false` with a `verify` list
  of statutory statements (Law No. 120 of 2008, Law No. 151 of 2020, Law No.
  159 of 1981, Law No. 72 of 2017, Law No. 14 of 2025, among others). They show
  "[DRAFT — PENDING LEGAL REVIEW BY THE FIRM]", are introduced as sample notes
  pending review, and state they are not legal advice from DIWAN. Replace them
  with the firm's own notes, or set `reviewed: true` and a `date` once approved.

## 5. Deliberately absent

No founding date, history, awards, rankings, clients, case results,
statistics, bar admissions, education, languages or other credentials appear
anywhere. Add them only once supplied and verified by the firm.
