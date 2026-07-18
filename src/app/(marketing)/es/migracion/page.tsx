import { ImmigrationPage } from "@/components/practice-areas/immigration-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigration.es.title,
  description: PAGE_SEO.immigration.es.description,
  path: "/es/migracion",
  locale: "es",
});

export default function MigracionRoutePage() {
  return <ImmigrationPage locale="es" />;
}
