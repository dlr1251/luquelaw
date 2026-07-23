-- Admin team allowlist + firm doctrinal commentaries on norm sections.

insert into public.admin_allowlist (email)
values
  ('daniel@luquelaw.co'),
  ('asistente@luquelaw.co'),
  ('mateo.abogado1@gmail.com'),
  ('camiloauribeg@gmail.com')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- Doctrinal commentaries (firm-authored; distinct from user norm_comments)
-- ---------------------------------------------------------------------------
create table if not exists public.norm_doctrinal_commentaries (
  id uuid primary key default gen_random_uuid(),
  norm_id uuid not null references public.norms (id) on delete cascade,
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  body_markdown text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists norm_doctrinal_commentaries_section_idx
  on public.norm_doctrinal_commentaries (section_id, status, sort_order);

create index if not exists norm_doctrinal_commentaries_norm_idx
  on public.norm_doctrinal_commentaries (norm_id, locale, status);

create index if not exists norm_doctrinal_commentaries_admin_idx
  on public.norm_doctrinal_commentaries (locale, status, updated_at desc);

create or replace function public.norm_doctrinal_commentaries_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norm_doctrinal_commentaries_updated_at on public.norm_doctrinal_commentaries;
create trigger norm_doctrinal_commentaries_updated_at
  before update on public.norm_doctrinal_commentaries
  for each row execute function public.norm_doctrinal_commentaries_set_updated_at();

-- Keep norm_id aligned with section's norm
create or replace function public.norm_doctrinal_commentaries_enforce_section()
returns trigger
language plpgsql
as $$
declare
  section_norm uuid;
begin
  select norm_id into section_norm
  from public.norm_sections
  where id = new.section_id;

  if section_norm is null then
    raise exception 'Section not found';
  end if;

  if new.norm_id is distinct from section_norm then
    raise exception 'Commentary norm_id must match section.norm_id';
  end if;

  return new;
end;
$$;

drop trigger if exists norm_doctrinal_commentaries_enforce_section
  on public.norm_doctrinal_commentaries;
create trigger norm_doctrinal_commentaries_enforce_section
  before insert or update of norm_id, section_id on public.norm_doctrinal_commentaries
  for each row execute function public.norm_doctrinal_commentaries_enforce_section();

alter table public.norm_doctrinal_commentaries enable row level security;

create policy "norm_doctrinal_commentaries_select_published"
  on public.norm_doctrinal_commentaries
  for select
  using (status = 'published' or public.is_clkr_admin());

create policy "norm_doctrinal_commentaries_insert_admin"
  on public.norm_doctrinal_commentaries
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "norm_doctrinal_commentaries_update_admin"
  on public.norm_doctrinal_commentaries
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norm_doctrinal_commentaries_delete_admin"
  on public.norm_doctrinal_commentaries
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.norm_doctrinal_commentaries to anon, authenticated;
grant insert, update, delete on public.norm_doctrinal_commentaries to authenticated;
