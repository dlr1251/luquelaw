import { getAllPublishedArticles } from "@/lib/clkr/get-articles";
import { clkrGuidesHubPath, clkrPublicPath } from "@/lib/clkr/types";
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
  "/clkr": { en: "CLKR LegalAI hub", es: "Hub CLKR LegalAI" },
  "/clkr/guides": { en: "Articles", es: "Artículos" },
  "/clkr/norms": { en: "Norms", es: "Normas" },
  "/clkr/agents": { en: "Agents & prompts", es: "Agentes y prompts" },
  "/posts": { en: "Blog", es: "Blog" },
  "/pricing": { en: "Pricing", es: "Planes" },
  "/privacy": { en: "Privacy", es: "Privacidad" },
  "/about": { en: "About", es: "Nosotros" },
  "/services": { en: "Services", es: "Servicios" },
};

function pageSeoDescription(enPath: string, locale: SearchLocale): string {
  const keyMap: Record<string, keyof typeof PAGE_SEO> = {
    "/": "home",
    "/clkr": "clkrHub",
    "/clkr/guides": "clkrGuides",
    "/clkr/norms": "normsHub",
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
  const [articles, posts, norms] = await Promise.all([
    getAllPublishedArticles(),
    getAllPublishedPosts(),
    getAllPublishedNorms(),
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
    });
    items.push({
      id: `page:es:${pair.es}`,
      title: titles.es,
      description: pageSeoDescription(pair.en, "es"),
      href: pair.es,
      type: pair.es.includes("/servicios/") || pair.es === "/es/servicios" ? "service" : "page",
      locale: "es",
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
    });
    items.push({
      id: `hub:norms:${locale}`,
      title: locale === "es" ? "Normas" : "Norms",
      description:
        locale === "es"
          ? "Biblioteca normativa colombiana"
          : "Colombian normative library",
      href: normsHubPath(locale),
      type: "norm",
      locale,
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

  items.push({
    id: "torny:all",
    title: "Torny",
    description:
      "AI-guided immigration consultations in the portal — prepaid wallet, cited norms and articles.",
    href: "/portal/lucy",
    type: "torny",
    locale: "all",
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
