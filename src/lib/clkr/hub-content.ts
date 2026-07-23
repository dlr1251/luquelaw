export type ClkrHubLocale = "en" | "es";

export const clkrLegalAiHubContent = {
  en: {
    eyebrow: "CLKR · LegalAI hub",
    title: "Colombian Legal Knowledge Repository",
    subtitle:
      "Norms you can navigate, guides you can cite, and Torny for guided immigration questions in the portal. Study tools — not legal advice.",
    modulesTitle: "Modules",
    modulesSubtitle: "Public libraries first. Agents unlock with a Professional plan.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    lucyEyebrow: "AI consultation",
    lucyTitle: "Meet Torny",
    lucyBody:
      "Guided immigration consultations in the portal — prepaid wallet, cited norms and articles. Escalate to a lawyer when you need a verified answer.",
    lucyCta: "Open Torny in the portal",
    lucyCtaShort: "Open Torny",
    lucySignIn: "Sign in to start",
    disclaimer:
      "Informational only. Colombian law changes; confirm the current rules for your case.",
    modules: {
      norms: {
        title: "Norms",
        description: "Constitutions, codes, laws, and resolutions with structured navigation.",
        cta: "Open norms",
        badge: "Public",
      },
      guides: {
        title: "Articles",
        description: "Practical articles on immigration, property, corporate, and more.",
        cta: "Browse articles",
        badge: "Public",
      },
      agents: {
        title: "Agents & prompts",
        description: "Skills and prompts for day-to-day legal work with AI tools.",
        cta: "View agents",
        badge: "Subscriber",
      },
    },
  },
  es: {
    eyebrow: "CLKR · Hub LegalAI",
    title: "Repositorio de Conocimiento Jurídico Colombiano",
    subtitle:
      "Normas navegables, guías citables y Torny para preguntas guiadas de migración en el portal. Herramientas de estudio — no asesoría jurídica.",
    modulesTitle: "Módulos",
    modulesSubtitle: "Primero las bibliotecas públicas. Los agentes se desbloquean con el plan Profesional.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    lucyEyebrow: "Consulta con IA",
    lucyTitle: "Conoce a Torny",
    lucyBody:
      "Consultas guiadas de migración en el portal — wallet prepago, normas y artículos citados. Escala a un abogado cuando necesites una respuesta verificada.",
    lucyCta: "Abrir Torny en el portal",
    lucyCtaShort: "Abrir Torny",
    lucySignIn: "Inicia sesión para empezar",
    disclaimer:
      "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
    modules: {
      norms: {
        title: "Normas",
        description: "Constituciones, códigos, leyes y resoluciones con navegación estructurada.",
        cta: "Abrir normas",
        badge: "Público",
      },
      guides: {
        title: "Artículos",
        description: "Artículos prácticos sobre migración, inmuebles, societario y más.",
        cta: "Ver artículos",
        badge: "Público",
      },
      agents: {
        title: "Agentes y prompts",
        description: "Skills y prompts para el trabajo jurídico diario con herramientas de IA.",
        cta: "Ver agentes",
        badge: "Suscriptor",
      },
    },
  },
} as const;

/** @deprecated Use clkrLegalAiHubContent for the hub; guides hub uses clkrGuidesHubContent */
export const clkrHubContent = {
  en: {
    eyebrow: "CLKR · Articles",
    title: "Legal articles",
    subtitle:
      "Articles on Colombian law for international clients — practical, cited, and easy to navigate. Not legal advice; every case still turns on its facts.",
    howItWorksTitle: "How to use this library",
    howItWorks: [
      "Start with the topic closest to your situation (immigration, property, etc.).",
      "Use the table of contents inside each article to jump to sections.",
      "When your facts are specific, book a consultation for a written legal concept (Concepto Jurídico).",
    ],
    articleCountLabel: "Articles",
    categoryLabel: "Topics covered",
    browseTitle: "All articles",
    browseSubtitle: "Search and filter by topic.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    disclaimer:
      "Informational only. Colombian law changes; confirm the current rules for your case.",
  },
  es: {
    eyebrow: "CLKR · Artículos",
    title: "Artículos jurídicos",
    subtitle:
      "Artículos sobre derecho colombiano para clientes internacionales — prácticos, con fuentes y fáciles de navegar. No es asesoría jurídica; cada caso sigue dependiendo de sus hechos.",
    howItWorksTitle: "Cómo usar esta biblioteca",
    howItWorks: [
      "Empieza por el tema más cercano a tu situación (migratorio, inmuebles, etc.).",
      "Usa la tabla de contenidos dentro de cada artículo para saltar a secciones.",
      "Si tus hechos son específicos, agenda una consulta para un concepto jurídico escrito.",
    ],
    articleCountLabel: "Artículos",
    categoryLabel: "Temas disponibles",
    browseTitle: "Todos los artículos",
    browseSubtitle: "Busca y filtra por tema.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    disclaimer:
      "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
  },
} as const;
