type JwtLike = Record<string, unknown>;

function emailFromClaims(claims: JwtLike): string {
  const e = claims.email;
  return typeof e === "string" ? e.trim().toLowerCase() : "";
}

function roleFromClaims(claims: JwtLike): string {
  const app = claims.app_metadata;
  const user = claims.user_metadata;
  const fromApp =
    app && typeof app === "object" && "role" in app ? String((app as { role?: unknown }).role ?? "") : "";
  const fromUser =
    user && typeof user === "object" && "role" in user
      ? String((user as { role?: unknown }).role ?? "")
      : "";
  return fromApp || fromUser;
}

/** Matches server-side gate; DB RLS uses admin_allowlist + app_metadata.role (see supabase migration). */
export function isAppAdmin(claims: JwtLike | null | undefined): boolean {
  if (!claims) return false;
  if (roleFromClaims(claims) === "admin") return true;
  const email = emailFromClaims(claims);
  if (!email) return false;
  const envList =
    process.env.ADMIN_EMAILS?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
  return envList.includes(email);
}
