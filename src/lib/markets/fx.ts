export type FxRates = {
  usdCop: number;
  eurCop: number;
  /** ISO timestamp of when this snapshot was fetched (or upstream last update). */
  updatedAt: string | null;
  source?: "coinbase" | "er-api";
};

type CoinbaseResponse = {
  data?: { currency?: string; rates?: Record<string, string> };
};

type ErApiResponse = {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_utc?: string;
};

const REVALIDATE_SECONDS = 3600;

function parseRate(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

async function fetchCoinbaseRates(base: "USD" | "EUR"): Promise<number | undefined> {
  try {
    const res = await fetch(
      `https://api.coinbase.com/v2/exchange-rates?currency=${base}`,
      { next: { revalidate: REVALIDATE_SECONDS, tags: ["fx-rates"] } },
    );
    if (!res.ok) return undefined;
    const json = (await res.json()) as CoinbaseResponse;
    return parseRate(json.data?.rates?.COP);
  } catch {
    return undefined;
  }
}

async function fetchErApiRates(base: "USD" | "EUR"): Promise<{
  rate?: number;
  updatedAt?: string;
} | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["fx-rates"] },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ErApiResponse;
    if (json.result !== "success") return null;
    return {
      rate: parseRate(json.rates?.COP),
      updatedAt: json.time_last_update_utc,
    };
  } catch {
    return null;
  }
}

/** Cached FX snapshot for the marketing top bar. Refreshes at most hourly. */
export async function getFxRates(): Promise<FxRates> {
  const [usdCoinbase, eurCoinbase] = await Promise.all([
    fetchCoinbaseRates("USD"),
    fetchCoinbaseRates("EUR"),
  ]);

  if (usdCoinbase && eurCoinbase) {
    return {
      usdCop: usdCoinbase,
      eurCop: eurCoinbase,
      updatedAt: new Date().toISOString(),
      source: "coinbase",
    };
  }

  const [usdEr, eurEr] = await Promise.all([
    fetchErApiRates("USD"),
    fetchErApiRates("EUR"),
  ]);

  const usdCop = usdCoinbase ?? usdEr?.rate;
  const eurCop = eurCoinbase ?? eurEr?.rate;

  return {
    usdCop: usdCop ?? 0,
    eurCop: eurCop ?? 0,
    updatedAt:
      usdEr?.updatedAt ??
      eurEr?.updatedAt ??
      (usdCop || eurCop ? new Date().toISOString() : null),
    source: usdCoinbase || eurCoinbase ? "coinbase" : "er-api",
  };
}

export function formatCopRate(value: number, locale: "en" | "es"): string {
  if (!value) return "—";
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
