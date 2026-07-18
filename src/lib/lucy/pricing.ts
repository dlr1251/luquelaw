/** Lucy credit packs and pricing defaults (USD cents). */

export const LUCY_TOPUP_PACKS = [
  { id: "pack_10", label: "$10", amountCents: 1000 },
  { id: "pack_25", label: "$25", amountCents: 2500 },
  { id: "pack_50", label: "$50", amountCents: 5000 },
] as const;

export type LucyTopupPackId = (typeof LUCY_TOPUP_PACKS)[number]["id"];

export function getLucyTopupPack(id: string) {
  return LUCY_TOPUP_PACKS.find((p) => p.id === id) ?? null;
}

/** Minimum balance (cents) required to send a message. */
export function getLucyMinBalanceCents(): number {
  return Number(process.env.LUCY_MIN_BALANCE_CENTS ?? "5") || 5;
}

export function getLucyInputCentsPer1k(): number {
  return Number(process.env.LUCY_INPUT_CENTS_PER_1K ?? "30") || 30;
}

export function getLucyOutputCentsPer1k(): number {
  return Number(process.env.LUCY_OUTPUT_CENTS_PER_1K ?? "150") || 150;
}

/** Default lawyer review unlock fee ($150). */
export function getLucyReviewFeeCents(): number {
  return Number(process.env.LUCY_REVIEW_FEE_CENTS ?? "15000") || 15000;
}

export function computeLucyUsageCents(tokenIn: number, tokenOut: number): number {
  const input = Math.ceil((Math.max(0, tokenIn) / 1000) * getLucyInputCentsPer1k());
  const output = Math.ceil((Math.max(0, tokenOut) / 1000) * getLucyOutputCentsPer1k());
  return Math.max(1, input + output);
}

export function formatUsdCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
