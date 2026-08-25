-- $10 Lucy AI signup credit (idempotent). Existing wallets with no bonus get it too.

create unique index if not exists lucy_wallet_ledger_signup_bonus_uidx
  on public.lucy_wallet_ledger (user_id)
  where ref_type = 'signup_bonus';

create or replace function public.lucy_grant_signup_bonus(p_user_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance int;
begin
  if p_user_id is null then
    raise exception 'user required';
  end if;

  begin
    v_balance := public.lucy_credit_wallet(
      p_user_id,
      1000,
      'adjustment',
      'signup_bonus',
      p_user_id::text,
      'Lucy AI signup credit (USD 10)'
    );
  exception
    when unique_violation then
      select balance_cents into v_balance
      from public.lucy_wallets
      where user_id = p_user_id;
  end;

  return coalesce(v_balance, 0);
end;
$$;

create or replace function public.lucy_grant_own_signup_bonus()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  return public.lucy_grant_signup_bonus(uid);
end;
$$;

revoke all on function public.lucy_grant_signup_bonus(uuid) from public;
revoke all on function public.lucy_grant_own_signup_bonus() from public;
grant execute on function public.lucy_grant_signup_bonus(uuid) to service_role;
grant execute on function public.lucy_grant_own_signup_bonus() to authenticated, service_role;

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

  perform public.lucy_grant_signup_bonus(new.id);
  return new;
end;
$$;

-- Backfill: every existing auth user who never received the signup bonus.
do $$
declare
  r record;
begin
  for r in
    select u.id
    from auth.users u
    where not exists (
      select 1
      from public.lucy_wallet_ledger l
      where l.user_id = u.id
        and l.ref_type = 'signup_bonus'
    )
  loop
    perform public.lucy_grant_signup_bonus(r.id);
  end loop;
end;
$$;
