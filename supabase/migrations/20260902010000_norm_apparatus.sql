-- Annotated statute apparatus (DIAN-style), citation graph, authorities, translator notes.

create table if not exists public.legal_authorities (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null unique,
  kind text not null check (
    kind in (
      'statute',
      'decree',
      'resolution',
      'judgment',
      'dian_doctrine',
      'constitution',
      'other'
    )
  ),
  title text not null,
  title_en text,
  citation_label text not null,
  official_source_url text,
  dian_file text unique,
  ingest_status text not null default 'stub' check (
    ingest_status in ('stub', 'ingested', 'published')
  ),
  listed_in_hub boolean not null default false,
  target_norm_slug_key text,
  html_es text,
  html_en text,
  citation_count int not null default 0,
  year int,
  number_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legal_authorities_kind_idx
  on public.legal_authorities (kind, citation_count desc);

create index if not exists legal_authorities_status_idx
  on public.legal_authorities (ingest_status, citation_count desc);

create table if not exists public.norm_section_apparatus (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  kind text not null check (
    kind in (
      'vigencia',
      'concordancias',
      'jurisprudencia',
      'jurisprudencia_vigencia',
      'doctrina',
      'legislacion_anterior',
      'editor_dian'
    )
  ),
  anchor_key text,
  sort_order int not null default 0,
  html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists norm_section_apparatus_section_idx
  on public.norm_section_apparatus (section_id, sort_order);

create table if not exists public.norm_citations (
  id uuid primary key default gen_random_uuid(),
  apparatus_id uuid not null references public.norm_section_apparatus (id) on delete cascade,
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  dian_file text not null,
  dian_anchor text,
  label text not null,
  target_authority_id uuid references public.legal_authorities (id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists norm_citations_section_idx
  on public.norm_citations (section_id, sort_order);

create index if not exists norm_citations_authority_idx
  on public.norm_citations (target_authority_id);

create index if not exists norm_citations_file_idx
  on public.norm_citations (dian_file);

create table if not exists public.norm_translation_notes (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  span_es text not null,
  rendering_us text not null,
  variant_uk text,
  risk text not null default 'medium' check (risk in ('low', 'medium', 'high')),
  note_html text not null,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists norm_translation_notes_section_idx
  on public.norm_translation_notes (section_id, status, sort_order);

create index if not exists norm_translation_notes_admin_idx
  on public.norm_translation_notes (risk, status, updated_at desc);

create or replace function public.legal_authorities_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists legal_authorities_updated_at on public.legal_authorities;
create trigger legal_authorities_updated_at
  before update on public.legal_authorities
  for each row execute function public.legal_authorities_set_updated_at();

create or replace function public.norm_section_apparatus_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norm_section_apparatus_updated_at on public.norm_section_apparatus;
create trigger norm_section_apparatus_updated_at
  before update on public.norm_section_apparatus
  for each row execute function public.norm_section_apparatus_set_updated_at();

create or replace function public.norm_translation_notes_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norm_translation_notes_updated_at on public.norm_translation_notes;
create trigger norm_translation_notes_updated_at
  before update on public.norm_translation_notes
  for each row execute function public.norm_translation_notes_set_updated_at();

alter table public.legal_authorities enable row level security;
alter table public.norm_section_apparatus enable row level security;
alter table public.norm_citations enable row level security;
alter table public.norm_translation_notes enable row level security;

create policy "legal_authorities_select_public"
  on public.legal_authorities
  for select
  using (true);

create policy "legal_authorities_write_admin"
  on public.legal_authorities
  for all
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norm_section_apparatus_select_published"
  on public.norm_section_apparatus
  for select
  using (
    exists (
      select 1
      from public.norm_sections s
      join public.norms n on n.id = s.norm_id
      where s.id = norm_section_apparatus.section_id
        and n.status = 'published'
    )
  );

create policy "norm_section_apparatus_select_admin"
  on public.norm_section_apparatus
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "norm_section_apparatus_write_admin"
  on public.norm_section_apparatus
  for all
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norm_citations_select_published"
  on public.norm_citations
  for select
  using (
    exists (
      select 1
      from public.norm_sections s
      join public.norms n on n.id = s.norm_id
      where s.id = norm_citations.section_id
        and n.status = 'published'
    )
  );

create policy "norm_citations_select_admin"
  on public.norm_citations
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "norm_citations_write_admin"
  on public.norm_citations
  for all
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norm_translation_notes_select_published"
  on public.norm_translation_notes
  for select
  using (
    status = 'published'
    and exists (
      select 1
      from public.norm_sections s
      join public.norms n on n.id = s.norm_id
      where s.id = norm_translation_notes.section_id
        and n.status = 'published'
    )
  );

create policy "norm_translation_notes_select_admin"
  on public.norm_translation_notes
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "norm_translation_notes_write_admin"
  on public.norm_translation_notes
  for all
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

grant select on public.legal_authorities to anon, authenticated;
grant insert, update, delete on public.legal_authorities to authenticated;

grant select on public.norm_section_apparatus to anon, authenticated;
grant insert, update, delete on public.norm_section_apparatus to authenticated;

grant select on public.norm_citations to anon, authenticated;
grant insert, update, delete on public.norm_citations to authenticated;

grant select on public.norm_translation_notes to anon, authenticated;
grant insert, update, delete on public.norm_translation_notes to authenticated;
