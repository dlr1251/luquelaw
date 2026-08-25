import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import {
  createLucyChat,
  escalateLucyChat,
  updateLucyChatPersonality,
  uploadLucyFile,
} from "@/app/(dashboard)/portal/lucy/actions";
import { LucyChatClient } from "@/components/lucy/lucy-chat-client";
import { LucyDetailsSheet } from "@/components/lucy/lucy-details-sheet";
import { LucyRenameTitle } from "@/components/lucy/lucy-rename-title";
import { Button } from "@/components/ui/button";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { LUCY_AI_NAME } from "@/lib/lucy/brand";
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
    .select(
      "id, title, aggressiveness, technicality, flexibility, eve_session_id, eve_continuation_token, eve_stream_index",
    )
    .eq("id", chatId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!chat) redirect(`/portal/lucy/${projectId}`);

  const balance = await getLucyBalance(userId);
  const locale = project.locale === "es" ? "es" : "en";
  const initialEveSession = chat.eve_session_id
    ? {
        sessionId: chat.eve_session_id as string,
        continuationToken: (chat.eve_continuation_token as string | null) ?? undefined,
        streamIndex: Number(chat.eve_stream_index ?? 0) || 0,
      }
    : null;

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
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/20 md:flex">
        <div className="p-3">
          <form action={createLucyChat}>
            <input type="hidden" name="project_id" value={projectId} />
            <Button type="submit" variant="outline" size="sm" className="w-full justify-start gap-1.5">
              <Plus className="size-3.5" />
              New chat
            </Button>
          </form>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Chats
          </p>
          <ul className="space-y-0.5">
            {(chats ?? []).map((c) => (
              <li key={c.id}>
                {c.id === chatId ? (
                  <div className="rounded-md bg-background px-2 py-1.5 font-medium text-foreground shadow-sm">
                    <LucyRenameTitle
                      chatId={c.id}
                      projectId={projectId}
                      title={c.title}
                      variant="nav"
                    />
                  </div>
                ) : (
                  <Link
                    href={`/portal/lucy/${projectId}/${c.id}`}
                    className="block truncate rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4">
          <div className="min-w-0">
            <LucyRenameTitle
              chatId={chat.id}
              projectId={projectId}
              title={chat.title}
              variant="header"
            />
            <p className="truncate text-[11px] text-muted-foreground">
              {LUCY_AI_NAME} · immigration · not legal advice
            </p>
          </div>
          <LucyDetailsSheet>
            <form action={createLucyChat} className="md:hidden">
              <input type="hidden" name="project_id" value={projectId} />
              <Button type="submit" variant="outline" size="sm" className="w-full">
                New chat
              </Button>
            </form>

            <div className="space-y-2 md:hidden">
              <p className="text-xs font-medium text-muted-foreground">Chats</p>
              <ul className="space-y-1">
                {(chats ?? []).map((c) => (
                  <li key={c.id}>
                    {c.id === chatId ? (
                      <div className="rounded-md border border-foreground/20 px-2 py-1.5 font-medium">
                        <LucyRenameTitle
                          chatId={c.id}
                          projectId={projectId}
                          title={c.title}
                          variant="nav"
                        />
                      </div>
                    ) : (
                      <Link
                        href={`/portal/lucy/${projectId}/${c.id}`}
                        className="block truncate rounded-md border px-2 py-1.5 text-sm text-muted-foreground"
                      >
                        {c.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Files</p>
              <form action={uploadLucyFile} className="space-y-2">
                <input type="hidden" name="project_id" value={projectId} />
                <input type="hidden" name="chat_id" value={chatId} />
                <input type="file" name="file" required className="block w-full text-xs" />
                <Button type="submit" variant="outline" size="sm">
                  Upload
                </Button>
              </form>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {(files ?? []).length ? (
                  (files ?? []).map((f) => (
                    <li key={f.id} className="truncate">
                      {f.file_name}
                    </li>
                  ))
                ) : (
                  <li>No files yet. PDF, images, or Word, max 10 MB.</li>
                )}
              </ul>
            </div>

            <form action={updateLucyChatPersonality} className="space-y-3 text-sm">
              <p className="text-xs font-medium text-muted-foreground">Tone</p>
              <input type="hidden" name="chat_id" value={chatId} />
              <input type="hidden" name="project_id" value={projectId} />
              <label className="block space-y-1">
                Directness
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
              <Button type="submit" variant="outline" size="sm">
                Save tone
              </Button>
            </form>

            <form action={escalateLucyChat} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Lawyer review</p>
              <p className="text-xs text-muted-foreground">
                Send this conversation to the firm. Pay later to unlock the verified answer.
              </p>
              <input type="hidden" name="chat_id" value={chatId} />
              <input type="hidden" name="project_id" value={projectId} />
              <textarea
                name="note"
                rows={3}
                placeholder="Optional note for the lawyer"
                className="w-full rounded-md border px-2 py-1.5 text-sm"
              />
              <Button type="submit" className="w-full">
                Request lawyer review
              </Button>
            </form>
          </LucyDetailsSheet>
        </div>

        {sp.error ? (
          <p className="border-b px-4 py-2 text-sm text-red-700">{sp.error}</p>
        ) : null}

        <LucyChatClient
          chatId={chatId}
          projectId={projectId}
          locale={locale}
          balanceCents={balance}
          sessionSpendCents={sessionSpend}
          initialEveSession={initialEveSession}
          initialMessages={(messages ?? []).map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
            cost_cents: m.cost_cents,
          }))}
        />
      </section>
    </div>
  );
}
