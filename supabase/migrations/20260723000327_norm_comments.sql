-- Public section comments for CLKR norms (threads, reactions, reports)

-- ---------------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------------
create table if not exists public.norm_comments (
  id uuid primary key default gen_random_uuid(),
  norm_id uuid not null references public.norms (id) on delete cascade,
  section_id uuid not null references public.norm_sections (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  parent_id uuid references public.norm_comments (id) on delete cascade,
  body text not null,
  author_display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint norm_comments_body_len check (char_length(body) between 1 and 4000)
);

create index if not exists norm_comments_section_created_idx
  on public.norm_comments (section_id, created_at)
  where deleted_at is null;

create index if not exists norm_comments_parent_idx
  on public.norm_comments (parent_id)
  where parent_id is not null;

create index if not exists norm_comments_user_idx
  on public.norm_comments (user_id);

create or replace function public.norm_comments_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists norm_comments_updated_at on public.norm_comments;
create trigger norm_comments_updated_at
  before update on public.norm_comments
  for each row execute function public.norm_comments_set_updated_at();

-- Max depth 2 (root + reply) and same-section parent
create or replace function public.norm_comments_enforce_thread()
returns trigger
language plpgsql
as $$
declare
  parent_section uuid;
  parent_parent uuid;
begin
  if new.parent_id is null then
    return new;
  end if;

  select section_id, parent_id
    into parent_section, parent_parent
  from public.norm_comments
  where id = new.parent_id;

  if parent_section is null then
    raise exception 'Parent comment not found';
  end if;

  if parent_section <> new.section_id then
    raise exception 'Reply must target the same section';
  end if;

  if parent_parent is not null then
    raise exception 'Comments are limited to one reply level';
  end if;

  if new.norm_id is distinct from (
    select norm_id from public.norm_comments where id = new.parent_id
  ) then
    raise exception 'Reply must target the same norm';
  end if;

  return new;
end;
$$;

drop trigger if exists norm_comments_enforce_thread on public.norm_comments;
create trigger norm_comments_enforce_thread
  before insert or update of parent_id, section_id, norm_id on public.norm_comments
  for each row execute function public.norm_comments_enforce_thread();

alter table public.norm_comments enable row level security;

create policy "norm_comments_select_public"
  on public.norm_comments for select
  to anon, authenticated
  using (deleted_at is null or public.is_clkr_admin());

create policy "norm_comments_insert_own"
  on public.norm_comments for insert
  to authenticated
  with check (auth.uid() = user_id or public.is_clkr_admin());

create policy "norm_comments_update_own"
  on public.norm_comments for update
  to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin())
  with check (auth.uid() = user_id or public.is_clkr_admin());

create policy "norm_comments_delete_own"
  on public.norm_comments for delete
  to authenticated
  using (auth.uid() = user_id or public.is_clkr_admin());

grant select on public.norm_comments to anon, authenticated;
grant insert, update, delete on public.norm_comments to authenticated;

-- ---------------------------------------------------------------------------
-- Reactions
-- ---------------------------------------------------------------------------
create table if not exists public.norm_comment_reactions (
  comment_id uuid not null references public.norm_comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('like', 'insightful')),
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists norm_comment_reactions_comment_idx
  on public.norm_comment_reactions (comment_id);

alter table public.norm_comment_reactions enable row level security;

create policy "norm_comment_reactions_select_public"
  on public.norm_comment_reactions for select
  to anon, authenticated
  using (true);

create policy "norm_comment_reactions_insert_own"
  on public.norm_comment_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "norm_comment_reactions_delete_own"
  on public.norm_comment_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "norm_comment_reactions_update_own"
  on public.norm_comment_reactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.norm_comment_reactions to anon, authenticated;
grant insert, update, delete on public.norm_comment_reactions to authenticated;

-- ---------------------------------------------------------------------------
-- Reports
-- ---------------------------------------------------------------------------
create table if not exists public.norm_comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.norm_comments (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  constraint norm_comment_reports_reason_len check (char_length(reason) between 1 and 1000),
  constraint norm_comment_reports_unique_reporter unique (comment_id, reporter_id)
);

create index if not exists norm_comment_reports_status_idx
  on public.norm_comment_reports (status, created_at desc);

alter table public.norm_comment_reports enable row level security;

create policy "norm_comment_reports_insert_own"
  on public.norm_comment_reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "norm_comment_reports_select_admin"
  on public.norm_comment_reports for select
  to authenticated
  using (public.is_clkr_admin() or auth.uid() = reporter_id);

create policy "norm_comment_reports_update_admin"
  on public.norm_comment_reports for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

grant select, insert on public.norm_comment_reports to authenticated;
grant update on public.norm_comment_reports to authenticated;
