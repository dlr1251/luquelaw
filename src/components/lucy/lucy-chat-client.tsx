"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

import { formatUsdCents } from "@/lib/lucy/pricing";

type InitialMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  cost_cents?: number;
};

export function LucyChatClient({
  chatId,
  projectId,
  initialMessages,
  balanceCents,
  sessionSpendCents,
}: {
  chatId: string;
  projectId: string;
  initialMessages: InitialMessage[];
  balanceCents: number;
  sessionSpendCents: number;
}) {
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(balanceCents);
  const [error, setError] = useState<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/lucy/chat",
        body: { chatId },
      }),
    [chatId],
  );

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    transport,
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: "text" as const, text: m.content }],
    })),
    onError: (err) => {
      setError(err.message || "Chat failed");
    },
    onFinish: async () => {
      try {
        const res = await fetch(`/api/lucy/balance`);
        if (res.ok) {
          const data = (await res.json()) as { balance: number };
          setBalance(data.balance);
        }
      } catch {
        /* ignore */
      }
    },
  });

  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setError(null);
    setInput("");
    try {
      await sendMessage({ text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  return (
    <div className="flex h-full min-h-[28rem] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          Balance: <strong className="text-foreground">{formatUsdCents(balance)}</strong>
        </span>
        <span>
          Session spend:{" "}
          <strong className="text-foreground">{formatUsdCents(sessionSpendCents)}</strong>
        </span>
        <a href={`/portal/lucy/${projectId}`} className="underline">
          Project
        </a>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-muted/20 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ask Lucy about Colombian immigration. Upload files in the sidebar, tune personality
            dials, and escalate for lawyer review when ready.
          </p>
        ) : (
          messages.map((m) => {
            const text = m.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("\n");
            return (
              <div key={m.id} className="text-sm">
                <p className="font-medium capitalize text-foreground">{m.role}</p>
                <p className="whitespace-pre-wrap text-muted-foreground">{text}</p>
              </div>
            );
          })
        )}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Ask Lucy…"
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={busy}
        />
        <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>
          {busy ? "Lucy is thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
