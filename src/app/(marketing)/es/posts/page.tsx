import { PostsHub } from "@/components/posts/posts-hub";
import { getHubPosts } from "@/lib/posts/get-posts";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { postsHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.postsHub.es.title,
  description: PAGE_SEO.postsHub.es.description,
  path: "/es/posts",
  locale: "es",
});

export default async function PostsHubEsPage() {
  const posts = await getHubPosts("es");
  return (
    <>
      <JsonLd data={postsHubJsonLd("es")} />
      <PostsHub posts={posts} locale="es" />
    </>
  );
}
