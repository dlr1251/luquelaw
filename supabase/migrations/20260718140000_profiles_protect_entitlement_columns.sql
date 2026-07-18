-- Prevent authenticated users from self-granting entitlement / billing fields.
-- Admins (is_clkr_admin) and service_role may still update these columns.

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

  -- Allow first-time Stripe customer link; block overwrites / clears by the user.
  if new.stripe_customer_id is distinct from old.stripe_customer_id then
    if old.stripe_customer_id is not null then
      raise exception 'Cannot modify stripe_customer_id on profiles';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_protect_privileged on public.profiles;
create trigger profiles_protect_privileged
  before update on public.profiles
  for each row
  execute function public.profiles_protect_privileged_columns();
