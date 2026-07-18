import type { Metadata } from "next";

import { NormsHub } from "@/components/norms/norms-hub";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getHubNorms } from "@/lib/norms/get-norms";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/config";
import { normsHubJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.normsHub.es.title,
  description: PAGE_SEO.normsHub.es.description,
  path: "/es/clkr/norms",
  locale: "es",
});

export default async function EsNormsHubPage() {
  const [norms, signedIn] = await Promise.all([getHubNorms("es"), getSignedInFlag()]);

  return (
    <>
      <JsonLd data={normsHubJsonLd("es")} />
      <NormsHub norms={norms} locale="es" signedIn={signedIn} />
    </>
  );
}
