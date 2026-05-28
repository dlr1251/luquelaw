import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.privacy.en.title,
  description: PAGE_SEO.privacy.en.description,
  path: "/privacy",
  locale: "en",
});

export default function PrivacyPage() {
  return <PrivacyPolicy locale="en" />;
}
