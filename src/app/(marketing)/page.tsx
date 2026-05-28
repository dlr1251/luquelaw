import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/config";
import { homeJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.home.en.title,
  description: PAGE_SEO.home.en.description,
  path: "/",
  locale: "en",
});

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <HomePage locale="en" />
    </>
  );
}
