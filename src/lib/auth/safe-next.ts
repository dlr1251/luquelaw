export type AuthLocale = "en" | "es";

/** Safe internal redirect path (blocks open redirects). */
export function safeNextPath(
  raw: string | null | undefined,
  fallback = "/portal/lucy",
): string {
  if (!raw) return fallback;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return fallback;
  }
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.includes("://") ||
    decoded.includes("\\")
  ) {
    return fallback;
  }
  return decoded;
}

export function authLocaleFromPath(path: string): AuthLocale {
  return path === "/es" || path.startsWith("/es/") ? "es" : "en";
}

export function loginBasePath(locale: AuthLocale = "en"): string {
  return locale === "es" ? "/es/login" : "/login";
}

/** Build /login or /es/login, with ?next= when the destination is not the default portal. */
export function loginHref(next?: string | null, locale?: AuthLocale): string {
  const path = safeNextPath(next, "/portal/lucy");
  const loc = locale ?? authLocaleFromPath(path);
  const base = loginBasePath(loc);
  if (path === "/portal/lucy") return base;
  return `${base}?next=${encodeURIComponent(path)}`;
}
