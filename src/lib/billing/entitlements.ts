import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAppAdmin } from "@/lib/auth/is-admin";
import {
  ACTIVE_SUB_STATUSES,
  PLAN_FEATURES,
  type EntitlementFeature,
  type PlanSlug,
} from "@/lib/billing/types";

export async function getSessionUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return String(data.claims.sub);
}

/**
 * Feature access via admin bypass, admin-granted beta flags, or active Stripe plans.
 * Beta flags align with PLAN_FEATURES (is_student ≈ student plan; is_client ≈ client plan).
 * is_subscriber is display-only and does not grant features.
 */
export async function hasEntitlement(
  feature: EntitlementFeature,
  userId?: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (claimsData?.claims && isAppAdmin(claimsData.claims)) {
    return true;
  }

  const uid = userId ?? (claimsData?.claims?.sub ? String(claimsData.claims.sub) : null);
  if (!uid) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_student, is_client")
    .eq("id", uid)
    .maybeSingle();

  // Admin-granted beta flags (users cannot self-set after profiles trigger)
  if (feature === "quizzes" && profile?.is_student) return true;
  if (feature === "portal_tickets" && profile?.is_client) return true;
  if (
    (feature === "agents" || feature === "norm_annotations") &&
    profile?.is_student
  ) {
    return true;
  }

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("status, plans(slug, features)")
    .eq("user_id", uid);

  if (!subs?.length) return false;

  for (const row of subs) {
    if (!ACTIVE_SUB_STATUSES.has(row.status)) continue;
    const plan = row.plans as
      | { slug: string; features: string[] | null }
      | { slug: string; features: string[] | null }[]
      | null;
    const planRow = Array.isArray(plan) ? plan[0] : plan;
    if (!planRow) continue;

    const features =
      planRow.features?.length
        ? planRow.features
        : PLAN_FEATURES[planRow.slug as PlanSlug] ?? [];

    if (features.includes(feature)) return true;
  }

  return false;
}

export async function requireEntitlement(
  feature: EntitlementFeature,
): Promise<{ ok: true; userId: string } | { ok: false; reason: "auth" | "entitlement" }> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, reason: "auth" };
  const allowed = await hasEntitlement(feature, userId);
  if (!allowed) return { ok: false, reason: "entitlement" };
  return { ok: true, userId };
}
