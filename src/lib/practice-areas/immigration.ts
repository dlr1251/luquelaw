import { clkrPublicPath } from "@/lib/clkr/types";

export type ImmigrationLocale = "en" | "es";

export type ImmigrationService = {
  id: string;
  group: string;
  tier: string;
  title: string;
  detail: string;
};

export type ImmigrationFeaturedArticle = {
  slugKey: string;
  title: string;
  description: string;
  href: string;
};

export type ImmigrationDeferredPillar = {
  id: string;
  title: string;
  teaser: string;
};

export type ImmigrationContent = {
  eyebrow: string;
  title: string;
  intro: string;
  bookCta: string;
  bookHref: string;
  guidesCta: string;
  guidesHref: string;
  servicesLabel: string;
  servicesTitle: string;
  servicesBody: string;
  serviceCta: string;
  services: ImmigrationService[];
  guidesLabel: string;
  guidesTitle: string;
  guidesBody: string;
  featuredArticles: ImmigrationFeaturedArticle[];
  toolsLabel: string;
  calculatorPlaceholder: {
    title: string;
    body: string;
  };
  comingSoonLabel: string;
  comingSoonTitle: string;
  comingSoonBody: string;
  deferredPillars: ImmigrationDeferredPillar[];
};

const contentEn: ImmigrationContent = {
  eyebrow: "Practice area",
  title: "Immigration Law",
  intro:
    "Visas, stay rules, and migratory regularization for foreigners in Colombia — clear counsel, bilingual delivery.",
  bookCta: "Book a consultation",
  bookHref: "/#book",
  guidesCta: "Read the guides",
  guidesHref: "#guides",
  servicesLabel: "Services",
  servicesTitle: "How we can help",
  servicesBody:
    "Two service lines with clear tiers. Book a consultation to confirm fit and receive a written concept and quotation.",
  serviceCta: "Book consultation",
  services: [
    {
      id: "visa-basic",
      group: "Visa assistance",
      tier: "Basic",
      title: "Visa assistance — Basic",
      detail:
        "Document checklist, filing guidance, and follow-up on a standard Cancillería timeline for a single principal applicant.",
    },
    {
      id: "visa-premium",
      group: "Visa assistance",
      tier: "Premium",
      title: "Visa assistance — Premium",
      detail:
        "Full file preparation, strategy review, beneficiary coordination, and hands-on responses to authority requests through issuance.",
    },
    {
      id: "reg-standard",
      group: "Migratory regularization",
      tier: "Standard",
      title: "Migratory regularization — Standard",
      detail:
        "Overstay assessment, safe-conduct or sanction pathway, and a staged plan to restore regular status.",
    },
    {
      id: "reg-rush",
      group: "Migratory regularization",
      tier: "Rush",
      title: "Migratory regularization — Rush",
      detail:
        "Expedited handling when a permit or visa window is closing — prioritized filings and same-week coordination where feasible.",
    },
  ],
  guidesLabel: "Guides",
  guidesTitle: "Start with the ground rules",
  guidesBody:
    "Two CLKR guides cover how tourism days work and the rules that apply to every Colombian visa application.",
  featuredArticles: [
    {
      slugKey: "last-legal-day",
      title: "Last Legal Day",
      description:
        "Tourism permits, the 180-day quota, extensions, and how to count your last lawful day in Colombia.",
      href: clkrPublicPath("last-legal-day", "en"),
    },
    {
      slugKey: "visas-ground-rules",
      title: "Colombian Visas Ground Rules",
      description:
        "Process, timelines, consular jurisdiction, general documents, beneficiaries, and minors under Resolución 5477.",
      href: clkrPublicPath("visas-ground-rules", "en"),
    },
  ],
  toolsLabel: "Tools",
  calculatorPlaceholder: {
    title: "Last Legal Day calculator",
    body: "Coming soon — a tool to read entries and exits and estimate your last legal day under tourism rules.",
  },
  comingSoonLabel: "Coming soon",
  comingSoonTitle: "More immigration knowledge",
  comingSoonBody:
    "These sections are planned next. The landing will grow into a full practice hub.",
  deferredPillars: [
    {
      id: "visas-catalog",
      title: "Visa types & categories",
      teaser:
        "A browsable catalog of V, M, and R visas with requirements, benefits, and restrictions.",
    },
    {
      id: "nationality",
      title: "Nationality & Civil Registry",
      teaser:
        "Colombian nationality by birth and adoption, Registro Civil, and the norms that govern them.",
    },
    {
      id: "extranjeria",
      title: "Extranjería procedures",
      teaser:
        "Stay extensions, cédula de extranjería, minors registration, sanctions, appointments, and migratory movements.",
    },
  ],
};

