"use client";

import { useState } from "react";

import { LUCY_TOPUP_PACKS, formatUsdCents } from "@/lib/lucy/pricing";

export function LucyWalletChip({ balanceCents }: { balanceCents: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function topUp(packId: string) {
    setLoading(packId);
    setError(null);
    try {
      const res = await fetch("/api/stripe/lucy-topup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm"
      >
        <span className="text-muted-foreground">Torny credits</span>
        <span>{formatUsdCents(balanceCents)}</span>
        <span className="text-xs text-[var(--moss)]">Recargar</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border bg-background p-3 shadow-lg">
          <p className="mb-2 text-xs text-muted-foreground">
            Prepaid wallet for Torny chats. Lawyer review unlock is billed separately.
          </p>
          <div className="space-y-2">
            {LUCY_TOPUP_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                disabled={Boolean(loading)}
                onClick={() => topUp(pack.id)}
                className="flex w-full items-center justify-between rounded border px-3 py-2 text-sm hover:bg-muted/40"
              >
                <span>{pack.label}</span>
                <span className="text-muted-foreground">
                  {loading === pack.id ? "…" : formatUsdCents(pack.amountCents)}
                </span>
              </button>
            ))}
          </div>
          {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
