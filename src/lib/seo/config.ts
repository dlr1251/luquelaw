import { BRAND } from "@/lib/email/brand";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.website
).replace(/\/$/, "");

export const SITE_NAME = BRAND.name;
export const LAWYER_NAME = BRAND.lawyer;
export const SITE_LOCATION = BRAND.location;

export const OG_LOCALE = {
  en: "en_US",
  es: "es_CO",
} as const;

export const DEFAULT_SEO = {
  en: {
    title: "Luque Law — Colombian law for international clients",
    description:
      "Bilingual firm in Medellín. Visas, property, companies, and the paperwork underneath — consultation, then a written Concepto Jurídico.",
  },
  es: {
    title: "Luque Law — Derecho colombiano para clientes internacionales",
    description:
      "Despacho bilingüe en Medellín. Visas, inmuebles, sociedades y el papeleo de fondo — consulta y luego un concepto jurídico escrito.",
  },
} as const;

export const PAGE_SEO = {
  home: {
    en: {
      title: "Colombian law for international clients",
      description:
        "Luque Law in Medellín — immigration, real estate, corporate, and related counsel. 45-minute consultation, then a written Concepto Jurídico within 3 business days.",
    },
    es: {
      title: "Derecho colombiano para clientes internacionales",
      description:
        "Luque Law en Medellín — migración, inmobiliario, corporativo y asuntos afines. Consulta de 45 minutos y, en 3 días hábiles, un concepto jurídico escrito.",
    },
  },
  clkrHub: {
    en: {
      title: "CLKR — LegalAI hub for Colombian law",
      description:
        "Norms, practical guides, and Torny — open Colombian legal knowledge you can navigate and cite.",
    },
    es: {
      title: "CLKR — Hub LegalAI de derecho colombiano",
      description:
        "Normas, guías prácticas y Torny — conocimiento jurídico colombiano abierto, navegable y citable.",
    },
  },
  clkrGuides: {
    en: {
      title: "Legal guides — CLKR",
      description:
        "Plain-language guides on Colombian immigration, real estate, corporate, labour, and civil law.",
    },
    es: {
      title: "Guías jurídicas — CLKR",
      description:
        "Guías en lenguaje claro sobre migración, inmobiliario, corporativo, laboral y civil en Colombia.",
    },
  },
  normsHub: {
    en: {
      title: "Norms — CLKR legal reference library",
      description:
        "Constitution, codes, laws, and resolutions in Spanish and English — for reference and navigation.",
    },
    es: {
      title: "Normas — Biblioteca de referencia CLKR",
      description:
        "Constitución, códigos, leyes y resoluciones en español e inglés — para consulta y navegación.",
    },
  },
  pricing: {
    en: {
      title: "Pricing — CLKR & portal plans",
      description:
        "Professional and Client plans for CLKR modules and the Luque Law portal.",
    },
    es: {
      title: "Precios — Planes CLKR y portal",
      description:
        "Planes Profesional y Cliente para módulos CLKR y el portal Luque Law.",
    },
  },
  postsHub: {
    en: {
      title: "Blog — Notes on law and life in Colombia",
      description:
        "Shorter pieces on visas, property, and business in Colombia from Luque Law.",
    },
    es: {
      title: "Blog — Notas sobre derecho y vida en Colombia",
      description:
        "Textos breves sobre visas, inmuebles y negocios en Colombia, desde Luque Law.",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description:
        "How Luque Law collects, uses, and protects personal data submitted through this website.",
    },
    es: {
      title: "Política de datos personales",
      description:
        "Cómo Luque Law recopila, usa y protege los datos personales enviados a través de este sitio web.",
    },
  },
  immigration: {
    en: {
      title: "Immigration Law — Visas & stay rules in Colombia",
      description:
        "Visa strategy, migratory regularization, V/M/R catalog, nationality, extranjería, and a Last Legal Day calculator.",
    },
    es: {
      title: "Derecho migratorio — Visas y permanencia en Colombia",
      description:
        "Estrategia de visa, regulación migratoria, catálogo V/M/R, nacionalidad, extranjería y calculadora de último día legal.",
    },
  },
  immigrationVisas: {
    en: {
      title: "Colombian visa types — V, M & R catalog",
      description:
        "Visitante (V), Migrante (M), and Residente (R) categories under Resolución 5477 de 2022.",
    },
    es: {
      title: "Tipos de visa colombiana — Catálogo V, M y R",
      description:
        "Categorías Visitante (V), Migrante (M) y Residente (R) bajo la Resolución 5477 de 2022.",
    },
  },
  immigrationNationality: {
    en: {
      title: "Colombian nationality & civil registry",
      description:
        "Nationality by birth and adoption, Registro Civil basics, and how they sit under immigration strategy.",
    },
    es: {
      title: "Nacionalidad colombiana y Registro Civil",
      description:
        "Nacionalidad por nacimiento y adopción, bases del Registro Civil y su lugar en la estrategia migratoria.",
    },
  },
  immigrationExtranjeria: {
    en: {
      title: "Extranjería procedures in Colombia",
      description:
        "Stay extensions, cédula de extranjería, minors registration, sanctions, appointments, and migratory movements.",
    },
    es: {
      title: "Trámites de extranjería en Colombia",
      description:
        "Prórroga de permanencia, cédula de extranjería, registro de menores, sanciones, citas y movimientos migratorios.",
    },
  },
  immigrationCalculator: {
    en: {
      title: "Last Legal Day calculator — tourism stay in Colombia",
      description:
        "Estimate tourism quota days used and your last lawful day under Colombia’s 180-day calendar-year rules.",
    },
    es: {
      title: "Calculadora de último día legal — Permanencia de turismo",
      description:
        "Estima los días de cuota de turismo usados y tu último día de permanencia regular bajo la regla de 180 días por año calendario.",
    },
  },
  about: {
    en: {
      title: "About Luque Law — Medellín firm for international clients",
      description:
        "Founder-led bilingual firm in Medellín. Who we are, how we work, and the team on your file.",
    },
    es: {
      title: "Nosotros — Luque Law en Medellín",
      description:
        "Despacho bilingüe liderado por su fundador en Medellín. Quiénes somos, cómo trabajamos y quién lleva tu expediente.",
    },
  },
  services: {
    en: {
      title: "Legal services — immigration, real estate, corporate & more",
      description:
        "Practice areas at Luque Law: immigration, labour, real estate, family, corporate, and tax orientation for international clients in Colombia.",
    },
    es: {
      title: "Servicios legales — migración, inmobiliario, corporativo y más",
      description:
        "Áreas de práctica de Luque Law: migración, laboral, inmobiliario, familia, corporativo y orientación tributaria para clientes internacionales en Colombia.",
    },
  },
  labourLaw: {
    en: {
      title: "Labour Law in Colombia",
      description:
        "Hiring, contracts, terminations, and labour risk for employers and professionals — including foreign workers.",
    },
    es: {
      title: "Derecho laboral en Colombia",
      description:
        "Contratación, contratos, terminaciones y riesgo laboral para empleadores y profesionales — incluido el trabajador extranjero.",
    },
  },
  realEstate: {
    en: {
      title: "Real Estate Law in Colombia",
      description:
        "Purchase, sale, leases, and propiedad horizontal — due diligence and closing for property in Colombia.",
    },
    es: {
      title: "Derecho inmobiliario en Colombia",
      description:
        "Compraventa, arrendamientos y propiedad horizontal — debida diligencia y cierre de inmuebles en Colombia.",
    },
  },
  familyLaw: {
    en: {
      title: "Family Law in Colombia",
      description:
        "Marriage, divorce, custody, and cross-border family matters for international clients.",
    },
    es: {
      title: "Derecho de familia en Colombia",
      description:
        "Matrimonio, divorcio, custodia y asuntos familiares transfronterizos para clientes internacionales.",
    },
  },
  corporateLaw: {
    en: {
      title: "Corporate Law in Colombia",
      description:
        "Company formation, contracts, and governance for international founders and investors in Colombia.",
    },
    es: {
      title: "Derecho corporativo en Colombia",
      description:
        "Constitución de sociedades, contratos y gobierno societario para fundadores e inversionistas internacionales en Colombia.",
    },
  },
  taxes: {
    en: {
      title: "Tax orientation in Colombia",
      description:
        "Tax residency and cross-border orientation for individuals and businesses in Colombia — with specialist handoff when needed.",
    },
    es: {
      title: "Orientación tributaria en Colombia",
      description:
        "Residencia fiscal y orientación transfronteriza para personas y empresas en Colombia — con traspaso a especialista cuando haga falta.",
    },
  },
} as const;

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION?.trim() ?? "";
