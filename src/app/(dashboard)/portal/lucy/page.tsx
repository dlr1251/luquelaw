import Link from "next/link";

import { createLucyProject } from "@/app/(dashboard)/portal/lucy/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LucyProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; topup?: string }>;
}) {
  const sp = await searchParams;
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("lucy_projects")
    .select("id, title, locale, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-[var(--forest)]">Lucy</h1>
        <p className="text-sm text-muted-foreground">
          AI immigration consultations — projects, files, and lawyer review unlock.
        </p>
      </div>

      {sp.topup === "success" ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          Credits added. You can chat with Lucy now.
        </p>
      ) : null}
      {sp.error ? <p className="text-sm text-red-700">{sp.error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>New project</CardTitle>
          <CardDescription>
            Each project holds chats and files for a matter. Lucy stays in Immigration for now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLucyProject} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              Title
              <input
                name="title"
                placeholder="e.g. M visa renewal"
                className="rounded border px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Locale
              <select name="locale" className="rounded border px-3 py-2" defaultValue="en">
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!projects?.length ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            projects.map((p) => (
              <Link
                key={p.id}
                href={`/portal/lucy/${p.id}`}
                className="block rounded border px-3 py-3 text-sm hover:bg-muted/30"
              >
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.locale.toUpperCase()} · updated {new Date(p.updated_at).toLocaleString()}
                </p>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
