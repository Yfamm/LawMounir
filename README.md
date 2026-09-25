# DIWAN — ديوان للمحاماه والأستشارات القانونية — website

A cinematic, editorial website for an Egyptian law firm, built with Next.js (App Router), TypeScript, CSS Modules, GSAP (ScrollTrigger + SplitText) and Lenis.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm run start
```

## Structure

```
src/
  app/                    Routes: /, /about, /practice-areas(/[slug]), /people,
                          /insights(/[slug]), /contact, api/contact, sitemap, robots
  animation/              GSAP registration, Lenis smooth scroll, page-transition curtain,
                          magnetic hook
  components/layout/      Navigation (desktop + full-screen mobile menu), Footer, Wordmark
  components/sections/    Hero, Introduction, PracticeAreasSection, LandscapeSection (pinned),
                          ApproachSection, ExperienceSection (horizontal), PeopleSection,
                          InsightsSection, ContactSection, PageHeader
  components/ui/          SectionHeading, RevealText, SplitReveal, Reveal, ImageReveal,
                          PracticeAreaList/Row, EditorialCard, TeamCard/Grid, Portrait,
                          ContactForm, Button, Arrow, TransitionLink, InsightsIndex
  content/                All copy: site details, practice areas, people, insights,
                          plates (image registry)
  assets/                 Hero image; plates/ (architectural renders) and previews/
  fonts/                  Self-hosted Cormorant Garamond, Manrope, IBM Plex Mono and
                          Amiri (all SIL OFL)
scripts/plates/           Python renderers that produced the architectural plates
```

## Art direction

- **Palette:** near-black stone (`#070706`), warm ivory (`#F2EBDD`) and an antique-gold scale (`--gold-100` → `--accent-deep`). Gold is kept to italics, hairlines, numerals and keylines.
- **Type:** Cormorant Garamond for display (ivory roman, gold italic), Manrope for reading, IBM Plex Mono for docket-style metadata, and Amiri — a revival of Cairo's Bulaq press Naskh — for Arabic counterparts to the name, tagline and section labels.
- **Imagery:** the hero photograph appears only in the hero. Every other image is one of six original architectural plates (hypostyle hall, neoclassical portico, mashrabiya light) rendered procedurally by `scripts/plates/` and registered in `src/content/plates.ts`. To use real photography instead, replace a plate's files in `src/assets/plates/` and `src/assets/previews/` (keeping names), or point its entry at new imports.
- **Ornament:** `GeometricPattern` draws an eight-pointed-star (khatam) lattice in hairlines, used faintly in the experience section, contact section, footer and mobile menu.

## Editing content

Firm content is sourced from the firm's public Facebook page and its Arabic
introduction document. **See [`CONTENT_CHECKLIST.md`](CONTENT_CHECKLIST.md)** for
the source log, every placeholder, and every statement marked `VERIFY`.

- **Identity and contact**: `src/content/site.ts` (DIWAN wordmark, Arabic name as
  published, Kafr el Sheikh; phone, email, street address and hours are
  placeholders and only become links once supplied).
- **Vision, who we are, values, mission** (English + Arabic, with sources and
  recorded edits): `src/content/firm.ts`.
- **Sources**: `src/content/sources.ts`; verbatim document in `docs/sources/`.
- **Practice areas**: `src/content/practiceAreas.ts` — six source-backed areas
  are published; seven prototype areas sit in `pendingPracticeAreas` (not
  rendered) until the firm confirms them.
- **Team**: `src/content/people.ts` — six placeholders until official profiles
  are supplied.
- **Insights**: `src/content/insights.ts` — sample notes pending legal review.
- **Canonical URL**: set `NEXT_PUBLIC_SITE_URL`.
- **Indexing**: every page is `noindex` and robots.txt disallows crawling until `NEXT_PUBLIC_SITE_INDEXABLE=true` is set at launch.
- **Metadata**: per-page titles, descriptions, canonical URLs and Open Graph/Twitter tags come from `pageMetadata()` in `src/content/seo.ts`; the share image is `src/app/opengraph-image.jpg`.

## Contact form

The form posts to `/api/contact`. Set `CONTACT_WEBHOOK_URL` to forward enquiries as JSON to a form service, CRM or email automation. Without it, the form opens the visitor's email client with the enquiry pre-filled, so nothing is silently lost.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
