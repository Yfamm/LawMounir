# DIWAN — ديوان للمحاماه والأستشارات القانونية — website

A cinematic, editorial website for an Egyptian law firm, built with Next.js (App Router), TypeScript, CSS Modules, GSAP (ScrollTrigger + SplitText) and Lenis — with a Supabase-backed CMS and confidential enquiries inbox at `/admin`.

## Commands

```bash
npm install
cp .env.example .env.local   # fill in the Supabase keys
npm run db:start             # local Supabase (Docker) — applies supabase/migrations
npm run cms:seed             # migrate the DIWAN source content into the CMS (empty database only)
npm run cms:backfill-ar      # existing database: preview the Arabic upgrade (add -- --apply to write)
ADMIN_PASSWORD='…' npm run cms:create-admin -- you@example.com
npm run dev                  # http://localhost:3000 — admin at /admin
npm run lint
npm run typecheck
npm run build && npm run start
```

For production: create a Supabase project, apply the migrations in
`supabase/migrations/` with the CLI (`npx supabase link --project-ref …` then
`npx supabase db push` — both migrations are additive; never `db reset` a
production database), set the variables from `.env.example` in the hosting
platform, then run `npm run cms:seed` and `npm run cms:create-admin` once
against it. In the Supabase dashboard keep **Allow new users to sign up** off
(Authentication → Providers) — admins are created only by the script.

**Upgrading a database that already holds content** (seeded before Arabic
support): deploy this code, `npx supabase db push` (adds the Arabic columns),
then `npm run cms:backfill-ar` to review and `npm run cms:backfill-ar -- --apply`
to write. The backfill only fills *empty* Arabic fields and converts old
single-language sections; it never overwrites text, never deletes, and never
touches enquiries, media files or admins. Deploy the code before (or together
with) the backfill: the previous version cannot read the bilingual shape.

## Structure

```
src/
  app/[lang]/             Public routes under /ar and /en: /, /about,
                          /practice-areas(/[slug]), /people, /insights(/[slug]), /contact;
                          root layout sets <html lang dir>; localized not-found
  app/global-not-found    Bilingual 404 for URLs outside /ar and /en
  app/admin/              CMS: login, dashboard, editors, enquiries, media (+ actions.ts)
  app/api/                contact (public enquiries), admin/media (uploads)
  lib/cms/                Content model, field definitions, validation, repository,
                          defaults (source-content fallback), admin data access
  lib/i18n.ts             Languages, direction, localized-path helpers, {en, ar} values
  lib/cms/ui.ts           Every interface string (buttons, form labels, errors, 404…)
  lib/cms/normalize.ts    Reads older single-language CMS data into the bilingual shape
  lib/supabase/           Public (anon), session (admin) and service-role clients
  proxy.ts                Language redirect for unprefixed URLs; admin session
                          refresh + sign-in redirect
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
  fonts/                  Self-hosted Cormorant Garamond, Manrope, IBM Plex Mono,
                          Amiri and IBM Plex Sans Arabic (all SIL OFL)
scripts/plates/           Python renderers that produced the architectural plates
```

## Languages (Arabic first)

- **URLs:** every public page exists at `/ar/…` and `/en/…` with the same slug.
  Unprefixed URLs (`/`, `/about`, old links) redirect (307) to the visitor's
  saved choice (`diwan_lang` cookie, set only when they use the switcher), else
  to the default language in Site Settings (Arabic). Choosing English is never
  overridden.
- **Switcher:** the ع / EN pill in the header and mobile menu links to the same
  page in the other language, keeping query and hash.
- **Direction:** `<html lang dir>` comes from the route. Layout uses logical
  CSS properties; GSAP reveals and the horizontal experience track read the
  document direction (`src/animation/gsap.ts`). Arabic text uses Amiri for
  display and IBM Plex Sans Arabic for reading.
- **SEO:** localized titles and descriptions, canonical per language,
  `hreflang` ar/en/x-default (x-default = default language), Open Graph locale,
  and a sitemap listing both languages. `noindex` stays until
  `NEXT_PUBLIC_SITE_INDEXABLE=true`.
- **Content model:** every editable text is `{ en, ar }`. Collections store
  English in the original columns and Arabic in `*_ar` columns
  (migration `20261013100000_bilingual_cms.sql`); sections and settings store
  `{ en, ar }` in JSON. When one language is empty the other is shown (marked
  with the right `lang`), so a page is never blank and never shows raw keys.
