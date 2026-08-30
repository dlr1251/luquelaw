alter table public.norms drop constraint norms_category_check;
alter table public.norms add constraint norms_category_check check (
  category = any (array[
    'constitutional',
    'immigration',
    'civil',
    'criminal',
    'labor',
    'commercial',
    'administrative',
    'procedural',
    'tax'
  ]::text[])
);
