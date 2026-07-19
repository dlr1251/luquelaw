import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.realEstate.es.title,
  description: PAGE_SEO.realEstate.es.description,
  path: "/es/servicios/inmobiliario",
  locale: "es",
});

export default function Page() {
  return <ServiceAreaPage locale="es" areaId="real-estate" />;
}
