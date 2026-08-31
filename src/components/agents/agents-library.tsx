"use client";

import { useState } from "react";

import type { AgentRecord } from "@/lib/agents/get-agents";

type Props = {
  agents: AgentRecord[];
  locale: "en" | "es";
};

export function AgentsLibrary({ agents, locale }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const copyLabel = locale === "es" ? "Copiar" : "Copy";
  const copiedLabel = locale === "es" ? "Copiado" : "Copied";

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <section>
      <h2 className="font-display text-xl text-[color:var(--forest)]">
        {locale === "es" ? "Agentes" : "Agents"}
      </h2>
      {agents.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {locale === "es" ? "Aún no hay agentes publicados." : "No published agents yet."}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {agents.map((a) => (
            <li key={a.id} className="border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg text-[color:var(--forest)]">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                </div>
                <span className="text-[0.625rem] uppercase tracking-[0.14em] text-[color:var(--moss)]">
                  {a.access_tier}
                </span>
              </div>
              {a.instructions ? (
                <p className="mt-3 text-sm leading-relaxed">{a.instructions}</p>
              ) : null}
              {a.system_prompt ? (
                <div className="mt-4">
                  <pre className="overflow-x-auto whitespace-pre-wrap bg-[color:var(--surface)] p-3 text-xs">
                    {a.system_prompt}
                  </pre>
                  <button
                    type="button"
                    className="btn-secondary mt-2"
                    onClick={() => copyText(a.id, a.system_prompt)}
                  >
                    {copied === a.id ? copiedLabel : copyLabel}
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