const contentEs: ImmigrationContent = {
  eyebrow: "Área de práctica",
  title: "Derecho migratorio",
  intro:
    "Visas, reglas de permanencia y regulación migratoria para extranjeros en Colombia — asesoría clara y bilingüe.",
  bookCta: "Agendar consulta",
  bookHref: "/es#book",
  guidesCta: "Leer las guías",
  guidesHref: "#guides",
  servicesLabel: "Servicios",
  servicesTitle: "Cómo podemos ayudarte",
  servicesBody:
    "Dos líneas de servicio con niveles claros. Agenda una consulta para confirmar el encaje y recibir concepto jurídico y cotización.",
  serviceCta: "Agendar consulta",
  services: [
    {
      id: "visa-basic",
      group: "Asistencia en visa",
      tier: "Básico",
      title: "Asistencia en visa — Básico",
      detail:
        "Lista de documentos, orientación de radicación y seguimiento en plazos estándar de Cancillería para un solicitante principal.",
    },
    {
      id: "visa-premium",
      group: "Asistencia en visa",
      tier: "Premium",
      title: "Asistencia en visa — Premium",
      detail:
        "Preparación completa del expediente, revisión de estrategia, coordinación de beneficiarios y respuesta a requerimientos hasta la expedición.",
    },
    {
      id: "reg-standard",
      group: "Regulación migratoria",
      tier: "Standard",
      title: "Regulación migratoria — Standard",
      detail:
        "Evaluación de sobreestadía, vía de salvoconducto o sanción, y plan por etapas para recuperar la situación regular.",
    },
    {
      id: "reg-rush",
      group: "Regulación migratoria",
      tier: "Rush",
      title: "Regulación migratoria — Rush",
      detail:
        "Gestión prioritaria cuando el permiso o la visa está por vencer — radicaciones aceleradas y coordinación en la misma semana cuando sea viable.",
    },
  ],
  guidesLabel: "Guías",
  guidesTitle: "Empieza por las reglas base",
  guidesBody:
    "Dos guías CLKR explican cómo funcionan los días de turismo y las normas comunes a toda solicitud de visa colombiana.",
  featuredArticles: [
    {
      slugKey: "last-legal-day",
      title: "Último día legal",
      description:
        "Permisos de turismo, la cuota de 180 días, prórrogas y cómo calcular tu último día de permanencia regular.",
      href: clkrPublicPath("last-legal-day", "es"),
    },
    {
      slugKey: "visas-ground-rules",
      title: "Reglas generales de visas colombianas",
      description:
        "Proceso, plazos, jurisdicción consular, documentos generales, beneficiarios y menores bajo la Resolución 5477.",
      href: clkrPublicPath("visas-ground-rules", "es"),
    },
  ],
  toolsLabel: "Herramientas",
  calculatorPlaceholder: {
    title: "Calculadora de último día legal",
    body: "Próximamente — una herramienta para leer entradas y salidas y estimar tu último día legal bajo reglas de turismo.",
  },
  comingSoonLabel: "Próximamente",
  comingSoonTitle: "Más conocimiento migratorio",
  comingSoonBody:
    "Estas secciones vienen después. La landing crecerá hasta ser un hub completo del área.",
  deferredPillars: [
    {
      id: "visas-catalog",
      title: "Tipos y categorías de visa",
      teaser:
        "Catálogo navegable de visas V, M y R con requisitos, beneficios y restricciones.",
    },
    {
      id: "nationality",
      title: "Nacionalidad y Registro Civil",
      teaser:
        "Nacionalidad colombiana por nacimiento y adopción, Registro Civil y las normas aplicables.",
    },
    {
      id: "extranjeria",
      title: "Trámites de extranjería",
      teaser:
        "Prórroga de permanencia, cédula de extranjería, registro de menores, sanciones, citas y movimientos migratorios.",
    },
  ],
};

export const immigrationContent: Record<ImmigrationLocale, ImmigrationContent> = {
  en: contentEn,
  es: contentEs,
};
