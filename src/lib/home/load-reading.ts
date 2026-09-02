import { getLatestHubArticles } from "@/lib/clkr/get-articles";
import type { HomeLocale } from "@/lib/home/content";
import { getLatestHubPosts } from "@/lib/posts/get-posts";

export async function loadHomeReading(locale: HomeLocale) {
  const [articles, posts] = await Promise.all([
    getLatestHubArticles(locale, 3),
    getLatestHubPosts(locale, 2),
  ]);
  return { articles, posts };
}
