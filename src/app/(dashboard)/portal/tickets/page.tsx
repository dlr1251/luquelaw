import Link from "next/link";
import { redirect } from "next/navigation";

import { createTicket } from "@/app/(dashboard)/portal/tickets/actions";
import { UnlockReviewButton } from "@/components/lucy/unlock-review-button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId, hasEntitlement } from "@/lib/billing/entitlements";
import { getLucyReviewFeeCents } from "@/lib/lucy/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type TicketRow = {
  id: string;
  subject: string;
  status: string;
  kind: string | null;
  review_status: string | null;
  review_fee_cents: number | null;
  lawyer_draft: string | null;
  created_at: string;
};

export default async function PortalTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    created?: string;
    escalated?: string;
    unlock?: string;
    ticket?: string;
  }>;
}) {
  const sp = await searchParams;
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const canCreate = await hasEntitlement("portal_tickets", userId);

  let tickets: TicketRow[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tickets")
      .select(
        "id, subject, status, kind, review_status, review_fee_cents, lawyer_draft, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    tickets = (data as TicketRow[] | null) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {sp.escalated ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          Torny consultation sent to the firm. We&apos;ll notify you here when the verified answer is
          ready to unlock.
        </p>
      ) : null}
      {sp.unlock === "success" ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          Payment received — your verified review is unlocked below.
        </p>
      ) : null}

      {canCreate ? (
        <Card>
          <CardHeader>
            <CardTitle>New ticket</CardTitle>
            <CardDescription>
              Lightweight request to the firm—not an expediente. For Torny lawyer reviews, escalate
              from a chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sp.error ? <p className="mb-3 text-sm text-red-700">{sp.error}</p> : null}
            {sp.created ? <p className="mb-3 text-sm text-green-700">Ticket created.</p> : null}
            <form action={createTicket} className="space-y-3">
              <input
                name="subject"
                required
                placeholder="Subject"
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <select
                name="category"
                className="w-full rounded border px-3 py-2 text-sm"
                defaultValue="general"
              >
                <option value="general">General</option>
                <option value="immigration">Immigration</option>
                <option value="real_estate">Real estate</option>
                <option value="billing">Billing</option>
              </select>
              <textarea
                name="body"
                required
                placeholder="Describe your request"
                rows={5}
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <button type="submit" className="btn-primary">
                Submit ticket
              </button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>General tickets</CardTitle>
            <CardDescription>
              Client plan unlocks general firm tickets. Torny consultations appear below when you
              escalate from a chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonLink href="/pricing">View plans</ButtonLink>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="space-y-2 border-b py-3 text-sm">
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {t.kind === "consultation" ? "Torny · " : ""}
                  {t.status}
                  {t.review_status ? ` · ${t.review_status}` : ""} ·{" "}
                  {new Date(t.created_at).toLocaleString()}
                </p>

                {t.kind === "consultation" && t.review_status === "ready_for_payment" ? (
                  <UnlockReviewButton
                    ticketId={t.id}
                    feeCents={t.review_fee_cents ?? getLucyReviewFeeCents()}
                  />
                ) : null}

                {t.kind === "consultation" &&
                t.review_status === "unlocked" &&
                t.lawyer_draft ? (
                  <div className="rounded border bg-muted/20 p-3">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Verified lawyer response
                    </p>
                    <p className="whitespace-pre-wrap text-sm">{t.lawyer_draft}</p>
                  </div>
                ) : null}

                {t.kind === "consultation" && t.review_status === "pending_lawyer" ? (
                  <p className="text-xs text-muted-foreground">
                    Waiting for lawyer review. You&apos;ll unlock the answer when it&apos;s ready.
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 text-sm">
        <Link href="/portal/lucy" className="underline">
          Torny
        </Link>
        <Link href="/portal" className="underline">
          ← Portal overview
        </Link>
      </div>
    </div>
  );
}
