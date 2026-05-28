import { notFound } from "next/navigation";

import { deletePost, savePost } from "@/app/(dashboard)/admin/posts/actions";
import { PostEditor } from "@/components/admin/post-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { getPostById } from "@/lib/posts/get-posts";
import { postPublicPath } from "@/lib/posts/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminPostEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/posts" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All posts
      </ButtonLink>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Edit post</h2>
        {post.status === "published" ? (
          <ButtonLink
            href={postPublicPath(post.slug_key, post.locale)}
            size="sm"
            variant="outline"
            target="_blank"
            rel="noreferrer"
          >
            View live
          </ButtonLink>
        ) : null}
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      {sp.saved ? (
        <Alert>
          <AlertDescription>Saved. Public pages revalidated.</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <PostEditor
            post={post}
            locale={post.locale}
            saveAction={savePost}
            deleteAction={deletePost}
          />
        </CardContent>
      </Card>
    </div>
  );
}
