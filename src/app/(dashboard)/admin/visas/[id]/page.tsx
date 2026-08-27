import { notFound } from "next/navigation";

import {
  deleteVisaCategory,
  saveVisaCategory,
} from "@/app/(dashboard)/admin/visas/actions";
import { VisaEditor } from "@/components/admin/visa-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { immigrationPath } from "@/lib/practice-areas/paths";
import { getVisaRecordById } from "@/lib/visas/get-visas";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminVisaEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const visa = await getVisaRecordById(id);
  if (!visa) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/visas" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All visas
      </ButtonLink>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Edit visa</h2>
        {visa.status === "published" ? (
          <ButtonLink
            href={immigrationPath(`/visas/${visa.slug}`, "en")}
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
          <VisaEditor
            visa={visa}
            saveAction={saveVisaCategory}
            deleteAction={deleteVisaCategory}
          />
        </CardContent>
      </Card>
    </div>
  );
}