- **Translation review:** each editor shows Arabic/English status — *missing*
  (filled in one language only), *needs review* (machine-prepared or unchecked
  translation) or *complete*. Tick "Arabic text reviewed" once a native
  reader has checked it. The dashboard lists the status of every section and
  collection. All Arabic prepared for this upgrade is marked *needs review*.

### Text that is not editable in the CMS (by design)

- The DIWAN Latin wordmark letters are editable; the gold rule and lockup are design.
- The section index numerals (01, 02 …) follow the visible order automatically.
- The bilingual 404 for URLs outside `/ar` and `/en` (`app/global-not-found.tsx`)
  is static: it renders before any data loads.
- The hidden anti-spam field label ("Company") in the contact form is never shown.
- Admin interface labels are in English with Arabic field names alongside.

## Art direction

- **Palette:** near-black stone (`#070706`), warm ivory (`#F2EBDD`) and an antique-gold scale (`--gold-100` → `--accent-deep`). Gold is kept to italics, hairlines, numerals and keylines.
- **Type:** Cormorant Garamond for display (ivory roman, gold italic), Manrope for reading, IBM Plex Mono for docket-style metadata, and Amiri — a revival of Cairo's Bulaq press Naskh — for Arabic counterparts to the name, tagline and section labels.
- **Imagery:** the hero photograph appears only in the hero. Every other image is one of six original architectural plates (hypostyle hall, neoclassical portico, mashrabiya light) rendered procedurally by `scripts/plates/` and registered in `src/content/plates.ts`. To use real photography instead, replace a plate's files in `src/assets/plates/` and `src/assets/previews/` (keeping names), or point its entry at new imports.
- **Ornament:** `GeometricPattern` draws an eight-pointed-star (khatam) lattice in hairlines, used faintly in the experience section, contact section, footer and mobile menu.

## CMS

**Data flow:** Supabase → `src/lib/cms/repository.ts` (server-only) → pages in
`src/app/[lang]` → the existing presentation components → the existing GSAP
animations. The CMS controls content only; layout and motion stay in code.

- **Admin** (`/admin`): Dashboard (with translation status), Enquiries,
  Homepage (every section, plus order & visibility), About (add, remove,
  hide and reorder sections), Index pages & SEO, Practice Areas, People,
  Insights (draft → in review → published, with legal-review flag), Values,
  Navigation & Footer, Interface text, Site Settings (names, logo, favicon,
  share image, default language, contact details, social links), Media.
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
  (Supabase Storage bucket `media`), each with Arabic and English alt text and
  caption. Resetting an image returns it to its original plate. The library
  searches and filters uploads, shows where each is used, replaces a file in
  place (every use updates) and refuses to delete an image in use (checked
  again on the server). The geometric pattern, grain and portrait placeholder
  are drawn in code and are not images.
- **Enquiries:** the contact form posts to `/api/contact` (size limit,
  honeypot, per-IP rate limit, zod validation) and is stored with the
  service role — the database is the source of truth. An optional Resend
  notification (name + admin link only) follows; its failure never affects
  the stored enquiry. Enquiries and internal notes are readable only by admins.

Schema, RLS policies and storage rules: `supabase/migrations/20260930100000_diwan_cms.sql`;
Arabic columns and the review status: `supabase/migrations/20261013100000_bilingual_cms.sql`.

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
- **Metadata**: per-page titles, descriptions, canonical URLs, `hreflang` and Open Graph/Twitter tags come from `pageMetadata()` in `src/content/seo.ts`, with text from Admin → Index pages & SEO; the default share image is `public/opengraph-image.jpg` (replace it in Site Settings).

## Contact form

Fields: name, phone and issue (required), email (optional). Labels, errors and
the success message follow the page language (Admin → Interface text and
Homepage → Contact); Arabic-Indic digits are accepted in the phone number. Submissions are
stored in the `enquiries` table and appear under Admin → Enquiries (unread
first, with status and internal notes). See `.env.example` for the optional
e-mail notification.

## Motion

- Every animation is gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get static, fully visible layouts, no pinning and native scrolling.
- Elements marked `data-reveal` start hidden only when JavaScript runs, with a CSS failsafe that reveals them after 3s.
- Pinned/horizontal sections run on tablet/desktop only; mobile gets a simplified vertical flow.
