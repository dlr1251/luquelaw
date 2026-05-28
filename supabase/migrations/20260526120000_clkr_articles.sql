-- CLKR full-article CMS (replaces code-only bodies + clkr_article_settings overlays).
-- Apply after 20260420120000_clkr_article_settings.sql
-- Admin: admin_allowlist email OR app_metadata.role = 'admin'

create table if not exists public.clkr_articles (
  id uuid primary key default gen_random_uuid(),
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null,
  category text not null,
  reading_time text not null default '10 min',
  sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  translation_group_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug_key, locale)
);

create index if not exists clkr_articles_hub_idx
  on public.clkr_articles (locale, status, sort_order);

alter table public.clkr_articles enable row level security;

create policy "clkr_articles_select_published"
  on public.clkr_articles
  for select
  using (status = 'published');

create policy "clkr_articles_select_admin"
  on public.clkr_articles
  for select
  to authenticated
  using (public.is_clkr_admin());

create policy "clkr_articles_insert_admin"
  on public.clkr_articles
  for insert
  to authenticated
  with check (public.is_clkr_admin());

create policy "clkr_articles_update_admin"
  on public.clkr_articles
  for update
  to authenticated
  using (public.is_clkr_admin())
  with check (public.is_clkr_admin());

create policy "clkr_articles_delete_admin"
  on public.clkr_articles
  for delete
  to authenticated
  using (public.is_clkr_admin());

grant select on public.clkr_articles to anon, authenticated;
grant insert, update, delete on public.clkr_articles to authenticated;

create or replace function public.clkr_articles_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clkr_articles_updated_at on public.clkr_articles;
create trigger clkr_articles_updated_at
  before update on public.clkr_articles
  for each row execute function public.clkr_articles_set_updated_at();

