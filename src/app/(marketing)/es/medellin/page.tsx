import { MedellinExpatsPage } from "@/components/campaigns/medellin-expats-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.medellinExpats.es.title,
  description: PAGE_SEO.medellinExpats.es.description,
  path: "/es/medellin",
  locale: "es",
});

export default function MedellinExpatsEsRoute() {
  return <MedellinExpatsPage locale="es" />;
}
