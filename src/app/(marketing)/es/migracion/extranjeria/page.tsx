import { ImmigrationContentPage } from "@/components/practice-areas/immigration-content-page";
import { extranjeriaContent } from "@/lib/practice-areas/extranjeria";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationExtranjeria.es.title,
  description: PAGE_SEO.immigrationExtranjeria.es.description,
  path: "/es/migracion/extranjeria",
  locale: "es",
});

export default function ImmigrationExtranjeriaPageEs() {
  const c = extranjeriaContent.es;
  return (
    <ImmigrationContentPage
      locale="es"
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