-- Seed (edit bodies via /admin/clkr after deploy)
insert into public.clkr_articles (
  slug_key, locale, title, description, category, reading_time, sections, status, sort_order, published_at
) values
(
  'investor-visa',
  'en',
  'Investor Visa (Visa de Inversionista — Tipo M)',
  'Eligibility, legal framework (Resolución 5477 de 2022), investment thresholds, FIEM registration, timelines, and common pitfalls.',
  'Immigration',
  '12 min',
  '[
    {"id":"definition","title":"Definition","html":"<p>Colombia''s investor visa (<strong>Visa de Inversionista</strong>) is an <strong>M-category</strong> visa for foreign nationals who make and maintain a qualifying investment in Colombia. The investment must be <strong>documented and properly registered</strong>; buying an asset alone does not automatically grant the visa.</p>"},
    {"id":"legal-framework","title":"Legal framework","html":"<p>The framework is primarily governed by <strong>Resolución 5477 de 2022</strong>. A key threshold is <strong>100 SMLMV</strong>. Qualifying investments commonly include real estate, corporate participation, and certain financial instruments. The frequent failure point is inadequate foreign investment registration.</p>"},
    {"id":"doctrinal-note","title":"Doctrinal note","html":"<p>A core pillar is <strong>foreign investment registration</strong> with <strong>Banco de la República</strong> (historically Form No. 4; today often referenced as <strong>FIEM</strong>). Without proper registration, visa support and repatriation rights may be impaired.</p>"},
    {"id":"practical-example","title":"Practical example","html":"<p><strong>Scenario:</strong> A U.S. citizen buys a Medellín apartment for USD 60,000. Steps: (1) bring funds through legal channels; (2) register foreign investment with Banco de la República; (3) prepare the visa file; (4) apply and track processing; (5) maintain the investment through the visa period.</p>"},
    {"id":"faq","title":"FAQ","html":"<p><strong>Can I use property held in a Colombian company?</strong> Sometimes—it depends on structure and registration evidence.</p><p><strong>Must the investment be maintained?</strong> Generally yes while the visa is valid.</p><p><strong>Dependents?</strong> Often available subject to requirements.</p><p><strong>If I sell the property?</strong> Case-specific analysis required; the visa basis may be undermined.</p>"},
    {"id":"glossary","title":"Glossary","html":"<ul><li><strong>SMLMV</strong> — monthly minimum legal wage threshold</li><li><strong>FIEM</strong> — foreign investment registration workflow</li><li><strong>Cancillería</strong> — Ministry of Foreign Affairs</li><li><strong>Resolución 5477 de 2022</strong> — visa regulation</li></ul>"}
  ]'::jsonb,
  'published',
  0,
  now()
),
(
  'real-estate-transactions',
  'en',
  'Real Estate Transactions for Foreigners',
  'How foreigners buy property in Colombia: due diligence, notarial process, taxes, registration, and foreign investment compliance.',
  'Real Estate',
  '14 min',
  '[
    {"id":"definition","title":"Definition","html":"<p>Foreign nationals may acquire real property in Colombia subject to due diligence, notarial formalities, tax obligations, and—when applicable—foreign exchange and investment registration rules.</p>"},
    {"id":"legal-framework","title":"Legal framework","html":"<p>Key areas include property registry (certificado de tradición y libertad), notarial deeds, transfer taxes, and Banco de la República registration when funds come from abroad.</p>"},
    {"id":"doctrinal-note","title":"Doctrinal note","html":"<p>The notarial deed and clean registry chain are central. Foreign investment registration is separate from registration at the notary but may be required for visa or repatriation strategies.</p>"},
    {"id":"practical-example","title":"Practical example","html":"<p>Typical flow: legal due diligence → promise of sale (optional) → deed at notary → pay taxes → register at office of instruments → register foreign investment if applicable.</p>"},
    {"id":"faq","title":"FAQ","html":"<p><strong>Can foreigners own 100%?</strong> Generally yes for most residential property.</p><p><strong>Power of attorney?</strong> Often used; must be carefully drafted and authenticated.</p>"},
    {"id":"glossary","title":"Glossary","html":"<ul><li><strong>Tradición y libertad</strong> — property title certificate</li><li><strong>Escritura pública</strong> — public deed</li><li><strong>Notaría</strong> — notary office</li></ul>"}
  ]'::jsonb,
  'published',
  10,
  now()
),
(
  'investor-visa',
  'es',
  'Visa de Inversionista (Tipo M)',
  'Requisitos, marco legal (Resolución 5477 de 2022), umbral de inversión, registro FIEM, tiempos y errores frecuentes.',
  'Immigration',
  '12 min',
  '[
    {"id":"definition","title":"Definición","html":"<p>La visa de inversionista es una visa de categoría <strong>M</strong> para extranjeros que realizan y mantienen una inversión calificada en Colombia. La inversión debe estar <strong>documentada y registrada</strong> correctamente.</p>"},
    {"id":"legal-framework","title":"Marco legal","html":"<p>Marco principal: <strong>Resolución 5477 de 2022</strong>. Umbral clave: <strong>100 SMLMV</strong>. Inversiones admisibles incluyen inmuebles, participación societaria e instrumentos financieros, con soporte documental.</p>"},
    {"id":"doctrinal-note","title":"Nota doctrinal","html":"<p>Pilar central: <strong>registro de inversión extranjera</strong> ante el <strong>Banco de la República</strong> (históricamente Formulario 4; hoy a menudo <strong>FIEM</strong>).</p>"},
    {"id":"practical-example","title":"Ejemplo práctico","html":"<p>Escenario: ciudadano estadounidense compra apartamento en Medellín. Pasos: canalización legal de fondos, registro cambiario, armado del expediente visa, radicación y mantenimiento de la inversión.</p>"},
    {"id":"faq","title":"Preguntas frecuentes","html":"<p><strong>¿Inmueble en sociedad?</strong> Depende de estructura y registro.</p><p><strong>¿Mantener inversión?</strong> En general sí durante la vigencia.</p>"},
    {"id":"glossary","title":"Glosario","html":"<ul><li><strong>SMLMV</strong></li><li><strong>FIEM</strong></li><li><strong>Cancillería</strong></li></ul>"}
  ]'::jsonb,
  'published',
  0,
  now()
),
(
  'real-estate-transactions',
  'es',
  'Transacciones Inmobiliarias para Extranjeros',
  'Cómo comprar propiedad en Colombia siendo extranjero: debida diligencia, notaría, impuestos, registro y cumplimiento cambiario.',
  'Real Estate',
  '14 min',
  '[
    {"id":"definition","title":"Definición","html":"<p>Los extranjeros pueden adquirir inmuebles en Colombia sujetos a debida diligencia, formalidades notariales, impuestos y—cuando aplique—registro cambiario.</p>"},
    {"id":"legal-framework","title":"Marco legal","html":"<p>Certificado de tradición y libertad, escritura pública, impuestos de transferencia y registro ante Banco de la República si los recursos provienen del exterior.</p>"},
    {"id":"doctrinal-note","title":"Nota doctrinal","html":"<p>La cadena registral limpia y la escritura son centrales. El registro cambiario es un trámite distinto pero puede ser necesario según la estrategia del cliente.</p>"},
    {"id":"practical-example","title":"Ejemplo práctico","html":"<p>Flujo típico: debida diligencia → promesa (opcional) → escritura en notaría → impuestos → registro en oficina de instrumentos → registro de inversión extranjera si aplica.</p>"},
    {"id":"faq","title":"Preguntas frecuentes","html":"<p><strong>¿100% extranjero?</strong> En general sí para vivienda.</p><p><strong>¿Poder?</strong> Frecuente; debe estar bien otorgado.</p>"},
    {"id":"glossary","title":"Glosario","html":"<ul><li><strong>Tradición y libertad</strong></li><li><strong>Escritura pública</strong></li></ul>"}
  ]'::jsonb,
  'published',
  10,
  now()
)
on conflict (slug_key, locale) do nothing;
