-- Community QA forum (StackOverflow-style)

create table if not exists public.community_questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  slug text not null unique,
  tags text[] not null default '{}',
  locale text not null default 'en' check (locale in ('en', 'es')),
  status text not null default 'open' check (status in ('open', 'closed', 'removed')),
  score integer not null default 0,
  answer_count integer not null default 0,
  accepted_answer_id uuid,
  author_display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_questions_title_len check (char_length(title) between 8 and 200),
  constraint community_questions_body_len check (char_length(body) between 16 and 20000)
);

create index if not exists community_questions_created_idx
  on public.community_questions (created_at desc)
  where status <> 'removed';

create index if not exists community_questions_score_idx
  on public.community_questions (score desc)
  where status = 'open';

create table if not exists public.community_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.community_questions (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  score integer not null default 0,
  is_accepted boolean not null default false,
  author_display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint community_answers_body_len check (char_length(body) between 8 and 20000)
);

create index if not exists community_answers_question_idx
  on public.community_answers (question_id, created_at)
  where deleted_at is null;

alter table public.community_questions
  drop constraint if exists community_questions_accepted_answer_fkey;

alter table public.community_questions
  add constraint community_questions_accepted_answer_fkey
  foreign key (accepted_answer_id) references public.community_answers (id) on delete set null;

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid references public.community_questions (id) on delete cascade,
  answer_id uuid references public.community_answers (id) on delete cascade,
  body text not null,
  author_display_name text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint community_comments_parent check (
    (question_id is not null and answer_id is null)
    or (question_id is null and answer_id is not null)
  ),
  constraint community_comments_body_len check (char_length(body) between 1 and 2000)
);

create table if not exists public.community_votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid not null references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('question', 'answer')),
  target_id uuid not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (voter_id, target_type, target_id)
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('question', 'answer', 'comment')),
  target_id uuid not null,
  reason text not null default '',
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

-- updated_at triggers
create or replace function public.community_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_questions_updated_at on public.community_questions;
create trigger community_questions_updated_at
  before update on public.community_questions
  for each row execute function public.community_set_updated_at();

drop trigger if exists community_answers_updated_at on public.community_answers;
create trigger community_answers_updated_at
  before update on public.community_answers
  for each row execute function public.community_set_updated_at();

-- Vote RPC (SECURITY DEFINER) — updates score + reputation
create or replace function public.community_cast_vote(
  p_target_type text,
  p_target_id uuid,
  p_value smallint
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_prev smallint;
  v_delta integer;
  v_author uuid;
  v_new_score integer;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_target_type not in ('question', 'answer') or p_value not in (-1, 1) then
    raise exception 'Invalid vote';
  end if;

  select value into v_prev
  from community_votes
  where voter_id = v_uid and target_type = p_target_type and target_id = p_target_id;

  if v_prev is null then
    insert into community_votes (voter_id, target_type, target_id, value)
    values (v_uid, p_target_type, p_target_id, p_value);
    v_delta := p_value;
  elsif v_prev = p_value then
    delete from community_votes
    where voter_id = v_uid and target_type = p_target_type and target_id = p_target_id;
    v_delta := -p_value;
  else
    update community_votes
      set value = p_value
    where voter_id = v_uid and target_type = p_target_type and target_id = p_target_id;
    v_delta := p_value - v_prev;
  end if;

  if p_target_type = 'question' then
    update community_questions
      set score = score + v_delta
    where id = p_target_id and status <> 'removed'
    returning score, author_id into v_new_score, v_author;
  else
    update community_answers
      set score = score + v_delta
    where id = p_target_id and deleted_at is null
    returning score, author_id into v_new_score, v_author;
  end if;

  if v_author is not null and v_author <> v_uid then
    update profiles
      set reputation = greatest(0, reputation + case when v_delta > 0 then 5 when v_delta < 0 then -2 else 0 end)
    where id = v_author;
  end if;

  return coalesce(v_new_score, 0);
end;
$$;

revoke all on function public.community_cast_vote(text, uuid, smallint) from public;
grant execute on function public.community_cast_vote(text, uuid, smallint) to authenticated;

-- Accept answer
create or replace function public.community_accept_answer(p_answer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_q uuid;
  v_q_author uuid;
  v_a_author uuid;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;

  select question_id, author_id into v_q, v_a_author
  from community_answers where id = p_answer_id and deleted_at is null;

  if v_q is null then raise exception 'Answer not found'; end if;

  select author_id into v_q_author from community_questions where id = v_q;
  if v_q_author <> v_uid and not public.is_clkr_admin() then
    raise exception 'Only the question author can accept';
  end if;

  update community_answers set is_accepted = false where question_id = v_q;
  update community_answers set is_accepted = true where id = p_answer_id;
  update community_questions set accepted_answer_id = p_answer_id where id = v_q;

  if v_a_author is not null and v_a_author <> v_uid then
    update profiles set reputation = reputation + 10 where id = v_a_author;
  end if;
end;
$$;

revoke all on function public.community_accept_answer(uuid) from public;
grant execute on function public.community_accept_answer(uuid) to authenticated;

-- Maintain answer_count
create or replace function public.community_answers_count_trg()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update community_questions set answer_count = answer_count + 1 where id = new.question_id;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.deleted_at is null and new.deleted_at is not null then
      update community_questions set answer_count = greatest(0, answer_count - 1) where id = new.question_id;
    elsif old.deleted_at is not null and new.deleted_at is null then
      update community_questions set answer_count = answer_count + 1 where id = new.question_id;
    end if;
    return new;
  end if;
  return new;
end;
$$;

drop trigger if exists community_answers_count on public.community_answers;
create trigger community_answers_count
  after insert or update of deleted_at on public.community_answers
  for each row execute function public.community_answers_count_trg();

-- RLS
alter table public.community_questions enable row level security;
alter table public.community_answers enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_votes enable row level security;
alter table public.community_reports enable row level security;

create policy "community_questions_select"
  on public.community_questions for select
  to anon, authenticated
  using (status <> 'removed' or public.is_clkr_admin());

create policy "community_questions_insert"
  on public.community_questions for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "community_questions_update_own"
  on public.community_questions for update
  to authenticated
  using (author_id = auth.uid() or public.is_clkr_admin());

create policy "community_answers_select"
  on public.community_answers for select
  to anon, authenticated
  using (deleted_at is null or public.is_clkr_admin());

create policy "community_answers_insert"
  on public.community_answers for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "community_answers_update_own"
  on public.community_answers for update
  to authenticated
  using (author_id = auth.uid() or public.is_clkr_admin());

create policy "community_comments_select"
  on public.community_comments for select
  to anon, authenticated
  using (deleted_at is null or public.is_clkr_admin());

create policy "community_comments_insert"
  on public.community_comments for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "community_comments_update_own"
  on public.community_comments for update
  to authenticated
  using (author_id = auth.uid() or public.is_clkr_admin());

create policy "community_votes_select_own"
  on public.community_votes for select
  to authenticated
  using (voter_id = auth.uid());

create policy "community_votes_all_own"
  on public.community_votes for all
  to authenticated
  using (voter_id = auth.uid())
  with check (voter_id = auth.uid());

create policy "community_reports_insert"
  on public.community_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "community_reports_select_admin"
  on public.community_reports for select
  to authenticated
  using (public.is_clkr_admin() or reporter_id = auth.uid());

create policy "community_reports_update_admin"
  on public.community_reports for update
  to authenticated
  using (public.is_clkr_admin());
