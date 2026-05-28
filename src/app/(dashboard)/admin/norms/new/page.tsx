import { redirect } from "next/navigation";

import { saveNorm } from "@/app/(dashboard)/admin/norms/actions";
import { NormEditor } from "@/components/admin/norm-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ locale?: string; error?: string }>;
};

export default async function AdminNormNewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = sp.locale === "es" ? "es" : sp.locale === "en" ? "en" : null;

  if (!locale) {
    redirect("/admin/norms");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/norms" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All norms
      </ButtonLink>

      <div>
        <h2 className="text-lg font-semibold">
          New {locale === "es" ? "Spanish" : "English"} norm
        </h2>
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <NormEditor locale={locale} saveAction={saveNorm} />
        </CardContent>
      </Card>
    </div>
  );
}
