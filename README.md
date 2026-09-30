# DIWAN — ديوان للمحاماه والأستشارات القانونية — website

A cinematic, editorial website for an Egyptian law firm, built with Next.js (App Router), TypeScript, CSS Modules, GSAP (ScrollTrigger + SplitText) and Lenis — with a Supabase-backed CMS and confidential enquiries inbox at `/admin`.

## Commands

```bash
npm install
cp .env.example .env.local   # fill in the Supabase keys
npm run db:start             # local Supabase (Docker) — applies supabase/migrations
npm run cms:seed             # migrate the DIWAN source content into the CMS
ADMIN_PASSWORD='…' npm run cms:create-admin -- you@example.com
npm run dev                  # http://localhost:3000 — admin at /admin
npm run lint
npm run typecheck
npm run build && npm run start
```

For production: create a Supabase project, run the migration in
`supabase/migrations/` (`npx supabase link` + `npx supabase db push`, or paste it
into the SQL editor), set the variables from `.env.example` in the hosting
platform, then run `npm run cms:seed` and `npm run cms:create-admin` once
against it. In the Supabase dashboard keep **Allow new users to sign up** off
(Authentication → Providers) — admins are created only by the script.

## Structure

```
src/
  app/(site)/             Public routes: /, /about, /practice-areas(/[slug]), /people,
                          /insights(/[slug]), /contact
  app/admin/              CMS: login, dashboard, editors, enquiries, media (+ actions.ts)
  app/api/                contact (public enquiries), admin/media (uploads)
  lib/cms/                Content model, field definitions, validation, repository,
                          defaults (source-content fallback), admin data access
  lib/supabase/           Public (anon), session (admin) and service-role clients
  proxy.ts                Admin session refresh + sign-in redirect
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

## CMS

**Data flow:** Supabase → `src/lib/cms/repository.ts` (server-only) → pages in
`src/app/(site)` → the existing presentation components → the existing GSAP
animations. The CMS controls content only; layout and motion stay in code.

- **Admin** (`/admin`): Dashboard, Enquiries, Homepage, About, Practice Areas,
  People, Insights, Values, Navigation & Footer, Site Settings, Media.
- **Auth:** Supabase Auth (email + password). `src/proxy.ts` refreshes the
  session and redirects signed-out visitors to `/admin/login`; every admin page,
  server action and admin API route re-verifies the user and their
  `admin_users` membership on the server; row-level security enforces it again
  in Postgres. Public sign-up is disabled.
- **Validation:** one field definition (`src/lib/cms/fields.ts`) drives both
  the admin forms and the zod schemas used by the server actions.
- **Publishing:** every save calls `revalidatePath("/", "layout")`; public pages
  are otherwise static and regenerate at most every 5 minutes.
- **Fallback:** if Supabase is unreachable or not yet seeded, the site renders
  the source content in `src/lib/cms/defaults.ts` (built from `src/content/*`).
  Once seeded, the database is authoritative. Visitors never see database
  errors.
- **Images:** a section's image is either one of the built-in architectural
  plates (or the hero photograph) or an upload from the media library
  (Supabase Storage bucket `media`). Resetting an image returns it to its
  original plate. Uploads in use cannot be deleted.
- **Enquiries:** the contact form posts to `/api/contact` (size limit,
  honeypot, per-IP rate limit, zod validation) and is stored with the
  service role — the database is the source of truth. An optional Resend
  notification (name + admin link only) follows; its failure never affects
  the stored enquiry. Enquiries and internal notes are readable only by admins.

Schema, RLS policies and storage rules: `supabase/migrations/20260930100000_diwan_cms.sql`.

## Editing content

Content is edited in the admin. The files below are the **source content**:
they seed the CMS (`npm run cms:seed`) and are the fallback when the database
is unavailable. Firm content is sourced from the firm's public Facebook page and its Arabic
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

Fields: name, phone and issue (required), email (optional). Submissions are
stored in the `enquiries` table and appear under Admin → Enquiries (unread
first, with status and internal notes). See `.env.example` for the optional
e-mail notification.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
