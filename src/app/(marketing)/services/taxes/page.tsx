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
  title: PAGE_SEO.taxes.en.title,
  description: PAGE_SEO.taxes.en.description,
  path: "/services/taxes",
  locale: "en",
});

export default async function Page() {
  const [relatedArticles, relatedPrompts] = await Promise.all([
    getHubArticlesForServiceArea("taxes", "en"),
    getPublishedPromptsByCategory(SERVICE_AREA_CLKR_CATEGORIES.taxes[0], "en", 3),
  ]);

  return (
    <ServiceAreaPage
      locale="en"
      areaId="taxes"
      relatedArticles={relatedArticles}
      relatedPrompts={relatedPrompts}
    />
  );
}
