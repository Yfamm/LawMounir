-- =============================================================================
-- DIWAN CMS — schema, row-level security and storage
-- =============================================================================
-- Public visitors (anon) may only READ published content. Every write happens
-- either through an authenticated admin session (checked by is_admin() in RLS
-- and again in server code) or through the server-side service role (public
-- enquiry intake). Enquiries are never readable by anon.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- helpers

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- admins

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- An admin can see their own membership row; nobody can write through the API.
create policy "admins read own membership" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------- media

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  url text not null,
  alt text not null default '',
  caption text not null default '',
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0),
  width integer,
  height integer,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger media_updated before update on public.media for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- site settings (single row)

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated before update on public.site_settings for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- navigation

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 60),
  href text not null check (href ~ '^(/|https?://|mailto:|tel:|#)'),
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger navigation_items_updated before update on public.navigation_items for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- page sections (structured JSON per section)

create table public.page_sections (
  key text primary key check (key ~ '^(home|about|contact)\.[a-z_]+$'),
  data jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger page_sections_updated before update on public.page_sections for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- values

create table public.firm_values (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null default '',
  body_en text not null default '',
  body_ar text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger firm_values_updated before update on public.firm_values for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- practice areas

create table public.practice_areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  title_ar text not null default '',
  summary text not null default '',
  overview text not null default '',
  scope text[] not null default '{}',
  forums text[] not null default '{}',
  image jsonb not null default '{}'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  sources text[] not null default '{}',
  verify text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger practice_areas_updated before update on public.practice_areas for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- people

create table public.people (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null default '',
  title_en text not null default '',
  title_ar text not null default '',
  practice text not null default '',
  bio_short text not null default '',
  bio_full text not null default '',
  portrait jsonb not null default '{}'::jsonb,
  education text not null default '',
  languages text not null default '',
  admission text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger people_updated before update on public.people for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- insights

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  title_ar text not null default '',
  excerpt text not null default '',
  excerpt_ar text not null default '',
  body text not null default '',
  author text not null default '',
  cover jsonb not null default '{}'::jsonb,
  category text not null default 'Legal Updates',
  published_on date,
  reading_time text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  legal_review text not null default 'pending' check (legal_review in ('pending', 'approved')),
  verify text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger insights_updated before update on public.insights for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- enquiries (confidential)

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  phone text not null check (char_length(phone) between 5 and 40),
  email text check (email is null or char_length(email) <= 200),
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  internal_note text not null default '',
  read_at timestamptz,
  handled_by uuid references auth.users (id) on delete set null,
  source_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_created_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create trigger enquiries_updated before update on public.enquiries for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- rate limiting (service role only)

create table public.rate_limit_events (
  id bigserial primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_key_idx on public.rate_limit_events (key, created_at desc);

-- Records a hit and returns true while the key is within its allowance.
create or replace function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  hits integer;
begin
  delete from public.rate_limit_events where created_at < now() - interval '1 day';
  select count(*) into hits from public.rate_limit_events
    where key = p_key and created_at > now() - make_interval(secs => p_window_seconds);
  if hits >= p_limit then
    return false;
  end if;
  insert into public.rate_limit_events (key) values (p_key);
  return true;
end $$;

revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;

-- ---------------------------------------------------------------- media usage (for safe deletion)

create or replace function public.media_usage(p_media uuid)
returns integer
language sql stable security definer set search_path = public
as $$
  select
    (select count(*) from public.page_sections where data::text like '%' || p_media::text || '%')
  + (select count(*) from public.site_settings where data::text like '%' || p_media::text || '%')
  + (select count(*) from public.practice_areas where image::text like '%' || p_media::text || '%')
  + (select count(*) from public.people where portrait::text like '%' || p_media::text || '%')
  + (select count(*) from public.insights where cover::text like '%' || p_media::text || '%')
$$;

revoke all on function public.media_usage(uuid) from public, anon;
grant execute on function public.media_usage(uuid) to authenticated;

-- =============================================================================
-- Row-level security
-- =============================================================================

alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.page_sections enable row level security;
alter table public.firm_values enable row level security;
alter table public.practice_areas enable row level security;
alter table public.people enable row level security;
alter table public.insights enable row level security;
alter table public.enquiries enable row level security;
alter table public.rate_limit_events enable row level security;

-- Public read of published content ------------------------------------------
create policy "public read media" on public.media for select to anon, authenticated using (true);
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public read visible nav" on public.navigation_items for select to anon, authenticated using (visible or public.is_admin());
create policy "public read enabled sections" on public.page_sections for select to anon, authenticated using (enabled or public.is_admin());
create policy "public read published values" on public.firm_values for select to anon, authenticated using (published or public.is_admin());
create policy "public read published practice" on public.practice_areas for select to anon, authenticated using (published or public.is_admin());
create policy "public read published people" on public.people for select to anon, authenticated using (published or public.is_admin());
create policy "public read published insights" on public.insights for select to anon, authenticated using (status = 'published' or public.is_admin());

-- Admin writes ----------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['media', 'site_settings', 'navigation_items', 'page_sections', 'firm_values', 'practice_areas', 'people', 'insights']
  loop
    execute format('create policy "admin insert %1$s" on public.%1$I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update %1$s" on public.%1$I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete %1$s" on public.%1$I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- Enquiries: admins only. No anon policy exists, so anon cannot read or write;
-- public intake goes through the server using the service role.
create policy "admin read enquiries" on public.enquiries for select to authenticated using (public.is_admin());
create policy "admin update enquiries" on public.enquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete enquiries" on public.enquiries for delete to authenticated using (public.is_admin());

-- rate_limit_events: no policies → only the service role (bypasses RLS) and the
-- security-definer function can touch it.

-- Defence in depth: remove table privileges anon never needs.
revoke insert, update, delete on all tables in schema public from anon;
revoke all on public.enquiries from anon;
revoke all on public.rate_limit_events from anon, authenticated;

-- =============================================================================
-- Storage: public-read media bucket, admin-only writes
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do nothing;

create policy "media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
