-- =============================================================================
-- DIWAN CMS — Arabic-first bilingual content (additive)
-- =============================================================================
-- Safe to run on a database that already holds content: only adds columns,
-- relaxes two CHECK constraints and adds one function. Nothing is dropped,
-- renamed or deleted. Existing unsuffixed text columns remain the ENGLISH
-- version; the new *_ar columns hold the ARABIC version.
--
-- `translations` (jsonb, per row) records the review state of each language,
-- e.g. {"ar": "needs_review"}. An absent key means "no review flag"; the admin
-- computes completeness from the content itself.
-- =============================================================================

-- ---------------------------------------------------------------- practice areas
alter table public.practice_areas
  add column if not exists summary_ar text not null default '',
  add column if not exists overview_ar text not null default '',
  add column if not exists scope_ar text[] not null default '{}',
  add column if not exists forums_ar text[] not null default '{}',
  add column if not exists seo_title_ar text not null default '',
  add column if not exists seo_description_ar text not null default '',
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------- people
alter table public.people
  add column if not exists practice_ar text not null default '',
  add column if not exists bio_short_ar text not null default '',
  add column if not exists bio_full_ar text not null default '',
  add column if not exists education_ar text not null default '',
  add column if not exists languages_ar text not null default '',
  add column if not exists admission_ar text not null default '',
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------- insights
alter table public.insights
  add column if not exists body_ar text not null default '',
  add column if not exists author_ar text not null default '',
  add column if not exists category_ar text not null default '',
  add column if not exists reading_time_ar text not null default '',
  add column if not exists seo_title_ar text not null default '',
  add column if not exists seo_description_ar text not null default '',
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- Editorial workflow: draft → review → published. Only "published" is public
-- (the existing RLS policy checks status = 'published', so "review" stays private).
alter table public.insights drop constraint if exists insights_status_check;
alter table public.insights
  add constraint insights_status_check check (status in ('draft', 'review', 'published'));

-- ---------------------------------------------------------------- values
alter table public.firm_values
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------- navigation
alter table public.navigation_items
  add column if not exists label_ar text not null default '';

-- ---------------------------------------------------------------- media
alter table public.media
  add column if not exists alt_ar text not null default '',
  add column if not exists caption_ar text not null default '';

-- ---------------------------------------------------------------- page sections
-- Allow keys for the new localized sections (ui strings, page meta, index pages).
alter table public.page_sections drop constraint if exists page_sections_key_check;
alter table public.page_sections
  add constraint page_sections_key_check check (key ~ '^(home|about|contact|practice|people|insights|ui|seo)\.[a-z_]+$');

-- ---------------------------------------------------------------- media usage
-- Settings images (logo, favicon, share image) live in site_settings.data and
-- are already covered by media_usage(); nothing to change there.
