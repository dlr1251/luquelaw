"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function createChatMessage(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  if (!isSupabaseConfigured()) redirect("/portal/chat?error=not_configured");

  const content = String(formData.get("content") ?? "").trim();
  if (!content) redirect("/portal/chat?error=Empty+message");

  const supabase = await createClient();
  let conversationId = String(formData.get("conversation_id") ?? "").trim();

  if (!conversationId) {
    const { data: conv, error } = await supabase
      .from("chat_conversations")
      .insert({
        user_id: userId,
        title: content.slice(0, 60),
        locale: "en",
      })
      .select("id")
      .single();
    if (error || !conv) {
      redirect(`/portal/chat?error=${encodeURIComponent(error?.message ?? "failed")}`);
    }
    conversationId = conv.id;
  }

  await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content,
  });

  // Placeholder assistant reply until RAG is wired
  await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content:
      "Thanks for your message. This chat guide is a shell—full RAG over CLKR and norms is coming next. This is not legal advice. For a fact-specific matter, book a consultation or open a portal ticket.",
  });

  revalidatePath("/portal/chat");
  redirect(`/portal/chat?c=${conversationId}`);
}
