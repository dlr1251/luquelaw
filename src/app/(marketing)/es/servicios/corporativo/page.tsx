import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.corporateLaw.es.title,
  description: PAGE_SEO.corporateLaw.es.description,
  path: "/es/servicios/corporativo",
  locale: "es",
});

export default function Page() {
  return <ServiceAreaPage locale="es" areaId="corporate-law" />;
}
