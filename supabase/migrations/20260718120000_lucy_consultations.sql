-- Lucy: projects, chats, files, wallet, consultation ticket extensions

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.lucy_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled project',
  locale text not null default 'en' check (locale in ('en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lucy_projects_user_idx on public.lucy_projects (user_id);

alter table public.lucy_projects enable row level security;

do $$ begin
  create policy "lucy_projects_own"
    on public.lucy_projects for all to authenticated
    using (auth.uid() = user_id or public.is_clkr_admin())
    with check (auth.uid() = user_id or public.is_clkr_admin());
exception when duplicate_object then null;
end $$;

grant select, insert, update, delete on public.lucy_projects to authenticated;

-- ---------------------------------------------------------------------------
-- Chats
-- ---------------------------------------------------------------------------
create table if not exists public.lucy_chats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.lucy_projects (id) on delete cascade,
  title text not null default 'New chat',
  aggressiveness int not null default 40 check (aggressiveness between 0 and 100),
  technicality int not null default 50 check (technicality between 0 and 100),
  flexibility int not null default 50 check (flexibility between 0 and 100),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lucy_chats_project_idx on public.lucy_chats (project_id);

alter table public.lucy_chats enable row level security;

do $$ begin
  create policy "lucy_chats_own"
    on public.lucy_chats for all to authenticated
    using (
      public.is_clkr_admin()
      or exists (
        select 1 from public.lucy_projects p
        where p.id = project_id and p.user_id = auth.uid()
      )
    )
    with check (
      public.is_clkr_admin()
      or exists (
        select 1 from public.lucy_projects p
        where p.id = project_id and p.user_id = auth.uid()
      )
    );
exception when duplicate_object then null;
end $$;

grant select, insert, update, delete on public.lucy_chats to authenticated;

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
create table if not exists public.lucy_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.lucy_chats (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  token_in int not null default 0,
  token_out int not null default 0,
  cost_cents int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lucy_messages_chat_idx on public.lucy_messages (chat_id, created_at);

alter table public.lucy_messages enable row level security;

do $$ begin
  create policy "lucy_messages_own"
    on public.lucy_messages for all to authenticated
    using (
      public.is_clkr_admin()
      or exists (
        select 1
        from public.lucy_chats c
        join public.lucy_projects p on p.id = c.project_id
        where c.id = chat_id and p.user_id = auth.uid()
      )
    )
    with check (
      public.is_clkr_admin()
      or exists (
        select 1
        from public.lucy_chats c
        join public.lucy_projects p on p.id = c.project_id
        where c.id = chat_id and p.user_id = auth.uid()
      )
    );
exception when duplicate_object then null;
end $$;

grant select, insert, update, delete on public.lucy_messages to authenticated;

-- ---------------------------------------------------------------------------
-- Files
-- ---------------------------------------------------------------------------
create table if not exists public.lucy_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.lucy_projects (id) on delete cascade,
  chat_id uuid references public.lucy_chats (id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lucy_files_project_idx on public.lucy_files (project_id);

alter table public.lucy_files enable row level security;

do $$ begin
  create policy "lucy_files_own"
    on public.lucy_files for all to authenticated
    using (
      public.is_clkr_admin()
      or exists (
        select 1 from public.lucy_projects p
        where p.id = project_id and p.user_id = auth.uid()
      )
    )
    with check (
      public.is_clkr_admin()
      or exists (
        select 1 from public.lucy_projects p
        where p.id = project_id and p.user_id = auth.uid()
      )
    );
exception when duplicate_object then null;
end $$;

grant select, insert, update, delete on public.lucy_files to authenticated;

-- ---------------------------------------------------------------------------
-- Wallet + ledger
-- ---------------------------------------------------------------------------
create table if not exists public.lucy_wallets (
  user_id uuid primary key references auth.users (id) on delete cascade,
  balance_cents int not null default 0 check (balance_cents >= 0),
  updated_at timestamptz not null default now()
);

alter table public.lucy_wallets enable row level security;

do $$ begin
  create policy "lucy_wallets_own"
    on public.lucy_wallets for select to authenticated
    using (auth.uid() = user_id or public.is_clkr_admin());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "lucy_wallets_insert_own"
    on public.lucy_wallets for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

grant select, insert on public.lucy_wallets to authenticated;

create table if not exists public.lucy_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('topup', 'usage', 'review_payment', 'adjustment')),
  amount_cents int not null,
  balance_after_cents int not null,
  ref_type text,
  ref_id text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists lucy_wallet_ledger_user_idx
  on public.lucy_wallet_ledger (user_id, created_at desc);

alter table public.lucy_wallet_ledger enable row level security;

do $$ begin
  create policy "lucy_wallet_ledger_own"
    on public.lucy_wallet_ledger for select to authenticated
    using (auth.uid() = user_id or public.is_clkr_admin());
exception when duplicate_object then null;
end $$;

grant select on public.lucy_wallet_ledger to authenticated;

create or replace function public.lucy_debit_wallet(
  p_user_id uuid,
  p_amount_cents int,
  p_ref_type text default null,
  p_ref_id text default null,
  p_note text default null
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance int;
begin
  if p_amount_cents <= 0 then
    raise exception 'amount must be positive';
  end if;

  insert into public.lucy_wallets (user_id, balance_cents)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance_cents into v_balance
  from public.lucy_wallets
  where user_id = p_user_id
  for update;

  if v_balance < p_amount_cents then
    raise exception 'insufficient_balance';
  end if;

  v_balance := v_balance - p_amount_cents;

  update public.lucy_wallets
  set balance_cents = v_balance, updated_at = now()
  where user_id = p_user_id;

  insert into public.lucy_wallet_ledger (
    user_id, kind, amount_cents, balance_after_cents, ref_type, ref_id, note
  ) values (
    p_user_id, 'usage', -p_amount_cents, v_balance, p_ref_type, p_ref_id, p_note
  );

  return v_balance;
end;
$$;

create or replace function public.lucy_credit_wallet(
  p_user_id uuid,
  p_amount_cents int,
  p_kind text default 'topup',
  p_ref_type text default null,
  p_ref_id text default null,
  p_note text default null
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance int;
begin
  if p_amount_cents <= 0 then
    raise exception 'amount must be positive';
  end if;
  if p_kind not in ('topup', 'review_payment', 'adjustment') then
    raise exception 'invalid kind';
  end if;

  insert into public.lucy_wallets (user_id, balance_cents)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance_cents into v_balance
  from public.lucy_wallets
  where user_id = p_user_id
  for update;

  v_balance := v_balance + p_amount_cents;

  update public.lucy_wallets
  set balance_cents = v_balance, updated_at = now()
  where user_id = p_user_id;

  insert into public.lucy_wallet_ledger (
    user_id, kind, amount_cents, balance_after_cents, ref_type, ref_id, note
  ) values (
    p_user_id, p_kind, p_amount_cents, v_balance, p_ref_type, p_ref_id, p_note
  );

  return v_balance;
end;
$$;

revoke all on function public.lucy_debit_wallet from public;
revoke all on function public.lucy_credit_wallet from public;
grant execute on function public.lucy_debit_wallet to authenticated, service_role;
grant execute on function public.lucy_credit_wallet to service_role;

-- ---------------------------------------------------------------------------
-- Tickets: consultation extensions (no-op if tickets table missing)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.tickets') is null then
    return;
  end if;

  alter table public.tickets add column if not exists kind text;
  alter table public.tickets add column if not exists chat_id uuid references public.lucy_chats (id) on delete set null;
  alter table public.tickets add column if not exists project_id uuid references public.lucy_projects (id) on delete set null;
  alter table public.tickets add column if not exists ai_summary text;
  alter table public.tickets add column if not exists lawyer_draft text;
  alter table public.tickets add column if not exists review_status text;
  alter table public.tickets add column if not exists review_fee_cents int;
  alter table public.tickets add column if not exists stripe_checkout_session_id text;

  update public.tickets set kind = 'general' where kind is null;
  alter table public.tickets alter column kind set default 'general';
end $$;

-- ---------------------------------------------------------------------------
-- Storage bucket for Lucy files
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lucy-files',
  'lucy-files',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do nothing;

drop policy if exists "lucy_files_storage_select" on storage.objects;
drop policy if exists "lucy_files_storage_insert" on storage.objects;
drop policy if exists "lucy_files_storage_delete" on storage.objects;

create policy "lucy_files_storage_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'lucy-files'
    and (
      public.is_clkr_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "lucy_files_storage_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'lucy-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "lucy_files_storage_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'lucy-files'
    and (
      public.is_clkr_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
