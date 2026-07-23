export type ServicesLocale = "en" | "es";

export type ServiceAreaId =
  | "immigration"
  | "labour-law"
  | "real-estate"
  | "family-law"
  | "corporate-law"
  | "taxes";

export type ServiceAreaContent = {
  id: ServiceAreaId;
  slugEn: string;
  slugEs: string;
  title: string;
  shortTitle: string;
  blurb: string;
  intro: string;
  services: string[];
  href: string;
};

export type ServicesHubContent = {
  eyebrow: string;
  title: string;
  intro: string;
  areasLabel: string;
  bookCta: string;
  learnMore: string;
};

function hrefFor(id: ServiceAreaId, locale: ServicesLocale): string {
  const map: Record<ServiceAreaId, { en: string; es: string }> = {
    immigration: {
      en: "/services/immigration",
      es: "/es/servicios/migracion",
    },
    "labour-law": {
      en: "/services/labour-law",
      es: "/es/servicios/laboral",
    },
    "real-estate": {
      en: "/services/real-estate",
      es: "/es/servicios/inmobiliario",
    },
    "family-law": {
      en: "/services/family-law",
      es: "/es/servicios/familia",
    },
    "corporate-law": {
      en: "/services/corporate-law",
      es: "/es/servicios/corporativo",
    },
    taxes: {
      en: "/services/taxes",
      es: "/es/servicios/impuestos",
    },
  };
  return map[id][locale];
}

const areasEn: Omit<ServiceAreaContent, "href">[] = [
  {
    id: "immigration",
    slugEn: "immigration",
    slugEs: "migracion",
    title: "Immigration Law",
    shortTitle: "Immigration",
    blurb: "What visa you need, how long you can stay, and what happens when the stamp runs out.",
    intro:
      "Colombian visas, migratory regularization, nationality, and stay rules — from first entry through long-term residence, with the paperwork Migración Colombia actually asks for.",
    services: [
      "Visa strategy and filing support (V, M, R)",
      "Migratory regularization and overstay risk review",
      "Nationality and civil registry intersections",
      "Extranjería procedures and cédula registration",
      "Last Legal Day tourism stay calculator",
    ],
  },
  {
    id: "labour-law",
    slugEn: "labour-law",
    slugEs: "laboral",
    title: "Labour Law",
    shortTitle: "Labour",
    blurb: "Hiring, contracts, terminations, and the labour risks foreigners often miss.",
    intro:
      "Counsel for employers and professionals on hiring, contracts, terminations, and Colombian labour compliance — including documentation when the worker is a foreign national.",
    services: [
      "Employment contracts and onboarding packages",
      "HR policies and workplace compliance reviews",
      "Terminations, settlements, and risk assessment",
      "Foreign national employment documentation",
      "Labour dispute orientation and strategy",
    ],
  },
  {
    id: "real-estate",
    slugEn: "real-estate",
    slugEs: "inmobiliario",
    title: "Real Estate",
    shortTitle: "Real Estate",
    blurb: "Buying, selling, or leasing — with due diligence that survives a civil-law closing.",
    intro:
      "Support for buying, selling, and leasing property in Colombia: title checks, contract review, propiedad horizontal, and closing coordination. Escrow is not the default here; we explain what actually secures the deal.",
    services: [
      "Purchase and sale due diligence",
      "Lease drafting and review",
      "Propiedad horizontal (HOA) guidance",
      "Title and registry coordination",
      "Closing support and payment mechanics",
    ],
  },
  {
    id: "family-law",
    slugEn: "family-law",
    slugEs: "familia",
    title: "Family Law",
    shortTitle: "Family",
    blurb: "Marriage, divorce, and custody when one foot is still in another country.",
    intro:
      "Bilingual guidance on family matters that often cross into visas, civil registry, and asset planning — without pretending every case is the same.",
    services: [
      "Marriage and prenuptial agreements",
      "Divorce and separation strategy",
      "Custody and parental responsibility orientation",
      "Cross-border family documentation",
      "Estate planning coordination with family goals",
    ],
  },
  {
    id: "corporate-law",
    slugEn: "corporate-law",
    slugEs: "corporativo",
    title: "Corporate Law",
    shortTitle: "Corporate",
    blurb: "Incorporate, contract, and keep the company in good standing.",
    intro:
      "Help international founders and investors set up and operate companies in Colombia — bylaws, shareholder agreements, and the housekeeping Cámara de Comercio actually expects.",
    services: [
      "Company incorporation and bylaws",
      "Shareholder and commercial contracts",
      "Corporate governance and filings",
      "Foreign investment registration orientation",
      "Ongoing business legal support",
    ],
  },
  {
    id: "taxes",
    slugEn: "taxes",
    slugEs: "impuestos",
    title: "Taxes",
    shortTitle: "Taxes",
    blurb: "Tax residency and cross-border orientation — then the right specialist when the numbers get deep.",
    intro:
      "Orientation on tax residency and cross-border reporting for foreigners and companies in Colombia. When the matter needs a full tax specialist, we say so and coordinate the handoff.",
    services: [
      "Tax residency orientation",
      "Cross-border income and reporting overview",
      "Corporate tax setup coordination",
      "Real estate transaction tax checkpoints",
      "Referral to tax specialists when needed",
    ],
  },
];

