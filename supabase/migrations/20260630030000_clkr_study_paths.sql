-- CLKR Study Paths & Progress Tracking
-- Adds organized learning paths and user progress tracking for CLKR articles

-- Study paths: curated sequences of articles for learning tracks
create table if not exists public.clkr_study_paths (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  category text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_time text, -- e.g. "2 hours", "1 week"
  icon text, -- optional icon name for UI
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clkr_study_paths_slug_key unique (slug_key, locale)
);

-- Study path steps: ordered articles within a path
create table if not exists public.clkr_study_path_steps (
  id uuid primary key default gen_random_uuid(),
  study_path_id uuid not null references public.clkr_study_paths(id) on delete cascade,
  article_id uuid not null references public.clkr_articles(id) on delete cascade,
  step_order int not null,
  description text, -- optional context for why this article is in the path
  created_at timestamptz not null default now(),
  constraint clkr_study_path_steps_unique unique (study_path_id, article_id),
  constraint clkr_study_path_steps_order unique (study_path_id, step_order)
);

-- Article relationships: prerequisites and related articles
create table if not exists public.clkr_article_relations (
  id uuid primary key default gen_random_uuid(),
  from_article_id uuid not null references public.clkr_articles(id) on delete cascade,
  to_article_id uuid not null references public.clkr_articles(id) on delete cascade,
  relation_type text not null check (relation_type in ('prerequisite', 'next_step', 'related')),
  created_at timestamptz not null default now(),
  constraint clkr_article_relations_unique unique (from_article_id, to_article_id, relation_type)
);

-- User progress tracking (requires auth)
create table if not exists public.clkr_user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.clkr_articles(id) on delete cascade,
  status text not null check (status in ('started', 'completed', 'bookmarked')),
  last_position text, -- optional: last section viewed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clkr_user_progress_unique unique (user_id, article_id, status)
);

-- Indexes for performance
create index if not exists clkr_study_paths_locale_status_idx 
  on public.clkr_study_paths(locale, status, sort_order);

create index if not exists clkr_study_path_steps_path_idx 
  on public.clkr_study_path_steps(study_path_id, step_order);

create index if not exists clkr_article_relations_from_idx 
  on public.clkr_article_relations(from_article_id, relation_type);

create index if not exists clkr_user_progress_user_idx 
  on public.clkr_user_progress(user_id, status);

-- RLS policies

-- Study paths: public read for published, admin write
alter table public.clkr_study_paths enable row level security;

create policy "Public can view published study paths"
  on public.clkr_study_paths for select
  using (status = 'published');

create policy "Admins can manage study paths"
  on public.clkr_study_paths for all
  using (public.is_clkr_admin());

-- Study path steps: public read, admin write
alter table public.clkr_study_path_steps enable row level security;

create policy "Public can view study path steps"
  on public.clkr_study_path_steps for select
  using (
    exists (
      select 1 from public.clkr_study_paths sp
      where sp.id = study_path_id
      and sp.status = 'published'
    )
  );

create policy "Admins can manage study path steps"
  on public.clkr_study_path_steps for all
  using (public.is_clkr_admin());

-- Article relations: public read, admin write
alter table public.clkr_article_relations enable row level security;

create policy "Public can view article relations"
  on public.clkr_article_relations for select
  using (true);

create policy "Admins can manage article relations"
  on public.clkr_article_relations for all
  using (public.is_clkr_admin());

-- User progress: users can manage their own
alter table public.clkr_user_progress enable row level security;

create policy "Users can view their own progress"
  on public.clkr_user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.clkr_user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.clkr_user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.clkr_user_progress for delete
  using (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_clkr_study_paths_updated_at
  before update on public.clkr_study_paths
  for each row execute function public.update_updated_at_column();

create trigger update_clkr_user_progress_updated_at
  before update on public.clkr_user_progress
  for each row execute function public.update_updated_at_column();
