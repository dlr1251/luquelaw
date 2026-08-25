import Link from "next/link";

import { AdminContentFilters } from "@/components/admin/admin-content-filters";
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
import { getAllCommentariesForAdmin } from "@/lib/commentaries/get-commentaries";
import type { DoctrinalCommentaryAdminRow } from "@/lib/commentaries/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Search = {
  error?: string;
  saved?: string;
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
  items: DoctrinalCommentaryAdminRow[],
  q: string,
  status: string,
): DoctrinalCommentaryAdminRow[] {
  const query = q.trim().toLowerCase();
  return items.filter((row) => {
    if (status && status !== "all" && row.status !== status) return false;
    if (!query) return true;
    const hay = [
      row.title,
      row.norm_title,
      row.norm_slug_key,
      row.section_title,
      row.section_key,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });
}

export default async function AdminCommentariesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const rows = isSupabaseConfigured() ? await getAllCommentariesForAdmin() : [];
  const q = sp.q ?? "";
  const status = sp.status ?? "all";
  const filtered = filterRows(rows, q, status);
  const en = filtered.filter((r) => r.locale === "en");
  const es = filtered.filter((r) => r.locale === "es");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Doctrinal commentaries</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Firm commentary on norm sections. Published notes appear on the
            public norm reader above the discussion thread.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/commentaries/new?locale=en" size="sm">
            + English
          </ButtonLink>
          <ButtonLink
            href="/admin/commentaries/new?locale=es"
            size="sm"
            variant="outline"
          >
            + Spanish
          </ButtonLink>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured. Add keys to{" "}
            <code className="font-mono">.env.local</code>.
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
          <AlertDescription>Commentary deleted.</AlertDescription>
        </Alert>
      ) : null}

      <AdminContentFilters
        basePath="/admin/commentaries"
        q={q}
        status={status}
        placeholder="Search title, norm, section…"
      />

      <CommentaryTable locale="en" title="English" items={en} />
      <CommentaryTable locale="es" title="Spanish" items={es} />
    </div>
  );
}

function CommentaryTable({
  locale,
  title,
  items,
}: {
  locale: "en" | "es";
  title: string;
  items: DoctrinalCommentaryAdminRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>
          {items.length} commentar{items.length === 1 ? "y" : "ies"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No commentaries yet.{" "}
            <Link
              href={`/admin/commentaries/new?locale=${locale}`}
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
                <TableHead>Norm / section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">
                      order {row.sort_order}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{row.norm_title ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.section_number_label
                        ? `${row.section_number_label} · `
                        : ""}
                      {row.section_title ?? row.section_key ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ButtonLink
                      href={`/admin/commentaries/${row.id}/edit`}
                      size="sm"
                      variant="ghost"
                    >
                      Edit
                    </ButtonLink>
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
