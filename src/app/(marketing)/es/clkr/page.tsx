import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";
import { getStudyPaths } from "@/lib/clkr/get-study-paths";
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
  const articles = await getHubArticles("es");
  const studyPaths = await getStudyPaths("es");
  return (
    <>
      <JsonLd data={clkrHubJsonLd("es")} />
      <ClkrHub articles={articles} studyPaths={studyPaths} locale="es" />
    </>
  );
}
