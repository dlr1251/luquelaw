import { redirect } from "next/navigation";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Project hub is skipped — open the latest chat (Eve-style). */
export default async function LucyProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("lucy_projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!project) redirect("/portal/lucy");

  const { data: latest } = await supabase
    .from("lucy_chats")
    .select("id")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest?.id) {
    redirect(`/portal/lucy/${projectId}/${latest.id}`);
  }

  const { data: chat } = await supabase
    .from("lucy_chats")
    .insert({ project_id: projectId, title: "New chat" })
    .select("id")
    .single();

  if (chat?.id) {
    redirect(`/portal/lucy/${projectId}/${chat.id}`);
  }

  redirect("/portal/lucy");
}
