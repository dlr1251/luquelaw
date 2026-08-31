-- Archive CLKR guides that duplicate the immigration visas catalog.
-- Detail content lives under /services/immigration/visas (and ES equivalent).

update public.clkr_articles
set status = 'archived',
    updated_at = now()
where slug_key in (
  'investor-visa',
  'visitor-visa-type-v',
  'resident-visa-type-r',
  'digital-nomad-visa-type-m',
  'migrant-visa-type-m-investor',
  'migrant-visa-type-m-worker',
  'migrant-visa-type-m-pensioner-rentier',
  'migrant-visa-type-m-categories-requirements'
)
and status = 'published';

update public.visa_categories
set related_guide_slug = null
where related_guide_slug in (
  'investor-visa',
  'visitor-visa-type-v',
  'resident-visa-type-r',
  'digital-nomad-visa-type-m',
  'migrant-visa-type-m-investor',
  'migrant-visa-type-m-worker',
  'migrant-visa-type-m-pensioner-rentier',
  'migrant-visa-type-m-categories-requirements'
);

delete from public.clkr_study_path_steps
where article_id in (
  select id from public.clkr_articles
  where slug_key in (
    'investor-visa',
    'visitor-visa-type-v',
    'resident-visa-type-r',
    'digital-nomad-visa-type-m',
    'migrant-visa-type-m-investor',
    'migrant-visa-type-m-worker',
    'migrant-visa-type-m-pensioner-rentier',
    'migrant-visa-type-m-categories-requirements'
  )
);

delete from public.clkr_study_paths sp
where slug_key in ('immigration-fundamentals', 'fundamentos-inmigracion')
and not exists (
  select 1 from public.clkr_study_path_steps s where s.study_path_id = sp.id
);

update public.clkr_prompts
set article_slug_key = null
where article_slug_key in (
  'investor-visa',
  'visitor-visa-type-v',
  'resident-visa-type-r',
  'digital-nomad-visa-type-m',
  'migrant-visa-type-m-investor',
  'migrant-visa-type-m-worker',
  'migrant-visa-type-m-pensioner-rentier',
  'migrant-visa-type-m-categories-requirements'
);

update public.clkr_skills
set article_slug_key = null
where article_slug_key in (
  'investor-visa',
  'visitor-visa-type-v',
  'resident-visa-type-r',
  'digital-nomad-visa-type-m',
  'migrant-visa-type-m-investor',
  'migrant-visa-type-m-worker',
  'migrant-visa-type-m-pensioner-rentier',
  'migrant-visa-type-m-categories-requirements'
);
