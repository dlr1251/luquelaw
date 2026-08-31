import { NextResponse } from "next/server";

import { searchHubArticles } from "@/lib/clkr/get-articles";
import { CLKR_CATEGORIES, type ClkrCategory } from "@/lib/clkr/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const categoryParam = searchParams.getAll("category").join(",");
  const sortParam = searchParams.get("sort");
  const categories = categoryParam
    .split(",")
    .map((s) => s.trim())
    .filter((c): c is ClkrCategory => CLKR_CATEGORIES.includes(c as ClkrCategory));
  const sort =
    sortParam === "title" || sortParam === "published_at" || sortParam === "sort_order"
      ? sortParam
      : "sort_order";

  const articles = await searchHubArticles(q, locale, {
    categories: categories.length ? categories : undefined,
    sort,
    limit: 300,
  });

  return NextResponse.json({ articles, count: articles.length });
}
