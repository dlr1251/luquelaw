-- Norms reference library: statutes, codes, resolutions (EN/ES).
-- Reuses is_clkr_admin() for CMS access.

create table if not exists public.norms (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  short_title text,
  description text not null,
  norm_type text not null check (norm_type in ('constitution', 'resolution', 'code', 'law')),
  category text not null check (
    category in (
      'constitutional',
      'immigration',
      'civil',
      'criminal',
      'labor',
      'commercial',
      'administrative',
      'procedural'
    )
  ),
  official_reference text not null,
  official_source_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  translation_group_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create index if not exists norms_hub_idx
  on public.norms (locale, status, sort_order);

create index if not exists norms_translation_group_idx
  on public.norms (translation_group_id);

alter table public.norms enable row level security;

create policy "norms_select_published"
  on public.norms
  for select
  using (status = 'published');

create policy "norms_select_admin"
  on public.norms
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "norms_insert_admin"
  on public.norms
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "norms_update_admin"
  on public.norms
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norms_delete_admin"
  on public.norms
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.norms to anon, authenticated;
grant insert, update, delete on public.norms to authenticated;

create table if not exists public.norm_sections (
  id uuid primary key default gen_random_uuid(),
  norm_id uuid not null references public.norms (id) on delete cascade,
  parent_id uuid references public.norm_sections (id) on delete cascade,
  section_key text not null,
  title text not null,
  number_label text,
  html text,
  sort_order int not null default 0,
  depth int not null default 0 check (depth >= 0),
  translation_group_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (norm_id, section_key)
);

create index if not exists norm_sections_norm_idx
  on public.norm_sections (norm_id, sort_order);

create index if not exists norm_sections_parent_idx
  on public.norm_sections (parent_id);

alter table public.norm_sections enable row level security;

create policy "norm_sections_select_published"
  on public.norm_sections
  for select
  using (
    exists (
      select 1
      from public.norms n
      where n.id = norm_sections.norm_id
        and n.status = 'published'
    )
  );

create policy "norm_sections_select_admin"
  on public.norm_sections
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "norm_sections_insert_admin"
  on public.norm_sections
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "norm_sections_update_admin"
  on public.norm_sections
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "norm_sections_delete_admin"
  on public.norm_sections
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.norm_sections to anon, authenticated;
grant insert, update, delete on public.norm_sections to authenticated;

create or replace function public.norms_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norms_updated_at on public.norms;
create trigger norms_updated_at
  before update on public.norms
  for each row execute function public.norms_set_updated_at();

create or replace function public.norm_sections_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norm_sections_updated_at on public.norm_sections;
create trigger norm_sections_updated_at
  before update on public.norm_sections
  for each row execute function public.norm_sections_set_updated_at();

-- Seed catalog (content to be filled via /admin/norms)
do $$
declare
  rec record;
begin
  for rec in
    select *
    from (
      values
        (
          'constitucion-colombia'::text,
          'a1000001-0001-4000-8000-000000000001'::uuid,
          'constitution'::text,
          'constitutional'::text,
          0::int,
          'Constitución Política de Colombia de 1991',
          'Political Constitution of Colombia (1991)',
          'Texto constitucional de referencia — navegación por títulos, capítulos y artículos.',
          'Constitutional reference text — browse by titles, chapters, and articles.',
          'Constitución Política de Colombia (1991)'
        ),
        (
          'resolucion-5477-2022',
          'a1000001-0001-4000-8000-000000000002'::uuid,
          'resolution',
          'immigration',
          10,
          'Resolución 5477 de 2022 (Visas)',
          'Resolution 5477 of 2022 (Visas)',
          'Reglamentación de visas colombianas — referencia para categorías M, V, R y trámites migratorios.',
          'Colombian visa regulation — reference for M, V, R categories and immigration procedures.',
          'Resolución 5477 de 2022 — Cancillería'
        ),
        (
          'codigo-civil',
          'a1000001-0001-4000-8000-000000000003'::uuid,
          'code',
          'civil',
          20,
          'Código Civil',
          'Civil Code',
          'Código civil colombiano — obligaciones, contratos, bienes, sucesiones y familia.',
          'Colombian Civil Code — obligations, contracts, property, succession, and family.',
          'Decreto 410 de 1971 (Código Civil)'
        ),
        (
          'codigo-general-del-proceso',
          'a1000001-0001-4000-8000-000000000004'::uuid,
          'code',
          'procedural',
          30,
          'Código General del Proceso',
          'General Code of Procedure',
          'Normas procesales generales — demanda, prueba, recursos y ejecución.',
          'General procedural rules — claims, evidence, appeals, and enforcement.',
          'Ley 1564 de 2012 (CGP)'
        ),
        (
          'codigo-de-comercio',
          'a1000001-0001-4000-8000-000000000005'::uuid,
          'code',
          'commercial',
          40,
          'Código de Comercio',
          'Commercial Code',
          'Derecho mercantil colombiano — comerciantes, títulos valores, sociedades mercantiles.',
          'Colombian commercial law — merchants, negotiable instruments, commercial companies.',
          'Decreto 410 de 1971 (Libro II — Comercio)'
        ),
        (
          'ley-sas',
          'a1000001-0001-4000-8000-000000000006'::uuid,
          'law',
          'commercial',
          50,
          'Ley de las SAS',
          'Simplified Stock Company Law (SAS)',
          'Ley 1258 de 2008 — sociedad por acciones simplificada: constitución, reformas y gobierno corporativo.',
          'Law 1258 of 2008 — simplified stock company (SAS): incorporation, amendments, and governance.',
          'Ley 1258 de 2008 (SAS)'
        ),
        (
          'codigo-sustantivo-del-trabajo',
          'a1000001-0001-4000-8000-000000000007'::uuid,
          'code',
          'labor',
          60,
          'Código Sustantivo del Trabajo',
          'Substantive Labor Code',
          'Relaciones laborales individuales y colectivas — contrato, jornada, terminación, seguridad social.',
          'Individual and collective labor relations — contract, hours, termination, social security.',
          'Decreto 2663 de 1950 (CST)'
        ),
        (
          'codigo-penal',
          'a1000001-0001-4000-8000-000000000008'::uuid,
          'code',
          'criminal',
          70,
          'Código Penal',
          'Penal Code',
          'Delitos, penas y responsabilidad penal — referencia sustantiva.',
          'Crimes, penalties, and criminal liability — substantive reference.',
          'Ley 599 de 2000 (Código Penal)'
        ),
        (
          'cpaca',
          'a1000001-0001-4000-8000-000000000009'::uuid,
          'code',
          'administrative',
          80,
          'CPACA',
          'Administrative Procedure and Administrative Litigation Code (CPACA)',
          'Ley 1437 de 2011 — actos administrativos, procedimiento y contencioso administrativo.',
          'Law 1437 of 2011 — administrative acts, procedure, and administrative litigation.',
          'Ley 1437 de 2011 (CPACA)'
        ),
        (
          'codigo-procedimiento-laboral-penal',
          'a1000001-0001-4000-8000-000000000010'::uuid,
          'code',
          'procedural',
          90,
          'Código de Procedimiento Laboral y Penal',
          'Labor and Criminal Procedure Codes',
          'Procedimiento laboral (Ley 712/2001) y procedimiento penal (Ley 906/2004) — referencia procesal.',
          'Labor procedure (Law 712/2001) and criminal procedure (Law 906/2004) — procedural reference.',
          'Ley 712 de 2001 · Ley 906 de 2004'
        )
    ) as seed (
      slug_key,
      translation_group_id,
      norm_type,
      category,
      sort_order,
      title_es,
      title_en,
      description_es,
      description_en,
      official_reference
    )
  loop
    insert into public.norms (
      slug_key,
      locale,
      title,
      short_title,
      description,
      norm_type,
      category,
      official_reference,
      status,
      sort_order,
      translation_group_id,
      published_at
    ) values
    (
      rec.slug_key,
      'es',
      rec.title_es,
      null,
      rec.description_es,
      rec.norm_type,
      rec.category,
      rec.official_reference,
      'published',
      rec.sort_order,
      rec.translation_group_id,
      now()
    ),
    (
      rec.slug_key,
      'en',
      rec.title_en,
      null,
      rec.description_en,
      rec.norm_type,
      rec.category,
      rec.official_reference,
      'published',
      rec.sort_order,
      rec.translation_group_id,
      now()
    )
    on conflict (slug_key, locale) do nothing;
  end loop;
end $$;

-- Seed overview sections for each norm
insert into public.norm_sections (norm_id, parent_id, section_key, title, number_label, html, sort_order, depth)
select
  n.id,
  null,
  'overview',
  case n.locale when 'es' then 'Generalidades' else 'Overview' end,
  null,
  case n.locale
    when 'es' then
      '<p>Texto normativo de <strong>referencia</strong>. El contenido completo se irá cargando por secciones. Consulte siempre la fuente oficial vigente antes de tomar decisiones.</p><p><em>Fuente:</em> '
      || n.official_reference
      || '</p>'
    else
      '<p><strong>Reference</strong> normative text. Full content will be loaded section by section. Always verify the current official source before acting.</p><p><em>Source:</em> '
      || n.official_reference
      || '</p>'
  end,
  0,
  0
from public.norms n
where not exists (
  select 1
  from public.norm_sections s
  where s.norm_id = n.id
    and s.section_key = 'overview'
);
