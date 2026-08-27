-- Visa categories CMS (bilingual fields as jsonb).
-- Public pages prefer published rows; hardcoded VISAS_CATALOG remains fallback.
-- Admin: is_clkr_admin()

create table if not exists public.visa_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  category text not null check (category in ('V', 'M', 'R')),
  article_num int not null,
  name jsonb not null,
  summary jsonb not null,
  who_for jsonb not null,
  eligibility jsonb,
  rights jsonb,
  restrictions jsonb,
  application_checklist jsonb,
  key_requirements jsonb not null,
  duration_notes jsonb not null,
  -- null = use work_permit_notes; true/false = yes/no with optional notes overlay unused
  work_permit boolean,
  work_permit_notes jsonb,
  beneficiary_notes jsonb not null,
  related_guide_slug text,
  enable_norm_comments boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint visa_categories_slug_unique unique (slug),
  constraint visa_categories_name_shape check (
    jsonb_typeof(name) = 'object'
    and name ? 'en' and name ? 'es'
  ),
  constraint visa_categories_summary_shape check (
    jsonb_typeof(summary) = 'object'
    and summary ? 'en' and summary ? 'es'
  )
);

create index if not exists visa_categories_hub_idx
  on public.visa_categories (status, category, sort_order);

create index if not exists visa_categories_article_idx
  on public.visa_categories (article_num);

alter table public.visa_categories enable row level security;

create policy "visa_categories_select_published"
  on public.visa_categories
  for select
  using (status = 'published');

create policy "visa_categories_select_admin"
  on public.visa_categories
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "visa_categories_insert_admin"
  on public.visa_categories
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "visa_categories_update_admin"
  on public.visa_categories
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "visa_categories_delete_admin"
  on public.visa_categories
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.visa_categories to anon, authenticated;
grant insert, update, delete on public.visa_categories to authenticated;

create or replace function public.visa_categories_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists visa_categories_updated_at on public.visa_categories;
create trigger visa_categories_updated_at
  before update on public.visa_categories
  for each row execute function public.visa_categories_set_updated_at();