const areasEs: Omit<ServiceAreaContent, "href">[] = [
  {
    id: "immigration",
    slugEn: "immigration",
    slugEs: "migracion",
    title: "Derecho migratorio",
    shortTitle: "Migración",
    blurb: "Qué visa necesitas, cuánto puedes quedarte y qué pasa cuando se acaba el sello.",
    intro:
      "Visas colombianas, regulación migratoria, nacionalidad y reglas de permanencia — desde el primer ingreso hasta la residencia de largo plazo, con el papeleo que Migración Colombia pide de verdad.",
    services: [
      "Estrategia y acompañamiento en visas (V, M, R)",
      "Regulación migratoria y revisión de sobreestadía",
      "Nacionalidad e intersecciones con registro civil",
      "Trámites de extranjería y cédula",
      "Calculadora de último día legal (turismo)",
    ],
  },
  {
    id: "labour-law",
    slugEn: "labour-law",
    slugEs: "laboral",
    title: "Derecho laboral",
    shortTitle: "Laboral",
    blurb: "Contratación, contratos, terminaciones y los riesgos laborales que el extranjero suele pasar por alto.",
    intro:
      "Asesoría para empleadores y profesionales en contratación, contratos, terminaciones y cumplimiento laboral en Colombia — incluida la documentación cuando el trabajador es extranjero.",
    services: [
      "Contratos laborales y paquetes de ingreso",
      "Políticas de RR. HH. y revisiones de cumplimiento",
      "Terminaciones, conciliaciones y evaluación de riesgo",
      "Documentación de empleo para extranjeros",
      "Orientación y estrategia en conflictos laborales",
    ],
  },
  {
    id: "real-estate",
    slugEn: "real-estate",
    slugEs: "inmobiliario",
    title: "Derecho inmobiliario",
    shortTitle: "Inmobiliario",
    blurb: "Comprar, vender o arrendar — con debida diligencia que aguante un cierre en derecho continental.",
    intro:
      "Acompañamiento en compraventa y arrendamiento: títulos, contratos, propiedad horizontal y cierre. El escrow no es la regla aquí; explicamos qué garantiza el negocio de verdad.",
    services: [
      "Debida diligencia en compraventa",
      "Redacción y revisión de arrendamientos",
      "Orientación en propiedad horizontal",
      "Coordinación de títulos y registro",
      "Apoyo en cierre y mecánicas de pago",
    ],
  },
  {
    id: "family-law",
    slugEn: "family-law",
    slugEs: "familia",
    title: "Derecho de familia",
    shortTitle: "Familia",
    blurb: "Matrimonio, divorcio y custodia cuando un pie sigue en otro país.",
    intro:
      "Orientación bilingüe en asuntos de familia que suelen cruzarse con visas, registro civil y planeación patrimonial — sin pretender que todos los casos sean iguales.",
    services: [
      "Matrimonio y capitulaciones",
      "Estrategia de divorcio y separación",
      "Orientación en custodia y responsabilidad parental",
      "Documentación familiar transfronteriza",
      "Coordinación con planeación patrimonial",
    ],
  },
  {
    id: "corporate-law",
    slugEn: "corporate-law",
    slugEs: "corporativo",
    title: "Derecho corporativo",
    shortTitle: "Corporativo",
    blurb: "Constituir, contratar y mantener la sociedad en regla.",
    intro:
      "Ayudamos a fundadores e inversionistas internacionales a constituir y operar compañías en Colombia: estatutos, acuerdos de socios y el housekeeping que Cámara de Comercio espera de verdad.",
    services: [
      "Constitución de sociedades y estatutos",
      "Contratos societarios y mercantiles",
      "Gobierno societario y radicaciones",
      "Orientación en registro de inversión extranjera",
      "Acompañamiento jurídico continuo",
    ],
  },
  {
    id: "taxes",
    slugEn: "taxes",
    slugEs: "impuestos",
    title: "Impuestos",
    shortTitle: "Impuestos",
    blurb: "Residencia fiscal y orientación transfronteriza — y el especialista correcto cuando los números se profundizan.",
    intro:
      "Orientación sobre residencia fiscal y reportes transfronterizos para extranjeros y empresas en Colombia. Cuando el asunto pide un especialista tributario de tiempo completo, lo decimos y coordinamos el traspaso.",
    services: [
      "Orientación sobre residencia fiscal",
      "Panorama de ingresos y reportes transfronterizos",
      "Coordinación de setup tributario societario",
      "Puntos de control fiscal en inmuebles",
      "Remisión a especialistas tributarios cuando haga falta",
    ],
  },
];

