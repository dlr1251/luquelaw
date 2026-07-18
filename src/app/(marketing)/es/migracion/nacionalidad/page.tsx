import { ImmigrationContentPage } from "@/components/practice-areas/immigration-content-page";
import { nationalityContent } from "@/lib/practice-areas/nationality";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationNationality.es.title,
  description: PAGE_SEO.immigrationNationality.es.description,
  path: "/es/migracion/nacionalidad",
  locale: "es",
});

export default function ImmigrationNationalityPageEs() {
  const c = nationalityContent.es;
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
