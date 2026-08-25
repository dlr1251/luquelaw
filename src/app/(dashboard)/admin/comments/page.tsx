import Link from "next/link";
import { redirect } from "next/navigation";

import {
  hideCommentAction,
  resolveReportAction,
  restoreCommentAction,
} from "@/app/(dashboard)/admin/comments/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type ReportComment = {
  id: string;
  body: string;
  author_display_name: string;
  section_id: string;
  deleted_at: string | null;
};

function asComment(
  value:
    | ReportComment
    | ReportComment[]
    | null
    | undefined,
): ReportComment | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminCommentsPage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims || !isAppAdmin(claimsData.claims)) {
    redirect("/portal");
  }

  const [{ data: reports }, { data: hidden }] = await Promise.all([
    supabase
      .from("norm_comment_reports")
      .select(
        "id, reason, status, created_at, comment_id, reporter_id, norm_comments(id, body, author_display_name, section_id, deleted_at)",
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("norm_comments")
      .select("id, body, author_display_name, deleted_at, section_id, created_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(30),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Moderation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review flagged discussion comments on CLKR norms. Firm doctrinal
            notes live under{" "}
            <Link
              href="/admin/commentaries"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Commentaries
            </Link>
            .
          </p>
        </div>
        <ButtonLink href="/admin/commentaries" size="sm" variant="outline">
          Commentaries CMS
        </ButtonLink>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open reports</CardTitle>
          <CardDescription>
            {reports?.length ?? 0} open report
            {(reports?.length ?? 0) === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reports?.length ? (
            <p className="text-sm text-muted-foreground">No open reports.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comment</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => {
                  const row = asComment(
                    report.norm_comments as
                      | ReportComment
                      | ReportComment[]
                      | null,
                  );
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="max-w-md align-top">
                        <div className="font-medium">
                          {row?.author_display_name ?? "Unknown"}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                          {row?.body ?? "(comment missing)"}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell className="align-top text-sm">
                        {report.reason}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="secondary">open</Badge>
                        {row?.deleted_at ? (
                          <Badge variant="outline" className="ml-1">
                            hidden
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col items-end gap-2">
                          <form action={resolveReportAction}>
                            <input
                              type="hidden"
                              name="reportId"
                              value={report.id}
                            />
                            <input type="hidden" name="status" value="resolved" />
                            <input type="hidden" name="hide" value="1" />
                            <Button type="submit" size="sm">
                              Hide & resolve
                            </Button>
                          </form>
                          <form action={resolveReportAction}>
                            <input
                              type="hidden"
                              name="reportId"
                              value={report.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="dismissed"
                            />
                            <Button type="submit" size="sm" variant="outline">
                              Dismiss
                            </Button>
                          </form>
                          {row && !row.deleted_at ? (
                            <form action={hideCommentAction}>
                              <input
                                type="hidden"
                                name="commentId"
                                value={row.id}
                              />
                              <Button type="submit" size="sm" variant="ghost">
                                Hide only
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hidden comments</CardTitle>
          <CardDescription>
            Soft-deleted or moderated discussion comments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hidden?.length ? (
            <p className="text-sm text-muted-foreground">No hidden comments.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Body</TableHead>
                  <TableHead>Hidden</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hidden.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="align-top font-medium">
                      {c.author_display_name}
                    </TableCell>
                    <TableCell className="max-w-lg align-top">
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {c.body}
                      </p>
                    </TableCell>
                    <TableCell className="align-top text-xs text-muted-foreground">
                      {c.deleted_at
                        ? new Date(c.deleted_at).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <form action={restoreCommentAction}>
                        <input type="hidden" name="commentId" value={c.id} />
                        <Button type="submit" size="sm" variant="outline">
                          Restore
                        </Button>
                      </form>
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
