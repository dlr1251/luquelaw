import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service";

export async function ensureLucyWallet(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lucy_wallets")
    .select("balance_cents")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data.balance_cents;

  const { error } = await supabase.from("lucy_wallets").insert({
    user_id: userId,
    balance_cents: 0,
  });

  if (error && !error.message.includes("duplicate")) {
    console.error("ensureLucyWallet", error.message);
  }
  return 0;
}

export async function getLucyBalance(userId: string): Promise<number> {
  return ensureLucyWallet(userId);
}

export async function debitLucyWallet(
  userId: string,
  amountCents: number,
  refType?: string,
  refId?: string,
  note?: string,
): Promise<{ ok: true; balance: number } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("lucy_debit_wallet", {
    p_user_id: userId,
    p_amount_cents: amountCents,
    p_ref_type: refType ?? null,
    p_ref_id: refId ?? null,
    p_note: note ?? null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, balance: Number(data) };
}

/** Service-role credit (Stripe webhooks). */
export async function creditLucyWalletService(
  userId: string,
  amountCents: number,
  kind: "topup" | "review_payment" | "adjustment" = "topup",
  refType?: string,
  refId?: string,
  note?: string,
): Promise<{ ok: true; balance: number } | { ok: false; error: string }> {
  if (!isServiceRoleConfigured()) return { ok: false, error: "service_role_missing" };
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("lucy_credit_wallet", {
    p_user_id: userId,
    p_amount_cents: amountCents,
    p_kind: kind,
    p_ref_type: refType ?? null,
    p_ref_id: refId ?? null,
    p_note: note ?? null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, balance: Number(data) };
}
