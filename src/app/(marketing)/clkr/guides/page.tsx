import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";
import { getStudyPaths } from "@/lib/clkr/get-study-paths";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { clkrGuidesHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrGuides.en.title,
  description: PAGE_SEO.clkrGuides.en.description,
  path: "/clkr/guides",
  locale: "en",
});

export default async function ClkrGuidesHubPage() {
  const [articles, studyPaths, signedIn] = await Promise.all([
    getHubArticles("en"),
    getStudyPaths("en"),
    getSignedInFlag(),
  ]);
  return (
    <>
      <JsonLd data={clkrGuidesHubJsonLd("en")} />
      <ClkrHub articles={articles} studyPaths={studyPaths} locale="en" signedIn={signedIn} />
    </>
  );
}
