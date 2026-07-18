import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getSignedInFlag(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    return Boolean(data?.claims);
  } catch {
    return false;
  }
}
