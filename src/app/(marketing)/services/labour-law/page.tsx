import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { getHubArticlesForServiceArea, SERVICE_AREA_CLKR_CATEGORIES } from "@/lib/clkr/get-hub-articles";
import { getPublishedPromptsByCategory } from "@/lib/agents/get-agents";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.labourLaw.en.title,
  description: PAGE_SEO.labourLaw.en.description,
  path: "/services/labour-law",
  locale: "en",
});

export default async function Page() {
  const [relatedArticles, relatedPrompts] = await Promise.all([
    getHubArticlesForServiceArea("labour-law", "en"),
    getPublishedPromptsByCategory(SERVICE_AREA_CLKR_CATEGORIES["labour-law"][0], "en", 3),
  ]);

  return (
    <ServiceAreaPage
      locale="en"
      areaId="labour-law"
      relatedArticles={relatedArticles}
      relatedPrompts={relatedPrompts}
    />
  );
}
