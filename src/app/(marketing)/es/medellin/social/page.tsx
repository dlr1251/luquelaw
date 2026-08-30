import { MedellinExpatsSocial } from "@/components/campaigns/medellin-expats-social";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Posts de la campaña Medellín",
  description: "Textos listos para Facebook y Threads.",
  path: "/es/medellin/social",
  locale: "es",
  noIndex: true,
});

export default function MedellinExpatsSocialEsRoute() {
  return <MedellinExpatsSocial locale="es" />;
}
