# Content checklist — before launch

The site is structurally complete, but it contains **no confirmed firm
information**. Every firm-specific value is a visible `[PLACEHOLDER]`, and every
statement that needs the firm's confirmation is marked `VERIFY` in the source
(`grep -rn VERIFY src`). Nothing below should be filled with invented or
assumed information.

## 1. Placeholders to replace

| Placeholder | Where it appears | Edit in |
| --- | --- | --- |
| `[LAW FIRM NAME]` | Logo, page-transition curtain, footer wordmark, copyright line, page titles and metadata | `src/content/site.ts` → `name`, `legalName` |
| `[اسم مكتب المحاماة]` | Arabic name under the logo, curtain | `site.ts` → `nameAr` |
| `[شعار المكتب بالعربية]` | Arabic tagline under the hero headline, mobile menu, footer | `site.ts` → `taglineAr` |
| `[CITY]` | Hero eyebrow ("Attorneys at Law — [CITY]") | `site.ts` → `city` |
| `[PHONE]` | Contact section, footer, mobile menu (becomes a `tel:` link when set) | `site.ts` → `phone` |
| `[EMAIL]` | Contact section, footer, mobile menu, form fallback (becomes a `mailto:` link when set) | `site.ts` → `email` |
| `[OFFICE ADDRESS]` | Contact section, footer, mobile menu | `site.ts` → `contact.office` (one line per array item) |
| `[OFFICE HOURS]` | Contact section, footer | `site.ts` → `contact.hours` |
| `[OFFICE COORDINATES]` | Hero (vertical detail) and footer | `site.ts` → `coordinates` |
| `[WEBSITE]` | Reference value for the public domain | `site.ts` → `website`; also set the `NEXT_PUBLIC_SITE_URL` env var |
| `[LAWYER NAME]`, `[TITLE]`, `[PRACTICE AREA]`, `[SHORT BIO]` | Six team cards (home shows three, /people shows all) | `src/content/people.ts` |
| `[PUBLICATION DATE]` | Insight cards and article pages | `src/content/insights.ts` → `date` per note |
| Favicon mark | Browser tab | `src/app/icon.svg` |

Counts shown beside the big titles ("Practice Areas (12)", "People (06)",
"Insights (06)") are computed from the content lists and update automatically.

## 2. Enquiries

- The contact form posts to `/api/contact`. Set `CONTACT_WEBHOOK_URL` to deliver
  enquiries (form service, CRM or email automation).
- Until a real email is configured, the form shows "Online enquiries are not yet
  connected" instead of opening an email draft to a placeholder address.

## 3. Statements that require firm verification (`VERIFY`)

### About the firm (claims about the firm itself)
- `src/content/site.ts` → `description` — scope of practice and clientele.
- `src/components/sections/Hero.tsx` — hero line describing the firm's clients.
- `src/components/sections/Introduction.tsx` — two paragraphs on practice and method.
- `src/app/about/page.tsx` — header introduction and the three "story" paragraphs.
- `src/components/sections/ApproachSection.tsx` — the four principles.
- `src/components/sections/PeopleSection.tsx`, `src/app/people/page.tsx` — how matters are staffed.
- `src/app/contact/page.tsx` — intake steps (conflict check, first conversation, engagement letter).
- `src/components/sections/ExperienceSection.tsx` — "Markets" is a claim of sector experience; "Twelve practice areas" must match the list.

### Practice areas
- `src/content/practiceAreas.ts` — confirm which areas the firm offers. Each
  `overview` cites Egyptian statutes/authorities, each `forums` list names real
  courts and regulators, and each `scope` list describes work the firm handles.
- `src/components/sections/PracticeAreasSection.tsx`, `src/app/practice-areas/page.tsx` — "Twelve areas…" introductions.

### General statements about Egyptian law
- `src/components/sections/LandscapeSection.tsx` — courts / regulators / markets pillars.
- `src/content/insights.ts` — six **sample** notes, each with `reviewed: false`
  and a `verify` list of the specific legal statements to check (e.g. Law No.
  120 of 2008, Law No. 151 of 2020, Law No. 159 of 1981, Law No. 72 of 2017,
  Law No. 14 of 2025). Unreviewed notes display
  "[DRAFT — PENDING LEGAL REVIEW BY THE FIRM]" in their disclaimer. Replace them
  with the firm's own notes, or set `reviewed: true` and a `date` once approved.

## 4. Deliberately absent

The site does not state founding dates, awards, rankings, clients, case results,
statistics, bar admissions or other credentials. Add them only once supplied
and verified by the firm.
