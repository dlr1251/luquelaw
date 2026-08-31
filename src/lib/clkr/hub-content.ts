export type ClkrHubLocale = "en" | "es";

export const clkrLegalAiHubContent = {
  en: {
    eyebrow: "Legal resources",
    title: "Colombian law — open, navigable, citable",
    subtitle:
      "CLKR articles, the norms catalog, and a public library of skills and prompts. Lucy AI and configurable agents live in the portal. Study tools — not legal advice.",
    modulesTitle: "Resources",
    modulesSubtitle: "Articles, norms, and prompts are public. Agents require a Professional plan.",
    contactCta: "Questions about your situation?",
    contactLink: "Get in touch",
    lucyEyebrow: "AI consultation",
    lucyTitle: "Meet Lucy AI",
    lucyBody:
      "Guided immigration consultations in the portal — prepaid wallet, cited norms and articles. Escalate to a lawyer when you need a verified answer.",
    lucyCta: "Open Lucy AI in the portal",
    lucyCtaShort: "Open Lucy AI",
    lucySignIn: "Sign in to start",
    disclaimer:
      "Informational only. Colombian law changes; confirm the current rules for your case.",
    modules: {
      guides: {
        title: "CLKR",
        description:
          "238+ practical articles on Colombian law — searchable, categorized, and linked to norms and prompts.",
        cta: "Browse CLKR",
        badge: "Public",
      },
      norms: {
        title: "Norms catalog",
        description: "Constitutions, codes, laws, and resolutions with structured navigation.",
        cta: "Open norms catalog",
        badge: "Public",
      },
      library: {
        title: "Skills & prompts",
        description:
          "Copy-ready prompts for migration letters, contract review, labor agreements, and more.",
        cta: "Open library",
        badge: "Public",
      },
      agents: {
        title: "Agents",
        description: "Configurable LegalAI agents for day-to-day legal work in the portal.",
        cta: "View agents",
        badge: "Professional",
      },
    },
    articlesTitle: "CLKR articles",
    articlesSubtitle:
      "A sample of published guides — open any title, or browse the full searchable library.",
    articlesRead: "Read guide",
    articlesBrowseAll: "Browse all CLKR articles",
    articleCategories: {
      Immigration: "Immigration",
      "Real Estate": "Real Estate",
      Corporate: "Corporate",
      Labor: "Labor",
      Civil: "Civil",
      Family: "Family",
      Tax: "Tax",
      Digital: "Digital",
      Administrative: "Administrative",
      IP: "IP",
      Criminal: "Criminal",
      International: "International",
    },
  },
  es: {
    eyebrow: "Recursos legales",
    title: "Derecho colombiano — abierto, navegable, citable",
    subtitle:
      "Artículos CLKR, normograma y una biblioteca pública de skills y prompts. Lucy AI y agentes configurables viven en el portal. Herramientas de estudio — no asesoría jurídica.",
    modulesTitle: "Recursos",
    modulesSubtitle: "Artículos, normas y prompts son públicos. Los agentes requieren plan Profesional.",
    contactCta: "¿Preguntas sobre tu caso?",
    contactLink: "Escríbenos",
    lucyEyebrow: "Consulta con IA",
    lucyTitle: "Conoce a Lucy AI",
    lucyBody:
      "Consultas guiadas de migración en el portal — wallet prepago, normas y artículos citados. Escala a un abogado cuando necesites una respuesta verificada.",
    lucyCta: "Abrir Lucy AI en el portal",
    lucyCtaShort: "Abrir Lucy AI",
    lucySignIn: "Inicia sesión para empezar",
    disclaimer:
      "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
    modules: {
      guides: {
        title: "CLKR",
        description:
          "238+ artículos prácticos sobre derecho colombiano — buscables, categorizados y enlazados a normas y prompts.",
        cta: "Explorar CLKR",
        badge: "Público",
      },
      norms: {
        title: "Normograma",
        description: "Constituciones, códigos, leyes y resoluciones con navegación estructurada.",
        cta: "Abrir normograma",
        badge: "Público",
      },
      library: {
        title: "Skills y prompts",
        description:
          "Prompts listos para cartas migratorias, revisión de contratos, acuerdos laborales y más.",
        cta: "Abrir biblioteca",
        badge: "Público",
      },
      agents: {
        title: "Agentes",
        description: "Agentes LegalAI configurables para el trabajo jurídico diario en el portal.",
        cta: "Ver agentes",
        badge: "Profesional",
      },
    },
    articlesTitle: "Artículos CLKR",
    articlesSubtitle:
      "Una muestra de guías publicadas — abre cualquier título, o explora la biblioteca completa.",
    articlesRead: "Leer guía",
    articlesBrowseAll: "Ver todos los artículos CLKR",
    articleCategories: {
      Immigration: "Inmigración",
      "Real Estate": "Inmobiliario",
      Corporate: "Corporativo",
      Labor: "Laboral",
      Civil: "Civil",
      Family: "Familia",
      Tax: "Tributario",
      Digital: "Digital",
      Administrative: "Administrativo",
      IP: "Propiedad intelectual",
      Criminal: "Penal",
      International: "Internacional",
    },
  },
} as const;

export const clkrLibraryHubContent = {
  en: {
    eyebrow: "Skills & prompts",
    title: "Legal AI prompt library",
    subtitle:
      "Copy prompts into Claude, ChatGPT, or your preferred tool. Each prompt links to a CLKR article for context. Verify outputs against primary sources.",
    searchPlaceholder: "Search prompts and skills…",
    tabPrompts: "Prompts",
    tabSkills: "Skills",
    readGuide: "Read CLKR article",
    copy: "Copy",
    copied: "Copied",
    empty: "No matches. Try another search or category.",
    filter: "Practice area",
    all: "All",
    browseClkr: "Browse CLKR articles",
    disclaimer:
      "Informational tools only. Not legal advice. You remain responsible for professional judgment.",
  },
  es: {
    eyebrow: "Skills y prompts",
    title: "Biblioteca de prompts jurídicos",
    subtitle:
      "Copia prompts en Claude, ChatGPT o tu herramienta preferida. Cada prompt enlaza a un artículo CLKR para contexto. Verifica los resultados contra fuentes primarias.",
    searchPlaceholder: "Buscar prompts y skills…",
    tabPrompts: "Prompts",
    tabSkills: "Skills",
    readGuide: "Leer artículo CLKR",
    copy: "Copiar",
    copied: "Copiado",
    empty: "Sin resultados. Prueba otra búsqueda o categoría.",
    filter: "Área",
    all: "Todas",
    browseClkr: "Explorar artículos CLKR",
    disclaimer:
      "Solo herramientas informativas. No es asesoría jurídica. Tú sigues siendo responsable del criterio profesional.",
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
