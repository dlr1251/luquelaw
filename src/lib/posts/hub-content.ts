export type PostsHubLocale = "en" | "es";

export const postsHubContent = {
  en: {
    eyebrow: "Blog",
    title: "Notes on law and life in Colombia",
    subtitle:
      "Shorter pieces on visas, property, and business — useful when you can point at a rule. Not legal advice; your facts still matter.",
    articleCountLabel: "Articles",
    categoryLabel: "Topics",
    browseTitle: "Latest articles",
    browseSubtitle: "Search and filter by topic.",
    contactCta: "Need a Concepto Jurídico for your facts?",
    contactLink: "Get in touch",
    disclaimer:
      "Informational only. Colombian law changes; confirm the current rules for your case.",
  },
  es: {
    eyebrow: "Blog",
    title: "Notas sobre derecho y vida en Colombia",
    subtitle:
      "Textos breves sobre visas, inmuebles y negocios — útiles cuando puedes señalar una norma. No es asesoría jurídica; tus hechos siguen importando.",
    articleCountLabel: "Artículos",
    categoryLabel: "Temas",
    browseTitle: "Artículos recientes",
    browseSubtitle: "Busca y filtra por tema.",
    contactCta: "¿Necesitas un concepto jurídico sobre tus hechos?",
    contactLink: "Escríbenos",
    disclaimer:
      "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
  },
} as const;
