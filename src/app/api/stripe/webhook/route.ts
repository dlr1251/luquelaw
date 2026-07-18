import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { syncProfileFlagsFromSubscriptions } from "@/lib/billing/profile-flags";
import { getStripe, isStripeConfigured } from "@/lib/billing/stripe";
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service";

export const runtime = "nodejs";

async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  userId: string,
  planId: string,
) {
  if (!isServiceRoleConfigured()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required to persist subscriptions");
  }
  const supabase = createServiceClient();
  const status = subscription.status;
  const periodEnd = subscription.items.data[0]?.current_period_end
    ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
    : null;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      stripe_subscription_id: subscription.id,
      status,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,plan_id" },
  );

  await syncProfileFlagsFromSubscriptions(supabase, userId);
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (!isServiceRoleConfigured()) {
    console.error("Stripe webhook: SUPABASE_SERVICE_ROLE_KEY missing — refusing to ack");
    return NextResponse.json(
      { error: "Server misconfigured: service role required" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const lucyKind = session.metadata?.lucy_kind;

      if (lucyKind === "topup" && userId) {
        const amountCents = Number(session.metadata?.amount_cents ?? "0");
        if (amountCents > 0) {
          const { creditLucyWalletService } = await import("@/lib/lucy/wallet");
          const result = await creditLucyWalletService(
            userId,
            amountCents,
            "topup",
            "stripe_checkout",
            session.id,
            `Lucy top-up pack ${session.metadata?.pack_id ?? ""}`,
          );
          if (!result.ok) {
            throw new Error(`Lucy top-up credit failed: ${result.error}`);
          }
        }
      } else if (lucyKind === "review_unlock" && userId) {
        const ticketId = session.metadata?.ticket_id;
        if (ticketId) {
          const supabase = createServiceClient();
          const { data: ticket } = await supabase
            .from("tickets")
            .select("id, review_status, lawyer_draft")
            .eq("id", ticketId)
            .eq("user_id", userId)
            .maybeSingle();

          if (ticket && ticket.review_status === "ready_for_payment") {
            await supabase
              .from("tickets")
              .update({
                review_status: "unlocked",
                status: "pending",
                updated_at: new Date().toISOString(),
              })
              .eq("id", ticketId);

            const amountCents = Number(session.metadata?.amount_cents ?? "0");
            if (amountCents > 0) {
              const { data: wallet } = await supabase
                .from("lucy_wallets")
                .select("balance_cents")
                .eq("user_id", userId)
                .maybeSingle();
              await supabase.from("lucy_wallet_ledger").insert({
                user_id: userId,
                kind: "review_payment",
                amount_cents: -amountCents,
                balance_after_cents: wallet?.balance_cents ?? 0,
                ref_type: "ticket",
                ref_id: ticketId,
                note: `Lawyer review unlock — ${session.id}`,
              });
            }
          }
        }
      } else {
        const planId = session.metadata?.plan_id;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (userId && planId && subId) {
          const subscription = await stripe.subscriptions.retrieve(subId);
          await upsertSubscriptionFromStripe(subscription, userId, planId);
        }
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      let userId = subscription.metadata?.supabase_user_id;
      let planId = subscription.metadata?.plan_id;

      const supabase = createServiceClient();

      if (!userId || !planId) {
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("user_id, plan_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();
        if (existing) {
          userId = userId ?? existing.user_id;
          planId = planId ?? existing.plan_id;
        }
      }

      if (userId && planId) {
        await upsertSubscriptionFromStripe(subscription, userId, planId);
      } else {
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status === "canceled" ? "canceled" : subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        const { data: row } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();
        if (row?.user_id) {
          await syncProfileFlagsFromSubscriptions(supabase, row.user_id);
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("Stripe webhook handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
