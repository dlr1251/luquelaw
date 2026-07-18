import { ClkrLegalAiHub } from "@/components/clkr/clkr-legalai-hub";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { clkrHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrHub.es.title,
  description: PAGE_SEO.clkrHub.es.description,
  path: "/es/clkr",
  locale: "es",
});

export default async function ClkrHubEsPage() {
  const signedIn = await getSignedInFlag();

  return (
    <>
      <JsonLd data={clkrHubJsonLd("es")} />
      <ClkrLegalAiHub locale="es" signedIn={signedIn} />
    </>
  );
}
