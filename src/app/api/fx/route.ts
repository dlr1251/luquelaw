import { getFxRates } from "@/lib/markets/fx";

export const revalidate = 3600;

export async function GET() {
  const rates = await getFxRates();
  return Response.json(rates, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
