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
import { immigrationPath } from "@/lib/practice-areas/paths";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { listAllVisaRecordsForAdmin } from "@/lib/visas/get-visas";
import type { VisaCategoryRecord } from "@/lib/visas/types";

type Search = {
  error?: string;
  deleted?: string;
  q?: string;
  status?: string;
};

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

function filterRows(
  items: VisaCategoryRecord[],
  q: string,
  status: string,
): VisaCategoryRecord[] {
  const query = q.trim().toLowerCase();
  return items.filter((row) => {
    if (status && status !== "all" && row.status !== status) return false;
    if (!query) return true;
    const hay = [row.slug, row.name.en, row.name.es, row.category, String(row.article_num)]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });
}

export default async function AdminVisasPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const rows = isSupabaseConfigured() ? await listAllVisaRecordsForAdmin() : [];
  const q = sp.q ?? "";
  const status = sp.status ?? "all";
  const filtered = filterRows(rows, q, status);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Visa categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            CMS for Resolución 5477 categories. Published rows override the hardcoded catalog on{" "}
            <Link
              href="/services/immigration/visas"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              /services/immigration/visas
            </Link>
            . Pilot: Tránsito Aeroportuario — migrate others as you go.
          </p>
        </div>
        <ButtonLink href="/admin/visas/new" size="sm">
          + New visa
        </ButtonLink>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured. Add keys to <code className="font-mono">.env.local</code>.
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
          <AlertDescription>Visa category deleted.</AlertDescription>
        </Alert>
      ) : null}

      <form className="flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search slug, name, article…"
          className="min-w-[14rem] flex-1 border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="btn-secondary px-4 py-2 text-sm">
          Filter
        </button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories in CMS</CardTitle>
          <CardDescription>
            {filtered.length} row{filtered.length === 1 ? "" : "s"}
            {rows.length ? ` · ${rows.length} total in database` : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visa categories yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Art.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.category}</TableCell>
                    <TableCell className="font-mono text-xs">{row.article_num}</TableCell>
                    <TableCell>
                      <div className="font-medium">{row.name.en}</div>
                      <div className="text-xs text-muted-foreground">{row.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <ButtonLink href={`/admin/visas/${row.id}`} size="sm" variant="outline">
                        Edit
                      </ButtonLink>
                      {row.status === "published" ? (
                        <ButtonLink
                          href={immigrationPath(`/visas/${row.slug}`, "en")}
                          size="sm"
                          variant="ghost"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </ButtonLink>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
