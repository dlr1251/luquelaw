import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isServiceRoleConfigured } from "@/lib/supabase/service";

export type CmsAdminSession = {
  userId: string;
  email: string;
};

export async function getCmsAdminSession(): Promise<CmsAdminSession | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) return null;
  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const email = typeof data.claims.email === "string" ? data.claims.email.trim().toLowerCase() : "";
  if (!userId) return null;
  return { userId, email };
}

export function envAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function serviceRoleReady(): boolean {
  return isServiceRoleConfigured();
}
