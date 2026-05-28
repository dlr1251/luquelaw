import type { SiteLocale } from "@/lib/locale/constants";

export function localeFromPathname(pathname: string): SiteLocale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

/** Primary browser language prefers Spanish (es, es-CO, etc.). */
export function prefersSpanish(acceptLanguage: string | null | undefined): boolean {
  if (!acceptLanguage) return false;

  for (const part of acceptLanguage.split(",")) {
    const tag = part.trim().split(";")[0]?.toLowerCase();
    if (!tag) continue;
    if (tag === "es" || tag.startsWith("es-")) return true;
    if (tag === "en" || tag.startsWith("en-")) return false;
  }

  return false;
}

export function resolveLocale({
  pathname,
  cookieLocale,
  acceptLanguage,
}: {
  pathname: string;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): SiteLocale {
  if (cookieLocale === "en" || cookieLocale === "es") {
    return cookieLocale;
  }

  return prefersSpanish(acceptLanguage) ? "es" : "en";
}
