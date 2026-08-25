import { notFound } from "next/navigation";

import {
  deleteCommentary,
  saveCommentary,
} from "@/app/(dashboard)/admin/commentaries/actions";
import { CommentaryEditor } from "@/components/admin/commentary-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCommentaryById,
  getNormOptionsForAdmin,
  getSectionOptionsForNorm,
} from "@/lib/commentaries/get-commentaries";
import { normPublicPath } from "@/lib/norms/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminCommentaryEditPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const commentary = await getCommentaryById(id);

  if (!commentary) {
    notFound();
  }

  const norms = await getNormOptionsForAdmin();
  const initialSections = await getSectionOptionsForNorm(commentary.norm_id);
  const norm = norms.find((n) => n.id === commentary.norm_id);

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

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Edit commentary</h2>
        {commentary.status === "published" && norm ? (
          <ButtonLink
            href={normPublicPath(norm.slug_key, commentary.locale)}
            size="sm"
            variant="outline"
            target="_blank"
            rel="noreferrer"
          >
            View norm
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
          <CommentaryEditor
            commentary={commentary}
            locale={commentary.locale}
            norms={norms}
            initialSections={initialSections}
            saveAction={saveCommentary}
            deleteAction={deleteCommentary}
          />
        </CardContent>
      </Card>
    </div>
  );
}
