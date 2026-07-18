export type ClkrHubLocale = "en" | "es";

export const clkrLegalAiHubContent = {
  en: {
    eyebrow: "CLKR · LegalAI hub",
    title: "Colombian Legal Knowledge Repository",
    subtitle:
      "Study Colombian law with a normative library, practical guides, LegalAI agents, and quizzes—built for students and professionals. Informational only; not legal advice.",
    modulesTitle: "Modules",
    modulesSubtitle: "Start with public libraries, then unlock agents and quizzes with a subscription.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    lucyEyebrow: "AI consultation",
    lucyTitle: "Meet Lucy",
    lucyBody:
      "Guided immigration consultations in the portal—prepaid wallet, cited norms and guides, escalate to a lawyer when you need a verified answer.",
    lucyCta: "Open Lucy in the portal",
    lucyCtaShort: "Open Lucy",
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
        title: "Guides",
        description: "In-depth didactic articles on immigration, property, corporate, and more.",
        cta: "Browse guides",
        badge: "Public",
      },
      agents: {
        title: "Agents & prompts",
        description: "Curated skills and prompts for day-to-day legal work with AI tools.",
        cta: "View agents",
        badge: "Subscriber",
      },
      quizzes: {
        title: "Quizzes",
        description: "Evaluate what you know with topic-linked quizzes for students.",
        cta: "Start quizzes",
        badge: "Student",
      },
    },
  },
  es: {
    eyebrow: "CLKR · Hub LegalAI",
    title: "Repositorio de Conocimiento Jurídico Colombiano",
    subtitle:
      "Estudia el ordenamiento colombiano con normas, guías prácticas, agentes LegalAI y quizzes—para estudiantes y profesionales. Solo informativo; no es asesoría jurídica.",
    modulesTitle: "Módulos",
    modulesSubtitle: "Empieza con las bibliotecas públicas; desbloquea agentes y quizzes con suscripción.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    lucyEyebrow: "Consulta con IA",
    lucyTitle: "Conoce a Lucy",
    lucyBody:
      "Consultas guiadas de migración en el portal—wallet prepago, normas y guías citadas, y escala a un abogado cuando necesites una respuesta verificada.",
    lucyCta: "Abrir Lucy en el portal",
    lucyCtaShort: "Abrir Lucy",
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
        title: "Guías",
        description: "Artículos didácticos sobre migración, inmuebles, societario y más.",
        cta: "Ver guías",
        badge: "Público",
      },
      agents: {
        title: "Agentes y prompts",
        description: "Skills y prompts curados para el trabajo jurídico diario con herramientas de IA.",
        cta: "Ver agentes",
        badge: "Suscriptor",
      },
      quizzes: {
        title: "Quizzes",
        description: "Evalúa lo que sabes con quizzes vinculados a temas para estudiantes.",
        cta: "Ir a quizzes",
        badge: "Estudiante",
      },
    },
  },
} as const;

/** @deprecated Use clkrLegalAiHubContent for the hub; guides hub uses clkrGuidesHubContent */
export const clkrHubContent = {
  en: {
    eyebrow: "CLKR · Guides",
    title: "Legal guides",
    subtitle:
      "In-depth guides on Colombian law for international clients—written to be practical, cited, and easy to navigate. Not legal advice; every case is different.",
    howItWorksTitle: "How to use this library",
    howItWorks: [
      "Start with the topic closest to your situation (immigration, property, etc.).",
      "Use the table of contents inside each article to jump to sections.",
      "When your facts are specific, book a consultation for a written legal concept tailored to you.",
    ],
    articleCountLabel: "Guides",
    categoryLabel: "Topics covered",
    browseTitle: "All guides",
    browseSubtitle: "Search and filter by topic. New articles are added over time.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    disclaimer:
      "For informational purposes only. Colombian law changes; always confirm current rules for your case.",
  },
  es: {
    eyebrow: "CLKR · Guías",
    title: "Guías jurídicas",
    subtitle:
      "Guías sobre derecho colombiano para clientes internacionales—prácticas, con fuentes y fáciles de navegar. No constituye asesoría jurídica; cada caso es único.",
    howItWorksTitle: "Cómo usar esta biblioteca",
    howItWorks: [
      "Empieza por el tema más cercano a tu situación (migratorio, inmuebles, etc.).",
      "Usa la tabla de contenidos dentro de cada artículo para saltar a secciones.",
      "Si tus hechos son específicos, agenda una consulta para un concepto jurídico a tu medida.",
    ],
    articleCountLabel: "Guías",
    categoryLabel: "Temas disponibles",
    browseTitle: "Todas las guías",
    browseSubtitle: "Busca y filtra por tema. Se irán sumando nuevos artículos.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    disclaimer:
      "Solo fines informativos. La ley colombiana cambia; confirma siempre las reglas vigentes para tu caso.",
  },
} as const;
