import { NextResponse } from "next/server";

import { searchHubArticles } from "@/lib/clkr/get-articles";
import { CLKR_CATEGORIES, type ClkrCategory } from "@/lib/clkr/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const category =
    categoryParam && CLKR_CATEGORIES.includes(categoryParam as ClkrCategory)
      ? (categoryParam as ClkrCategory)
      : undefined;
  const sort =
    sortParam === "title" || sortParam === "published_at" || sortParam === "sort_order"
      ? sortParam
      : "sort_order";

  const articles = await searchHubArticles(q, locale, { category, sort, limit: 300 });

  return NextResponse.json({ articles, count: articles.length });
}
