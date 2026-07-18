import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createLucyChat,
  uploadLucyFile,
} from "@/app/(dashboard)/portal/lucy/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function LucyProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("lucy_projects")
    .select("id, title, locale")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!project) redirect("/portal/lucy");

  const [{ data: chats }, { data: files }] = await Promise.all([
    supabase
      .from("lucy_chats")
      .select("id, title, updated_at, status")
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("lucy_files")
      .select("id, file_name, size_bytes, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <Link href="/portal/lucy" className="text-xs underline">
          ← All projects
        </Link>
        <h1 className="font-serif text-2xl text-[var(--forest)]">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          Locale {project.locale.toUpperCase()} · pick a chat or upload files
        </p>
      </div>

      {sp.error ? <p className="text-sm text-red-700">{sp.error}</p> : null}

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Chats</CardTitle>
            <CardDescription>Conversations with Lucy in this project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={createLucyChat}>
              <input type="hidden" name="project_id" value={projectId} />
              <button type="submit" className="btn-primary text-sm">
                New chat
              </button>
            </form>
            <div className="space-y-2">
              {!chats?.length ? (
                <p className="text-sm text-muted-foreground">No chats yet.</p>
              ) : (
                chats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/portal/lucy/${projectId}/${c.id}`}
                    className="block rounded border px-3 py-2 text-sm hover:bg-muted/30"
                  >
                    {c.title}
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>PDF, images, or Word docs (max 10 MB).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={uploadLucyFile} className="space-y-2">
              <input type="hidden" name="project_id" value={projectId} />
              <input type="file" name="file" required className="block w-full text-sm" />
              <button type="submit" className="rounded border px-3 py-1.5 text-sm">
                Upload
              </button>
            </form>
            <ul className="space-y-1 text-sm">
              {!files?.length ? (
                <li className="text-muted-foreground">No files yet.</li>
              ) : (
                files.map((f) => (
                  <li key={f.id} className="truncate">
                    {f.file_name}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(f.size_bytes / 1024)} KB)
                    </span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
