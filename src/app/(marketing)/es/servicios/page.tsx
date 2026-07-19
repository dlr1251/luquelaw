import type { Metadata } from "next";

import { ServicesHubPage } from "@/components/services/services-hub-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.services.es.title,
  description: PAGE_SEO.services.es.description,
  path: "/es/servicios",
  locale: "es",
});

export default function ServiciosPage() {
  return <ServicesHubPage locale="es" />;
}
