"use client";

import { useState } from "react";

import { formatUsdCents } from "@/lib/lucy/pricing";

export function UnlockReviewButton({
  ticketId,
  feeCents,
}: {
  ticketId: string;
  feeCents: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fee = feeCents;

  async function unlock() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/lucy-unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticketId }),
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
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button type="button" className="btn-primary" disabled={loading} onClick={unlock}>
        {loading ? "Redirecting…" : `Unlock review — ${formatUsdCents(fee)}`}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
