import { ImmigrationPage } from "@/components/practice-areas/immigration-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigration.en.title,
  description: PAGE_SEO.immigration.en.description,
  path: "/immigration",
  locale: "en",
});

export default function ImmigrationRoutePage() {
  return <ImmigrationPage locale="en" />;
}
