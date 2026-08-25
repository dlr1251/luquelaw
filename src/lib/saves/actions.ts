"use server";

import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type SaveTargetType = "guide" | "norm" | "post";

export async function toggleUserSave(input: {
  targetType: SaveTargetType;
  targetSlug: string;
  title: string;
  locale: "en" | "es";
}) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required", saved: false };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("user_saves")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", input.targetType)
    .eq("target_slug", input.targetSlug)
    .eq("locale", input.locale)
    .maybeSingle();

  if (existing) {
    await supabase.from("user_saves").delete().eq("id", existing.id);
    revalidatePath("/portal/saved");
    return { ok: true as const, saved: false };
  }

  const { error } = await supabase.from("user_saves").insert({
    user_id: userId,
    target_type: input.targetType,
    target_slug: input.targetSlug,
    title: input.title.slice(0, 200),
    locale: input.locale,
  });

  if (error) {
    return { ok: false as const, error: error.message, saved: false };
  }

  revalidatePath("/portal/saved");
  return { ok: true as const, saved: true };
}

export async function listUserSaves() {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_saves")
    .select("id, target_type, target_slug, title, locale, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function isSaved(
  targetType: SaveTargetType,
  targetSlug: string,
  locale: "en" | "es",
): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_saves")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_slug", targetSlug)
    .eq("locale", locale)
    .maybeSingle();

  return Boolean(data);
}
