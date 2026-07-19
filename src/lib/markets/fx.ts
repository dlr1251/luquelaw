export type FxRates = {
  usdCop: number;
  eurCop: number;
  updatedAt: string | null;
};

type ErApiResponse = {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_utc?: string;
};

async function fetchBaseRates(base: "USD" | "EUR"): Promise<ErApiResponse | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ErApiResponse;
  } catch {
    return null;
  }
}

/** Cached FX snapshot for the marketing top bar (America/Bogota context). */
export async function getFxRates(): Promise<FxRates> {
  const [usd, eur] = await Promise.all([fetchBaseRates("USD"), fetchBaseRates("EUR")]);

  const usdCop = usd?.result === "success" ? usd.rates?.COP : undefined;
  const eurCop = eur?.result === "success" ? eur.rates?.COP : undefined;

  return {
    usdCop: typeof usdCop === "number" && Number.isFinite(usdCop) ? usdCop : 0,
    eurCop: typeof eurCop === "number" && Number.isFinite(eurCop) ? eurCop : 0,
    updatedAt: usd?.time_last_update_utc ?? eur?.time_last_update_utc ?? null,
  };
}

export function formatCopRate(value: number, locale: "en" | "es"): string {
  if (!value) return "—";
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
