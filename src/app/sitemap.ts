import type { MetadataRoute } from "next";

import { getAllPublishedArticles } from "@/lib/clkr/get-articles";
import { clkrPublicPath } from "@/lib/clkr/types";
import { getAllPublishedNorms } from "@/lib/norms/get-norms";
import { normPublicPath } from "@/lib/norms/types";
import { getAllPublishedPosts } from "@/lib/posts/get-posts";
import { postPublicPath } from "@/lib/posts/types";
import { SITE_URL } from "@/lib/seo/config";
import { SITEMAP_STATIC_PATHS } from "@/lib/seo/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, posts, norms] = await Promise.all([
    getAllPublishedArticles(),
    getAllPublishedPosts(),
    getAllPublishedNorms(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = SITEMAP_STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.priority >= 0.8 ? "weekly" : "monthly",
    priority: entry.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}${clkrPublicPath(article.slug_key, article.locale)}`,
    lastModified: new Date(article.updated_at ?? article.published_at ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}${postPublicPath(post.slug_key, post.locale)}`,
    lastModified: new Date(post.updated_at ?? post.published_at ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const normEntries: MetadataRoute.Sitemap = norms.map((norm) => ({
    url: `${SITE_URL}${normPublicPath(norm.slug_key, norm.locale, ["overview"])}`,
    lastModified: new Date(norm.updated_at ?? norm.published_at ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.68,
  }));

  return [...staticEntries, ...articleEntries, ...postEntries, ...normEntries];
}
