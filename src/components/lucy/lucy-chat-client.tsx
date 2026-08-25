"use client";

import { useEveAgent } from "eve/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LUCY_AI_NAME } from "@/lib/lucy/brand";
import { cn } from "@/lib/utils";

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

const STARTERS = [
  "How long can I stay on a visitor visa V?",
  "What is the difference between visa V and visa M?",
  "Can I work in Colombia on a visitor visa?",
];

export function LucyChatClient({
  chatId,
  locale,
  initialMessages,
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
  const [error, setError] = useState<string | null>(null);
  const boundSessionRef = useRef<string | null>(initialEveSession?.sessionId ?? null);
  const lastUserTextRef = useRef<string>("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
            ? "Insufficient Lucy AI balance. Top up your wallet to continue."
            : "Could not bind Lucy AI session",
        );
      }
    });
  }, [agent.session?.sessionId, agent.session?.continuationToken, agent.session?.streamIndex, chatId]);

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
      } catch {
        /* ignore */
      }
    })();
  }, [agent.status, agent.data.messages, chatId]);

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

  const visible = liveMessages.filter((m) => m.role === "user" || m.role === "assistant");

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visible, busy]);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);

    try {
      const balRes = await fetch("/api/lucy/balance");
      if (balRes.ok) {
        const data = (await balRes.json()) as { balance: number };
        if (data.balance < 5) {
          setError("Insufficient Lucy AI balance. Top up your wallet to continue.");
          return;
        }
      }
    } catch {
      /* Eve + wallet hook still gate usage */
    }

    setInput("");
    lastUserTextRef.current = trimmed;
    try {
      await agent.send({ message: trimmed });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendText(input);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
            <div className="space-y-2">
              <p className="font-serif text-2xl text-[var(--forest)]">{LUCY_AI_NAME}</p>
              <p className="text-sm text-muted-foreground">
                Colombian immigration questions, grounded in norms and guides. Not legal advice.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={busy}
                  onClick={() => void sendText(prompt)}
                  className="rounded-xl border bg-background px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted/50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6">
            {visible.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}
                >
                  <p className="px-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                    {isUser ? "You" : LUCY_AI_NAME}
                  </p>
                  <div
                    className={cn(
                      "max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed",
                      isUser
                        ? "rounded-2xl rounded-br-md bg-[var(--forest)] px-4 py-2.5 text-white"
                        : "text-foreground",
                    )}
                  >
                    {m.text || (busy && !isUser ? "…" : "")}
                  </div>
                </div>
              );
            })}
            {busy ? (
              <p className="text-xs text-muted-foreground">{LUCY_AI_NAME} is writing…</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t bg-background px-4 py-3">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border bg-muted/20 px-3 py-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            rows={1}
            placeholder={`Message ${LUCY_AI_NAME}`}
            className="min-h-10 max-h-40 flex-1 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
            disabled={busy}
          />
          <Button
            type="submit"
            size="icon"
            className="mb-0.5 rounded-full"
            disabled={busy || !input.trim()}
            aria-label="Send"
          >
            <ArrowUp />
          </Button>
        </form>
        {error || agent.error ? (
          <p className="mx-auto mt-2 max-w-2xl text-xs text-red-700">
            {error ?? agent.error?.message}
          </p>
        ) : (
          <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground">
            Enter to send · Shift+Enter for a new line · prepaid credits
          </p>
        )}
      </div>
    </div>
  );
}
