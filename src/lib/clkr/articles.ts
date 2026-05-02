export type ClkrCategory =
  | "Immigration"
  | "Real Estate"
  | "Corporate"
  | "Labor"
  | "Civil";

export type ClkrArticle = {
  slug: string;
  title: string;
  category: ClkrCategory;
  readingTime: string;
  description: string;
};

export const clkrArticles: ClkrArticle[] = [
  {
    slug: "/clkr/investor-visa",
    title: "Investor Visa (Visa de Inversionista — Tipo M)",
    category: "Immigration",
    readingTime: "12 min",
    description:
      "Eligibility, legal framework (Resolución 5477 de 2022), investment thresholds, FIEM registration, timelines, and common pitfalls.",
  },
  {
    slug: "/clkr/real-estate-transactions",
    title: "Real Estate Transactions for Foreigners",
    category: "Real Estate",
    readingTime: "14 min",
    description:
      "How foreigners buy property in Colombia: due diligence, notarial process, taxes, registration, and foreign investment compliance.",
  },
];

export const clkrArticlesEs: ClkrArticle[] = [
  {
    slug: "/es/clkr/investor-visa",
    title: "Visa de Inversionista (Tipo M)",
    category: "Immigration",
    readingTime: "12 min",
    description:
      "Requisitos, marco legal (Resolución 5477 de 2022), umbral de inversión, registro FIEM, tiempos y errores frecuentes.",
  },
  {
    slug: "/es/clkr/real-estate-transactions",
    title: "Transacciones Inmobiliarias para Extranjeros",
    category: "Real Estate",
    readingTime: "14 min",
    description:
      "Cómo comprar propiedad en Colombia siendo extranjero: debida diligencia, notaría, impuestos, registro y cumplimiento cambiario.",
  },
];

