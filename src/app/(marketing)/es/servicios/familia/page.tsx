import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.familyLaw.es.title,
  description: PAGE_SEO.familyLaw.es.description,
  path: "/es/servicios/familia",
  locale: "es",
});

export default function Page() {
  return <ServiceAreaPage locale="es" areaId="family-law" />;
}
