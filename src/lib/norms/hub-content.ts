export type NormsHubLocale = "en" | "es";

export const normsHubContent = {
  en: {
    eyebrow: "Norms catalog",
    title: "Colombian statute browser",
    subtitle:
      "Constitution, codes, laws, and resolutions in Spanish and English — structured navigation with official references. Not legal advice; verify the official gazette for your case.",
    normCountLabel: "Norms",
    categoryLabel: "Areas of law",
    browseTitle: "Browse norms",
    browseSubtitle: "Filter by area or document type. Content loads section by section.",
    searchPlaceholder: "Filter by title or reference…",
    allCategories: "All areas",
    allTypes: "All types",
    howItWorksTitle: "How to use this library",
    howItWorks: [
      "Pick the code, law, or resolution you need.",
      "Use the sidebar table of contents to jump between titles, chapters, and articles.",
      "Switch EN/ES for parallel reference when available.",
    ],
    disclaimer:
      "Reference only. Colombian law changes; confirm the official text before you act.",
    read: "Open norm",
    contents: "Table of contents",
    mobileContents: "Contents",
    officialSource: "Official reference",
    relatedNorms: "Related norms",
    relatedArticles: "Related CLKR articles",
    readArticle: "Read article",
  },
  es: {
    eyebrow: "Normograma",
    title: "Navegador de normas colombianas",
    subtitle:
      "Constitución, códigos, leyes y resoluciones en español e inglés — navegación estructurada con referencias oficiales. No es asesoría jurídica; verifica la norma oficial vigente.",
    normCountLabel: "Normas",
    categoryLabel: "Ramas del derecho",
    browseTitle: "Explorar normas",
    browseSubtitle: "Filtra por rama o tipo de documento. El contenido se carga por secciones.",
    searchPlaceholder: "Filtrar por título o referencia…",
    allCategories: "Todas las ramas",
    allTypes: "Todos los tipos",
    howItWorksTitle: "Cómo usar esta biblioteca",
    howItWorks: [
      "Elige el código, ley o resolución que necesitas.",
      "Usa la tabla de contenidos lateral para saltar entre títulos, capítulos y artículos.",
      "Cambia EN/ES para consulta paralela cuando esté disponible.",
    ],
    disclaimer:
      "Solo referencia. La ley colombiana cambia; confirma el texto oficial antes de actuar.",
    read: "Abrir norma",
    contents: "Tabla de contenidos",
    mobileContents: "Contenido",
    officialSource: "Referencia oficial",
    relatedNorms: "Normas relacionadas",
    relatedArticles: "Artículos CLKR relacionados",
    readArticle: "Leer artículo",
  },
} as const;
