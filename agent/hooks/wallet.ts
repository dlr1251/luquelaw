import { defineHook } from "eve/hooks";

import { computeUsageCents } from "../lib/pricing";
import { createAgentServiceClient, isAgentServiceConfigured } from "../lib/supabase";

/**
 * Debit the user's Torny wallet after each model step.
 * Maps Eve session → lucy_chats.eve_session_id → project owner.
 * Message bodies are persisted by the portal via /api/lucy/persist-turn.
 */
export default defineHook({
  events: {
    async "step.completed"(event, ctx) {
      if (!isAgentServiceConfigured()) return;

      const tokenIn = event.data.usage?.inputTokens ?? 0;
      const tokenOut = event.data.usage?.outputTokens ?? 0;
      if (tokenIn === 0 && tokenOut === 0) return;

      const costCents = computeUsageCents(tokenIn, tokenOut);
      const sessionId = ctx.session.id;
      const supabase = createAgentServiceClient();

      const { data: chat } = await supabase
        .from("lucy_chats")
        .select("id, project_id, lucy_projects!inner(user_id)")
        .eq("eve_session_id", sessionId)
        .maybeSingle();

      if (!chat) {
        console.warn("[torny/wallet] no chat bound to eve session", sessionId);
        return;
      }

      const project = chat.lucy_projects as
        | { user_id: string }
        | { user_id: string }[]
        | null;
      const userId = Array.isArray(project) ? project[0]?.user_id : project?.user_id;
      if (!userId) return;

      const { error: debitErr } = await supabase.rpc("lucy_debit_wallet", {
        p_user_id: userId,
        p_amount_cents: costCents,
        p_ref_type: "eve_step",
        p_ref_id: `${sessionId}:${event.data.turnId}:${event.data.stepIndex}`,
        p_note: `Torny usage (${tokenIn} in / ${tokenOut} out)`,
      });

      if (debitErr) {
        console.warn("[torny/wallet] debit failed", debitErr.message);
      }

      await supabase
        .from("lucy_chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", chat.id);
    },

    async "session.waiting"(event, ctx) {
      if (!isAgentServiceConfigured()) return;
      const token =
        typeof event.data === "object" &&
        event.data &&
        "continuationToken" in event.data
          ? String((event.data as { continuationToken?: string }).continuationToken ?? "")
          : "";
      if (!token) return;

      const supabase = createAgentServiceClient();
      await supabase
        .from("lucy_chats")
        .update({
          eve_continuation_token: token,
          updated_at: new Date().toISOString(),
        })
        .eq("eve_session_id", ctx.session.id);
    },
  },
});
