import Link from "next/link";
import { redirect } from "next/navigation";

import { ClkrArticleEditor } from "@/components/admin/clkr-article-editor";
import { Container } from "@/components/container";
import { saveClkrArticle } from "@/app/admin/clkr/actions";

type Props = {
  searchParams: Promise<{ locale?: string; error?: string }>;
};

export default async function AdminClkrNewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = sp.locale === "es" ? "es" : sp.locale === "en" ? "en" : null;

  if (!locale) {
    redirect("/admin/clkr");
  }

  return (
    <Container className="py-10">
      <Link href="/admin/clkr" className="text-sm font-bold text-[color:var(--moss)] hover:underline">
        ← All CLKR articles
      </Link>
      <h2 className="mt-4 font-display text-[1.65rem] font-normal text-[color:var(--forest)]">
        New {locale === "es" ? "Spanish" : "English"} article
      </h2>

      {sp.error ? (
        <p className="mt-4 border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {sp.error}
        </p>
      ) : null}

      <div className="mt-8 max-w-3xl border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-5 sm:p-8">
        <ClkrArticleEditor locale={locale} saveAction={saveClkrArticle} />
      </div>
    </Container>
  );
}
