import { getAllPublishedArticles } from "@/lib/clkr/get-articles";
import { clkrGuidesHubPath, clkrLibraryPath, clkrLibraryPromptPath, clkrLibrarySkillPath, clkrPublicPath } from "@/lib/clkr/types";
import { getPublishedPrompts, getPublishedSkills } from "@/lib/agents/get-agents";
import { getAllPublishedNorms } from "@/lib/norms/get-norms";
import { normPublicPath, normsHubPath } from "@/lib/norms/types";
import { getAllPublishedPosts } from "@/lib/posts/get-posts";
import { postPublicPath } from "@/lib/posts/types";
import { PAGE_SEO } from "@/lib/seo/config";
import { STATIC_ROUTE_PAIRS } from "@/lib/seo/routes";
import { getServiceAreas } from "@/lib/services/content";

import type { SearchLocale, SiteSearchItem } from "./types";

const PAGE_TITLES: Record<string, { en: string; es: string }> = {
  "/": { en: "Home", es: "Inicio" },
  "/clkr": { en: "CLKR articles", es: "Artículos CLKR" },
  "/clkr/norms": { en: "Norms catalog", es: "Normograma" },
  "/clkr/library": { en: "Skills & prompts", es: "Skills y prompts" },
  "/clkr/agents": { en: "Agents", es: "Agentes" },
  "/posts": { en: "Blog", es: "Blog" },
  "/pricing": { en: "Pricing", es: "Planes" },
  "/privacy": { en: "Privacy", es: "Privacidad" },
  "/about": { en: "About", es: "Nosotros" },
  "/services": { en: "Services", es: "Servicios" },
};

const PAGE_KEYWORDS: Record<string, string[]> = {
  "/clkr": ["clkr", "guides", "guias", "artículos", "articles"],
  "/clkr/norms": [
    "norma",
    "normas",
    "normograma",
    "laws",
    "statutes",
    "codigo",
    "código",
    "constitucion",
    "constitución",
  ],
  "/clkr/library": ["library", "biblioteca", "prompts", "skills", "lucy"],
  "/posts": ["blog", "posts", "noticias"],
  "/pricing": ["pricing", "planes", "precios", "rates", "fees"],
  "/services": ["services", "servicios", "practice", "areas"],
  "/about": ["about", "nosotros", "team", "equipo"],
};

function pageSeoDescription(enPath: string, locale: SearchLocale): string {
  const keyMap: Record<string, keyof typeof PAGE_SEO> = {
    "/": "home",
    "/clkr": "clkrGuides",
    "/clkr/norms": "normsHub",
    "/clkr/library": "clkrLibrary",
    "/posts": "postsHub",
    "/pricing": "pricing",
    "/privacy": "privacy",
    "/about": "about",
    "/services": "services",
  };
  const key = keyMap[enPath];
  if (!key) return "";
  const entry = PAGE_SEO[key];
  if (!entry || typeof entry !== "object") return "";
  const localized = (entry as Record<string, { description?: string }>)[locale];
  return localized?.description ?? "";
}

