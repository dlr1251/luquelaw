import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteClkrArticle, saveClkrArticle } from "@/app/admin/clkr/actions";
import { ClkrArticleEditor } from "@/components/admin/clkr-article-editor";
import { Container } from "@/components/container";
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
    <Container className="py-10">
      <Link href="/admin/clkr" className="text-sm font-bold text-[color:var(--moss)] hover:underline">
        ← All CLKR articles
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-[1.65rem] font-normal text-[color:var(--forest)]">Edit article</h2>
        {article.status === "published" ? (
          <Link
            href={clkrPublicPath(article.slug_key, article.locale)}
            className="text-sm font-bold text-[color:var(--moss)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            View live →
          </Link>
        ) : null}
      </div>

      {sp.error ? (
        <p className="mt-4 border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {sp.error}
        </p>
      ) : null}
      {sp.saved ? (
        <p className="mt-4 border border-[color:var(--moss)]/50 bg-[color:var(--surface)] px-4 py-3 text-sm">
          Saved. Public pages revalidated.
        </p>
      ) : null}

      <div className="mt-8 max-w-3xl border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-5 sm:p-8">
        <ClkrArticleEditor
          article={article}
          locale={article.locale}
          saveAction={saveClkrArticle}
          deleteAction={deleteClkrArticle}
        />
      </div>
    </Container>
  );
}
