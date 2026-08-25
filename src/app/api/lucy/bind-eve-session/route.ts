import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyMinBalanceCents } from "@/lib/lucy/pricing";
import { getLucyBalance } from "@/lib/lucy/wallet";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  chatId: string;
  sessionId: string;
  continuationToken?: string;
  streamIndex?: number;
};

/** Bind an Eve session to a portal chat (owner-only). */
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
  const sessionId = String(body.sessionId ?? "").trim();
  if (!chatId || !sessionId) {
    return Response.json({ error: "chatId and sessionId required" }, { status: 400 });
  }

  const balance = await getLucyBalance(userId);
  if (balance < getLucyMinBalanceCents()) {
    return Response.json(
      { error: "insufficient_balance", balance, minBalance: getLucyMinBalanceCents() },
      { status: 402 },
    );
  }

  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("lucy_chats")
    .select("id, project_id, lucy_projects!inner(user_id)")
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

  const { error } = await supabase
    .from("lucy_chats")
    .update({
      eve_session_id: sessionId,
      eve_continuation_token: body.continuationToken ?? null,
      eve_stream_index: body.streamIndex ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
