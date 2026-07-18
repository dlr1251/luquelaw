"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireEntitlement } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function createTicket(formData: FormData) {
  const access = await requireEntitlement("portal_tickets");
  if (!access.ok) redirect("/pricing");
  if (!isSupabaseConfigured()) redirect("/portal/tickets?error=not_configured");

  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim() || "general";
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) redirect("/portal/tickets?error=Missing+fields");

  const supabase = await createClient();
  const { data: ticket, error } = await supabase
    .from("tickets")
    .insert({
      user_id: access.userId,
      subject,
      category,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !ticket) {
    redirect(`/portal/tickets?error=${encodeURIComponent(error?.message ?? "failed")}`);
  }

  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author_id: access.userId,
    body,
    is_staff: false,
  });

  revalidatePath("/portal/tickets");
  redirect(`/portal/tickets?created=1`);
}
