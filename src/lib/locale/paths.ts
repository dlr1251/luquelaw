import type { SiteLocale } from "@/lib/locale/constants";
import { alternateImmigrationPath } from "@/lib/practice-areas/paths";

const supportedEnglishPaths = new Set([
  "/",
  "/contact",
  "/privacy",
  "/immigration",
  "/book",
  "/services",
  "/pricing",
  "/clkr",
  "/clkr/guides",
  "/clkr/norms",
  "/clkr/agents",
  "/posts",
]);

const localizedPrefixes = ["/clkr/", "/posts/", "/immigration/"];

function isSupportedLocalizedPath(path: string): boolean {
  return localizedPrefixes.some((prefix) => path.startsWith(prefix));
}

const pathEnMap: Record<string, string> = {
  "/privacidad": "/privacy",
  "/migracion": "/immigration",
};

const pathEsMap: Record<string, string> = {
  "/privacy": "/es/privacidad",
  "/immigration": "/es/migracion",
};

function stripSpanishPrefix(pathname: string) {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Map Spanish migracion subpaths to English immigration suffixes. */
function spanishMigracionToEnglish(stripped: string): string | undefined {
  if (stripped === "/migracion") return "/immigration";
  if (!stripped.startsWith("/migracion/")) return undefined;
  const rest = stripped.slice("/migracion".length);
  const parts = rest.replace(/^\//, "").split("/");
  const map: Record<string, string> = {
    visas: "visas",
    nacionalidad: "nationality",
    extranjeria: "extranjeria",
    calculadora: "calculator",
  };
  const mapped = parts.map((part, i) => (i === 0 && map[part] ? map[part] : part));
  return `/immigration/${mapped.join("/")}`;
}

/** Map English immigration subpaths to Spanish migracion paths. */
function englishImmigrationToSpanish(englishPath: string): string | undefined {
  if (englishPath === "/immigration") return "/es/migracion";
  if (!englishPath.startsWith("/immigration/")) return undefined;
  const rest = englishPath.slice("/immigration".length);
  const parts = rest.replace(/^\//, "").split("/");
  const map: Record<string, string> = {
    visas: "visas",
    nationality: "nacionalidad",
    extranjeria: "extranjeria",
    calculator: "calculadora",
  };
  const mapped = parts.map((part, i) => (i === 0 && map[part] ? map[part] : part));
  return `/es/migracion/${mapped.join("/")}`;
}

export function toSpanishPath(pathname: string): string {
  const immigrationAlt = alternateImmigrationPath(pathname);
  if (pathname.startsWith("/immigration") && immigrationAlt) return immigrationAlt;

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
  if (pathname.startsWith("/es/migracion") && immigrationAlt) return immigrationAlt;

  if (pathname === "/es") return "/";
  if (pathname === "/es/privacidad") return "/privacy";
  if (pathname === "/es/migracion") return "/immigration";

  const stripped = stripSpanishPrefix(pathname);
  const migracionEn = spanishMigracionToEnglish(stripped);
  if (migracionEn) return migracionEn;

  const mapped = pathEnMap[stripped] ?? stripped;

  if (
    isSupportedLocalizedPath(mapped) ||
    supportedEnglishPaths.has(mapped) ||
    mapped === "/privacy" ||
    mapped === "/immigration" ||
    mapped.startsWith("/immigration/")
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
