export type ClkrHubLocale = "en" | "es";

export const clkrHubContent = {
  en: {
    eyebrow: "CLKR · Legal library",
    title: "Colombian Legal Knowledge Repository",
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
    eyebrow: "CLKR · Biblioteca legal",
    title: "Repositorio de Conocimiento Jurídico Colombiano",
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
