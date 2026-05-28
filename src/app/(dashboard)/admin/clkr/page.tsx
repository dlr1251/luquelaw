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
import { getAllArticlesForAdmin } from "@/lib/clkr/get-articles";
import { clkrPublicPath } from "@/lib/clkr/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Search = { error?: string; saved?: string; deleted?: string };

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

export default async function AdminClkrPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const articles = isSupabaseConfigured() ? await getAllArticlesForAdmin() : [];
  const en = articles.filter((a) => a.locale === "en");
  const es = articles.filter((a) => a.locale === "es");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">CLKR articles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and edit guides stored in Supabase. Published articles appear on{" "}
            <Link href="/clkr" className="font-medium text-foreground underline-offset-4 hover:underline">
              /clkr
            </Link>{" "}
            and{" "}
            <Link href="/es/clkr" className="font-medium text-foreground underline-offset-4 hover:underline">
              /es/clkr
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/clkr/new?locale=en" size="sm">
            + English
          </ButtonLink>
          <ButtonLink href="/admin/clkr/new?locale=es" size="sm" variant="outline">
            + Spanish
          </ButtonLink>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured. Add keys to <code className="font-mono">.env.local</code> and
            run migrations in <code className="font-mono">supabase/migrations/</code>.
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
          <AlertDescription>Article deleted.</AlertDescription>
        </Alert>
      ) : null}

      <AdminArticleTable locale="en" title="English (/clkr)" items={en} />
      <AdminArticleTable locale="es" title="Spanish (/es/clkr)" items={es} />
    </div>
  );
}

function AdminArticleTable({
  locale,
  title,
  items,
}: {
  locale: "en" | "es";
  title: string;
  items: Awaited<ReturnType<typeof getAllArticlesForAdmin>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{items.length} article{items.length === 1 ? "" : "s"}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No articles yet.{" "}
            <Link
              href={`/admin/clkr/new?locale=${locale}`}
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
              {items.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {article.category} · order {article.sort_order}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{article.slug_key}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(article.status)}>{article.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonLink href={`/admin/clkr/${article.id}/edit`} size="sm" variant="ghost">
                        Edit
                      </ButtonLink>
                      {article.status === "published" ? (
                        <ButtonLink
                          href={clkrPublicPath(article.slug_key, article.locale)}
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
