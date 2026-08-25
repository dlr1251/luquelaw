import { redirect } from "next/navigation";

import {
  adminModerateQuestion,
  adminResolveReport,
} from "@/lib/community/actions";
import {
  listOpenReports,
  listRecentQuestionsAdmin,
} from "@/lib/community/queries";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminCommunityPage() {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!isAppAdmin(data?.claims as Record<string, unknown> | null)) {
    redirect("/portal");
  }

  const [reports, questions] = await Promise.all([
    listOpenReports(),
    listRecentQuestionsAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community moderation</CardTitle>
          <CardDescription>Open reports and recent questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section className="space-y-3">
            <h2 className="font-semibold">Open reports</h2>
            {reports.length === 0 ? (
              <p className="text-muted-foreground">No open reports.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center gap-2 border-b pb-2">
                  <span>
                    {r.target_type} · {r.target_id.slice(0, 8)}… · {r.reason || "(no reason)"}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await adminResolveReport(r.id, "resolved");
                    }}
                  >
                    <button type="submit" className="btn-secondary btn-secondary-sm">
                      Resolve
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await adminResolveReport(r.id, "dismissed");
                    }}
                  >
                    <button type="submit" className="btn-secondary btn-secondary-sm">
                      Dismiss
                    </button>
                  </form>
                </div>
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Recent questions</h2>
            {questions.map((q) => (
              <div key={q.id} className="flex flex-wrap items-center gap-2 border-b pb-2">
                <a href={`/community/${q.slug}`} className="underline">
                  {q.title}
                </a>
                <span className="text-xs text-muted-foreground">{q.status}</span>
                <form
                  action={async () => {
                    "use server";
                    await adminModerateQuestion(q.id, "remove");
                  }}
                >
                  <button type="submit" className="btn-secondary btn-secondary-sm">
                    Remove
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await adminModerateQuestion(q.id, "close");
                  }}
                >
                  <button type="submit" className="btn-secondary btn-secondary-sm">
                    Close
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await adminModerateQuestion(q.id, "restore");
                  }}
                >
                  <button type="submit" className="btn-secondary btn-secondary-sm">
                    Restore
                  </button>
                </form>
              </div>
            ))}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
