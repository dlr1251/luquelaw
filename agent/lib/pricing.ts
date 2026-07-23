/** Shared Torny wallet pricing (USD cents) for Eve hooks — mirrors src/lib/lucy/pricing. */

export function getMinBalanceCents(): number {
  return Number(process.env.LUCY_MIN_BALANCE_CENTS ?? "5") || 5;
}

export function getInputCentsPer1k(): number {
  return Number(process.env.LUCY_INPUT_CENTS_PER_1K ?? "30") || 30;
}

export function getOutputCentsPer1k(): number {
  return Number(process.env.LUCY_OUTPUT_CENTS_PER_1K ?? "150") || 150;
}

export function computeUsageCents(tokenIn: number, tokenOut: number): number {
  const input = Math.ceil((Math.max(0, tokenIn) / 1000) * getInputCentsPer1k());
  const output = Math.ceil((Math.max(0, tokenOut) / 1000) * getOutputCentsPer1k());
  return Math.max(1, input + output);
}
