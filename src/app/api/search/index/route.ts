import { NextResponse } from "next/server";

import { buildSiteSearchIndex } from "@/lib/search/build-index";

export const revalidate = 60;

export async function GET() {
  try {
    const items = await buildSiteSearchIndex();
    return NextResponse.json(
      { items, generatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("[search/index]", error);
    return NextResponse.json({ items: [], error: "Failed to build index" }, { status: 500 });
  }
}
