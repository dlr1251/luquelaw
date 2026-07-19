import { ImmigrationContentPage } from "@/components/practice-areas/immigration-content-page";
import { extranjeriaContent } from "@/lib/practice-areas/extranjeria";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationExtranjeria.en.title,
  description: PAGE_SEO.immigrationExtranjeria.en.description,
  path: "/services/immigration/extranjeria",
  locale: "en",
});

export default function ImmigrationExtranjeriaPage() {
  const c = extranjeriaContent.en;
  return (
    <ImmigrationContentPage
      locale="en"
      eyebrow={c.eyebrow}
      title={c.title}
      intro={c.intro}
      sections={c.sections}
      ctaTitle={c.ctaTitle}
      ctaBody={c.ctaBody}
      bookCta={c.bookCta}
      bookHref={c.bookHref}
      disclaimer={c.disclaimer}
    />
  );
}
