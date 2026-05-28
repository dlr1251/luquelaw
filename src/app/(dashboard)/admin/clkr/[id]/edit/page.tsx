import { notFound } from "next/navigation";

import {
  deleteClkrArticle,
  saveClkrArticle,
} from "@/app/(dashboard)/admin/clkr/actions";
import { ClkrArticleEditor } from "@/components/admin/clkr-article-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleById } from "@/lib/clkr/get-articles";
import { clkrPublicPath } from "@/lib/clkr/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminClkrEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/clkr" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All articles
      </ButtonLink>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Edit article</h2>
        {article.status === "published" ? (
          <ButtonLink
            href={clkrPublicPath(article.slug_key, article.locale)}
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
          <ClkrArticleEditor
            article={article}
            locale={article.locale}
            saveAction={saveClkrArticle}
            deleteAction={deleteClkrArticle}
          />
        </CardContent>
      </Card>
    </div>
  );
}
