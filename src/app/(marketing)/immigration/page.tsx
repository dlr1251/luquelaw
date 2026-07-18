import { ImmigrationPage } from "@/components/practice-areas/immigration-page";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigration.en.title,
  description: PAGE_SEO.immigration.en.description,
  path: "/immigration",
  locale: "en",
});

export default async function ImmigrationRoutePage() {
  const signedIn = await getSignedInFlag();
  return <ImmigrationPage locale="en" signedIn={signedIn} />;
}
