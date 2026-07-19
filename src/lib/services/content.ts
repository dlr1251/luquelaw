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
    blurb: "Visas, stay rules, nationality, and extranjería for international clients.",
    intro:
      "Clear guidance on Colombian visas, migratory regularization, nationality, and stay compliance — from first entry through long-term residence.",
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
    blurb: "Employment contracts, HR compliance, and workplace disputes in Colombia.",
    intro:
      "Practical counsel for employers and professionals on hiring, contracts, terminations, and Colombian labour compliance.",
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
    blurb: "Purchase, sale, leases, and HOA matters for property in Colombia.",
    intro:
      "Transaction support for buying, selling, and leasing property in Colombia — with clear due diligence and closing coordination.",
    services: [
      "Purchase and sale due diligence",
      "Lease drafting and review",
      "HOA / propiedad horizontal guidance",
      "Title and registry coordination",
      "Escrow and closing support",
    ],
  },
  {
    id: "family-law",
    slugEn: "family-law",
    slugEs: "familia",
    title: "Family Law",
    shortTitle: "Family",
    blurb: "Marriage, divorce, custody, and cross-border family matters.",
    intro:
      "Sensitive, bilingual guidance on family matters that often intersect with immigration and asset planning for international clients.",
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
    blurb: "Company formation, contracts, and ongoing business counsel.",
    intro:
      "Help international founders and investors set up and operate companies in Colombia with clean corporate hygiene.",
    services: [
      "Company incorporation and bylaws",
      "Shareholder and commercial contracts",
      "Corporate housekeeping and governance",
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
    blurb: "International tax orientation for individuals and businesses in Colombia.",
    intro:
      "High-level tax orientation for foreigners and companies operating in Colombia — coordinated with specialist allies when needed.",
    services: [
      "Tax residency orientation",
      "Cross-border income and reporting overview",
      "Corporate tax setup coordination",
      "Real estate transaction tax checkpoints",
      "Referrals to allied tax specialists",
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
    blurb: "Visas, permanencia, nacionalidad y extranjería para clientes internacionales.",
    intro:
      "Orientación clara sobre visas colombianas, regulación migratoria, nacionalidad y cumplimiento de permanencia — desde el primer ingreso hasta la residencia de largo plazo.",
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
    blurb: "Contratos laborales, cumplimiento de RR. HH. y conflictos en el trabajo.",
    intro:
      "Asesoría práctica para empleadores y profesionales en contratación, terminaciones y cumplimiento laboral en Colombia.",
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
    blurb: "Compraventa, arrendamientos y propiedad horizontal en Colombia.",
    intro:
      "Acompañamiento en compraventa y arrendamiento de inmuebles en Colombia, con debida diligencia clara y coordinación del cierre.",
    services: [
      "Debida diligencia en compraventa",
      "Redacción y revisión de arrendamientos",
      "Orientación en propiedad horizontal",
      "Coordinación de títulos y registro",
      "Apoyo en depósito y cierre",
    ],
  },
  {
    id: "family-law",
    slugEn: "family-law",
    slugEs: "familia",
    title: "Derecho de familia",
    shortTitle: "Familia",
    blurb: "Matrimonio, divorcio, custodia y asuntos familiares transfronterizos.",
    intro:
      "Orientación bilingüe y cuidadosa en asuntos de familia que suelen cruzarse con migración y planeación patrimonial.",
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
    blurb: "Constitución de sociedades, contratos y acompañamiento empresarial.",
    intro:
      "Ayudamos a fundadores e inversionistas internacionales a constituir y operar compañías en Colombia con higiene societaria clara.",
    services: [
      "Constitución de sociedades y estatutos",
      "Contratos societarios y mercantiles",
      "Gobierno corporativo y housekeeping",
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
    blurb: "Orientación tributaria internacional para personas y empresas en Colombia.",
    intro:
      "Orientación tributaria de alto nivel para extranjeros y empresas en Colombia — coordinada con aliados especialistas cuando haga falta.",
    services: [
      "Orientación sobre residencia fiscal",
      "Panorama de ingresos y reportes transfronterizos",
      "Coordinación de setup tributario societario",
      "Puntos de control fiscal en inmuebles",
      "Remisiones a especialistas tributarios aliados",
    ],
  },
];

export const servicesHubContent: Record<ServicesLocale, ServicesHubContent> = {
  en: {
    eyebrow: "Services",
    title: "Legal services for international clients in Colombia.",
    intro:
      "Six practice areas under one bilingual team — clear scope, structured engagement, and counsel that is easy to act on.",
    areasLabel: "Practice areas",
    bookCta: "Book a consultation",
    learnMore: "Learn more",
  },
  es: {
    eyebrow: "Servicios",
    title: "Servicios legales para clientes internacionales en Colombia.",
    intro:
      "Seis áreas de práctica bajo un equipo bilingüe — alcance claro, encargo estructurado y asesoría fácil de ejecutar.",
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
