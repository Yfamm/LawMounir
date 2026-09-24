# Mounir Law Firm — website

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

- **Firm details** (phone, email, office, hours, domain): `src/content/site.ts` — the values shipped are placeholders.
- **Team**: `src/content/people.ts` — names and bios are placeholders. Add a portrait with `image: "/images/people/name.jpg"` (put files in `public/images/people/`); without one, a typographic portrait is shown.
- **Practice areas**: `src/content/practiceAreas.ts` (`plate` and `focus` choose and frame the area's image).
- **Insights**: `src/content/insights.ts` — general commentary; have the firm's lawyers review before publishing.

## Contact form

The form posts to `/api/contact`. Set `CONTACT_WEBHOOK_URL` to forward enquiries as JSON to a form service, CRM or email automation. Without it, the form opens the visitor's email client with the enquiry pre-filled, so nothing is silently lost.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
