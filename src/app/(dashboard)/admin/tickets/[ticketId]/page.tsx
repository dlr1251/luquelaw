import Link from "next/link";
import { redirect } from "next/navigation";

import {
  markTicketReadyForPayment,
  saveLawyerDraft,
} from "@/app/(dashboard)/admin/tickets/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { formatUsdCents, getLucyReviewFeeCents } from "@/lib/lucy/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminTicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<{ error?: string; saved?: string; ready?: string }>;
}) {
  const { ticketId } = await params;
  const sp = await searchParams;
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims || !isAppAdmin(claimsData.claims)) {
    redirect("/portal");
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select(
      "id, subject, category, status, kind, review_status, review_fee_cents, ai_summary, lawyer_draft, chat_id, project_id, user_id, created_at",
    )
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket) redirect("/admin/tickets");

  let transcript: Array<{ role: string; content: string }> = [];
  let files: Array<{ file_name: string }> = [];
  let chatMeta: {
    aggressiveness: number;
    technicality: number;
    flexibility: number;
    title: string;
  } | null = null;

  if (ticket.chat_id) {
    const { data: messages } = await supabase
      .from("lucy_messages")
      .select("role, content")
      .eq("chat_id", ticket.chat_id)
      .order("created_at");
    transcript = messages ?? [];

    const { data: chat } = await supabase
      .from("lucy_chats")
      .select("title, aggressiveness, technicality, flexibility")
      .eq("id", ticket.chat_id)
      .maybeSingle();
    chatMeta = chat;
  }

  if (ticket.project_id) {
    const { data: fileRows } = await supabase
      .from("lucy_files")
      .select("file_name")
      .eq("project_id", ticket.project_id);
    files = fileRows ?? [];
  }

  const fee = ticket.review_fee_cents ?? getLucyReviewFeeCents();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link href="/admin/tickets" className="text-sm underline">
        ← Queue
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{ticket.subject}</CardTitle>
          <CardDescription>
            {ticket.kind} · {ticket.status}
            {ticket.review_status ? ` · ${ticket.review_status}` : ""} · fee{" "}
            {formatUsdCents(fee)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {sp.error ? <p className="text-red-700">{sp.error}</p> : null}
          {sp.saved ? <p className="text-green-800">Draft saved.</p> : null}
          {sp.ready ? (
            <p className="text-green-800">Marked ready — client can pay to unlock.</p>
          ) : null}

          <div>
            <p className="font-medium">AI summary</p>
            <pre className="mt-1 whitespace-pre-wrap rounded border bg-muted/20 p-3 text-xs">
              {ticket.ai_summary || "(none)"}
            </pre>
          </div>

          {chatMeta ? (
            <p className="text-xs text-muted-foreground">
              Chat “{chatMeta.title}” · aggressiveness {chatMeta.aggressiveness} ·
              technicality {chatMeta.technicality} · flexibility {chatMeta.flexibility}
            </p>
          ) : null}

          <div>
            <p className="font-medium">Files</p>
            <ul className="mt-1 list-inside list-disc text-xs">
              {!files.length ? <li>(none)</li> : files.map((f) => <li key={f.file_name}>{f.file_name}</li>)}
            </ul>
          </div>

          <div>
            <p className="font-medium">Transcript</p>
            <div className="mt-1 max-h-80 space-y-2 overflow-y-auto rounded border p-3 text-xs">
              {!transcript.length ? (
                <p className="text-muted-foreground">(empty)</p>
              ) : (
                transcript.map((m, i) => (
                  <div key={`${m.role}-${i}`}>
                    <p className="font-medium capitalize">{m.role}</p>
                    <p className="whitespace-pre-wrap text-muted-foreground">{m.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {ticket.kind === "consultation" ? (
            <>
              <form action={saveLawyerDraft} className="space-y-2">
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <label className="block space-y-1 font-medium">
                  Verified lawyer response
                  <textarea
                    name="lawyer_draft"
                    required
                    rows={10}
                    defaultValue={ticket.lawyer_draft ?? ""}
                    className="w-full rounded border px-3 py-2 font-normal"
                    placeholder="Write the verified answer the client will unlock…"
                  />
                </label>
                <button type="submit" className="rounded border px-3 py-1.5 text-sm">
                  Save draft
                </button>
              </form>

              {ticket.review_status === "pending_lawyer" ||
              ticket.review_status === "ready_for_payment" ? (
                <form action={markTicketReadyForPayment}>
                  <input type="hidden" name="ticket_id" value={ticket.id} />
                  <button type="submit" className="btn-primary text-sm">
                    Mark ready for payment ({formatUsdCents(fee)})
                  </button>
                </form>
              ) : null}

              {ticket.review_status === "unlocked" ? (
                <p className="text-sm text-green-800">Client has unlocked this review.</p>
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
