import { NextResponse } from "next/server";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyReviewFeeCents } from "@/lib/lucy/pricing";
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

  let ticketId = "";
  try {
    const body = (await request.json()) as { ticketId?: string };
    ticketId = String(body.ticketId ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!ticketId) {
    return NextResponse.json({ error: "ticketId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, user_id, kind, review_status, review_fee_cents, subject")
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket || ticket.user_id !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (ticket.kind !== "consultation" || ticket.review_status !== "ready_for_payment") {
    return NextResponse.json({ error: "Ticket not ready for payment" }, { status: 400 });
  }

  const feeCents = ticket.review_fee_cents ?? getLucyReviewFeeCents();

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
          unit_amount: feeCents,
          product_data: {
            name: "Torny lawyer review — unlock",
            description: ticket.subject.slice(0, 200),
          },
        },
      },
    ],
    success_url: `${site}/portal/tickets?unlock=success&ticket=${ticketId}`,
    cancel_url: `${site}/portal/tickets?unlock=cancel&ticket=${ticketId}`,
    metadata: {
      supabase_user_id: userId,
      lucy_kind: "review_unlock",
      ticket_id: ticketId,
      amount_cents: String(feeCents),
    },
  });

  await supabase
    .from("tickets")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", ticketId);

  return NextResponse.json({ url: session.url });
}
