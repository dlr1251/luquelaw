import { saveVisaCategory } from "@/app/(dashboard)/admin/visas/actions";
import { VisaEditor } from "@/components/admin/visa-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminVisaNewPage({ searchParams }: Props) {
  const sp = await searchParams;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/visas" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All visas
      </ButtonLink>
      <h2 className="text-lg font-semibold">New visa category</h2>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      <Card>
        <CardContent className="pt-6">
          <VisaEditor saveAction={saveVisaCategory} />
        </CardContent>
      </Card>
    </div>
  );
}
