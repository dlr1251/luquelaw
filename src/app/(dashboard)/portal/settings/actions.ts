"use server";

import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function updateOwnProfile(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 80);
  const localeRaw = String(formData.get("locale") ?? "en").trim();
  const locale = localeRaw === "es" ? "es" : "en";
  const aboutShort = String(formData.get("about_short") ?? "").trim().slice(0, 280);

  if (!displayName) {
    return { ok: false as const, error: "Display name is required" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      locale,
      about_short: aboutShort || null,
    })
    .eq("id", userId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/portal/settings");
  revalidatePath("/portal");
  return { ok: true as const };
}
