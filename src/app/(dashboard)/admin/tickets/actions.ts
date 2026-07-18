"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { getLucyReviewFeeCents } from "@/lib/lucy/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/portal");
  }
  return supabase;
}

export async function saveLawyerDraft(formData: FormData) {
  const supabase = await requireAdmin();
  const ticketId = String(formData.get("ticket_id") ?? "").trim();
  const lawyerDraft = String(formData.get("lawyer_draft") ?? "").trim();
  if (!ticketId || !lawyerDraft) {
    redirect(`/admin/tickets/${ticketId || ""}?error=missing`);
  }

  await supabase
    .from("tickets")
    .update({
      lawyer_draft: lawyerDraft,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId)
    .eq("kind", "consultation");

  revalidatePath(`/admin/tickets/${ticketId}`);
  redirect(`/admin/tickets/${ticketId}?saved=1`);
}

export async function markTicketReadyForPayment(formData: FormData) {
  const supabase = await requireAdmin();
  const ticketId = String(formData.get("ticket_id") ?? "").trim();
  if (!ticketId) redirect("/admin/tickets");

  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, lawyer_draft, review_fee_cents")
    .eq("id", ticketId)
    .eq("kind", "consultation")
    .maybeSingle();

  if (!ticket?.lawyer_draft?.trim()) {
    redirect(`/admin/tickets/${ticketId}?error=draft_required`);
  }

  await supabase
    .from("tickets")
    .update({
      review_status: "ready_for_payment",
      review_fee_cents: ticket.review_fee_cents ?? getLucyReviewFeeCents(),
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/portal/tickets");
  redirect(`/admin/tickets/${ticketId}?ready=1`);
}
