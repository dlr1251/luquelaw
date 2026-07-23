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
import { getAllPostsForAdmin } from "@/lib/posts/get-posts";
import type { PostRecord } from "@/lib/posts/types";
import { postPublicPath } from "@/lib/posts/types";
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

function filterPosts(items: PostRecord[], q: string, status: string): PostRecord[] {
  const query = q.trim().toLowerCase();
  return items.filter((row) => {
    if (status && status !== "all" && row.status !== status) return false;
    if (!query) return true;
    const hay = [row.title, row.slug_key, row.category].join(" ").toLowerCase();
    return hay.includes(query);
  });
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const posts = isSupabaseConfigured() ? await getAllPostsForAdmin() : [];
  const q = sp.q ?? "";
  const status = sp.status ?? "all";
  const filtered = filterPosts(posts, q, status);
  const en = filtered.filter((p) => p.locale === "en");
  const es = filtered.filter((p) => p.locale === "es");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Blog posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and edit blog articles stored in Supabase. Published posts appear on{" "}
            <Link href="/posts" className="font-medium text-foreground underline-offset-4 hover:underline">
              /posts
            </Link>{" "}
            and{" "}
            <Link href="/es/posts" className="font-medium text-foreground underline-offset-4 hover:underline">
              /es/posts
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/posts/new?locale=en" size="sm">
            + English
          </ButtonLink>
          <ButtonLink href="/admin/posts/new?locale=es" size="sm" variant="outline">
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
          <AlertDescription>Post deleted.</AlertDescription>
        </Alert>
      ) : null}

      <AdminContentFilters basePath="/admin/posts" q={q} status={status} />

      <AdminPostTable locale="en" title="English (/posts)" items={en} />
      <AdminPostTable locale="es" title="Spanish (/es/posts)" items={es} />
    </div>
  );
}

function AdminPostTable({
  locale,
  title,
  items,
}: {
  locale: "en" | "es";
  title: string;
  items: PostRecord[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{items.length} post{items.length === 1 ? "" : "s"}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No posts match.{" "}
            <Link
              href={`/admin/posts/new?locale=${locale}`}
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
              {items.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {post.category} · order {post.sort_order}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{post.slug_key}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(post.status)}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonLink href={`/admin/posts/${post.id}/edit`} size="sm" variant="ghost">
                        Edit
                      </ButtonLink>
                      {post.status === "published" ? (
                        <ButtonLink
                          href={postPublicPath(post.slug_key, post.locale)}
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
