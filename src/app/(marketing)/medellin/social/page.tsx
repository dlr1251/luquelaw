import { MedellinExpatsSocial } from "@/components/campaigns/medellin-expats-social";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Medellín campaign posts",
  description: "Copy-ready social posts for the Medellín five-files campaign.",
  path: "/medellin/social",
  locale: "en",
  noIndex: true,
});

export default function MedellinExpatsSocialRoute() {
  return <MedellinExpatsSocial locale="en" />;
}
