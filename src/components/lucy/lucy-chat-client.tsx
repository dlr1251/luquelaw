"use client";

import { useEveAgent } from "eve/react";
import { useEffect, useRef, useState } from "react";

import { formatUsdCents } from "@/lib/lucy/pricing";

type InitialMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  cost_cents?: number;
};

type EveCursor = {
  sessionId?: string;
  continuationToken?: string;
  streamIndex: number;
};

export function LucyChatClient({
  chatId,
  projectId,
  locale,
  initialMessages,
  balanceCents,
  sessionSpendCents,
  initialEveSession,
}: {
  chatId: string;
  projectId: string;
  locale: "en" | "es";
  initialMessages: InitialMessage[];
  balanceCents: number;
  sessionSpendCents: number;
  initialEveSession: EveCursor | null;
}) {
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(balanceCents);
  const [sessionSpend, setSessionSpend] = useState(sessionSpendCents);
  const [error, setError] = useState<string | null>(null);
  const boundSessionRef = useRef<string | null>(initialEveSession?.sessionId ?? null);
  const lastUserTextRef = useRef<string>("");

  const agent = useEveAgent({
    initialSession: initialEveSession
      ? {
          sessionId: initialEveSession.sessionId,
          continuationToken: initialEveSession.continuationToken,
          streamIndex: initialEveSession.streamIndex ?? 0,
        }
      : undefined,
    headers: async () => ({
      "x-torny-chat-id": chatId,
      "x-torny-locale": locale,
    }),
  });

  const busy = agent.status === "submitted" || agent.status === "streaming";

  // Bind Eve session id to this chat once available
  useEffect(() => {
    const sessionId = agent.session?.sessionId;
    if (!sessionId || boundSessionRef.current === sessionId) return;

    boundSessionRef.current = sessionId;
    void fetch("/api/lucy/bind-eve-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chatId,
        sessionId,
        continuationToken: agent.session?.continuationToken,
        streamIndex: agent.session?.streamIndex ?? 0,
      }),
    }).then(async (res) => {
      if (res.status === 402) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(
          data?.error === "insufficient_balance"
            ? "Insufficient Torny balance. Top up your wallet to continue."
            : "Could not bind Torny session",
        );
      }
    });
  }, [agent.session?.sessionId, agent.session?.continuationToken, agent.session?.streamIndex, chatId]);

  // When a turn finishes, persist messages and refresh balance
  useEffect(() => {
    if (agent.status !== "ready") return;
    const msgs = agent.data.messages;
    if (!msgs.length || !lastUserTextRef.current) return;

    const lastAssistant = [...msgs].reverse().find((m) => m.role === "assistant");
    const assistantText =
      lastAssistant?.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("\n")
        .trim() ?? "";

    const userText = lastUserTextRef.current;
    lastUserTextRef.current = "";

    void (async () => {
      try {
        await fetch("/api/lucy/persist-turn", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chatId,
            userText,
            assistantText,
          }),
        });
        const res = await fetch("/api/lucy/balance");
        if (res.ok) {
          const data = (await res.json()) as { balance: number };
          setBalance(data.balance);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [agent.status, agent.data.messages, chatId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setError(null);

    try {
      const balRes = await fetch("/api/lucy/balance");
      if (balRes.ok) {
        const data = (await balRes.json()) as { balance: number };
        setBalance(data.balance);
        if (data.balance < 5) {
          setError("Insufficient Torny balance. Top up your wallet to continue.");
          return;
        }
      }
    } catch {
      /* continue; Eve + wallet hook still gate usage */
    }

    setInput("");
    lastUserTextRef.current = text;
    try {
      await agent.send({ message: text });
      setSessionSpend((s) => s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  const liveMessages =
    agent.data.messages.length > 0
      ? agent.data.messages.map((m) => {
          const text = m.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("\n");
          return { id: m.id, role: m.role, text: text ?? "" };
        })
      : initialMessages.map((m) => ({
          id: m.id,
          role: m.role,
          text: m.content,
        }));

  return (
    <div className="flex h-full min-h-[28rem] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          Balance: <strong className="text-foreground">{formatUsdCents(balance)}</strong>
        </span>
        <span>
          Session spend:{" "}
          <strong className="text-foreground">{formatUsdCents(sessionSpend)}</strong>
        </span>
        <span className="text-muted-foreground/80">Prepaid credits · you pay model usage</span>
        <a href={`/portal/lucy/${projectId}`} className="underline">
          Project
        </a>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-muted/20 p-3">
        {liveMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ask Torny about Colombian immigration. Upload files in the sidebar, tune personality
            dials, and escalate for lawyer review when ready. Usage is billed from your prepaid
            wallet.
          </p>
        ) : (
          liveMessages.map((m) => (
            <div key={m.id} className="text-sm">
              <p className="font-medium capitalize text-foreground">{m.role}</p>
              <p className="whitespace-pre-wrap text-muted-foreground">{m.text}</p>
            </div>
          ))
        )}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {agent.error ? (
        <p className="text-sm text-red-700">{agent.error.message}</p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Ask Torny…"
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={busy}
        />
        <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
          {busy ? "Torny is thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
