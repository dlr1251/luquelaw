import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  chatId: string;
  userText?: string;
  assistantText?: string;
  tokenIn?: number;
  tokenOut?: number;
  costCents?: number;
};

/** Persist a completed Torny turn into lucy_messages (owner-only). */
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const chatId = String(body.chatId ?? "").trim();
  if (!chatId) {
    return Response.json({ error: "chatId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("lucy_chats")
    .select("id, title, project_id, lucy_projects!inner(user_id)")
    .eq("id", chatId)
    .maybeSingle();

  if (!chat) {
    return Response.json({ error: "Chat not found" }, { status: 404 });
  }

  const project = chat.lucy_projects as
    | { user_id: string }
    | { user_id: string }[]
    | null;
  const owner = Array.isArray(project) ? project[0]?.user_id : project?.user_id;
  if (owner !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const userText = String(body.userText ?? "").trim();
  const assistantText = String(body.assistantText ?? "").trim();

  if (userText) {
    const { data: recent } = await supabase
      .from("lucy_messages")
      .select("id, content, role")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!(recent?.role === "user" && recent.content === userText)) {
      await supabase.from("lucy_messages").insert({
        chat_id: chatId,
        role: "user",
        content: userText,
      });

      if (chat.title === "New chat" || chat.title === "New conversation") {
        await supabase
          .from("lucy_chats")
          .update({ title: userText.slice(0, 60), updated_at: new Date().toISOString() })
          .eq("id", chatId);
      }
    }
  }

  if (assistantText) {
    await supabase.from("lucy_messages").insert({
      chat_id: chatId,
      role: "assistant",
      content: assistantText,
      token_in: body.tokenIn ?? 0,
      token_out: body.tokenOut ?? 0,
      cost_cents: body.costCents ?? 0,
    });
  }

  await supabase
    .from("lucy_chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  return Response.json({ ok: true });
}
