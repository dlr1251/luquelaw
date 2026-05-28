import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.privacy.es.title,
  description: PAGE_SEO.privacy.es.description,
  path: "/es/privacidad",
  locale: "es",
});

export default function PrivacidadPage() {
  return <PrivacyPolicy locale="es" />;
}
