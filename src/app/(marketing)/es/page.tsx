import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/lib/seo/json-ld";
import { loadHomeReading } from "@/lib/home/load-reading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/config";
import { homeJsonLd } from "@/lib/seo/schemas";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: PAGE_SEO.home.es.title,
  description: PAGE_SEO.home.es.description,
  path: "/es",
  locale: "es",
});

export default async function HomeEs() {
  const { articles, posts } = await loadHomeReading("es");
  return (
    <>
      <JsonLd data={homeJsonLd("es")} />
      <HomePage locale="es" articles={articles} posts={posts} />
    </>
  );
}