export async function buildSiteSearchIndex(): Promise<SiteSearchItem[]> {
  const [articles, posts, norms, promptsEn, promptsEs, skillsEn, skillsEs] = await Promise.all([
    getAllPublishedArticles(),
    getAllPublishedPosts(),
    getAllPublishedNorms(),
    getPublishedPrompts("en"),
    getPublishedPrompts("es"),
    getPublishedSkills("en"),
    getPublishedSkills("es"),
  ]);

  const items: SiteSearchItem[] = [];

  for (const pair of STATIC_ROUTE_PAIRS) {
    const titles = PAGE_TITLES[pair.en];
    if (!titles) continue;

    items.push({
      id: `page:en:${pair.en}`,
      title: titles.en,
      description: pageSeoDescription(pair.en, "en"),
      href: pair.en,
      type: pair.en.includes("/services/") || pair.en === "/services" ? "service" : "page",
      locale: "en",
      keywords: PAGE_KEYWORDS[pair.en],
    });
    items.push({
      id: `page:es:${pair.es}`,
      title: titles.es,
      description: pageSeoDescription(pair.en, "es"),
      href: pair.es,
      type: pair.es.includes("/servicios/") || pair.es === "/es/servicios" ? "service" : "page",
      locale: "es",
      keywords: PAGE_KEYWORDS[pair.en],
    });
  }

  // Ensure hubs exist even if not in PAGE_TITLES map above
  for (const locale of ["en", "es"] as const) {
    items.push({
      id: `hub:articles:${locale}`,
      title: locale === "es" ? "Artículos" : "Articles",
      description:
        locale === "es"
          ? "Artículos didácticos sobre derecho colombiano"
          : "Didactic articles on Colombian law",
      href: clkrGuidesHubPath(locale),
      type: "article",
      locale,
      keywords: ["clkr", "guides", "guias", "artículos", "articles"],
    });
    items.push({
      id: `hub:library:${locale}`,
      title: locale === "es" ? "Skills y prompts" : "Skills & prompts",
      description:
        locale === "es"
          ? "Biblioteca pública de prompts jurídicos"
          : "Public library of legal AI prompts",
      href: clkrLibraryPath(locale),
      type: "page",
      locale,
      keywords: ["library", "biblioteca", "prompts", "skills", "lucy"],
    });
    items.push({
      id: `hub:norms:${locale}`,
      title: locale === "es" ? "Normograma" : "Norms catalog",
      description:
        locale === "es"
          ? "Navegador de normas colombianas"
          : "Colombian statute browser",
      href: normsHubPath(locale),
      type: "norm",
      locale,
      keywords: [
        "norma",
        "normas",
        "normograma",
        "laws",
        "statutes",
        "codigo",
        "código",
        "constitucion",
        "constitución",
      ],
    });
  }

  for (const locale of ["en", "es"] as const) {
    for (const area of getServiceAreas(locale)) {
      items.push({
        id: `service:${locale}:${area.id}`,
        title: area.title,
        description: area.blurb,
        href: area.href,
        type: "service",
        locale,
        category: area.shortTitle,
      });
    }
  }

  for (const article of articles) {
    items.push({
      id: `article:${article.locale}:${article.slug_key}`,
      title: article.title,
      description: article.description,
      href: clkrPublicPath(article.slug_key, article.locale),
      type: "article",
      locale: article.locale,
      category: article.category,
    });
  }

  for (const post of posts) {
    items.push({
      id: `post:${post.locale}:${post.slug_key}`,
      title: post.title,
      description: post.description,
      href: postPublicPath(post.slug_key, post.locale),
      type: "post",
      locale: post.locale,
      category: post.category,
    });
  }

  for (const norm of norms) {
    items.push({
      id: `norm:${norm.locale}:${norm.slug_key}`,
      title: norm.short_title || norm.title,
      description: norm.description,
      href: normPublicPath(norm.slug_key, norm.locale, ["overview"]),
      type: "norm",
      locale: norm.locale,
      category: norm.category,
    });
  }

  for (const prompt of [...promptsEn, ...promptsEs]) {
    items.push({
      id: `prompt:${prompt.locale}:${prompt.slug_key}`,
      title: prompt.title,
      description: prompt.description,
      href: clkrLibraryPromptPath(prompt.slug_key, prompt.locale),
      type: "page",
      locale: prompt.locale,
      category: prompt.category,
    });
  }

  for (const skill of [...skillsEn, ...skillsEs]) {
    items.push({
      id: `skill:${skill.locale}:${skill.slug_key}`,
      title: skill.title,
      description: skill.description,
      href: clkrLibrarySkillPath(skill.slug_key, skill.locale),
      type: "page",
      locale: skill.locale,
      category: skill.category,
    });
  }

  items.push({
    id: "torny:all",
    title: "Lucy AI",
    description:
      "AI-guided immigration consultations in the portal — prepaid wallet, cited norms and articles.",
    href: "/portal/lucy",
    type: "torny",
    locale: "all",
    keywords: ["lucy", "torny", "ai", "assistant", "asistente"],
  });

  // Dedupe by id (hubs may overlap static pairs)
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    // Also dedupe by href+locale for overlapping hubs
    const hrefKey = `${item.locale}:${item.href}`;
    if (seen.has(hrefKey)) return false;
    seen.add(item.id);
    seen.add(hrefKey);
    return true;
  });
}
