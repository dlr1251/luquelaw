-- CLKR library: link prompts/skills to articles + public read access

alter table public.clkr_prompts
  add column if not exists article_slug_key text,
  add column if not exists translation_group_id uuid,
  add column if not exists use_case text;

alter table public.clkr_skills
  add column if not exists article_slug_key text,
  add column if not exists category text not null default 'general',
  add column if not exists translation_group_id uuid;

create index if not exists clkr_prompts_article_slug_key_idx
  on public.clkr_prompts (article_slug_key, locale)
  where status = 'published';

create index if not exists clkr_prompts_category_idx
  on public.clkr_prompts (category, locale, sort_order)
  where status = 'published';

create index if not exists clkr_skills_article_slug_key_idx
  on public.clkr_skills (article_slug_key, locale)
  where status = 'published';

-- Public read for published prompts and skills (library is open)
drop policy if exists "clkr_prompts_select_published" on public.clkr_prompts;
create policy "clkr_prompts_select_published"
  on public.clkr_prompts for select
  to anon, authenticated
  using (status = 'published' or public.is_clkr_admin());

drop policy if exists "clkr_skills_select_published" on public.clkr_skills;
create policy "clkr_skills_select_published"
  on public.clkr_skills for select
  to anon, authenticated
  using (status = 'published' or public.is_clkr_admin());

grant select on public.clkr_prompts, public.clkr_skills to anon;
