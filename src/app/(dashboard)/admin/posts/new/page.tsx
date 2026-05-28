import { redirect } from "next/navigation";

import { savePost } from "@/app/(dashboard)/admin/posts/actions";
import { PostEditor } from "@/components/admin/post-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ locale?: string; error?: string }>;
};

export default async function AdminPostNewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = sp.locale === "es" ? "es" : sp.locale === "en" ? "en" : null;

  if (!locale) {
    redirect("/admin/posts");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/posts" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All posts
      </ButtonLink>

      <div>
        <h2 className="text-lg font-semibold">
          New {locale === "es" ? "Spanish" : "English"} post
        </h2>
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <PostEditor locale={locale} saveAction={savePost} />
        </CardContent>
      </Card>
    </div>
  );
}
