-- Seed CLKR immigration guides: last-legal-day + visas-ground-rules (EN/ES)
-- Safe to re-run: skips existing (slug_key, locale) pairs.

insert into public.clkr_articles (
  slug_key, locale, title, description, category, reading_time, sections, status, sort_order, published_at
) values
(
  'last-legal-day',
  'en',
  'Last Legal Day',
  'How tourism permits work in Colombia: the 180-day annual quota, extensions, visa runs, and how to count your last lawful day.',
  'Immigration',
  '11 min',
  '[
    {"id":"overview","title":"Overview","html":"<p>If your nationality is exempt from a short-stay visa, Migración Colombia may admit you as a tourist and stamp a <strong>tourism permit</strong> (permiso de turismo). As a general rule, you may stay up to <strong>180 days per calendar year</strong> (1 January–31 December). We call this the <strong>180-day quota</strong>.</p><p>Your <strong>last legal day</strong> is the final day you may remain in Colombia under your current permit without falling into irregular status. Counting it correctly matters for planning travel, extensions, and visa filings.</p><p><em>Disclaimer: informational only — not legal advice. Officers retain discretion on the days granted at entry.</em></p>"},
    {"id":"quota-rules","title":"The 180-day quota","html":"<p>The quota resets on 1 January, but the reset is <strong>not automatic while you remain in Colombia</strong>. If you entered in the prior year and are still inside on 1 January under that permit, you continue under the days already granted until that permit ends. To start a fresh quota year, you typically need to <strong>exit and re-enter</strong>.</p><p>Days are counted <strong>including the day of arrival and the day of departure</strong>. Unused days do not roll into the next year. Time spent in Colombia under a <strong>visa</strong> is tracked separately from tourism days.</p>"},
    {"id":"stamps-and-extensions","title":"Stamps, extensions, and visa runs","html":"<p>At entry, officers usually grant up to <strong>90 days</strong>, even if you still have more than 90 days left in your annual quota. You may request a <strong>tourism permit extension</strong> (prórroga) through Migración Colombia’s procedures, typically before the stamp expires, to use remaining quota days (often up to another 90 days, subject to the 180-day cap and officer discretion).</p><p>A <strong>visa run</strong> (exit and re-entry through an authorized border post or airport) can produce a new stamp of up to 90 days — but only for days still available in the quota.</p>"},
    {"id":"practical-cases","title":"Practical cases","html":"<p><strong>Single stay from January:</strong> Enter 1 January with 90 days; extend before expiry to reach ~180 days ending around 30 June.</p><p><strong>Multiple trips:</strong> Each re-entry may show a 90-day stamp, but Migración tracks cumulative tourism days.</p><p><strong>Year overlap:</strong> An extension that crosses into January does not give you a second consecutive extension at the end of that period.</p>"},
    {"id":"overstay","title":"What if you overstay?","html":"<p>Even one day beyond your authorized stay can trigger an administrative sanction under Migración Colombia’s sanctioning framework (commonly referenced via <strong>Resolución 2357 de 2020</strong> and related rules). Regularization may require paying a fine and obtaining a <strong>safe-conduct</strong> (salvoconducto).</p>"},
    {"id":"next-steps","title":"Next steps","html":"<p>Keep a personal log of entries and exits. A Last Legal Day calculator is planned on our immigration practice page. For a case-specific count, <a href=\"/#book\">book a consultation</a>.</p>"}
  ]'::jsonb,
  'published',
  2,
  now()
),
(
  'visas-ground-rules',
  'en',
  'Colombian Visas Ground Rules',
  'Process, modality, timelines, consular jurisdiction, general documents, beneficiaries, and minors for Colombian visa applications under Resolución 5477.',
  'Immigration',
  '14 min',
  '[
    {"id":"framework","title":"Legal framework","html":"<p>Colombian visa applications are governed primarily by <strong>Resolución 5477 de 2022</strong> (in force since 22 October 2022). Core principles include a <strong>mandatory digital process</strong>, visas issued <strong>only upon request</strong>, reciprocity, discretionary authority of Cancillería, and legality.</p><p><em>Disclaimer: informational only — not legal advice.</em></p>"},
    {"id":"process-and-timelines","title":"Process, modality, and timelines","html":"<p>There is no “renewal” in the colloquial sense: each stay requires a <strong>new application</strong>. Typical steps: document preparation; online form; study fee within <strong>10 calendar days</strong>; authority requests; issuance fee within <strong>10 days</strong>; visa registration and <strong>cédula de extranjería</strong> when required.</p><p>Under Art. 13, authorities generally have up to <strong>30 days</strong> to approve, declare inadmissible, or deny.</p>"},
    {"id":"jurisdiction","title":"Consulates and jurisdiction","html":"<p>Applications from <strong>inside Colombia</strong> select the Bogotá office and require lawful presence. Applications from <strong>abroad</strong> go to the consulate with jurisdiction over your residence. From a <strong>third country</strong>, you generally must prove residence there (Art. 8).</p>"},
    {"id":"general-documents","title":"General document requirements","html":"<p>Common requirements: compliant <strong>visa photo</strong>; passport with at least <strong>six months</strong> validity; proof of current status if applying from Colombia (stamp, extension, prior visa, or safe-conduct). Category-specific evidence is additional.</p>"},
    {"id":"beneficiaries-minors","title":"Beneficiaries and minors","html":"<p>Some visa types allow <strong>beneficiaries</strong> under Resolución 5477; others do not. Minors typically need parental consent and civil registry evidence. Verify whether your category admits dependents before a family filing.</p>"},
    {"id":"after-approval","title":"After approval","html":"<p>After the visa PDF is issued, you generally have <strong>15 calendar days</strong> to register with Migración Colombia and obtain a <strong>cédula de extranjería</strong> when applicable. See the <a href=\"/immigration\">immigration practice page</a> or <a href=\"/#book\">book a consultation</a>.</p>"}
  ]'::jsonb,
  'published',
  3,
  now()
),
(
  'last-legal-day',
  'es',
  'Último día legal',
  'Cómo funcionan los permisos de turismo en Colombia: la cuota anual de 180 días, prórrogas, salidas y reingresos, y cómo calcular tu último día de permanencia regular.',
  'Immigration',
  '11 min',
  '[
    {"id":"overview","title":"Panorama","html":"<p>Si tu nacionalidad está exenta de visa de corta estadía, Migración Colombia puede admitirte como turista y estampar un <strong>permiso de turismo</strong>. Como regla general, puedes permanecer hasta <strong>180 días por año calendario</strong>. A eso lo llamamos la <strong>cuota de 180 días</strong>.</p><p>Tu <strong>último día legal</strong> es el último día en que puedes permanecer bajo tu permiso vigente sin caer en situación irregular.</p><p><em>Aviso: contenido informativo — no constituye asesoría legal.</em></p>"},
    {"id":"quota-rules","title":"La cuota de 180 días","html":"<p>La cuota se reinicia el 1 de enero, pero el reinicio <strong>no es automático si sigues en el país</strong>. Para abrir el cupo del nuevo año suele ser necesario <strong>salir y volver a ingresar</strong>.</p><p>Los días se cuentan <strong>incluyendo el día de llegada y el de salida</strong>. El tiempo bajo <strong>visa</strong> se rastrea aparte del de turismo.</p>"},
    {"id":"stamps-and-extensions","title":"Sellos, prórrogas y visa runs","html":"<p>Al ingreso suelen otorgar hasta <strong>90 días</strong>. Puedes solicitar una <strong>prórroga</strong> antes del vencimiento para usar días restantes de la cuota. Un <strong>visa run</strong> puede generar un nuevo sello de hasta 90 días solo por los días disponibles en la cuota.</p>"},
    {"id":"practical-cases","title":"Casos prácticos","html":"<p><strong>Una sola estadía desde enero:</strong> 90 días + prórroga hasta ~180.</p><p><strong>Varios viajes:</strong> Migración acumula los días de turismo.</p><p><strong>Cruce de años:</strong> una prórroga que atraviesa enero no da una segunda prórroga consecutiva al final.</p>"},
    {"id":"overstay","title":"¿Qué pasa si te pasas de días?","html":"<p>La sobreestadía puede activar un proceso sancionatorio (marco frecuentemente asociado a la <strong>Resolución 2357 de 2020</strong>). Regularizar puede exigir multa y <strong>salvoconducto</strong>.</p>"},
    {"id":"next-steps","title":"Siguientes pasos","html":"<p>Lleva un registro de entradas y salidas. Para un conteo caso a caso, <a href=\"/es#book\">agenda una consulta</a>.</p>"}
  ]'::jsonb,
  'published',
  2,
  now()
),
(
  'visas-ground-rules',
  'es',
  'Reglas generales de visas colombianas',
  'Proceso, modalidad, plazos, jurisdicción consular, documentos generales, beneficiarios y menores en solicitudes de visa bajo la Resolución 5477.',
  'Immigration',
  '14 min',
  '[
    {"id":"framework","title":"Marco legal","html":"<p>Las solicitudes se rigen principalmente por la <strong>Resolución 5477 de 2022</strong>. Principios clave: <strong>proceso digital obligatorio</strong>, visas <strong>solo a solicitud</strong>, reciprocidad, facultad discrecional y legalidad.</p><p><em>Aviso: contenido informativo — no constituye asesoría legal.</em></p>"},
    {"id":"process-and-timelines","title":"Proceso, modalidad y plazos","html":"<p>Cada permanencia exige una <strong>nueva solicitud</strong>. Pasos: documentos; formulario; estudio en <strong>10 días calendario</strong>; requerimientos; expedición en <strong>10 días</strong>; registro y <strong>cédula de extranjería</strong> cuando corresponda.</p><p>Según el art. 13, suele haber hasta <strong>30 días</strong> para aprobar, declarar inadmisible o negar.</p>"},
    {"id":"jurisdiction","title":"Consulados y jurisdicción","html":"<p>Desde <strong>Colombia</strong>: oficina de Bogotá con permanencia regular. Desde el <strong>exterior</strong>: consulado con jurisdicción sobre tu domicilio. Desde un <strong>tercer país</strong>: acreditar residencia (art. 8).</p>"},
    {"id":"general-documents","title":"Requisitos documentales generales","html":"<p>Comunes: <strong>foto de visa</strong> conforme; pasaporte con al menos <strong>seis meses</strong> de vigencia; prueba de estatus si aplicas desde Colombia. La evidencia específica de cada categoría es adicional.</p>"},
    {"id":"beneficiaries-minors","title":"Beneficiarios y menores","html":"<p>Algunas visas admiten <strong>beneficiarios</strong>; otras no. Los menores suelen requerir consentimiento parental y prueba de registro civil. Verifica la categoría antes de una radicación familiar.</p>"},
    {"id":"after-approval","title":"Después de la aprobación","html":"<p>Tras la visa en PDF, suele haber <strong>15 días calendario</strong> para registrarte ante Migración y obtener la <strong>cédula de extranjería</strong> cuando aplique. Visita la <a href=\"/es/migracion\">página de derecho migratorio</a> o <a href=\"/es#book\">agenda una consulta</a>.</p>"}
  ]'::jsonb,
  'published',
  3,
  now()
)
on conflict (slug_key, locale) do nothing;
