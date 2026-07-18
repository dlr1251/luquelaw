import type { ClkrArticleRecord } from "./types";

const PUBLISHED_AT = "2026-05-26T12:00:00.000Z";

/** Full article bodies used when Supabase is unavailable or has no published rows yet. */
export const staticClkrArticleRecords: ClkrArticleRecord[] = [
  {
    id: "static-investor-visa-en",
    slug_key: "investor-visa",
    locale: "en",
    title: "Investor Visa (Visa de Inversionista — Tipo M)",
    description:
      "Eligibility, legal framework (Resolución 5477 de 2022), investment thresholds, FIEM registration, timelines, and common pitfalls.",
    category: "Immigration",
    reading_time: "12 min",
    sections: [
      {
        id: "definition",
        title: "Definition",
        html: "<p>Colombia's investor visa (<strong>Visa de Inversionista</strong>) is an <strong>M-category</strong> visa for foreign nationals who make and maintain a qualifying investment in Colombia. The investment must be <strong>documented and properly registered</strong>; buying an asset alone does not automatically grant the visa.</p>",
      },
      {
        id: "legal-framework",
        title: "Legal framework",
        html: "<p>The framework is primarily governed by <strong>Resolución 5477 de 2022</strong>. A key threshold is <strong>100 SMLMV</strong>. Qualifying investments commonly include real estate, corporate participation, and certain financial instruments. The frequent failure point is inadequate foreign investment registration.</p>",
      },
      {
        id: "doctrinal-note",
        title: "Doctrinal note",
        html: "<p>A core pillar is <strong>foreign investment registration</strong> with <strong>Banco de la República</strong> (historically Form No. 4; today often referenced as <strong>FIEM</strong>). Without proper registration, visa support and repatriation rights may be impaired.</p>",
      },
      {
        id: "practical-example",
        title: "Practical example",
        html: "<p><strong>Scenario:</strong> A U.S. citizen buys a Medellín apartment for USD 60,000. Steps: (1) bring funds through legal channels; (2) register foreign investment with Banco de la República; (3) prepare the visa file; (4) apply and track processing; (5) maintain the investment through the visa period.</p>",
      },
      {
        id: "faq",
        title: "FAQ",
        html: "<p><strong>Can I use property held in a Colombian company?</strong> Sometimes—it depends on structure and registration evidence.</p><p><strong>Must the investment be maintained?</strong> Generally yes while the visa is valid.</p><p><strong>Dependents?</strong> Often available subject to requirements.</p><p><strong>If I sell the property?</strong> Case-specific analysis required; the visa basis may be undermined.</p>",
      },
      {
        id: "glossary",
        title: "Glossary",
        html: "<ul><li><strong>SMLMV</strong> — monthly minimum legal wage threshold</li><li><strong>FIEM</strong> — foreign investment registration workflow</li><li><strong>Cancillería</strong> — Ministry of Foreign Affairs</li><li><strong>Resolución 5477 de 2022</strong> — visa regulation</li></ul>",
      },
    ],
    status: "published",
    sort_order: 0,
    translation_group_id: "static-tg-investor-visa",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-real-estate-transactions-en",
    slug_key: "real-estate-transactions",
    locale: "en",
    title: "Real Estate Transactions for Foreigners",
    description:
      "How foreigners buy property in Colombia: due diligence, notarial process, taxes, registration, and foreign investment compliance.",
    category: "Real Estate",
    reading_time: "14 min",
    sections: [
      {
        id: "definition",
        title: "Definition",
        html: "<p>Foreign nationals may acquire real property in Colombia subject to due diligence, notarial formalities, tax obligations, and—when applicable—foreign exchange and investment registration rules.</p>",
      },
      {
        id: "legal-framework",
        title: "Legal framework",
        html: "<p>Key areas include property registry (certificado de tradición y libertad), notarial deeds, transfer taxes, and Banco de la República registration when funds come from abroad.</p>",
      },
      {
        id: "doctrinal-note",
        title: "Doctrinal note",
        html: "<p>The notarial deed and clean registry chain are central. Foreign investment registration is separate from registration at the notary but may be required for visa or repatriation strategies.</p>",
      },
      {
        id: "practical-example",
        title: "Practical example",
        html: "<p>Typical flow: legal due diligence → promise of sale (optional) → deed at notary → pay taxes → register at office of instruments → register foreign investment if applicable.</p>",
      },
      {
        id: "faq",
        title: "FAQ",
        html: "<p><strong>Can foreigners own 100%?</strong> Generally yes for most residential property.</p><p><strong>Power of attorney?</strong> Often used; must be carefully drafted and authenticated.</p>",
      },
      {
        id: "glossary",
        title: "Glossary",
        html: "<ul><li><strong>Tradición y libertad</strong> — property title certificate</li><li><strong>Escritura pública</strong> — public deed</li><li><strong>Notaría</strong> — notary office</li></ul>",
      },
    ],
    status: "published",
    sort_order: 10,
    translation_group_id: "static-tg-real-estate-transactions",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-investor-visa-es",
    slug_key: "investor-visa",
    locale: "es",
    title: "Visa de Inversionista (Tipo M)",
    description:
      "Requisitos, marco legal (Resolución 5477 de 2022), umbral de inversión, registro FIEM, tiempos y errores frecuentes.",
    category: "Immigration",
    reading_time: "12 min",
    sections: [
      {
        id: "definition",
        title: "Definición",
        html: "<p>La visa de inversionista es una visa de categoría <strong>M</strong> para extranjeros que realizan y mantienen una inversión calificada en Colombia. La inversión debe estar <strong>documentada y registrada</strong> correctamente.</p>",
      },
      {
        id: "legal-framework",
        title: "Marco legal",
        html: "<p>Marco principal: <strong>Resolución 5477 de 2022</strong>. Umbral clave: <strong>100 SMLMV</strong>. Inversiones admisibles incluyen inmuebles, participación societaria e instrumentos financieros, con soporte documental.</p>",
      },
      {
        id: "doctrinal-note",
        title: "Nota doctrinal",
        html: "<p>Pilar central: <strong>registro de inversión extranjera</strong> ante el <strong>Banco de la República</strong> (históricamente Formulario 4; hoy a menudo <strong>FIEM</strong>).</p>",
      },
      {
        id: "practical-example",
        title: "Ejemplo práctico",
        html: "<p>Escenario: ciudadano estadounidense compra apartamento en Medellín. Pasos: canalización legal de fondos, registro cambiario, armado del expediente visa, radicación y mantenimiento de la inversión.</p>",
      },
      {
        id: "faq",
        title: "Preguntas frecuentes",
        html: "<p><strong>¿Inmueble en sociedad?</strong> Depende de estructura y registro.</p><p><strong>¿Mantener inversión?</strong> En general sí durante la vigencia.</p>",
      },
      {
        id: "glossary",
        title: "Glosario",
        html: "<ul><li><strong>SMLMV</strong></li><li><strong>FIEM</strong></li><li><strong>Cancillería</strong></li></ul>",
      },
    ],
    status: "published",
    sort_order: 0,
    translation_group_id: "static-tg-investor-visa",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-real-estate-transactions-es",
    slug_key: "real-estate-transactions",
    locale: "es",
    title: "Transacciones Inmobiliarias para Extranjeros",
    description:
      "Cómo comprar propiedad en Colombia siendo extranjero: debida diligencia, notaría, impuestos, registro y cumplimiento cambiario.",
    category: "Real Estate",
    reading_time: "14 min",
    sections: [
      {
        id: "definition",
        title: "Definición",
        html: "<p>Los extranjeros pueden adquirir inmuebles en Colombia sujetos a debida diligencia, formalidades notariales, impuestos y—cuando aplique—registro cambiario.</p>",
      },
      {
        id: "legal-framework",
        title: "Marco legal",
        html: "<p>Certificado de tradición y libertad, escritura pública, impuestos de transferencia y registro ante Banco de la República si los recursos provienen del exterior.</p>",
      },
      {
        id: "doctrinal-note",
        title: "Nota doctrinal",
        html: "<p>La cadena registral limpia y la escritura son centrales. El registro cambiario es un trámite distinto pero puede ser necesario según la estrategia del cliente.</p>",
      },
      {
        id: "practical-example",
        title: "Ejemplo práctico",
        html: "<p>Flujo típico: debida diligencia → promesa (opcional) → escritura en notaría → impuestos → registro en oficina de instrumentos → registro de inversión extranjera si aplica.</p>",
      },
      {
        id: "faq",
        title: "Preguntas frecuentes",
        html: "<p><strong>¿100% extranjero?</strong> En general sí para vivienda.</p><p><strong>¿Poder?</strong> Frecuente; debe estar bien otorgado.</p>",
      },
      {
        id: "glossary",
        title: "Glosario",
        html: "<ul><li><strong>Tradición y libertad</strong></li><li><strong>Escritura pública</strong></li></ul>",
      },
    ],
    status: "published",
    sort_order: 10,
    translation_group_id: "static-tg-real-estate-transactions",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-last-legal-day-en",
    slug_key: "last-legal-day",
    locale: "en",
    title: "Last Legal Day",
    description:
      "How tourism permits work in Colombia: the 180-day annual quota, extensions, visa runs, and how to count your last lawful day.",
    category: "Immigration",
    reading_time: "11 min",
    sections: [
      {
        id: "overview",
        title: "Overview",
        html: "<p>If your nationality is exempt from a short-stay visa, Migración Colombia may admit you as a tourist and stamp a <strong>tourism permit</strong> (permiso de turismo). As a general rule, you may stay up to <strong>180 days per calendar year</strong> (1 January–31 December). We call this the <strong>180-day quota</strong>.</p><p>Your <strong>last legal day</strong> is the final day you may remain in Colombia under your current permit without falling into irregular status. Counting it correctly matters for planning travel, extensions, and visa filings.</p><p><em>Disclaimer: informational only — not legal advice. Officers retain discretion on the days granted at entry.</em></p>",
      },
      {
        id: "quota-rules",
        title: "The 180-day quota",
        html: "<p>The quota resets on 1 January, but the reset is <strong>not automatic while you remain in Colombia</strong>. If you entered in the prior year and are still inside on 1 January under that permit, you continue under the days already granted until that permit ends. To start a fresh quota year, you typically need to <strong>exit and re-enter</strong>.</p><p>Days are counted <strong>including the day of arrival and the day of departure</strong>. Unused days do not roll into the next year. Time spent in Colombia under a <strong>visa</strong> is tracked separately from tourism days: exhausting visa days does not by itself consume your tourism quota, and vice versa — but you must leave and re-enter under the correct status.</p>",
      },
      {
        id: "stamps-and-extensions",
        title: "Stamps, extensions, and visa runs",
        html: "<p>At entry, officers usually grant up to <strong>90 days</strong>, even if you still have more than 90 days left in your annual quota. You may request a <strong>tourism permit extension</strong> (prórroga) through Migración Colombia’s procedures, typically before the stamp expires, to use remaining quota days (often up to another 90 days, subject to the 180-day cap and officer discretion).</p><p>A <strong>visa run</strong> (exit and re-entry through an authorized border post or airport) can produce a new stamp of up to 90 days — but only for days still available in the quota. If you have already used 100 days, the next stamp may be shorter than 90. There is no fixed minimum time abroad; many travelers allow at least 24 hours outside.</p>",
      },
      {
        id: "practical-cases",
        title: "Practical cases",
        html: "<p><strong>Single stay from January:</strong> Enter 1 January with 90 days; extend before expiry to reach ~180 days ending around 30 June. After that, plan a visa or leave.</p><p><strong>Multiple trips:</strong> Each re-entry may show a 90-day stamp, but Migración tracks cumulative tourism days. A later entry can receive fewer than 90 days once the quota is partly used.</p><p><strong>Year overlap:</strong> An extension that crosses into January does not give you a second consecutive extension at the end of that period. Leaving and re-entering in the new year can open a refreshed quota, reduced by any tourism days already used in that new calendar year.</p>",
      },
      {
        id: "overstay",
        title: "What if you overstay?",
        html: "<p>Even one day beyond your authorized stay can trigger an administrative sanction under Migración Colombia’s sanctioning framework (commonly referenced via <strong>Resolución 2357 de 2020</strong> and related rules). Sanctions range by severity and can affect future visa prospects. Regularization may require paying a fine and obtaining a <strong>safe-conduct</strong> (salvoconducto) before you can leave or apply for a visa.</p>",
      },
      {
        id: "next-steps",
        title: "Next steps",
        html: "<p>Keep a personal log of entries and exits. A Last Legal Day calculator is planned on our immigration practice page. For a case-specific count or if you are near overstay, <a href=\"/#book\">book a consultation</a>.</p>",
      },
    ],
    status: "published",
    sort_order: 2,
    translation_group_id: "static-tg-last-legal-day",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-visas-ground-rules-en",
    slug_key: "visas-ground-rules",
    locale: "en",
    title: "Colombian Visas Ground Rules",
    description:
      "Process, modality, timelines, consular jurisdiction, general documents, beneficiaries, and minors for Colombian visa applications under Resolución 5477.",
    category: "Immigration",
    reading_time: "14 min",
    sections: [
      {
        id: "framework",
        title: "Legal framework",
        html: "<p>Colombian visa applications are governed primarily by <strong>Resolución 5477 de 2022</strong> (in force since 22 October 2022), which replaced Resolución 6045 de 2017. Core principles include a <strong>mandatory digital process</strong>, visas issued <strong>only upon request</strong>, reciprocity, discretionary authority of Cancillería, and legality.</p><p><em>Disclaimer: informational only — not legal advice.</em></p>",
      },
      {
        id: "process-and-timelines",
        title: "Process, modality, and timelines",
        html: "<p>There is no “renewal” in the colloquial sense: each stay requires a <strong>new application</strong>. Typical steps: (1) collect and prepare documents; (2) submit the online form; (3) pay the study fee within <strong>10 calendar days</strong>; (4) respond to any authority requests; (5) if approved, pay the issuance fee within <strong>10 days</strong>; (6) register the visa and obtain a <strong>cédula de extranjería</strong> when required.</p><p>Under Art. 13, authorities generally have up to <strong>30 days</strong> to approve, declare inadmissible, or deny. <strong>Inadmissible</strong> usually allows immediate reapplication (new study fee). <strong>Denied</strong> typically requires leaving within 30 days and waiting <strong>six months</strong> before reapplying from your home country.</p>",
      },
      {
        id: "jurisdiction",
        title: "Consulates and jurisdiction",
        html: "<p>Applications from <strong>inside Colombia</strong> are filed selecting the Bogotá office and require lawful presence. Applications from <strong>abroad</strong> go to the Colombian consulate with jurisdiction over your place of residence. From a <strong>third country</strong>, you generally must prove temporary or permanent residence there (Art. 8). Traveling away from the filing jurisdiction during processing can lead to inadmissibility; interviews may be required in person.</p>",
      },
      {
        id: "general-documents",
        title: "General document requirements",
        html: "<p>Common to most categories: a compliant <strong>visa photo</strong> (recent, white background, size limits); passport biodata page with at least <strong>six months</strong> validity; and proof of current status if applying from Colombia (entry stamp, extension, prior visa, or safe-conduct for visa application). Documents are usually uploaded as PDFs within platform size/page limits and should not be password-protected. Category-specific evidence (contracts, bank statements, civil registry extracts, etc.) is additional.</p>",
      },
      {
        id: "beneficiaries-minors",
        title: "Beneficiaries and minors",
        html: "<p>Some visa types allow <strong>beneficiaries</strong> (dependents) under conditions set in Resolución 5477 for that category; others do not. Minors typically need parental consent, identity documents, and civil registry evidence consistent with the category. Always verify whether the specific visa you seek admits beneficiaries before planning a family filing.</p>",
      },
      {
        id: "after-approval",
        title: "After approval",
        html: "<p>Once the visa PDF is issued, Cancillería generally notifies that you have <strong>15 calendar days</strong> to register with Migración Colombia and obtain a <strong>cédula de extranjería</strong> when applicable. That ID is often required for banking and local contracts. Missed registration deadlines can create separate compliance issues.</p><p>For strategy on a specific category, see our <a href=\"/immigration\">immigration practice page</a> or <a href=\"/#book\">book a consultation</a>.</p>",
      },
    ],
    status: "published",
    sort_order: 3,
    translation_group_id: "static-tg-visas-ground-rules",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-last-legal-day-es",
    slug_key: "last-legal-day",
    locale: "es",
    title: "Último día legal",
    description:
      "Cómo funcionan los permisos de turismo en Colombia: la cuota anual de 180 días, prórrogas, salidas y reingresos, y cómo calcular tu último día de permanencia regular.",
    category: "Immigration",
    reading_time: "11 min",
    sections: [
      {
        id: "overview",
        title: "Panorama",
        html: "<p>Si tu nacionalidad está exenta de visa de corta estadía, Migración Colombia puede admitirte como turista y estampar un <strong>permiso de turismo</strong>. Como regla general, puedes permanecer hasta <strong>180 días por año calendario</strong> (1 de enero–31 de diciembre). A eso lo llamamos la <strong>cuota de 180 días</strong>.</p><p>Tu <strong>último día legal</strong> es el último día en que puedes permanecer en Colombia bajo tu permiso vigente sin caer en situación irregular. Contarlo bien importa para planear viajes, prórrogas y solicitudes de visa.</p><p><em>Aviso: contenido informativo — no constituye asesoría legal. Los oficiales conservan discrecionalidad sobre los días otorgados al ingreso.</em></p>",
      },
      {
        id: "quota-rules",
        title: "La cuota de 180 días",
        html: "<p>La cuota se reinicia el 1 de enero, pero el reinicio <strong>no es automático si sigues en el país</strong>. Si ingresaste el año anterior y el 1 de enero aún estás bajo ese permiso, continúas con los días ya otorgados hasta que expire. Para abrir el cupo del nuevo año suele ser necesario <strong>salir y volver a ingresar</strong>.</p><p>Los días se cuentan <strong>incluyendo el día de llegada y el de salida</strong>. Los días no usados no se acumulan al año siguiente. El tiempo bajo <strong>visa</strong> se rastrea aparte del de turismo: agotar días de visa no consume por sí solo la cuota de turismo, y viceversa — pero debes salir y reingresar bajo el estatus correcto.</p>",
      },
      {
        id: "stamps-and-extensions",
        title: "Sellos, prórrogas y visa runs",
        html: "<p>Al ingreso, los oficiales suelen otorgar hasta <strong>90 días</strong>, aunque te queden más de 90 en la cuota anual. Puedes solicitar una <strong>prórroga del permiso de turismo</strong> ante Migración Colombia, normalmente antes de que venza el sello, para usar días restantes (a menudo hasta otros 90, sujeto al tope de 180 y a la discrecionalidad).</p><p>Un <strong>visa run</strong> (salida y reingreso por puesto habilitado) puede generar un nuevo sello de hasta 90 días — solo por los días que aún tengas en la cuota. Si ya usaste 100 días, el siguiente sello puede ser menor a 90. No hay un mínimo fijo de tiempo en el exterior; muchos viajeros dejan al menos 24 horas fuera.</p>",
      },
      {
        id: "practical-cases",
        title: "Casos prácticos",
        html: "<p><strong>Una sola estadía desde enero:</strong> Ingreso el 1 de enero con 90 días; prórroga antes del vencimiento hasta completar ~180 días hacia el 30 de junio. Después, planear visa o salir.</p><p><strong>Varios viajes:</strong> Cada reingreso puede mostrar un sello de 90 días, pero Migración acumula los días de turismo. Un ingreso posterior puede recibir menos de 90 si la cuota ya está parcialmente usada.</p><p><strong>Cruce de años:</strong> Una prórroga que atraviesa enero no da derecho a una segunda prórroga consecutiva al final. Salir y reingresar en el año nuevo puede abrir cuota renovada, descontando los días de turismo ya usados en ese año calendario.</p>",
      },
      {
        id: "overstay",
        title: "¿Qué pasa si te pasas de días?",
        html: "<p>Incluso un día de sobreestadía puede activar un proceso sancionatorio (marco frecuentemente asociado a la <strong>Resolución 2357 de 2020</strong> y normas conexas). Las sanciones varían por gravedad y pueden afectar futuras visas. Regularizar puede exigir pagar multa y obtener un <strong>salvoconducto</strong> antes de salir o solicitar visa.</p>",
      },
      {
        id: "next-steps",
        title: "Siguientes pasos",
        html: "<p>Lleva un registro personal de entradas y salidas. En la página del área migratoria planeamos una calculadora de último día legal. Para un conteo caso a caso o si estás cerca de sobreestadía, <a href=\"/es#book\">agenda una consulta</a>.</p>",
      },
    ],
    status: "published",
    sort_order: 2,
    translation_group_id: "static-tg-last-legal-day",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
  {
    id: "static-visas-ground-rules-es",
    slug_key: "visas-ground-rules",
    locale: "es",
    title: "Reglas generales de visas colombianas",
    description:
      "Proceso, modalidad, plazos, jurisdicción consular, documentos generales, beneficiarios y menores en solicitudes de visa bajo la Resolución 5477.",
    category: "Immigration",
    reading_time: "14 min",
    sections: [
      {
        id: "framework",
        title: "Marco legal",
        html: "<p>Las solicitudes de visa colombiana se rigen principalmente por la <strong>Resolución 5477 de 2022</strong> (vigente desde el 22 de octubre de 2022), que reemplazó la Resolución 6045 de 2017. Principios clave: <strong>proceso digital obligatorio</strong>, visas <strong>solo a solicitud</strong>, reciprocidad, facultad discrecional de Cancillería y legalidad.</p><p><em>Aviso: contenido informativo — no constituye asesoría legal.</em></p>",
      },
      {
        id: "process-and-timelines",
        title: "Proceso, modalidad y plazos",
        html: "<p>No hay “renovación” en sentido coloquial: cada permanencia exige una <strong>nueva solicitud</strong>. Pasos típicos: (1) reunir y preparar documentos; (2) radicar el formulario en línea; (3) pagar el estudio dentro de <strong>10 días calendario</strong>; (4) responder requerimientos; (5) si se aprueba, pagar la expedición en <strong>10 días</strong>; (6) registrar la visa y obtener <strong>cédula de extranjería</strong> cuando corresponda.</p><p>Según el art. 13, la autoridad suele tener hasta <strong>30 días</strong> para aprobar, declarar inadmisible o negar. <strong>Inadmisible</strong> suele permitir volver a aplicar de inmediato (nuevo estudio). <strong>Negada</strong> típicamente exige salir en 30 días y esperar <strong>seis meses</strong> para reaplicar desde el país de origen.</p>",
      },
      {
        id: "jurisdiction",
        title: "Consulados y jurisdicción",
        html: "<p>Desde <strong>Colombia</strong> se radica seleccionando la oficina de Bogotá y se exige permanencia regular. Desde el <strong>exterior</strong>, ante el consulado con jurisdicción sobre tu domicilio. Desde un <strong>tercer país</strong>, en general debes acreditar residencia temporal o permanente allí (art. 8). Salir de la jurisdicción de radicación durante el trámite puede generar inadmisión; puede haber entrevista presencial.</p>",
      },
      {
        id: "general-documents",
        title: "Requisitos documentales generales",
        html: "<p>Comunes a la mayoría de categorías: <strong>foto de visa</strong> conforme (reciente, fondo blanco, límites de tamaño); página de datos del pasaporte con al menos <strong>seis meses</strong> de vigencia; y prueba de estatus si aplicas desde Colombia (sello de ingreso, prórroga, visa previa o salvoconducto para solicitar visa). Los PDF deben respetar límites de la plataforma y no ir protegidos con contraseña. La evidencia específica de cada categoría es adicional.</p>",
      },
      {
        id: "beneficiaries-minors",
        title: "Beneficiarios y menores",
        html: "<p>Algunas visas admiten <strong>beneficiarios</strong> (dependientes) según las condiciones de la Resolución 5477 para esa categoría; otras no. Los menores suelen requerir consentimiento parental, identidad y prueba de registro civil acorde a la categoría. Verifica siempre si la visa que buscas admite beneficiarios antes de planear una radicación familiar.</p>",
      },
      {
        id: "after-approval",
        title: "Después de la aprobación",
        html: "<p>Una vez expedida la visa en PDF, Cancillería suele notificar que tienes <strong>15 días calendario</strong> para registrarte ante Migración Colombia y obtener la <strong>cédula de extranjería</strong> cuando aplique. Ese documento suele ser necesario para banca y contratos locales. Omitir el registro puede generar incumplimientos aparte.</p><p>Para estrategia por categoría, visita la <a href=\"/es/migracion\">página de derecho migratorio</a> o <a href=\"/es#book\">agenda una consulta</a>.</p>",
      },
    ],
    status: "published",
    sort_order: 3,
    translation_group_id: "static-tg-visas-ground-rules",
    published_at: PUBLISHED_AT,
    created_at: PUBLISHED_AT,
    updated_at: PUBLISHED_AT,
  },
];

export function getStaticPublishedArticle(
  slugKey: string,
  locale: "en" | "es",
): ClkrArticleRecord | null {
  return (
    staticClkrArticleRecords.find(
      (article) =>
        article.slug_key === slugKey && article.locale === locale && article.status === "published",
    ) ?? null
  );
}

export function getStaticPublishedArticles(locale: "en" | "es"): ClkrArticleRecord[] {
  return staticClkrArticleRecords
    .filter((article) => article.locale === locale && article.status === "published")
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getStaticTranslationSlugKey(
  slugKey: string,
  locale: "en" | "es",
): string | null {
  const source = getStaticPublishedArticle(slugKey, locale);
  if (!source?.translation_group_id) return null;

  const otherLocale = locale === "en" ? "es" : "en";
  const translation = staticClkrArticleRecords.find(
    (article) =>
      article.translation_group_id === source.translation_group_id &&
      article.locale === otherLocale &&
      article.status === "published",
  );

  return translation?.slug_key ?? null;
}
