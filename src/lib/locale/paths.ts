import type { SiteLocale } from "@/lib/locale/constants";
import { alternateImmigrationPath } from "@/lib/practice-areas/paths";

const supportedEnglishPaths = new Set([
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/book",
  "/services",
  "/services/immigration",
  "/services/labour-law",
  "/services/real-estate",
  "/services/family-law",
  "/services/corporate-law",
  "/services/taxes",
  "/pricing",
  "/clkr",
  "/clkr/guides",
  "/clkr/norms",
  "/clkr/agents",
  "/posts",
]);

const localizedPrefixes = ["/clkr/", "/posts/", "/services/"];

function isSupportedLocalizedPath(path: string): boolean {
  return localizedPrefixes.some((prefix) => path.startsWith(prefix));
}

const pathEnMap: Record<string, string> = {
  "/privacidad": "/privacy",
  "/nosotros": "/about",
  "/servicios": "/services",
  "/servicios/migracion": "/services/immigration",
  "/servicios/laboral": "/services/labour-law",
  "/servicios/inmobiliario": "/services/real-estate",
  "/servicios/familia": "/services/family-law",
  "/servicios/corporativo": "/services/corporate-law",
  "/servicios/impuestos": "/services/taxes",
};

const pathEsMap: Record<string, string> = {
  "/privacy": "/es/privacidad",
  "/about": "/es/nosotros",
  "/services": "/es/servicios",
  "/services/immigration": "/es/servicios/migracion",
  "/services/labour-law": "/es/servicios/laboral",
  "/services/real-estate": "/es/servicios/inmobiliario",
  "/services/family-law": "/es/servicios/familia",
  "/services/corporate-law": "/es/servicios/corporativo",
  "/services/taxes": "/es/servicios/impuestos",
};

function stripSpanishPrefix(pathname: string) {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Map Spanish servicios/migracion subpaths to English services/immigration suffixes. */
function spanishMigracionToEnglish(stripped: string): string | undefined {
  if (stripped === "/servicios/migracion") return "/services/immigration";
  if (!stripped.startsWith("/servicios/migracion/")) return undefined;
  const rest = stripped.slice("/servicios/migracion".length);
  const parts = rest.replace(/^\//, "").split("/");
  const map: Record<string, string> = {
    visas: "visas",
    nacionalidad: "nationality",
    extranjeria: "extranjeria",
    calculadora: "calculator",
  };
  const mapped = parts.map((part, i) => (i === 0 && map[part] ? map[part] : part));
  return `/services/immigration/${mapped.join("/")}`;
}

/** Map English services/immigration subpaths to Spanish servicios/migracion paths. */
function englishImmigrationToSpanish(englishPath: string): string | undefined {
  if (englishPath === "/services/immigration") return "/es/servicios/migracion";
  if (!englishPath.startsWith("/services/immigration/")) return undefined;
  const rest = englishPath.slice("/services/immigration".length);
  const parts = rest.replace(/^\//, "").split("/");
  const map: Record<string, string> = {
    visas: "visas",
    nationality: "nacionalidad",
    extranjeria: "extranjeria",
    calculator: "calculadora",
  };
  const mapped = parts.map((part, i) => (i === 0 && map[part] ? map[part] : part));
  return `/es/servicios/migracion/${mapped.join("/")}`;
}

export function toSpanishPath(pathname: string): string {
  const immigrationAlt = alternateImmigrationPath(pathname);
  if (pathname.startsWith("/services/immigration") && immigrationAlt) return immigrationAlt;

  const englishPath = stripSpanishPrefix(pathname);

  if (pathEsMap[englishPath]) return pathEsMap[englishPath];
  const immEs = englishImmigrationToSpanish(englishPath);
  if (immEs) return immEs;
  if (isSupportedLocalizedPath(englishPath)) {
    return `/es${englishPath}`;
  }
  if (!supportedEnglishPaths.has(englishPath)) return "/es";
  return englishPath === "/" ? "/es" : `/es${englishPath}`;
}

export function toEnglishPath(pathname: string): string {
  const immigrationAlt = alternateImmigrationPath(pathname);
  if (pathname.startsWith("/es/servicios/migracion") && immigrationAlt) return immigrationAlt;

  if (pathname === "/es") return "/";
  if (pathname === "/es/privacidad") return "/privacy";
  if (pathname === "/es/nosotros") return "/about";
  if (pathname === "/es/servicios") return "/services";
  if (pathname === "/es/servicios/migracion") return "/services/immigration";

  const stripped = stripSpanishPrefix(pathname);
  const migracionEn = spanishMigracionToEnglish(stripped);
  if (migracionEn) return migracionEn;

  const mapped = pathEnMap[stripped] ?? stripped;

  if (
    isSupportedLocalizedPath(mapped) ||
    supportedEnglishPaths.has(mapped) ||
    mapped === "/privacy" ||
    mapped === "/about" ||
    mapped === "/services" ||
    mapped.startsWith("/services/")
  ) {
    return mapped;
  }

  return "/";
}

export function localizedPath(pathname: string, locale: SiteLocale): string {
  const current = localeFromPathname(pathname);
  if (current === locale) return pathname;
  return locale === "es" ? toSpanishPath(pathname) : toEnglishPath(pathname);
}

export function localeFromPathname(pathname: string): SiteLocale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

export function shouldLocalizePath(pathname: string): boolean {
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/auth")) return false;
  if (pathname.startsWith("/login")) return false;
  if (pathname.startsWith("/account")) return false;
  if (pathname.startsWith("/portal")) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/_next")) return false;
  return true;
}
