-- CLKR hub: ordering, visibility, optional title/description overrides.
-- Writes: users in admin_allowlist (by email) OR JWT app_metadata.role = 'admin'.
-- 1) Insert your Supabase Auth email: insert into public.admin_allowlist (email) values ('you@domain.com');
-- 2) Or set App metadata on the user in Dashboard: {"role":"admin"}

create table if not exists public.admin_allowlist (
  email text primary key
);

create table if not exists public.clkr_article_settings (
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  sort_order int not null default 0,
  is_hidden boolean not null default false,
  title_override text,
  description_override text,
  updated_at timestamptz not null default now(),
  primary key (slug_key, locale)
);

alter table public.clkr_article_settings enable row level security;

create or replace function public.is_clkr_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((auth.jwt()->'app_metadata'->>'role'), '') = 'admin'
    or exists (
      select 1
      from public.admin_allowlist a
      where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
    );
$$;

create policy "clkr_settings_select_public"
  on public.clkr_article_settings
  for select
  using (true);

create policy "clkr_settings_insert_admin"
  on public.clkr_article_settings
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "clkr_settings_update_admin"
  on public.clkr_article_settings
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "clkr_settings_delete_admin"
  on public.clkr_article_settings
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant execute on function public.is_clkr_admin() to authenticated;

grant select on public.clkr_article_settings to anon, authenticated;
grant insert, update, delete on public.clkr_article_settings to authenticated;

alter table public.admin_allowlist enable row level security;
