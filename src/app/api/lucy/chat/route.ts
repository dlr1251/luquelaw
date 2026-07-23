import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { buildLucySystemPrompt } from "@/lib/lucy/prompt";
import { computeLucyUsageCents, getLucyMinBalanceCents } from "@/lib/lucy/pricing";
import { createLucyTools, getLucyModel } from "@/lib/lucy/tools";
import { debitLucyWallet, getLucyBalance } from "@/lib/lucy/wallet";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  chatId: string;
  messages: UIMessage[];
};

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ error: "Not configured" }), { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const chatId = String(body.chatId ?? "").trim();
  if (!chatId || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: "chatId and messages required" }), {
      status: 400,
    });
  }

  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("lucy_chats")
    .select(
      "id, title, aggressiveness, technicality, flexibility, project_id, lucy_projects!inner(id, user_id, locale)",
    )
    .eq("id", chatId)
    .maybeSingle();

  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
  }

  const project = chat.lucy_projects as
    | { id: string; user_id: string; locale: string }
    | { id: string; user_id: string; locale: string }[]
    | null;
  const projectRow = Array.isArray(project) ? project[0] : project;
  if (!projectRow || projectRow.user_id !== userId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const balance = await getLucyBalance(userId);
  const minBalance = getLucyMinBalanceCents();
  if (balance < minBalance) {
    return new Response(
      JSON.stringify({
        error: "insufficient_balance",
        balance,
        minBalance,
      }),
      { status: 402 },
    );
  }

  const { data: files } = await supabase
    .from("lucy_files")
    .select("file_name")
    .eq("project_id", projectRow.id)
    .limit(30);

  const locale = projectRow.locale === "es" ? "es" : "en";
  const system = await buildLucySystemPrompt(
    {
      aggressiveness: chat.aggressiveness,
      technicality: chat.technicality,
      flexibility: chat.flexibility,
    },
    {
      locale,
      fileNames: (files ?? []).map((f) => f.file_name),
    },
  );

  // Persist the latest user message if not already stored (client may send full history)
  const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    const text = extractText(lastUser);
    if (text) {
      const { data: recent } = await supabase
        .from("lucy_messages")
        .select("id, content, role")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!(recent?.role === "user" && recent.content === text)) {
        await supabase.from("lucy_messages").insert({
          chat_id: chatId,
          role: "user",
          content: text,
        });

        if (chat.title === "New chat" || chat.title === "New conversation") {
          await supabase
            .from("lucy_chats")
            .update({ title: text.slice(0, 60), updated_at: new Date().toISOString() })
            .eq("id", chatId);
        }
      }
    }
  }

  const modelMessages = await convertToModelMessages(body.messages);

  const result = streamText({
    model: getLucyModel(),
    system,
    messages: modelMessages,
    tools: createLucyTools(locale),
    onFinish: async ({ text, usage }) => {
      const tokenIn = usage?.inputTokens ?? 0;
      const tokenOut = usage?.outputTokens ?? 0;
      const costCents = computeLucyUsageCents(tokenIn, tokenOut);

      const { data: msg } = await supabase
        .from("lucy_messages")
        .insert({
          chat_id: chatId,
          role: "assistant",
          content: text || "(empty response)",
          token_in: tokenIn,
          token_out: tokenOut,
          cost_cents: costCents,
        })
        .select("id")
        .single();

      await debitLucyWallet(
        userId,
        costCents,
        "lucy_message",
        msg?.id ?? chatId,
        `Torny chat usage (${tokenIn} in / ${tokenOut} out)`,
      );

      await supabase
        .from("lucy_chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", chatId);
    },
  });

  return result.toUIMessageStreamResponse();
}

function extractText(message: UIMessage): string {
  if (!message.parts?.length) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")
    .trim();
}
