type JwtLike = Record<string, unknown>;

function emailFromClaims(claims: JwtLike): string {
  const e = claims.email;
  return typeof e === "string" ? e.trim().toLowerCase() : "";
}

/** Only app_metadata.role — never user_metadata (user-editable). */
function roleFromAppMetadata(claims: JwtLike): string {
  const app = claims.app_metadata;
  if (app && typeof app === "object" && "role" in app) {
    return String((app as { role?: unknown }).role ?? "");
  }
  return "";
}

/** Matches server-side gate; DB RLS uses admin_allowlist + app_metadata.role. */
export function isAppAdmin(claims: JwtLike | null | undefined): boolean {
  if (!claims) return false;
  if (roleFromAppMetadata(claims) === "admin") return true;
  const email = emailFromClaims(claims);
  if (!email) return false;
  const envList =
    process.env.ADMIN_EMAILS?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
  return envList.includes(email);
}
