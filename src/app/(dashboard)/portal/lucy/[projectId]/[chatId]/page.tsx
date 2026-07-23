import Link from "next/link";
import { redirect } from "next/navigation";

import {
  escalateLucyChat,
  updateLucyChatPersonality,
  uploadLucyFile,
} from "@/app/(dashboard)/portal/lucy/actions";
import { LucyChatClient } from "@/components/lucy/lucy-chat-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyBalance } from "@/lib/lucy/wallet";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function LucyChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; chatId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { projectId, chatId } = await params;
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

  const { data: chat } = await supabase
    .from("lucy_chats")
    .select("id, title, aggressiveness, technicality, flexibility")
    .eq("id", chatId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!chat) redirect(`/portal/lucy/${projectId}`);

  const balance = await getLucyBalance(userId);

  const [{ data: messages }, { data: files }, { data: chats }] = await Promise.all([
    supabase
      .from("lucy_messages")
      .select("id, role, content, cost_cents, created_at")
      .eq("chat_id", chatId)
      .order("created_at"),
    supabase
      .from("lucy_files")
      .select("id, file_name, size_bytes")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("lucy_chats")
      .select("id, title")
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false }),
  ]);

  const sessionSpend = (messages ?? []).reduce((sum, m) => sum + (m.cost_cents ?? 0), 0);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[240px_1fr_260px]">
      <aside className="space-y-4">
        <div>
          <Link href={`/portal/lucy/${projectId}`} className="text-xs underline">
            ← {project.title}
          </Link>
          <h2 className="mt-2 text-sm font-semibold">Chats</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {(chats ?? []).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/portal/lucy/${projectId}/${c.id}`}
                  className={
                    c.id === chatId
                      ? "font-medium text-[var(--forest)]"
                      : "text-muted-foreground hover:underline"
                  }
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Files</h2>
          <form action={uploadLucyFile} className="mt-2 space-y-2">
            <input type="hidden" name="project_id" value={projectId} />
            <input type="hidden" name="chat_id" value={chatId} />
            <input type="file" name="file" required className="block w-full text-xs" />
            <button type="submit" className="rounded border px-2 py-1 text-xs">
              Upload
            </button>
          </form>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {(files ?? []).map((f) => (
              <li key={f.id} className="truncate">
                {f.file_name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <Card className="min-h-[32rem]">
        <CardHeader>
          <CardTitle>{chat.title}</CardTitle>
          <CardDescription>
            Torny · Immigration · not legal advice until lawyer unlock
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error ? <p className="mb-3 text-sm text-red-700">{sp.error}</p> : null}
          <LucyChatClient
            chatId={chatId}
            projectId={projectId}
            balanceCents={balance}
            sessionSpendCents={sessionSpend}
            initialMessages={(messages ?? []).map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant" | "system",
              content: m.content,
              cost_cents: m.cost_cents,
            }))}
          />
        </CardContent>
      </Card>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personality</CardTitle>
            <CardDescription>0–100 dials for this chat.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateLucyChatPersonality} className="space-y-3 text-sm">
              <input type="hidden" name="chat_id" value={chatId} />
              <input type="hidden" name="project_id" value={projectId} />
              <label className="block space-y-1">
                Aggressiveness
                <input
                  type="range"
                  name="aggressiveness"
                  min={0}
                  max={100}
                  defaultValue={chat.aggressiveness}
                  className="w-full"
                />
              </label>
              <label className="block space-y-1">
                Technicality
                <input
                  type="range"
                  name="technicality"
                  min={0}
                  max={100}
                  defaultValue={chat.technicality}
                  className="w-full"
                />
              </label>
              <label className="block space-y-1">
                Flexibility
                <input
                  type="range"
                  name="flexibility"
                  min={0}
                  max={100}
                  defaultValue={chat.flexibility}
                  className="w-full"
                />
              </label>
              <button type="submit" className="rounded border px-3 py-1.5 text-xs">
                Save dials
              </button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Escalate</CardTitle>
            <CardDescription>
              Send package to the firm. Pay later to unlock the verified answer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={escalateLucyChat} className="space-y-2">
              <input type="hidden" name="chat_id" value={chatId} />
              <input type="hidden" name="project_id" value={projectId} />
              <textarea
                name="note"
                rows={3}
                placeholder="Optional note for the lawyer…"
                className="w-full rounded border px-2 py-1.5 text-sm"
              />
              <button type="submit" className="btn-primary w-full text-sm">
                Request lawyer review
              </button>
            </form>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
