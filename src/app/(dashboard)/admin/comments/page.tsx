import Link from "next/link";
import { redirect } from "next/navigation";

import {
  hideCommentAction,
  resolveReportAction,
  restoreCommentAction,
} from "@/app/(dashboard)/admin/comments/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open reports</CardTitle>
          <CardDescription>
            Flagged CLKR norm comments awaiting moderation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!reports?.length ? (
            <p className="text-sm text-muted-foreground">No open reports.</p>
          ) : (
            reports.map((report) => {
              const comment = report.norm_comments as
                | {
                    id: string;
                    body: string;
                    author_display_name: string;
                    section_id: string;
                    deleted_at: string | null;
                  }
                | {
                    id: string;
                    body: string;
                    author_display_name: string;
                    section_id: string;
                    deleted_at: string | null;
                  }[]
                | null;
              const row = Array.isArray(comment) ? comment[0] : comment;

              return (
                <div key={report.id} className="border-b border-border py-3 text-sm last:border-0">
                  <p className="font-medium">
                    {row?.author_display_name ?? "Unknown"} ·{" "}
                    <span className="text-muted-foreground">
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Reason: {report.reason}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-foreground">
                    {row?.body ?? "(comment missing)"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={resolveReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="resolved" />
                      <input type="hidden" name="hide" value="1" />
                      <button type="submit" className="btn-secondary text-xs">
                        Hide & resolve
                      </button>
                    </form>
                    <form action={resolveReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button type="submit" className="text-xs underline">
                        Dismiss
                      </button>
                    </form>
                    {row && !row.deleted_at ? (
                      <form action={hideCommentAction}>
                        <input type="hidden" name="commentId" value={row.id} />
                        <button type="submit" className="text-xs underline">
                          Hide only
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hidden comments</CardTitle>
          <CardDescription>Soft-deleted or moderated comments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hidden?.length ? (
            <p className="text-sm text-muted-foreground">No hidden comments.</p>
          ) : (
            hidden.map((c) => (
              <div key={c.id} className="border-b border-border py-3 text-sm last:border-0">
                <p className="font-medium">
                  {c.author_display_name}{" "}
                  <span className="text-muted-foreground">
                    · {c.deleted_at ? new Date(c.deleted_at).toLocaleString() : ""}
                  </span>
                </p>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{c.body}</p>
                <form action={restoreCommentAction} className="mt-2">
                  <input type="hidden" name="commentId" value={c.id} />
                  <button type="submit" className="text-xs underline">
                    Restore
                  </button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Link href="/admin/clkr" className="text-sm underline">
        ← Admin home
      </Link>
    </div>
  );
}
