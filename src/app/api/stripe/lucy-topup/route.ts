import { NextResponse } from "next/server";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyTopupPack } from "@/lib/lucy/pricing";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/billing/stripe";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  let packId = "pack_25";
  try {
    const body = (await request.json()) as { packId?: string };
    if (body.packId) packId = body.packId;
  } catch {
    /* default pack */
  }

  const pack = getLucyTopupPack(packId);
  if (!pack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const { data: claims } = await supabase.auth.getClaims();
    const email = typeof claims?.claims?.email === "string" ? claims.claims.email : undefined;
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      metadata: { supabase_user_id: userId },
    });
    customerId = customer.id;
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);
  }

  const site = getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pack.amountCents,
          product_data: {
            name: `Lucy credits — ${pack.label}`,
            description: "Prepaid wallet credit for Lucy legal consultations",
          },
        },
      },
    ],
    success_url: `${site}/portal/lucy?topup=success`,
    cancel_url: `${site}/portal/lucy?topup=cancel`,
    metadata: {
      supabase_user_id: userId,
      lucy_kind: "topup",
      pack_id: pack.id,
      amount_cents: String(pack.amountCents),
    },
  });

  return NextResponse.json({ url: session.url });
}
