import { MedellinExpatsPage } from "@/components/campaigns/medellin-expats-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.medellinExpats.en.title,
  description: PAGE_SEO.medellinExpats.en.description,
  path: "/medellin",
  locale: "en",
});

export default function MedellinExpatsRoute() {
  return <MedellinExpatsPage locale="en" />;
}
