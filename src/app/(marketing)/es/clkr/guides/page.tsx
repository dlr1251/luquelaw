import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { clkrGuidesHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrGuides.es.title,
  description: PAGE_SEO.clkrGuides.es.description,
  path: "/es/clkr/guides",
  locale: "es",
});

export default async function ClkrGuidesHubEsPage() {
  const [articles, signedIn] = await Promise.all([getHubArticles("es"), getSignedInFlag()]);
  return (
    <>
      <JsonLd data={clkrGuidesHubJsonLd("es")} />
      <ClkrHub articles={articles} locale="es" signedIn={signedIn} />
    </>
  );
}
