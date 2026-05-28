import { clkrPublicPath } from "@/lib/clkr/types";
import { normPublicPath } from "@/lib/norms/types";
import { postPublicPath } from "@/lib/posts/types";

import { SITE_URL } from "./config";

export type SeoLocale = "en" | "es";

export const STATIC_ROUTE_PAIRS = [
  { en: "/", es: "/es" },
  { en: "/clkr", es: "/es/clkr" },
  { en: "/norms", es: "/es/norms" },
  { en: "/posts", es: "/es/posts" },
  { en: "/privacy", es: "/es/privacidad" },
] as const;

const LOCALIZED_PREFIXES = ["/clkr/", "/norms/", "/posts/"] as const;

export function isLocalizedContentPath(path: string): boolean {
  if (STATIC_ROUTE_PAIRS.some((pair) => pair.en === path || pair.es === path)) {
    return true;
  }
  return LOCALIZED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function getAlternatePath(path: string, locale: SeoLocale): string | undefined {
  for (const pair of STATIC_ROUTE_PAIRS) {
    if (pair[locale] === path) {
      return pair[locale === "en" ? "es" : "en"];
    }
  }

  const stripped = path.startsWith("/es/") ? path.slice(3) : path;
  if (isLocalizedContentPath(stripped)) {
    return locale === "en" ? `/es${stripped}` : stripped;
  }

  return undefined;
}

export function buildStaticLanguageAlternates(
  path: string,
  locale: SeoLocale,
): Record<string, string> {
  const alternatePath = getAlternatePath(path, locale);
  const languages: Record<string, string> = {
    [locale]: absoluteUrl(path),
    "x-default": absoluteUrl(locale === "en" ? path : (alternatePath ?? path)),
  };

  if (alternatePath) {
    languages[locale === "en" ? "es" : "en"] = absoluteUrl(alternatePath);
  }

  return languages;
}

export function buildClkrLanguageAlternates(
  slugKey: string,
  locale: SeoLocale,
  translationSlugKey?: string | null,
): Record<string, string> {
  const selfPath = clkrPublicPath(slugKey, locale);
  const languages: Record<string, string> = {
    [locale]: absoluteUrl(selfPath),
    "x-default": absoluteUrl(clkrPublicPath(slugKey, "en")),
  };

  if (translationSlugKey) {
    const otherLocale = locale === "en" ? "es" : "en";
    languages[otherLocale] = absoluteUrl(clkrPublicPath(translationSlugKey, otherLocale));
  }

  return languages;
}

export function buildPostLanguageAlternates(
  slugKey: string,
  locale: SeoLocale,
  translationSlugKey?: string | null,
): Record<string, string> {
  const selfPath = postPublicPath(slugKey, locale);
  const languages: Record<string, string> = {
    [locale]: absoluteUrl(selfPath),
    "x-default": absoluteUrl(postPublicPath(slugKey, "en")),
  };

  if (translationSlugKey) {
    const otherLocale = locale === "en" ? "es" : "en";
    languages[otherLocale] = absoluteUrl(postPublicPath(translationSlugKey, otherLocale));
  }

  return languages;
}

export function buildNormLanguageAlternates(
  slugKey: string,
  locale: SeoLocale,
  sectionPath: string[],
  translationSlugKey?: string | null,
): Record<string, string> {
  const selfPath = normPublicPath(slugKey, locale, sectionPath);
  const languages: Record<string, string> = {
    [locale]: absoluteUrl(selfPath),
    "x-default": absoluteUrl(normPublicPath(slugKey, "en", sectionPath)),
  };

  if (translationSlugKey) {
    const otherLocale = locale === "en" ? "es" : "en";
    languages[otherLocale] = absoluteUrl(
      normPublicPath(translationSlugKey, otherLocale, sectionPath),
    );
  }

  return languages;
}

export const SITEMAP_STATIC_PATHS = [
  { path: "/", priority: 1.0 },
  { path: "/es", priority: 1.0 },
  { path: "/clkr", priority: 0.8 },
  { path: "/es/clkr", priority: 0.8 },
  { path: "/norms", priority: 0.8 },
  { path: "/es/norms", priority: 0.8 },
  { path: "/posts", priority: 0.75 },
  { path: "/es/posts", priority: 0.75 },
  { path: "/privacy", priority: 0.3 },
  { path: "/es/privacidad", priority: 0.3 },
] as const;
