import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.taxes.es.title,
  description: PAGE_SEO.taxes.es.description,
  path: "/es/servicios/impuestos",
  locale: "es",
});

export default function Page() {
  return <ServiceAreaPage locale="es" areaId="taxes" />;
}
