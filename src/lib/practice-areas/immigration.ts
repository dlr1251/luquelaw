import { clkrPublicPath } from "@/lib/clkr/types";

import { immigrationPath, type ImmigrationLocale } from "./paths";

export type { ImmigrationLocale };

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

export type ImmigrationHubCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type ImmigrationProcessStep = {
  title: string;
  body: string;
  icon: "chat" | "doc" | "plan";
};

export type ImmigrationContent = {
  eyebrow: string;
  title: string;
  intro: string;
  bookCta: string;
  bookHref: string;
  lucyCta: string;
  lucyHref: string;
  visasCta: string;
  visasHref: string;
  servicesLabel: string;
  servicesTitle: string;
  servicesBody: string;
  serviceCta: string;
  services: ImmigrationService[];
  processLabel: string;
  processTitle: string;
  processBody: string;
  processFooter: string;
  processSteps: [ImmigrationProcessStep, ImmigrationProcessStep, ImmigrationProcessStep];
  guidesLabel: string;
  guidesTitle: string;
  guidesBody: string;
  featuredArticles: ImmigrationFeaturedArticle[];
  hubLabel: string;
  hubTitle: string;
  hubBody: string;
  hubCards: ImmigrationHubCard[];
  bookingLabel: string;
  bookingTitle: string;
  bookingBody: string;
  disclaimer: string;
};

const contentEn: ImmigrationContent = {
  eyebrow: "Practice area",
  title: "Immigration Law",
  intro:
    "Visas, stay rules, and migratory regularization for foreigners in Colombia — clear counsel, bilingual delivery.",
  bookCta: "Book a consultation",
  bookHref: "#book",
  lucyCta: "Ask Lucy",
  lucyHref: "/portal/lucy",
  visasCta: "Explore visa types",
  visasHref: immigrationPath("/visas", "en"),
  servicesLabel: "Services",
  servicesTitle: "How we can help",
  servicesBody:
    "Two service lines with clear tiers. Book a consultation to confirm fit and receive a written concept and quotation. No public prices on visa or regularization files — scope drives the fee.",
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
  processLabel: "Process",
  processTitle: "How we work",
  processBody:
    "Every engagement starts with a structured consultation, followed by a written legal concept and a clear workplan.",
  processFooter: "You know the path and the fee before committing to a full filing.",
  processSteps: [
    {
      icon: "chat",
      title: "Consultation",
      body: "We map your nationality, stamps, goals, and risk — tourism quota, visa category, or regularization.",
    },
    {
      icon: "doc",
      title: "Written concept",
      body: "You receive a clear memo: options, documents, timelines, and what Cancillería or Migración typically expects.",
    },
    {
      icon: "plan",
      title: "Workplan & filing",
      body: "If we proceed, we execute the agreed tier — checklist only, or full preparation through issuance.",
    },
  ],
  guidesLabel: "Guides",
  guidesTitle: "Start with the ground rules",
  guidesBody:
    "CLKR guides on tourism days, visa process under Resolución 5477, and the investor (M) pathway.",
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
    {
      slugKey: "investor-visa",
      title: "Investor Visa (Tipo M)",
      description:
        "Eligibility, investment thresholds, FIEM registration, timelines, and common pitfalls.",
      href: clkrPublicPath("investor-visa", "en"),
    },
  ],
  hubLabel: "Explore",
  hubTitle: "Immigration hub",
  hubBody: "Tools and reference pages for planning — always informational, never a substitute for a case review.",
  hubCards: [
    {
      id: "visas",
      title: "Visa types & categories",
      body: "Browse Visitante (V), Migrante (M), and Residente (R) categories under Resolución 5477.",
      href: immigrationPath("/visas", "en"),
      cta: "Open catalog",
    },
    {
      id: "nationality",
      title: "Nationality & Civil Registry",
      body: "Birth, adoption, Registro Civil, and how nationality intersects with immigration strategy.",
      href: immigrationPath("/nationality", "en"),
      cta: "Read more",
    },
    {
      id: "extranjeria",
      title: "Extranjería procedures",
      body: "Extensions, cédula de extranjería, minors, sanctions, appointments, and movements.",
      href: immigrationPath("/extranjeria", "en"),
      cta: "View procedures",
    },
    {
      id: "calculator",
      title: "Last Legal Day calculator",
      body: "Log entries and exits to estimate tourism quota use and your last lawful day.",
      href: immigrationPath("/calculator", "en"),
      cta: "Open calculator",
    },
  ],
  bookingLabel: "Book",
  bookingTitle: "Schedule a consultation",
  bookingBody: "Pick a slot. We will confirm by email and send preparation notes.",
  disclaimer:
    "Informational only — not legal advice. Cancillería and Migración Colombia retain discretionary authority on every application and admission.",
};