export const servicesHubContent: Record<ServicesLocale, ServicesHubContent> = {
  en: {
    eyebrow: "Services",
    title: "What we handle for international clients in Colombia.",
    intro:
      "Six practice areas. Same method every time: consultation, written Concepto Jurídico, then a scoped plan you can act on.",
    areasLabel: "Practice areas",
    bookCta: "Book a consultation",
    learnMore: "Learn more",
  },
  es: {
    eyebrow: "Servicios",
    title: "Qué atendemos para clientes internacionales en Colombia.",
    intro:
      "Seis áreas de práctica. El mismo método siempre: consulta, concepto jurídico escrito y un plan acotado que puedas ejecutar.",
    areasLabel: "Áreas de práctica",
    bookCta: "Agendar consulta",
    learnMore: "Ver más",
  },
};

export function getServiceAreas(locale: ServicesLocale): ServiceAreaContent[] {
  const source = locale === "es" ? areasEs : areasEn;
  return source.map((area) => ({
    ...area,
    href: hrefFor(area.id, locale),
  }));
}

export function getServiceArea(
  id: ServiceAreaId,
  locale: ServicesLocale,
): ServiceAreaContent | undefined {
  return getServiceAreas(locale).find((area) => area.id === id);
}

export const SERVICE_AREA_IDS: ServiceAreaId[] = [
  "immigration",
  "labour-law",
  "real-estate",
  "family-law",
  "corporate-law",
  "taxes",
];

/** Non-immigration MVP area ids (have dedicated simple pages). */
export const MVP_SERVICE_AREA_IDS: Exclude<ServiceAreaId, "immigration">[] = [
  "labour-law",
  "real-estate",
  "family-law",
  "corporate-law",
  "taxes",
];
