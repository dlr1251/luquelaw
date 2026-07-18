import { ImmigrationContentPage } from "@/components/practice-areas/immigration-content-page";
import { nationalityContent } from "@/lib/practice-areas/nationality";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationNationality.en.title,
  description: PAGE_SEO.immigrationNationality.en.description,
  path: "/immigration/nationality",
  locale: "en",
});

export default function ImmigrationNationalityPage() {
  const c = nationalityContent.en;
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
