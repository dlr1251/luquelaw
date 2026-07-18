import { BRAND } from "@/lib/email/brand";

import { LAWYER_NAME, SITE_LOCATION, SITE_NAME, SITE_URL } from "./config";
import type { SeoLocale } from "./routes";

export function homeJsonLd(locale: SeoLocale) {
  const isEs = locale === "es";

  return [
    {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "@id": `${SITE_URL}/#legal-service`,
      name: SITE_NAME,
      url: isEs ? `${SITE_URL}/es` : SITE_URL,
      description: isEs ? BRAND.tagline : BRAND.tagline,
      areaServed: {
        "@type": "Country",
        name: "Colombia",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Medellín",
        addressCountry: "CO",
      },
      location: SITE_LOCATION,
      inLanguage: isEs ? "es" : "en",
      provider: {
        "@type": "Attorney",
        "@id": `${SITE_URL}/#attorney`,
        name: LAWYER_NAME,
        url: isEs ? `${SITE_URL}/es` : SITE_URL,
        worksFor: {
          "@type": "LegalService",
          name: SITE_NAME,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: ["en", "es"],
      publisher: {
        "@type": "LegalService",
        name: SITE_NAME,
      },
    },
  ];
}

export function clkrHubJsonLd(locale: SeoLocale) {
  const isEs = locale === "es";
  const path = isEs ? "/es/clkr" : "/clkr";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEs ? "CLKR — Hub LegalAI" : "CLKR — LegalAI hub",
    url: `${SITE_URL}${path}`,
    inLanguage: isEs ? "es" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function clkrGuidesHubJsonLd(locale: SeoLocale) {
  const isEs = locale === "es";
  const path = isEs ? "/es/clkr/guides" : "/clkr/guides";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEs ? "Guías jurídicas" : "Legal guides",
    url: `${SITE_URL}${path}`,
    inLanguage: isEs ? "es" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function normsHubJsonLd(locale: SeoLocale) {
  const isEs = locale === "es";
  const path = isEs ? "/es/clkr/norms" : "/clkr/norms";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEs ? "Normas jurídicas colombianas" : "Colombian legal norms",
    url: `${SITE_URL}${path}`,
    inLanguage: isEs ? "es" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function normJsonLd(
  norm: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
  sectionPath: string[],
  sectionTitle: string,
) {
  const isEs = norm.locale === "es";
  const basePath = isEs ? `/es/clkr/norms/${norm.slug_key}` : `/clkr/norms/${norm.slug_key}`;
  const path = sectionPath.length ? `${basePath}/${sectionPath.join("/")}` : basePath;
  const url = `${SITE_URL}${path}`;
  const homePath = isEs ? "/es" : "/";
  const hubPath = isEs ? "/es/clkr/norms" : "/clkr/norms";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Legislation",
      name: sectionTitle,
      description: norm.description,
      url,
      inLanguage: isEs ? "es" : "en",
      datePublished: norm.published_at ?? norm.updated_at,
      dateModified: norm.updated_at,
      isPartOf: {
        "@type": "Legislation",
        name: norm.title,
        url: `${SITE_URL}${basePath}`,
      },
      publisher: {
        "@type": "LegalService",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEs ? "Inicio" : "Home",
          item: `${SITE_URL}${homePath}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEs ? "Normas" : "Norms",
          item: `${SITE_URL}${hubPath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: norm.title,
          item: `${SITE_URL}${basePath}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: sectionTitle,
          item: url,
        },
      ],
    },
  ];
}

export function postsHubJsonLd(locale: SeoLocale) {
  const isEs = locale === "es";
  const path = isEs ? "/es/posts" : "/posts";

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: isEs ? "Blog — Luque Law" : "Blog — Luque Law",
    url: `${SITE_URL}${path}`,
    inLanguage: isEs ? "es" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function postJsonLd(
  post: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
) {
  const isEs = post.locale === "es";
  const path = isEs ? `/es/posts/${post.slug_key}` : `/posts/${post.slug_key}`;
  const url = `${SITE_URL}${path}`;
  const homePath = isEs ? "/es" : "/";
  const hubPath = isEs ? "/es/posts" : "/posts";

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url,
      inLanguage: isEs ? "es" : "en",
      datePublished: post.published_at ?? post.updated_at,
      dateModified: post.updated_at,
      author: {
        "@type": "Attorney",
        name: LAWYER_NAME,
        url: `${SITE_URL}${homePath}`,
      },
      publisher: {
        "@type": "LegalService",
        name: SITE_NAME,
        url: SITE_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEs ? "Inicio" : "Home",
          item: `${SITE_URL}${homePath}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}${hubPath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  ];
}

export function clkrArticleJsonLd(
  article: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
) {
  const isEs = article.locale === "es";
  const path = isEs ? `/es/clkr/guides/${article.slug_key}` : `/clkr/guides/${article.slug_key}`;
  const url = `${SITE_URL}${path}`;
  const homePath = isEs ? "/es" : "/";
  const hubPath = isEs ? "/es/clkr" : "/clkr";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url,
      inLanguage: isEs ? "es" : "en",
      datePublished: article.published_at ?? article.updated_at,
      dateModified: article.updated_at,
      author: {
        "@type": "Attorney",
        name: LAWYER_NAME,
        url: `${SITE_URL}${homePath}`,
      },
      publisher: {
        "@type": "LegalService",
        name: SITE_NAME,
        url: SITE_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEs ? "Inicio" : "Home",
          item: `${SITE_URL}${homePath}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "CLKR",
          item: `${SITE_URL}${hubPath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: url,
        },
      ],
    },
  ];
}