-- Pilot seed: V Tránsito Aeroportuario (art. 33)
insert into public.visa_categories (
  slug, category, article_num, name, summary, who_for, eligibility, rights, restrictions,
  application_checklist, key_requirements, duration_notes, work_permit, work_permit_notes,
  beneficiary_notes, related_guide_slug, enable_norm_comments, status, sort_order, published_at
) values (
  'transito-aeroportuario', 'V', 33,
  '{"en":"V Visa — Airport Transit","es":"Visa V Tránsito Aeroportuario"}'::jsonb,
  '{"en":"For foreign nationals of nationalities listed by resolution who need a direct airport transit in Colombia en route to a third country. Authorized stay is up to 24 hours, strictly in sterile or direct-transit zones of a single international airport. Presence in those zones is not an entry into Colombian territory for immigration purposes.","es":"Para extranjeros de nacionalidades establecidas mediante Resolución que aspiren a realizar tránsito directo en alguno de los aeropuertos del territorio nacional y con destino a un tercer Estado. La permanencia autorizada es de máximo veinticuatro (24) horas, restringida a zonas estériles o de tránsito directo en un solo aeropuerto con operación internacional. La llegada y permanencia en esas zonas no se consideran ingreso al territorio nacional, en términos migratorios."}'::jsonb,
  '{"en":"Travelers who must change flights in Colombia without entering the country, and whose nationality requires an airport-transit visa under the list published by Cancillería (Resolución 5488 de 2022, art. 8, as amended — notably by Resolución 3717 de 2023).","es":"Viajeros que deben hacer conexión en Colombia sin ingresar al país, y cuya nacionalidad exige visa de tránsito aeroportuario según el listado de Cancillería (Resolución 5488 de 2022, art. 8, modificado — en particular por la Resolución 3717 de 2023)."}'::jsonb,
  '{"en":"Only nationals of States or territories that Cancillería lists as requiring this visa. Stateless persons with a travel document issued by a State recognized by Colombia also need it (Res. 5488 art. 8, as amended). Nationals not on that list are exempt from the airport-transit visa for a direct connection to a third State. Confirm the current list before filing — it can change by resolution. Countries commonly listed as requiring it include Afghanistan, Angola, Bangladesh, Burkina Faso, Cameroon, Cote d''Ivoire, Egypt, Ethiopia, Eritrea, Gambia, Ghana, Haiti, India, Iran, Kenya, Lebanon, Mali, Nepal, Nigeria, Pakistan, Sierra Leone, Syria, Somalia, Sri Lanka, Sudan, Tajikistan, and Uzbekistan.","es":"Solo nacionales de Estados o territorios que Cancillería liste como obligados a esta visa. Los apátridas con documento de viaje de un Estado reconocido por Colombia también la requieren (Res. 5488 art. 8, modificado). Quienes no estén en ese listado están exentos de la visa de tránsito aeroportuario directo hacia un tercer Estado. Confirme el listado vigente antes de solicitar — puede cambiar por resolución. Países que suelen figurar como obligados incluyen Afganistán, Angola, Bangladesh, Burkina Faso, Camerún, Costa de Marfil, Egipto, Etiopía, Eritrea, Gambia, Ghana, Haití, India, Irán, Kenia, Líbano, Malí, Nepal, Nigeria, Pakistán, Sierra Leona, Siria, Somalia, Sri Lanka, Sudán, Tayikistán y Uzbekistán."}'::jsonb,
  '{"en":["Direct transit through the international/sterile zone of one Colombian airport with international operations, onward to a third country.","Authorized presence in that zone for up to 24 hours per transit.","Visa validity of up to 30 days for multiple transits (as authorized).","Multiple entries/transits are generally allowed under the visa framework (art. 27), within the authorization granted.","Time spent in the international transit zone is not treated as entry into Colombian territory for immigration purposes — without limiting Migración Colombia''s control of those zones."],"es":["Tránsito directo por la zona internacional/estéril de un aeropuerto colombiano con operación internacional, con destino a un tercer país.","Permanencia autorizada en esa zona hasta por 24 horas por tránsito.","Vigencia de la visa de hasta 30 días para múltiples tránsitos (según autorización).","Entradas/tránsitos múltiples están en principio permitidos en el régimen de visas (art. 27), dentro de lo autorizado.","La permanencia en la zona de tránsito internacional no se considera ingreso al territorio nacional en términos migratorios — sin menoscabo del control que Migración Colombia ejerce sobre esas zonas."]}'::jsonb,
  '{"en":["No work authorization in Colombia.","No exit from the sterile/direct-transit zone; no change of airport.","Maximum 24 hours in the transit zone per connection.","Does not authorize entry into Colombian national territory beyond the transit zone.","Does not allow applications as a beneficiary (dependents).","Does not carry the study permission that other longer visitor visas may allow (art. 28 excludes airport transit)."],"es":["No otorga permiso de trabajo en Colombia.","No permite salir de la zona estéril/de tránsito directo ni cambiar de aeropuerto.","Máximo 24 horas en la zona de tránsito por conexión.","No autoriza el ingreso al territorio nacional más allá de la zona de tránsito.","No admite solicitudes en calidad de beneficiario.","No incluye el permiso de estudio que otras visas de visitante más largas pueden permitir (el art. 28 exceptúa el tránsito aeroportuario)."]}'::jsonb,
  '{"en":["Complete the online visa application (SITAC / Cancillería) for category V — Airport Transit.","Recent digital color photo on a white background (neutral expression; max 300 KB; face fully visible).","Passport or accepted travel document valid at least six (6) months from the application date, in good condition, with a blank page if a sticker may be needed — plus a copy of the bio page.","If applying from inside Colombia: copy of the most recent entry stamp or equivalent Migración Colombia authorization / salvoconducto.","Airline ticket showing entry into and exit from Colombia to a third country.","Proof of admissibility to the final destination — mainly the visa for that third State when required.","Pay the study fee within the calendar deadline Cancillería sets after filing; if approved, pay the issuance fee within its deadline."],"es":["Diligenciar la solicitud en línea (SITAC / Cancillería) en categoría V — Tránsito Aeroportuario.","Fotografía digital reciente a color con fondo blanco (expresión neutra; máximo 300 KB; rostro completo y visible).","Pasaporte o documento de viaje aceptado con vigencia mínima de seis (6) meses al momento de la solicitud, en buen estado y con hojas libres si se requiere etiqueta — más copia de la página de datos.","Si solicita estando en Colombia: copia del sello de entrada más reciente o autorización equivalente de Migración Colombia / salvoconducto.","Tiquete aéreo de entrada y salida de Colombia con destino a un tercer país.","Prueba de admisibilidad al destino final — principalmente la visa del tercer Estado cuando la exija.","Pagar la tasa de estudio dentro del plazo calendario que fije Cancillería tras el radicado; si aprueban, pagar la tasa de expedición en su plazo."]}'::jsonb,
  '{"en":["General filing formalities under art. 24 (form, photo, passport).","Air ticket into and out of Colombia to a third country (art. 33).","Proof of admissibility to the final destination, mainly a visa if required (art. 33)."],"es":["Formalidades generales de solicitud del art. 24 (formulario, foto, pasaporte).","Tiquete aéreo de entrada y salida de Colombia hacia un tercer país (art. 33).","Demostrar admisibilidad al destino final, principalmente visa si se requiere (art. 33)."]}'::jsonb,
  '{"en":"Visa validity: up to thirty (30) days for multiple transits. Stay in the airport transit zone: maximum twenty-four (24) hours per transit.","es":"Vigencia de la visa: hasta treinta (30) días para múltiples tránsitos. Permanencia en la zona de tránsito: máximo veinticuatro (24) horas por tránsito."}'::jsonb,
  false, null,
  '{"en":"This visa does not allow applications as a beneficiary.","es":"Esta visa no permite solicitudes en calidad de beneficiario."}'::jsonb,
  null, true, 'published', 33, now()
) on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  who_for = excluded.who_for,
  eligibility = excluded.eligibility,
  rights = excluded.rights,
  restrictions = excluded.restrictions,
  application_checklist = excluded.application_checklist,
  key_requirements = excluded.key_requirements,
  duration_notes = excluded.duration_notes,
  work_permit = excluded.work_permit,
  beneficiary_notes = excluded.beneficiary_notes,
  enable_norm_comments = excluded.enable_norm_comments,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();
