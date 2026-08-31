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
  title: PAGE_SEO.taxes.es.title,
  description: PAGE_SEO.taxes.es.description,
  path: "/es/servicios/impuestos",
  locale: "es",
});

export default async function Page() {
  const [relatedArticles, relatedPrompts] = await Promise.all([
    getHubArticlesForServiceArea("taxes", "es"),
    getPublishedPromptsByCategory(SERVICE_AREA_CLKR_CATEGORIES.taxes[0], "es", 3),
  ]);

  return (
    <ServiceAreaPage
      locale="es"
      areaId="taxes"
      relatedArticles={relatedArticles}
      relatedPrompts={relatedPrompts}
    />
  );
}
