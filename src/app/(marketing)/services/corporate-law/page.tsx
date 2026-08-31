import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { getPublishedPromptsByCategory } from "@/lib/agents/get-agents";
import {
  getHubArticlesForServiceArea,
  SERVICE_AREA_CLKR_CATEGORIES,
} from "@/lib/clkr/get-hub-articles";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.corporateLaw.en.title,
  description: PAGE_SEO.corporateLaw.en.description,
  path: "/services/corporate-law",
  locale: "en",
});

export default async function Page() {
  const [relatedArticles, relatedPrompts] = await Promise.all([
    getHubArticlesForServiceArea("corporate-law", "en"),
    getPublishedPromptsByCategory(SERVICE_AREA_CLKR_CATEGORIES["corporate-law"][0], "en", 3),
  ]);

  return (
    <ServiceAreaPage
      locale="en"
      areaId="corporate-law"
      relatedArticles={relatedArticles}
      relatedPrompts={relatedPrompts}
    />
  );
}
