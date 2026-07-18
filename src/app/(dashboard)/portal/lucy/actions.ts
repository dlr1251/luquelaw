"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { sendLucyEscalateEmail } from "@/lib/lucy/email";
import { getLucyReviewFeeCents } from "@/lib/lucy/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function createLucyProject(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  if (!isSupabaseConfigured()) redirect("/portal/lucy?error=not_configured");

  const title = String(formData.get("title") ?? "").trim() || "Untitled project";
  const locale = formData.get("locale") === "es" ? "es" : "en";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lucy_projects")
    .insert({ user_id: userId, title, locale })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/portal/lucy?error=${encodeURIComponent(error?.message ?? "failed")}`);
  }

  const { data: chat } = await supabase
    .from("lucy_chats")
    .insert({ project_id: data.id, title: "New chat" })
    .select("id")
    .single();

  revalidatePath("/portal/lucy");
  if (chat) {
    redirect(`/portal/lucy/${data.id}/${chat.id}`);
  }
  redirect(`/portal/lucy/${data.id}`);
}

export async function createLucyChat(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "").trim();
  if (!projectId) redirect("/portal/lucy");

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("lucy_projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!project) redirect("/portal/lucy");

  const { data: chat, error } = await supabase
    .from("lucy_chats")
    .insert({ project_id: projectId, title: "New chat" })
    .select("id")
    .single();

  if (error || !chat) {
    redirect(`/portal/lucy/${projectId}?error=${encodeURIComponent(error?.message ?? "failed")}`);
  }

  revalidatePath(`/portal/lucy/${projectId}`);
  redirect(`/portal/lucy/${projectId}/${chat.id}`);
}

export async function updateLucyChatPersonality(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const chatId = String(formData.get("chat_id") ?? "").trim();
  const projectId = String(formData.get("project_id") ?? "").trim();
  const aggressiveness = Number(formData.get("aggressiveness") ?? 40);
  const technicality = Number(formData.get("technicality") ?? 50);
  const flexibility = Number(formData.get("flexibility") ?? 50);

  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("lucy_chats")
    .select("id, project_id, lucy_projects!inner(user_id)")
    .eq("id", chatId)
    .maybeSingle();

  const project = chat?.lucy_projects as
    | { user_id: string }
    | { user_id: string }[]
    | null
    | undefined;
  const owner = Array.isArray(project) ? project[0]?.user_id : project?.user_id;
  if (!chat || owner !== userId) redirect("/portal/lucy");

  await supabase
    .from("lucy_chats")
    .update({
      aggressiveness: clampDial(aggressiveness),
      technicality: clampDial(technicality),
      flexibility: clampDial(flexibility),
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  revalidatePath(`/portal/lucy/${projectId}/${chatId}`);
  redirect(`/portal/lucy/${projectId}/${chatId}`);
}

function clampDial(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export async function uploadLucyFile(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "").trim();
  const chatId = String(formData.get("chat_id") ?? "").trim() || null;
  const file = formData.get("file");

  if (!projectId || !(file instanceof File) || file.size === 0) {
    redirect(`/portal/lucy/${projectId}?error=file_required`);
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("lucy_projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!project) redirect("/portal/lucy");

  const safeName = file.name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
  const storagePath = `${userId}/${projectId}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("lucy-files")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    redirect(
      `/portal/lucy/${projectId}${chatId ? `/${chatId}` : ""}?error=${encodeURIComponent(uploadError.message)}`,
    );
  }

  await supabase.from("lucy_files").insert({
    project_id: projectId,
    chat_id: chatId,
    storage_path: storagePath,
    file_name: file.name,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
  });

  revalidatePath(`/portal/lucy/${projectId}`);
  redirect(`/portal/lucy/${projectId}${chatId ? `/${chatId}` : ""}`);
}

export async function escalateLucyChat(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const chatId = String(formData.get("chat_id") ?? "").trim();
  const projectId = String(formData.get("project_id") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!chatId || !projectId) redirect("/portal/lucy");

  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("lucy_chats")
    .select(
      "id, title, aggressiveness, technicality, flexibility, project_id, lucy_projects!inner(id, title, user_id, locale)",
    )
    .eq("id", chatId)
    .maybeSingle();

  const project = chat?.lucy_projects as
    | { id: string; title: string; user_id: string; locale: string }
    | { id: string; title: string; user_id: string; locale: string }[]
    | null
    | undefined;
  const projectRow = Array.isArray(project) ? project[0] : project;
  if (!chat || !projectRow || projectRow.user_id !== userId) {
    redirect("/portal/lucy");
  }

  const { data: messages } = await supabase
    .from("lucy_messages")
    .select("role, content, created_at")
    .eq("chat_id", chatId)
    .order("created_at");

  const { data: files } = await supabase
    .from("lucy_files")
    .select("file_name")
    .eq("project_id", projectId);

  const transcript = (messages ?? [])
    .map((m) => `[${m.role}] ${m.content}`)
    .join("\n\n");

  const lastAssistant = [...(messages ?? [])].reverse().find((m) => m.role === "assistant");
  const aiSummary =
    note ||
    lastAssistant?.content.slice(0, 2000) ||
    "Client requested lawyer review of this Lucy conversation.";

  const subject = `Lucy review: ${chat.title}`.slice(0, 200);

  const { data: ticket, error } = await supabase
    .from("tickets")
    .insert({
      user_id: userId,
      subject,
      category: "consultation",
      kind: "consultation",
      status: "open",
      chat_id: chatId,
      project_id: projectId,
      ai_summary: aiSummary,
      review_status: "pending_lawyer",
      review_fee_cents: getLucyReviewFeeCents(),
    })
    .select("id")
    .single();

  if (error || !ticket) {
    redirect(
      `/portal/lucy/${projectId}/${chatId}?error=${encodeURIComponent(error?.message ?? "escalate_failed")}`,
    );
  }

  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author_id: userId,
    body: `${aiSummary}\n\n---\nTranscript attached in admin / email.`,
    is_staff: false,
  });

  const { data: claims } = await supabase.auth.getClaims();
  const userEmail =
    typeof claims?.claims?.email === "string" ? claims.claims.email : "unknown@user";

  await sendLucyEscalateEmail({
    ticketId: ticket.id,
    userEmail,
    subject,
    aiSummary,
    transcript: transcript.slice(0, 50000),
    fileNames: (files ?? []).map((f) => f.file_name),
    personality: {
      aggressiveness: chat.aggressiveness,
      technicality: chat.technicality,
      flexibility: chat.flexibility,
    },
    projectTitle: projectRow.title,
    chatTitle: chat.title,
  });

  revalidatePath("/portal/tickets");
  revalidatePath("/admin/tickets");
  redirect(`/portal/tickets?escalated=1&ticket=${ticket.id}`);
}
