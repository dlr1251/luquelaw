export type PostsHubLocale = "en" | "es";

export const postsHubContent = {
  en: {
    eyebrow: "Blog · Insights",
    title: "Legal insights for international clients",
    subtitle:
      "Shorter articles on immigration, property, and business in Colombia — practical updates and checklists. Not legal advice; every case is different.",
    articleCountLabel: "Articles",
    categoryLabel: "Topics",
    browseTitle: "Latest articles",
    browseSubtitle: "Search and filter by topic. New posts are published regularly.",
    contactCta: "Need advice for your situation?",
    contactLink: "Get in touch",
    disclaimer:
      "For informational purposes only. Colombian law changes; always confirm current rules for your case.",
  },
  es: {
    eyebrow: "Blog · Perspectivas",
    title: "Perspectivas legales para clientes internacionales",
    subtitle:
      "Artículos breves sobre inmigración, inmuebles y negocios en Colombia — actualizaciones y listas de verificación. No constituye asesoría jurídica; cada caso es único.",
    articleCountLabel: "Artículos",
    categoryLabel: "Temas",
    browseTitle: "Artículos recientes",
    browseSubtitle: "Busca y filtra por tema. Publicamos nuevos artículos con frecuencia.",
    contactCta: "¿Necesitas orientación para tu caso?",
    contactLink: "Escríbenos",
    disclaimer:
      "Solo fines informativos. La ley colombiana cambia; confirma siempre las reglas vigentes para tu caso.",
  },
} as const;
