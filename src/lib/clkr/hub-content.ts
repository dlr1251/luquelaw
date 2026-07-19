export type ClkrHubLocale = "en" | "es";

export const clkrLegalAiHubContent = {
  en: {
    eyebrow: "CLKR · LegalAI hub",
    title: "Colombian Legal Knowledge Repository",
    subtitle:
      "Study Colombian law with a normative library, practical guides, and LegalAI agents—built for professionals. Informational only; not legal advice.",
    modulesTitle: "Modules",
    modulesSubtitle: "Start with public libraries, then unlock agents with a Professional subscription.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    lucyEyebrow: "AI consultation",
    lucyTitle: "Meet Torny",
    lucyBody:
      "Guided immigration consultations in the portal—prepaid wallet, cited norms and articles, escalate to a lawyer when you need a verified answer.",
    lucyCta: "Open Torny in the portal",
    lucyCtaShort: "Open Torny",
    lucySignIn: "Sign in to start",
    disclaimer:
      "For informational purposes only. Colombian law changes; always confirm current rules for your case.",
    modules: {
      norms: {
        title: "Norms",
        description: "Browse constitutions, codes, laws, and resolutions with structured navigation.",
        cta: "Open norms",
        badge: "Public",
      },
      guides: {
        title: "Articles",
        description: "In-depth didactic articles on immigration, property, corporate, and more.",
        cta: "Browse articles",
        badge: "Public",
      },
      agents: {
        title: "Agents & prompts",
        description: "Curated skills and prompts for day-to-day legal work with AI tools.",
        cta: "View agents",
        badge: "Subscriber",
      },
    },
  },
  es: {
    eyebrow: "CLKR · Hub LegalAI",
    title: "Repositorio de Conocimiento Jurídico Colombiano",
    subtitle:
      "Estudia el ordenamiento colombiano con normas, guías prácticas y agentes LegalAI—para profesionales. Solo informativo; no es asesoría jurídica.",
    modulesTitle: "Módulos",
    modulesSubtitle: "Empieza con las bibliotecas públicas; desbloquea agentes con suscripción Profesional.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    lucyEyebrow: "Consulta con IA",
    lucyTitle: "Conoce a Torny",
    lucyBody:
      "Consultas guiadas de migración en el portal—wallet prepago, normas y artículos citados, y escala a un abogado cuando necesites una respuesta verificada.",
    lucyCta: "Abrir Torny en el portal",
    lucyCtaShort: "Abrir Torny",
    lucySignIn: "Inicia sesión para empezar",
    disclaimer:
      "Solo fines informativos. La ley colombiana cambia; confirma siempre las reglas vigentes para tu caso.",
    modules: {
      norms: {
        title: "Normas",
        description: "Consulta constituciones, códigos, leyes y resoluciones con navegación estructurada.",
        cta: "Abrir normas",
        badge: "Público",
      },
      guides: {
        title: "Artículos",
        description: "Artículos didácticos sobre migración, inmuebles, societario y más.",
        cta: "Ver artículos",
        badge: "Público",
      },
      agents: {
        title: "Agentes y prompts",
        description: "Skills y prompts curados para el trabajo jurídico diario con herramientas de IA.",
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
      "In-depth articles on Colombian law for international clients—written to be practical, cited, and easy to navigate. Not legal advice; every case is different.",
    howItWorksTitle: "How to use this library",
    howItWorks: [
      "Start with the topic closest to your situation (immigration, property, etc.).",
      "Use the table of contents inside each article to jump to sections.",
      "When your facts are specific, book a consultation for a written legal concept tailored to you.",
    ],
    articleCountLabel: "Articles",
    categoryLabel: "Topics covered",
    browseTitle: "All articles",
    browseSubtitle: "Search and filter by topic. New articles are added over time.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    disclaimer:
      "For informational purposes only. Colombian law changes; always confirm current rules for your case.",
  },
  es: {
    eyebrow: "CLKR · Artículos",
    title: "Artículos jurídicos",
    subtitle:
      "Artículos sobre derecho colombiano para clientes internacionales—prácticos, con fuentes y fáciles de navegar. No constituye asesoría jurídica; cada caso es único.",
    howItWorksTitle: "Cómo usar esta biblioteca",
    howItWorks: [
      "Empieza por el tema más cercano a tu situación (migratorio, inmuebles, etc.).",
      "Usa la tabla de contenidos dentro de cada artículo para saltar a secciones.",
      "Si tus hechos son específicos, agenda una consulta para un concepto jurídico a tu medida.",
    ],
    articleCountLabel: "Artículos",
    categoryLabel: "Temas disponibles",
    browseTitle: "Todos los artículos",
    browseSubtitle: "Busca y filtra por tema. Se irán sumando nuevos artículos.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    disclaimer:
      "Solo fines informativos. La ley colombiana cambia; confirma siempre las reglas vigentes para tu caso.",
  },
} as const;
