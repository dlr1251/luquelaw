-- Seed data for CLKR study paths and article relations
-- Run this after the clkr_study_paths migration

-- First, we need to get the article IDs for linking
-- This assumes articles already exist with these slug_keys

-- Immigration study path (English)
insert into public.clkr_study_paths (slug_key, locale, title, description, category, difficulty, estimated_time, sort_order, status)
values (
  'immigration-fundamentals',
  'en',
  'Immigration Fundamentals',
  'Learn the essential requirements and procedures for immigrating to Colombia, from visitor visas to permanent residency. Perfect for digital nomads, investors, and those planning long-term stays.',
  'Immigration',
  'beginner',
  '2 hours',
  1,
  'published'
) on conflict (slug_key, locale) do nothing;

-- Real Estate study path (English)
insert into public.clkr_study_paths (slug_key, locale, title, description, category, difficulty, estimated_time, sort_order, status)
values (
  'real-estate-investment',
  'en',
  'Real Estate Investment in Colombia',
  'Master the process of buying, selling, and investing in Colombian real estate. Covers legal requirements, contracts, taxes, and property management fundamentals.',
  'Real Estate',
  'intermediate',
  '3 hours',
  2,
  'published'
) on conflict (slug_key, locale) do nothing;

-- Immigration study path (Spanish)
insert into public.clkr_study_paths (slug_key, locale, title, description, category, difficulty, estimated_time, sort_order, status)
values (
  'fundamentos-inmigracion',
  'es',
  'Fundamentos de inmigración',
  'Aprende los requisitos y procedimientos esenciales para inmigrar a Colombia, desde visas de visitante hasta residencia permanente. Perfecto para nómadas digitales, inversionistas y quienes planean estadías prolongadas.',
  'Immigration',
  'beginner',
  '2 horas',
  1,
  'published'
) on conflict (slug_key, locale) do nothing;

-- Real Estate study path (Spanish)
insert into public.clkr_study_paths (slug_key, locale, title, description, category, difficulty, estimated_time, sort_order, status)
values (
  'inversion-inmobiliaria',
  'es',
  'Inversión inmobiliaria en Colombia',
  'Domina el proceso de comprar, vender e invertir en bienes raíces colombianos. Cubre requisitos legales, contratos, impuestos y fundamentos de administración de propiedades.',
  'Real Estate',
  'intermediate',
  '3 horas',
  2,
  'published'
) on conflict (slug_key, locale) do nothing;

-- Now link articles to study paths
-- Note: This uses the existing articles. We'll need to adjust based on actual article IDs in production

-- Link investor-visa to immigration-fundamentals path (English)
do $$
declare
  v_study_path_id uuid;
  v_article_id uuid;
begin
  -- Get study path ID
  select id into v_study_path_id 
  from public.clkr_study_paths 
  where slug_key = 'immigration-fundamentals' and locale = 'en';
  
  -- Get article ID
  select id into v_article_id 
  from public.clkr_articles 
  where slug_key = 'investor-visa' and locale = 'en';
  
  -- Create step if both exist
  if v_study_path_id is not null and v_article_id is not null then
    insert into public.clkr_study_path_steps (study_path_id, article_id, step_order, description)
    values (
      v_study_path_id,
      v_article_id,
      1,
      'Start here: Understand the M investor visa requirements and application process.'
    ) on conflict (study_path_id, article_id) do nothing;
  end if;
end $$;

-- Link real-estate-transactions to real-estate-investment path (English)
do $$
declare
  v_study_path_id uuid;
  v_article_id uuid;
begin
  select id into v_study_path_id 
  from public.clkr_study_paths 
  where slug_key = 'real-estate-investment' and locale = 'en';
  
  select id into v_article_id 
  from public.clkr_articles 
  where slug_key = 'real-estate-transactions' and locale = 'en';
  
  if v_study_path_id is not null and v_article_id is not null then
    insert into public.clkr_study_path_steps (study_path_id, article_id, step_order, description)
    values (
      v_study_path_id,
      v_article_id,
      1,
      'Learn the complete real estate transaction process in Colombia, from offer to closing.'
    ) on conflict (study_path_id, article_id) do nothing;
  end if;
end $$;

-- Spanish versions
do $$
declare
  v_study_path_id uuid;
  v_article_id uuid;
begin
  select id into v_study_path_id 
  from public.clkr_study_paths 
  where slug_key = 'fundamentos-inmigracion' and locale = 'es';
  
  select id into v_article_id 
  from public.clkr_articles 
  where slug_key = 'investor-visa' and locale = 'es';
  
  if v_study_path_id is not null and v_article_id is not null then
    insert into public.clkr_study_path_steps (study_path_id, article_id, step_order, description)
    values (
      v_study_path_id,
      v_article_id,
      1,
      'Comienza aquí: Comprende los requisitos y el proceso de solicitud de la visa M de inversionista.'
    ) on conflict (study_path_id, article_id) do nothing;
  end if;
end $$;

do $$
declare
  v_study_path_id uuid;
  v_article_id uuid;
begin
  select id into v_study_path_id 
  from public.clkr_study_paths 
  where slug_key = 'inversion-inmobiliaria' and locale = 'es';
  
  select id into v_article_id 
  from public.clkr_articles 
  where slug_key = 'real-estate-transactions' and locale = 'es';
  
  if v_study_path_id is not null and v_article_id is not null then
    insert into public.clkr_study_path_steps (study_path_id, article_id, step_order, description)
    values (
      v_study_path_id,
      v_article_id,
      1,
      'Aprende el proceso completo de transacciones inmobiliarias en Colombia, desde la oferta hasta el cierre.'
    ) on conflict (study_path_id, article_id) do nothing;
  end if;
end $$;

-- Note: In production, you can add more article relations using:
-- insert into public.clkr_article_relations (from_article_id, to_article_id, relation_type)
-- values ('[article-id]', '[related-article-id]', 'prerequisite' | 'next_step' | 'related')
-- on conflict do nothing;
