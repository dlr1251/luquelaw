export type { Post, PostCategory } from "./types";

/** Fallback hub catalog when Supabase has no published rows yet */
export const posts = [
  {
    slug: "/posts/digital-nomad-visa-colombia",
    title: "Digital Nomad Visa in Colombia: What Changed in 2026",
    category: "Immigration" as const,
    readingTime: "6 min",
    description:
      "A practical overview of Colombia's digital nomad visa — eligibility, income requirements, application steps, and common mistakes international remote workers make.",
    publishedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    slug: "/posts/property-due-diligence-medellin",
    title: "Property Due Diligence in Medellín: A Buyer's Checklist",
    category: "Real Estate" as const,
    readingTime: "7 min",
    description:
      "Five essential checks before signing a purchase promise in Medellín — registry review, liens, zoning, taxes, and foreign investment registration.",
    publishedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    slug: "/posts/sas-incorporation-foreigners",
    title: "Incorporating a Colombian S.A.S. as a Foreign Founder",
    category: "Business" as const,
    readingTime: "8 min",
    description:
      "Why foreign entrepreneurs choose the S.A.S. structure, what documents you need, typical timelines, and post-incorporation compliance basics.",
    publishedAt: "2026-05-20T00:00:00.000Z",
  },
];

export const postsEs = [
  {
    slug: "/es/posts/digital-nomad-visa-colombia",
    title: "Visa nómada digital en Colombia: novedades 2026",
    category: "Immigration" as const,
    readingTime: "6 min",
    description:
      "Panorama práctico de la visa nómada digital — requisitos, ingresos, pasos de solicitud y errores frecuentes de trabajadores remotos internacionales.",
    publishedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    slug: "/es/posts/property-due-diligence-medellin",
    title: "Debida diligencia inmobiliaria en Medellín: checklist del comprador",
    category: "Real Estate" as const,
    readingTime: "7 min",
    description:
      "Cinco verificaciones esenciales antes de firmar una promesa de compraventa — tradición, gravámenes, uso del suelo, impuestos y registro cambiario.",
    publishedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    slug: "/es/posts/sas-incorporation-foreigners",
    title: "Constituir una S.A.S. en Colombia siendo extranjero",
    category: "Business" as const,
    readingTime: "8 min",
    description:
      "Por qué los emprendedores extranjeros eligen la S.A.S., documentos necesarios, tiempos habituales y cumplimiento posterior a la constitución.",
    publishedAt: "2026-05-20T00:00:00.000Z",
  },
];
