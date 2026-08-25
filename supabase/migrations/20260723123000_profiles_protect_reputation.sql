-- Block users from self-editing reputation (RPCs use security definer owner role)
create or replace function public.profiles_protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text := coalesce(
    auth.jwt() ->> 'role',
    current_setting('request.jwt.claim.role', true),
    ''
  );
begin
  if jwt_role = 'service_role' or public.is_clkr_admin() then
    return new;
  end if;

  if new.is_student is distinct from old.is_student
     or new.is_client is distinct from old.is_client
     or new.is_subscriber is distinct from old.is_subscriber then
    raise exception 'Cannot modify entitlement flags on profiles';
  end if;

  if new.reputation is distinct from old.reputation then
    -- Allow SECURITY DEFINER RPCs (run as postgres / supabase_admin, not authenticator roles)
    if current_user in ('authenticated', 'anon') then
      raise exception 'Cannot modify reputation on profiles';
    end if;
  end if;

  if new.stripe_customer_id is distinct from old.stripe_customer_id then
    if old.stripe_customer_id is not null then
      raise exception 'Cannot modify stripe_customer_id on profiles';
    end if;
  end if;

  return new;
end;
$$;
