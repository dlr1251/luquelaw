-- Deactivate Student plan and strip quizzes from plan feature arrays.
-- Quiz tables remain for historical data; app routes/CMS removed.
-- No-op when plans table is not present yet.

do $$
begin
  if to_regclass('public.plans') is null then
    return;
  end if;

  update public.plans
  set active = false
  where slug = 'student';

  update public.plans
  set features = array_remove(features, 'quizzes')
  where features is not null
    and 'quizzes' = any (features);
end $$;
