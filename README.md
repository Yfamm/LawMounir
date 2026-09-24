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
  content/                All copy: site details, practice areas, people, insights
  assets/                 Hero image
  fonts/                  Self-hosted Cormorant Garamond + Manrope (SIL OFL)
```

## Editing content

- **Firm details** (phone, email, office, hours, domain): `src/content/site.ts` — the values shipped are placeholders.
- **Team**: `src/content/people.ts` — names and bios are placeholders. Add a portrait with `image: "/images/people/name.jpg"` (put files in `public/images/people/`); without one, a typographic portrait is shown.
- **Practice areas**: `src/content/practiceAreas.ts` (`focus` frames the hover preview on the Cairo image).
- **Insights**: `src/content/insights.ts` — general commentary; have the firm's lawyers review before publishing.

## Contact form

The form posts to `/api/contact`. Set `CONTACT_WEBHOOK_URL` to forward enquiries as JSON to a form service, CRM or email automation. Without it, the form opens the visitor's email client with the enquiry pre-filled, so nothing is silently lost.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
