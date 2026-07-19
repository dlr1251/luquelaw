import { ImmigrationPage } from "@/components/practice-areas/immigration-page";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigration.es.title,
  description: PAGE_SEO.immigration.es.description,
  path: "/es/servicios/migracion",
  locale: "es",
});

export default async function ImmigrationRoutePageEs() {
  const signedIn = await getSignedInFlag();
  return <ImmigrationPage locale="es" signedIn={signedIn} />;
}
