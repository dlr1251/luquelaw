-- Seed catalog rows for Migración Colombia resolutions used by Lucy Immigration RAG.
-- Section bodies are loaded via: npm run import:suin-norm -- --slug <slug> --apply

do $$
declare
  rec record;
begin
  for rec in
    select *
    from (
      values
        (
          'resolucion-2061-2020'::text,
          'a1000001-0001-4000-8000-000000000011'::uuid,
          'resolution'::text,
          'immigration'::text,
          11::int,
          'Resolución 2061 de 2020 (Trámites de Extranjería)',
          'Resolution 2061 of 2020 (Extranjería Procedures)',
          'Resolución Única de Trámites de Migración Colombia — registro, cédula de extranjería, PTP/prórrogas, salvoconductos y CMM.',
          'Migración Colombia unified procedure resolution — foreigner registration, cédula de extranjería, PTP/extensions, safe-conducts, and CMM.',
          'Resolución 2061 de 2020 — Migración Colombia'
        ),
        (
          'resolucion-2357-2020',
          'a1000001-0001-4000-8000-000000000012'::uuid,
          'resolution',
          'immigration',
          12,
          'Resolución 2357 de 2020 (Obligaciones y Sanciones)',
          'Resolution 2357 of 2020 (Obligations and Sanctions)',
          'Criterios para obligaciones migratorias (SIRE) y procedimiento sancionatorio de Migración Colombia.',
          'Criteria for immigration compliance obligations (SIRE) and Migración Colombia’s sanction procedure.',
          'Resolución 2357 de 2020 — Migración Colombia'
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
    on conflict (slug_key, locale) do update set
      title = excluded.title,
      description = excluded.description,
      norm_type = excluded.norm_type,
      category = excluded.category,
      official_reference = excluded.official_reference,
      status = excluded.status,
      sort_order = excluded.sort_order,
      translation_group_id = excluded.translation_group_id,
      published_at = coalesce(public.norms.published_at, excluded.published_at),
      updated_at = now();
  end loop;
end $$;
