import type { SupabaseClient } from "@supabase/supabase-js";

import { ACTIVE_SUB_STATUSES } from "@/lib/billing/types";

/**
 * Update display flag is_subscriber from active subscriptions.
 * Does not touch is_student / is_client (admin beta grants only).
 * Entitlements come from the subscriptions table + those beta flags.
 */
export async function syncProfileFlagsFromSubscriptions(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId);

  const is_subscriber = (subs ?? []).some((row) => ACTIVE_SUB_STATUSES.has(row.status));

  await supabase.from("profiles").update({ is_subscriber }).eq("id", userId);
}
