import { clkrPublicPath } from "@/lib/clkr/types";
import { normPublicPath } from "@/lib/norms/types";
import { postPublicPath } from "@/lib/posts/types";
import { alternateImmigrationPath } from "@/lib/practice-areas/paths";

import { SITE_URL } from "./config";

export type SeoLocale = "en" | "es";

export const STATIC_ROUTE_PAIRS = [
  { en: "/", es: "/es" },
  { en: "/clkr", es: "/es/clkr" },
  { en: "/clkr/guides", es: "/es/clkr/guides" },
  { en: "/clkr/norms", es: "/es/clkr/norms" },
  { en: "/clkr/agents", es: "/es/clkr/agents" },
  { en: "/posts", es: "/es/posts" },
  { en: "/pricing", es: "/es/pricing" },
  { en: "/privacy", es: "/es/privacidad" },
  { en: "/about", es: "/es/nosotros" },
  { en: "/services", es: "/es/servicios" },
  { en: "/services/immigration", es: "/es/servicios/migracion" },
  { en: "/services/immigration/visas", es: "/es/servicios/migracion/visas" },
  { en: "/services/immigration/nationality", es: "/es/servicios/migracion/nacionalidad" },
  { en: "/services/immigration/extranjeria", es: "/es/servicios/migracion/extranjeria" },
  { en: "/services/immigration/calculator", es: "/es/servicios/migracion/calculadora" },
  { en: "/services/labour-law", es: "/es/servicios/laboral" },
  { en: "/services/real-estate", es: "/es/servicios/inmobiliario" },
  { en: "/services/family-law", es: "/es/servicios/familia" },
  { en: "/services/corporate-law", es: "/es/servicios/corporativo" },
  { en: "/services/taxes", es: "/es/servicios/impuestos" },
] as const;

const LOCALIZED_PREFIXES = ["/clkr/", "/posts/", "/services/"] as const;

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

  // Immigration hub nested routes (including /visas/[slug])
  if (
    path.startsWith("/services/immigration/") ||
    path.startsWith("/es/servicios/migracion/")
  ) {
    return alternateImmigrationPath(path);
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
  { path: "/about", priority: 0.85 },
  { path: "/es/nosotros", priority: 0.85 },
  { path: "/services", priority: 0.9 },
  { path: "/es/servicios", priority: 0.9 },
  { path: "/services/immigration", priority: 0.85 },
  { path: "/es/servicios/migracion", priority: 0.85 },
  { path: "/services/immigration/visas", priority: 0.8 },
  { path: "/es/servicios/migracion/visas", priority: 0.8 },
  { path: "/services/immigration/nationality", priority: 0.75 },
  { path: "/es/servicios/migracion/nacionalidad", priority: 0.75 },
  { path: "/services/immigration/extranjeria", priority: 0.75 },
  { path: "/es/servicios/migracion/extranjeria", priority: 0.75 },
  { path: "/services/immigration/calculator", priority: 0.8 },
  { path: "/es/servicios/migracion/calculadora", priority: 0.8 },
  { path: "/services/labour-law", priority: 0.8 },
  { path: "/es/servicios/laboral", priority: 0.8 },
  { path: "/services/real-estate", priority: 0.8 },
  { path: "/es/servicios/inmobiliario", priority: 0.8 },
  { path: "/services/family-law", priority: 0.8 },
  { path: "/es/servicios/familia", priority: 0.8 },
  { path: "/services/corporate-law", priority: 0.8 },
  { path: "/es/servicios/corporativo", priority: 0.8 },
  { path: "/services/taxes", priority: 0.8 },
  { path: "/es/servicios/impuestos", priority: 0.8 },
  { path: "/clkr", priority: 0.8 },
  { path: "/es/clkr", priority: 0.8 },
  { path: "/clkr/guides", priority: 0.75 },
  { path: "/es/clkr/guides", priority: 0.75 },
  { path: "/clkr/norms", priority: 0.75 },
  { path: "/es/clkr/norms", priority: 0.75 },
  { path: "/posts", priority: 0.75 },
  { path: "/es/posts", priority: 0.75 },
  { path: "/pricing", priority: 0.7 },
  { path: "/es/pricing", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/es/privacidad", priority: 0.3 },
] as const;
