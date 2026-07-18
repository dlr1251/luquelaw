import { NextResponse } from "next/server";

import { resolveStripePriceId } from "@/lib/billing/plans";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/billing/stripe";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = String(claimsData.claims.sub);
  const email = typeof claimsData.claims.email === "string" ? claimsData.claims.email : undefined;

  const body = (await request.json().catch(() => null)) as { planId?: string } | null;
  if (!body?.planId) {
    return NextResponse.json({ error: "planId required" }, { status: 400 });
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("id, slug, stripe_price_id")
    .eq("id", body.planId)
    .maybeSingle();

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const priceId = resolveStripePriceId(plan.slug, plan.stripe_price_id);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Plan has no Stripe price. Set stripe_price_id in plans or STRIPE_PRICE_* env vars.",
      },
      { status: 400 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId },
    });
    customerId = customer.id;
    await supabase.from("profiles").upsert({
      id: userId,
      stripe_customer_id: customerId,
    });
  }

  const site = getSiteUrl();
  const meta = {
    supabase_user_id: userId,
    plan_id: plan.id,
    plan_slug: plan.slug,
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${site}/portal?checkout=success`,
    cancel_url: `${site}/pricing?checkout=cancel`,
    metadata: meta,
    subscription_data: {
      metadata: meta,
    },
  });

  return NextResponse.json({ url: session.url });
}
