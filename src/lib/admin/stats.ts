import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminTopbarStats = {
  users: number;
  articles: number;
  openTickets: number;
};

export async function getAdminTopbarStats(): Promise<AdminTopbarStats> {
  if (!isSupabaseConfigured()) {
    return { users: 0, articles: 0, openTickets: 0 };
  }

  const supabase = await createClient();
  const [users, published, tickets] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("clkr_articles")
      .select("slug_key")
      .eq("status", "published"),
    supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);

  const articleKeys = new Set((published.data ?? []).map((row) => String(row.slug_key)));

  return {
    users: users.count ?? 0,
    articles: articleKeys.size,
    openTickets: tickets.count ?? 0,
  };
}