const contentEs: ImmigrationContent = {
  eyebrow: "Área de práctica",
  title: "Derecho migratorio",
  intro:
    "Visas, reglas de permanencia y regulación migratoria para extranjeros en Colombia — asesoría clara y bilingüe.",
  bookCta: "Agendar consulta",
  bookHref: "#book",
  lucyCta: "Preguntar a Lucy",
  lucyHref: "/portal/lucy",
  visasCta: "Explorar tipos de visa",
  visasHref: immigrationPath("/visas", "es"),
  servicesLabel: "Servicios",
  servicesTitle: "Cómo podemos ayudarte",
  servicesBody:
    "Dos líneas de servicio con niveles claros. Agenda una consulta para confirmar el encaje y recibir concepto jurídico y cotización. Sin precios públicos en expedientes de visa o regulación — el alcance define el honorario.",
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
  processLabel: "Proceso",
  processTitle: "Cómo trabajamos",
  processBody:
    "Todo encargo empieza con una consulta estructurada, seguida de un concepto jurídico escrito y un plan de trabajo claro.",
  processFooter: "Conoces el camino y el honorario antes de comprometerte con el expediente completo.",
  processSteps: [
    {
      icon: "chat",
      title: "Consulta",
      body: "Mapeamos nacionalidad, sellos, objetivos y riesgo — cuota de turismo, categoría de visa o regulación.",
    },
    {
      icon: "doc",
      title: "Concepto escrito",
      body: "Recibes un memo claro: opciones, documentos, plazos y lo que Cancillería o Migración suelen esperar.",
    },
    {
      icon: "plan",
      title: "Plan y radicación",
      body: "Si avanzamos, ejecutamos el nivel acordado — solo checklist, o preparación completa hasta la expedición.",
    },
  ],
  guidesLabel: "Guías",
  guidesTitle: "Empieza por las reglas base",
  guidesBody:
    "Guías CLKR sobre días de turismo, proceso de visa bajo la Resolución 5477 y la vía de inversionista (M).",
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
    {
      slugKey: "investor-visa",
      title: "Visa de Inversionista (Tipo M)",
      description:
        "Requisitos, umbral de inversión, registro FIEM, tiempos y errores frecuentes.",
      href: clkrPublicPath("investor-visa", "es"),
    },
  ],
  hubLabel: "Explorar",
  hubTitle: "Hub migratorio",
  hubBody:
    "Herramientas y páginas de referencia para planear — siempre informativas, nunca un sustituto de la revisión de tu caso.",
  hubCards: [
    {
      id: "visas",
      title: "Tipos y categorías de visa",
      body: "Explora Visitante (V), Migrante (M) y Residente (R) bajo la Resolución 5477.",
      href: immigrationPath("/visas", "es"),
      cta: "Abrir catálogo",
    },
    {
      id: "nationality",
      title: "Nacionalidad y Registro Civil",
      body: "Nacimiento, adopción, Registro Civil y cómo la nacionalidad se cruza con la estrategia migratoria.",
      href: immigrationPath("/nationality", "es"),
      cta: "Leer más",
    },
    {
      id: "extranjeria",
      title: "Trámites de extranjería",
      body: "Prórrogas, cédula de extranjería, menores, sanciones, citas y movimientos.",
      href: immigrationPath("/extranjeria", "es"),
      cta: "Ver trámites",
    },
    {
      id: "calculator",
      title: "Calculadora de último día legal",
      body: "Registra entradas y salidas para estimar el uso de la cuota de turismo y tu último día legal.",
      href: immigrationPath("/calculator", "es"),
      cta: "Abrir calculadora",
    },
  ],
  bookingLabel: "Agenda",
  bookingTitle: "Agenda una consulta",
  bookingBody: "Elige un horario. Confirmamos por correo y enviamos notas de preparación.",
  disclaimer:
    "Contenido informativo — no constituye asesoría jurídica. Cancillería y Migración Colombia conservan facultad discrecional en cada solicitud e ingreso.",
};

export const immigrationContent: Record<ImmigrationLocale, ImmigrationContent> = {
  en: contentEn,
  es: contentEs,
};
