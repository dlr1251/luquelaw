import { notFound } from "next/navigation";

import { deleteNorm, saveNorm } from "@/app/(dashboard)/admin/norms/actions";
import { NormEditor } from "@/components/admin/norm-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { getNormById, getNormSectionsForAdmin } from "@/lib/norms/get-norms";
import { normPublicPath } from "@/lib/norms/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminNormEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const norm = await getNormById(id);

  if (!norm) {
    notFound();
  }

  const sections = await getNormSectionsForAdmin(norm.id);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/norms" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All norms
      </ButtonLink>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Edit norm</h2>
        {norm.status === "published" ? (
          <ButtonLink
            href={normPublicPath(norm.slug_key, norm.locale)}
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
          <NormEditor
            norm={norm}
            sections={sections}
            locale={norm.locale}
            saveAction={saveNorm}
            deleteAction={deleteNorm}
          />
        </CardContent>
      </Card>
    </div>
  );
}
