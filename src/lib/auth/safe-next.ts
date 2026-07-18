/** Safe internal redirect path (blocks open redirects). */
export function safeNextPath(
  raw: string | null | undefined,
  fallback = "/portal",
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

/** Build /login?next=… when the destination is not the default portal. */
export function loginHref(next?: string | null): string {
  const path = safeNextPath(next, "/portal");
  if (path === "/portal") return "/login";
  return `/login?next=${encodeURIComponent(path)}`;
}
