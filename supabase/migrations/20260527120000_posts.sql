-- Blog posts CMS (shorter articles, separate from CLKR legal guides).
-- Admin: admin_allowlist email OR app_metadata.role = 'admin' (via is_clkr_admin())

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  category text not null,
  reading_time text not null default '5 min',
  sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  translation_group_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create index if not exists posts_hub_idx
  on public.posts (locale, status, sort_order);

alter table public.posts enable row level security;

create policy "posts_select_published"
  on public.posts
  for select
  using (status = 'published');

create policy "posts_select_admin"
  on public.posts
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "posts_insert_admin"
  on public.posts
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "posts_update_admin"
  on public.posts
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "posts_delete_admin"
  on public.posts
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

create or replace function public.posts_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.posts_set_updated_at();

-- Seed three blog articles (EN + ES)
insert into public.posts (
  slug_key, locale, title, description, category, reading_time, sections, status, sort_order, published_at, translation_group_id
) values
(
  'digital-nomad-visa-colombia',
  'en',
  'Digital Nomad Visa in Colombia: What Changed in 2026',
  'A practical overview of Colombia''s digital nomad visa — eligibility, income requirements, application steps, and common mistakes international remote workers make.',
  'Immigration',
  '6 min',
  '[
    {"id":"overview","title":"Overview","html":"<p>Colombia''s <strong>digital nomad visa</strong> (Visa V — Nómadas Digitales) allows remote workers employed abroad or with foreign clients to live in Colombia while working remotely. It is popular among U.S. and European professionals drawn to Medellín''s quality of life and time zone alignment.</p><p>This article summarizes the practical framework — not a substitute for a case-specific legal review.</p>"},
    {"id":"requirements","title":"Key requirements","html":"<p>Applicants typically must show:</p><ul><li>Valid passport and clean criminal record</li><li>Proof of remote employment or freelance contracts with foreign clients</li><li>Minimum monthly income (threshold tied to Colombian legal minimums — confirm current figure before applying)</li><li>Health insurance valid in Colombia for the visa period</li></ul><p>Documentation quality matters: bank statements, employer letters, and contract language are frequently scrutinized.</p>"},
    {"id":"application","title":"Application tips","html":"<p>Most applications route through Colombia''s <strong>Ministry of Foreign Affairs (Cancillería)</strong>. Common pitfalls include:</p><ul><li>Income shown in the wrong currency or period</li><li>Contracts that do not clearly state remote work from Colombia is permitted</li><li>Insurance policies that exclude Colombia or lack adequate coverage</li></ul><p>Plan for processing time and avoid booking non-refundable travel before approval.</p>"},
    {"id":"takeaway","title":"Bottom line","html":"<p>The digital nomad visa is accessible for well-documented remote workers, but small paperwork errors cause delays or denials. If you plan to stay long-term or switch to another visa category, map that path before you apply.</p>"}
  ]'::jsonb,
  'published',
  0,
  '2026-05-01T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000001'::uuid
),
(
  'property-due-diligence-medellin',
  'en',
  'Property Due Diligence in Medellín: A Buyer''s Checklist',
  'Five essential checks before signing a purchase promise in Medellín — registry review, liens, zoning, taxes, and foreign investment registration.',
  'Real Estate',
  '7 min',
  '[
    {"id":"intro","title":"Why due diligence matters","html":"<p>Medellín''s property market attracts foreign buyers, but <strong>notarial deeds and clean titles are not automatic</strong>. A structured due diligence review before signing a promesa de compraventa protects you from liens, boundary disputes, and compliance gaps.</p>"},
    {"id":"checklist","title":"Five essential checks","html":"<ol><li><strong>Tradición y libertad</strong> — verify ownership chain, encumbrances, and annotations at the registry office.</li><li><strong>Liens and lawsuits</strong> — confirm no active embargos, family estate claims, or pending litigation.</li><li><strong>Zoning and estrato</strong> — confirm permitted use and understand utility cost implications.</li><li><strong>Tax status</strong> — review predial (property tax) and valorization levies; unpaid taxes can transfer with the property.</li><li><strong>Foreign investment registration</strong> — if funds come from abroad, plan Banco de la República registration before or in parallel with closing.</li></ol>"},
    {"id":"closing","title":"Before you sign","html":"<p>Never wire earnest money without a reviewed promise of sale and clear exit terms if due diligence fails. Power of attorney structures are common for absentee buyers but must be drafted carefully.</p><p>For a deeper dive on the full purchase process, see our CLKR guide on real estate transactions for foreigners.</p>"}
  ]'::jsonb,
  'published',
  10,
  '2026-05-10T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000002'::uuid
),
(
  'sas-incorporation-foreigners',
  'en',
  'Incorporating a Colombian S.A.S. as a Foreign Founder',
  'Why foreign entrepreneurs choose the S.A.S. structure, what documents you need, typical timelines, and post-incorporation compliance basics.',
  'Business',
  '8 min',
  '[
    {"id":"why-sas","title":"Why the S.A.S.?","html":"<p>The <strong>Sociedad por Acciones Simplificada (S.A.S.)</strong> is Colombia''s most flexible corporate form. Foreign founders often prefer it because:</p><ul><li>Single-shareholder structures are permitted</li><li>Bylaws can be customized without excessive notarial formalities</li><li>It works well for holding companies, consulting firms, and property-holding vehicles</li></ul>"},
    {"id":"documents","title":"What you will need","html":"<p>Typical incorporation packages include:</p><ul><li>Passport copies and proof of address for foreign shareholders</li><li>Proposed company name (verify availability with Cámara de Comercio)</li><li>Bylaws (estatutos sociales) defining governance and capital</li><li>Legal representative appointment (can be a foreign national with proper visa status)</li></ul><p>Apostille or legalization may be required for documents issued outside Colombia.</p>"},
    {"id":"compliance","title":"After incorporation","html":"<p>Registration with the <strong>Cámara de Comercio</strong>, tax ID (NIT), and DIAN enrollment are immediate next steps. Ongoing obligations include annual renewal, accounting records, and — if applicable — invoicing and payroll compliance.</p><p>Foreign founders planning to work in Colombia should align corporate setup with the correct visa category from the start.</p>"}
  ]'::jsonb,
  'published',
  20,
  '2026-05-20T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000003'::uuid
),
(
  'digital-nomad-visa-colombia',
  'es',
  'Visa nómada digital en Colombia: novedades 2026',
  'Panorama práctico de la visa nómada digital — requisitos, ingresos, pasos de solicitud y errores frecuentes de trabajadores remotos internacionales.',
  'Immigration',
  '6 min',
  '[
    {"id":"overview","title":"Panorama","html":"<p>La <strong>visa nómada digital</strong> (Visa V — Nómadas Digitales) permite a trabajadores remotos con empleador o clientes en el exterior residir en Colombia mientras trabajan a distancia. Es muy solicitada por profesionales de EE.UU. y Europa atraídos por la calidad de vida en Medellín.</p><p>Este artículo resume el marco práctico — no sustituye un análisis jurídico a la medida de tu caso.</p>"},
    {"id":"requirements","title":"Requisitos clave","html":"<p>En general el solicitante debe acreditar:</p><ul><li>Pasaporte vigente y antecedentes penales limpios</li><li>Relación laboral remota o contratos con clientes extranjeros</li><li>Ingresos mínimos mensuales (umbral ligado al mínimo legal colombiano — confirma la cifra vigente)</li><li>Seguro de salud válido en Colombia durante la vigencia</li></ul>"},
    {"id":"application","title":"Consejos de solicitud","html":"<p>La mayoría de trámites se radican ante la <strong>Cancillería</strong>. Errores frecuentes:</p><ul><li>Ingresos en moneda o periodo incorrecto</li><li>Contratos que no autorizan trabajo remoto desde Colombia</li><li>Pólizas que excluyen Colombia o con cobertura insuficiente</li></ul>"},
    {"id":"takeaway","title":"Conclusión","html":"<p>La visa es accesible con documentación sólida, pero detalles formales generan demoras o negaciones. Si planeas permanencia prolongada u otro tipo de visa, define esa ruta antes de aplicar.</p>"}
  ]'::jsonb,
  'published',
  0,
  '2026-05-01T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000001'::uuid
),
(
  'property-due-diligence-medellin',
  'es',
  'Debida diligencia inmobiliaria en Medellín: checklist del comprador',
  'Cinco verificaciones esenciales antes de firmar una promesa de compraventa — tradición, gravámenes, uso del suelo, impuestos y registro cambiario.',
  'Real Estate',
  '7 min',
  '[
    {"id":"intro","title":"Por qué importa la debida diligencia","html":"<p>El mercado inmobiliario de Medellín atrae compradores extranjeros, pero <strong>escritura y tradición limpia no son automáticas</strong>. Una revisión estructurada antes de la promesa de compraventa protege contra gravámenes, litigios y incumplimientos.</p>"},
    {"id":"checklist","title":"Cinco verificaciones esenciales","html":"<ol><li><strong>Tradición y libertad</strong> — cadena de dominio, gravámenes y anotaciones.</li><li><strong>Embargos y procesos</strong> — confirmar ausencia de litigios o reclamaciones.</li><li><strong>Uso del suelo y estrato</strong> — uso permitido e implicaciones de costos.</li><li><strong>Impuestos</strong> — predial y valorización al día.</li><li><strong>Registro cambiario</strong> — si los fondos vienen del exterior, planificar registro ante el Banco de la República.</li></ol>"},
    {"id":"closing","title":"Antes de firmar","html":"<p>No transfieras arras sin promesa revisada y cláusulas de salida si falla la diligencia. Los poderes son frecuentes pero deben redactarse con cuidado.</p>"}
  ]'::jsonb,
  'published',
  10,
  '2026-05-10T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000002'::uuid
),
(
  'sas-incorporation-foreigners',
  'es',
  'Constituir una S.A.S. en Colombia siendo extranjero',
  'Por qué los emprendedores extranjeros eligen la S.A.S., documentos necesarios, tiempos habituales y cumplimiento posterior a la constitución.',
  'Business',
  '8 min',
  '[
    {"id":"why-sas","title":"¿Por qué la S.A.S.?","html":"<p>La <strong>Sociedad por Acciones Simplificada (S.A.S.)</strong> es la forma societaria más flexible en Colombia. Ventajas para fundadores extranjeros:</p><ul><li>Permite accionista único</li><li>Estatutos personalizables con formalidades reducidas</li><li>Útil para holdings, consultorías y vehículos inmobiliarios</li></ul>"},
    {"id":"documents","title":"Documentos habituales","html":"<ul><li>Pasaporte y prueba de domicilio de accionistas extranjeros</li><li>Nombre social disponible (Cámara de Comercio)</li><li>Estatutos sociales</li><li>Representante legal (puede ser extranjero con visa adecuada)</li></ul><p>Documentos del exterior pueden requerir apostilla o legalización.</p>"},
    {"id":"compliance","title":"Después de la constitución","html":"<p>Matrícula mercantil, NIT y registro DIAN son pasos inmediatos. Obligaciones continuas: renovación anual, contabilidad y — si aplica — facturación y nómina.</p><p>Alinea la estructura societaria con la categoría migratoria correcta desde el inicio.</p>"}
  ]'::jsonb,
  'published',
  20,
  '2026-05-20T00:00:00+00'::timestamptz,
  'a1000001-0001-4000-8000-000000000003'::uuid
)
on conflict (slug_key, locale) do nothing;
