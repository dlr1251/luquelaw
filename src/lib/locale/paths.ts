import type { SiteLocale } from "@/lib/locale/constants";

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
  "/clkr/quizzes",
  "/posts",
]);

const localizedPrefixes = ["/clkr/", "/posts/"];

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

export function toSpanishPath(pathname: string): string {
  const englishPath = stripSpanishPrefix(pathname);

  if (pathEsMap[englishPath]) return pathEsMap[englishPath];
  if (isSupportedLocalizedPath(englishPath)) {
    return `/es${englishPath}`;
  }
  if (!supportedEnglishPaths.has(englishPath)) return "/es";
  return englishPath === "/" ? "/es" : `/es${englishPath}`;
}

export function toEnglishPath(pathname: string): string {
  if (pathname === "/es") return "/";
  if (pathname === "/es/privacidad") return "/privacy";
  if (pathname === "/es/migracion") return "/immigration";

  const stripped = stripSpanishPrefix(pathname);
  const mapped = pathEnMap[stripped] ?? stripped;

  if (
    isSupportedLocalizedPath(mapped) ||
    supportedEnglishPaths.has(mapped) ||
    mapped === "/privacy" ||
    mapped === "/immigration"
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
