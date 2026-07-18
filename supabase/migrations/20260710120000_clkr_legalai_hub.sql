-- Phase B–F: profiles, billing, agents, quizzes, annotations, tickets, chat

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'en' check (locale in ('en', 'es')),
  is_student boolean not null default false,
  is_client boolean not null default false,
  is_subscriber boolean not null default false,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_clkr_admin());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id or public.is_clkr_admin())
  with check (auth.uid() = id or public.is_clkr_admin());

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id or public.is_clkr_admin());

grant select, insert, update on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'locale', 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.profiles_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.profiles_set_updated_at();

-- ---------------------------------------------------------------------------
-- Plans & subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('student', 'professional', 'client')),
  name_en text not null,
  name_es text not null,
  description_en text not null default '',
  description_es text not null default '',
  stripe_price_id text,
  features text[] not null default '{}',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid not null references public.plans (id),
  stripe_subscription_id text unique,
  status text not null default 'inactive'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'inactive', 'unpaid')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create index if not exists subscriptions_user_idx on public.subscriptions (user_id, status);

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

create policy "plans_select_all"
  on public.plans for select using (active = true or public.is_clkr_admin());

create policy "plans_admin_all"
  on public.plans for all to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "subscriptions_select_own"
  on public.subscriptions for select to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin());

create policy "subscriptions_admin_write"
  on public.subscriptions for all to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

grant select on public.plans to anon, authenticated;
grant select on public.subscriptions to authenticated;
grant insert, update, delete on public.plans, public.subscriptions to authenticated;

insert into public.plans (slug, name_en, name_es, description_en, description_es, features, sort_order)
values
  (
    'student',
    'Student',
    'Estudiante',
    'Quizzes, norm annotations, and a subset of LegalAI agents.',
    'Quizzes, anotaciones normativas y un subconjunto de agentes LegalAI.',
    array['quizzes', 'norm_annotations', 'agents'],
    1
  ),
  (
    'professional',
    'Professional',
    'Profesional',
    'Full agents, skills, prompts, and advanced normative study tools.',
    'Agentes, skills, prompts y herramientas avanzadas de estudio normativo.',
    array['agents', 'norm_annotations'],
    2
  ),
  (
    'client',
    'Client',
    'Cliente',
    'Portal tickets and firm resources for Luque Law clients.',
    'Tickets del portal y recursos de la firma para clientes de Luque Law.',
    array['portal_tickets'],
    3
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Agents / skills / prompts
-- ---------------------------------------------------------------------------
create table if not exists public.clkr_agents (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  category text not null default 'general',
  system_prompt text not null default '',
  instructions text not null default '',
  access_tier text not null default 'professional'
    check (access_tier in ('student', 'professional')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create table if not exists public.clkr_skills (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  body text not null default '',
  access_tier text not null default 'professional'
    check (access_tier in ('student', 'professional')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create table if not exists public.clkr_prompts (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  prompt_text text not null,
  category text not null default 'general',
  access_tier text not null default 'professional'
    check (access_tier in ('student', 'professional')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

alter table public.clkr_agents enable row level security;
alter table public.clkr_skills enable row level security;
alter table public.clkr_prompts enable row level security;

-- Published rows visible to authenticated users (app still gates by entitlement)
create policy "clkr_agents_select_published"
  on public.clkr_agents for select to authenticated
  using (status = 'published' or public.is_clkr_admin());
create policy "clkr_agents_admin"
  on public.clkr_agents for all to authenticated
  using (public.is_clkr_admin()) with check (public.is_clkr_admin());

create policy "clkr_skills_select_published"
  on public.clkr_skills for select to authenticated
  using (status = 'published' or public.is_clkr_admin());
create policy "clkr_skills_admin"
  on public.clkr_skills for all to authenticated
  using (public.is_clkr_admin()) with check (public.is_clkr_admin());

create policy "clkr_prompts_select_published"
  on public.clkr_prompts for select to authenticated
  using (status = 'published' or public.is_clkr_admin());
create policy "clkr_prompts_admin"
  on public.clkr_prompts for all to authenticated
  using (public.is_clkr_admin()) with check (public.is_clkr_admin());

grant select on public.clkr_agents, public.clkr_skills, public.clkr_prompts to authenticated;
grant insert, update, delete on public.clkr_agents, public.clkr_skills, public.clkr_prompts to authenticated;

-- ---------------------------------------------------------------------------
-- Quizzes
-- ---------------------------------------------------------------------------
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null default '',
  topic_slug text,
  norm_id uuid references public.norms (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null,
  choices jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  explanation text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  score int not null default 0,
  total int not null default 0,
  completed_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts (id) on delete cascade,
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  selected_index int not null,
  is_correct boolean not null default false
);

alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;

create policy "quizzes_select_published"
  on public.quizzes for select to authenticated
  using (status = 'published' or public.is_clkr_admin());
create policy "quizzes_admin"
  on public.quizzes for all to authenticated
  using (public.is_clkr_admin()) with check (public.is_clkr_admin());

create policy "quiz_questions_select"
  on public.quiz_questions for select to authenticated
  using (
    public.is_clkr_admin()
    or exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.status = 'published'
    )
  );
create policy "quiz_questions_admin"
  on public.quiz_questions for all to authenticated
  using (public.is_clkr_admin()) with check (public.is_clkr_admin());

create policy "quiz_attempts_own"
  on public.quiz_attempts for all to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin())
  with check (auth.uid() = user_id or public.is_clkr_admin());

create policy "quiz_answers_own"
  on public.quiz_answers for all to authenticated
  using (
    public.is_clkr_admin()
    or exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = auth.uid()
    )
  )
  with check (
    public.is_clkr_admin()
    or exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

grant select on public.quizzes, public.quiz_questions to authenticated;
grant insert, update, delete on public.quizzes, public.quiz_questions to authenticated;
grant select, insert, update, delete on public.quiz_attempts, public.quiz_answers to authenticated;

-- ---------------------------------------------------------------------------
-- Norm annotations
-- ---------------------------------------------------------------------------
create table if not exists public.norm_annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  norm_id uuid not null references public.norms (id) on delete cascade,
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists norm_annotations_user_section_idx
  on public.norm_annotations (user_id, section_id);

alter table public.norm_annotations enable row level security;

create policy "norm_annotations_own"
  on public.norm_annotations for all to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin())
  with check (auth.uid() = user_id or public.is_clkr_admin());

grant select, insert, update, delete on public.norm_annotations to authenticated;

-- ---------------------------------------------------------------------------
-- Tickets
-- ---------------------------------------------------------------------------
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  category text not null default 'general',
  status text not null default 'open'
    check (status in ('open', 'pending', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

create policy "tickets_own"
  on public.tickets for all to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin())
  with check (auth.uid() = user_id or public.is_clkr_admin());

create policy "ticket_messages_own"
  on public.ticket_messages for all to authenticated
  using (
    public.is_clkr_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  )
  with check (
    public.is_clkr_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.tickets, public.ticket_messages to authenticated;

-- ---------------------------------------------------------------------------
-- Chat (shell for future RAG)
-- ---------------------------------------------------------------------------
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  locale text not null default 'en' check (locale in ('en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

create policy "chat_conversations_own"
  on public.chat_conversations for all to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin())
  with check (auth.uid() = user_id or public.is_clkr_admin());

create policy "chat_messages_own"
  on public.chat_messages for all to authenticated
  using (
    public.is_clkr_admin()
    or exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  with check (
    public.is_clkr_admin()
    or exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.chat_conversations, public.chat_messages to authenticated;
