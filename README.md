# [LAW FIRM NAME] — website

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

All firm-specific information is currently a visible `[PLACEHOLDER]`, and every
statement that needs the firm's confirmation is marked `VERIFY` in the source.
**See [`CONTENT_CHECKLIST.md`](CONTENT_CHECKLIST.md) for the complete list.**

- **Firm identity and contact** (English/Arabic name, Arabic tagline, city, phone, email, office, hours, coordinates, website): `src/content/site.ts`. Phone and email only become links once real values replace the placeholders.
- **Canonical URL**: set `NEXT_PUBLIC_SITE_URL` (used by metadata, sitemap and robots).
- **Team**: `src/content/people.ts` — six `[LAWYER NAME]` placeholders. Add a portrait with `image: "/images/people/name.jpg"` (files in `public/images/people/`); without one, a typographic plate is shown. The people count on the site follows this list.
- **Practice areas**: `src/content/practiceAreas.ts` (`plate` and `focus` choose and frame the area's image). The count follows this list.
- **Insights**: `src/content/insights.ts` — sample commentary with `reviewed: false` and `date: null`. Unreviewed notes display a "pending legal review" notice; set `reviewed: true` and a publication `date` once approved.
- **Favicon**: `src/app/icon.svg` is a neutral placeholder mark.

## Contact form

The form posts to `/api/contact`. Set `CONTACT_WEBHOOK_URL` to forward enquiries as JSON to a form service, CRM or email automation. Without it, the form opens the visitor's email client with the enquiry pre-filled, so nothing is silently lost.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
