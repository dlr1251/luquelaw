-- User saves (guides, norms, posts) + profile reputation for community

-- ---------------------------------------------------------------------------
-- user_saves
-- ---------------------------------------------------------------------------
create table if not exists public.user_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('guide', 'norm', 'post')),
  target_slug text not null,
  title text not null default '',
  locale text not null default 'en' check (locale in ('en', 'es')),
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_slug, locale)
);

create index if not exists user_saves_user_created_idx
  on public.user_saves (user_id, created_at desc);

alter table public.user_saves enable row level security;

create policy "user_saves_select_own"
  on public.user_saves for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_saves_insert_own"
  on public.user_saves for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_saves_delete_own"
  on public.user_saves for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- profiles: forum reputation + short bio
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists reputation integer not null default 0,
  add column if not exists about_short text;

comment on column public.profiles.reputation is 'Community forum reputation points';
comment on column public.profiles.about_short is 'Short public bio for community profile';
