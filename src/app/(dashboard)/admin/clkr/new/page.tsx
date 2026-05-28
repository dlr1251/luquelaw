import { redirect } from "next/navigation";

import { saveClkrArticle } from "@/app/(dashboard)/admin/clkr/actions";
import { ClkrArticleEditor } from "@/components/admin/clkr-article-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/clkr" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All articles
      </ButtonLink>

      <div>
        <h2 className="text-lg font-semibold">
          New {locale === "es" ? "Spanish" : "English"} article
        </h2>
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <ClkrArticleEditor locale={locale} saveAction={saveClkrArticle} />
        </CardContent>
      </Card>
    </div>
  );
}
