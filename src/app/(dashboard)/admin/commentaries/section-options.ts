"use server";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { getSectionOptionsForNorm } from "@/lib/commentaries/get-commentaries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function fetchSectionsForNorm(normId: string) {
  if (!isSupabaseConfigured() || !normId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    return [];
  }

  return getSectionOptionsForNorm(normId);
}
