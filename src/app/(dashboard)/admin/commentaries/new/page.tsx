import {
  saveCommentary,
} from "@/app/(dashboard)/admin/commentaries/actions";
import { CommentaryEditor } from "@/components/admin/commentary-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import {
  getNormOptionsForAdmin,
  getSectionOptionsForNorm,
} from "@/lib/commentaries/get-commentaries";

type Props = {
  searchParams: Promise<{ locale?: string; error?: string }>;
};

export default async function AdminCommentaryNewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = sp.locale === "es" ? "es" : "en";
  const norms = await getNormOptionsForAdmin();
  const localeNorms = norms.filter((n) => n.locale === locale);
  const initialSections = localeNorms[0]
    ? await getSectionOptionsForNorm(localeNorms[0].id)
    : [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink
        href="/admin/commentaries"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
      >
        ← All commentaries
      </ButtonLink>

      <h2 className="text-lg font-semibold">
        New commentary ({locale === "es" ? "ES" : "EN"})
      </h2>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <CommentaryEditor
            locale={locale}
            norms={norms}
            initialSections={initialSections}
            saveAction={saveCommentary}
          />
        </CardContent>
      </Card>
    </div>
  );
}
