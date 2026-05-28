import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllNormsForAdmin } from "@/lib/norms/get-norms";
import { normPublicPath } from "@/lib/norms/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Search = { error?: string; saved?: string; deleted?: string };

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

export default async function AdminNormsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const norms = isSupabaseConfigured() ? await getAllNormsForAdmin() : [];
  const en = norms.filter((n) => n.locale === "en");
  const es = norms.filter((n) => n.locale === "es");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Norms</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference statutes, codes, and resolutions. Published norms appear on{" "}
            <Link href="/norms" className="font-medium text-foreground underline-offset-4 hover:underline">
              /norms
            </Link>{" "}
            and{" "}
            <Link href="/es/norms" className="font-medium text-foreground underline-offset-4 hover:underline">
              /es/norms
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/norms/new?locale=en" size="sm">
            + English
          </ButtonLink>
          <ButtonLink href="/admin/norms/new?locale=es" size="sm" variant="outline">
            + Spanish
          </ButtonLink>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured. Add keys to <code className="font-mono">.env.local</code> and
            run migrations.
          </AlertDescription>
        </Alert>
      ) : null}

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      {sp.deleted ? (
        <Alert>
          <AlertDescription>Norm deleted.</AlertDescription>
        </Alert>
      ) : null}

      <AdminNormTable locale="en" title="English (/norms)" items={en} />
      <AdminNormTable locale="es" title="Spanish (/es/norms)" items={es} />
    </div>
  );
}

function AdminNormTable({
  locale,
  title,
  items,
}: {
  locale: "en" | "es";
  title: string;
  items: Awaited<ReturnType<typeof getAllNormsForAdmin>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>
          {items.length} norm{items.length === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No norms yet.{" "}
            <Link
              href={`/admin/norms/new?locale=${locale}`}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((norm) => (
                <TableRow key={norm.id}>
                  <TableCell>
                    <div className="font-medium">{norm.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {norm.category} · {norm.norm_type} · order {norm.sort_order}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{norm.slug_key}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(norm.status)}>{norm.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonLink href={`/admin/norms/${norm.id}/edit`} size="sm" variant="ghost">
                        Edit
                      </ButtonLink>
                      {norm.status === "published" ? (
                        <ButtonLink
                          href={normPublicPath(norm.slug_key, norm.locale)}
                          size="sm"
                          variant="outline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </ButtonLink>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
