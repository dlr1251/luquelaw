import { PostsHub } from "@/components/posts/posts-hub";
import { getHubPosts } from "@/lib/posts/get-posts";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { postsHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.postsHub.en.title,
  description: PAGE_SEO.postsHub.en.description,
  path: "/posts",
  locale: "en",
});

export default async function PostsHubPage() {
  const posts = await getHubPosts("en");
  return (
    <>
      <JsonLd data={postsHubJsonLd("en")} />
      <PostsHub posts={posts} locale="en" />
    </>
  );
}
