import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.labourLaw.es.title,
  description: PAGE_SEO.labourLaw.es.description,
  path: "/es/servicios/laboral",
  locale: "es",
});

export default function Page() {
  return <ServiceAreaPage locale="es" areaId="labour-law" />;
}
