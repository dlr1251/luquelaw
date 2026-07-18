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
    title: "Luque Law — Abogado · Legal Counsel",
    description:
      "Colombian law for international clients — bilingual legal counsel in Medellín, Colombia.",
  },
  es: {
    title: "Luque Law — Abogado",
    description:
      "Derecho colombiano para clientes internacionales — asesoría legal bilingüe en Medellín, Colombia.",
  },
} as const;

export const PAGE_SEO = {
  home: {
    en: {
      title: "Colombian Law for International Clients",
      description:
        "Bilingual legal counsel in Medellín, Colombia — immigration, real estate, corporate, and civil law for international clients.",
    },
    es: {
      title: "Derecho colombiano para clientes internacionales",
      description:
        "Asesoría legal bilingüe en Medellín — inmigración, bienes raíces, derecho corporativo y civil para clientes internacionales.",
    },
  },
  clkrHub: {
    en: {
      title: "CLKR — LegalAI hub for Colombian law",
      description:
        "Norms, practical guides, and LegalAI agents for studying and practicing Colombian law.",
    },
    es: {
      title: "CLKR — Hub LegalAI de derecho colombiano",
      description:
        "Normas, guías prácticas y agentes LegalAI para estudiar y practicar el derecho colombiano.",
    },
  },
  clkrGuides: {
    en: {
      title: "Legal guides — CLKR",
      description:
        "Plain-language guides on Colombian immigration, real estate, corporate, labor, and civil law for international clients.",
    },
    es: {
      title: "Guías jurídicas — CLKR",
      description:
        "Guías en lenguaje claro sobre inmigración, bienes raíces, derecho corporativo, laboral y civil en Colombia.",
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
        "Professional and Client plans for CLKR LegalAI modules and the Luque Law portal.",
    },
    es: {
      title: "Precios — Planes CLKR y portal",
      description:
        "Planes Profesional y Cliente para módulos LegalAI de CLKR y el portal Luque Law.",
    },
  },
  postsHub: {
    en: {
      title: "Blog — Legal insights for international clients",
      description:
        "Shorter articles on immigration, property, and business in Colombia — practical updates and checklists from Luque Law.",
    },
    es: {
      title: "Blog — Perspectivas legales para clientes internacionales",
      description:
        "Artículos breves sobre inmigración, inmuebles y negocios en Colombia — actualizaciones y listas de verificación de Luque Law.",
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
      title: "Immigration Law — Visas & Stay Rules in Colombia",
      description:
        "Visa assistance, migratory regularization, V/M/R catalog, nationality, extranjería, and a Last Legal Day calculator for international clients.",
    },
    es: {
      title: "Derecho migratorio — Visas y permanencia en Colombia",
      description:
        "Asistencia en visas, regulación migratoria, catálogo V/M/R, nacionalidad, extranjería y calculadora de último día legal para clientes internacionales.",
    },
  },
  immigrationVisas: {
    en: {
      title: "Colombian Visa Types — V, M & R Catalog",
      description:
        "Browse Visitante (V), Migrante (M), and Residente (R) visa categories under Resolución 5477 de 2022.",
    },
    es: {
      title: "Tipos de visa colombiana — Catálogo V, M y R",
      description:
        "Explora las categorías Visitante (V), Migrante (M) y Residente (R) bajo la Resolución 5477 de 2022.",
    },
  },
  immigrationNationality: {
    en: {
      title: "Colombian Nationality & Civil Registry",
      description:
        "Nationality by birth and adoption, Registro Civil basics, and how they intersect with immigration strategy.",
    },
    es: {
      title: "Nacionalidad colombiana y Registro Civil",
      description:
        "Nacionalidad por nacimiento y adopción, bases del Registro Civil y su relación con la estrategia migratoria.",
    },
  },
  immigrationExtranjeria: {
    en: {
      title: "Extranjería Procedures in Colombia",
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
      title: "Last Legal Day Calculator — Tourism Stay in Colombia",
      description:
        "Estimate tourism quota days used and your last lawful day under Colombia’s 180-day calendar-year rules.",
    },
    es: {
      title: "Calculadora de último día legal — Permanencia de turismo",
      description:
        "Estima los días de cuota de turismo usados y tu último día de permanencia regular bajo la regla de 180 días por año calendario.",
    },
  },
} as const;

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION?.trim() ?? "";
