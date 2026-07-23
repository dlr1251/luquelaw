"use server";

import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function displayNameFor(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  return data?.display_name?.trim() || "Member";
}

async function requireAdminUser(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false, error: "forbidden" };
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!isAppAdmin(data?.claims as Record<string, unknown> | null)) {
    return { ok: false, error: "forbidden" };
  }
  return { ok: true, userId };
}

export async function createQuestion(input: {
  title: string;
  body: string;
  tags: string[];
  locale: "en" | "es";
}) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const title = input.title.trim();
  const body = input.body.trim();
  if (title.length < 8 || body.length < 16) {
    return { ok: false as const, error: "Title or body too short" };
  }

  const base = slugify(title) || "question";
  const slug = `${base}-${Date.now().toString(36)}`;
  const author_display_name = await displayNameFor(userId);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_questions")
    .insert({
      author_id: userId,
      title,
      body,
      slug,
      tags: input.tags.slice(0, 5),
      locale: input.locale,
      author_display_name,
    })
    .select("slug")
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/community");
  revalidatePath("/es/comunidad");
  return { ok: true as const, slug: data.slug as string };
}

export async function createAnswer(input: { questionId: string; body: string }) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const body = input.body.trim();
  if (body.length < 8) return { ok: false as const, error: "Answer too short" };

  const author_display_name = await displayNameFor(userId);
  const supabase = await createClient();
  const { error } = await supabase.from("community_answers").insert({
    question_id: input.questionId,
    author_id: userId,
    body,
    author_display_name,
  });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/community");
  revalidatePath("/es/comunidad");
  return { ok: true as const };
}

export async function createComment(input: {
  questionId?: string;
  answerId?: string;
  body: string;
}) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const body = input.body.trim();
  if (!body) return { ok: false as const, error: "Empty comment" };

  const author_display_name = await displayNameFor(userId);
  const supabase = await createClient();
  const { error } = await supabase.from("community_comments").insert({
    author_id: userId,
    question_id: input.questionId ?? null,
    answer_id: input.answerId ?? null,
    body,
    author_display_name,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/community");
  revalidatePath("/es/comunidad");
  return { ok: true as const };
}

export async function castVote(input: {
  targetType: "question" | "answer";
  targetId: string;
  value: 1 | -1;
}) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("community_cast_vote", {
    p_target_type: input.targetType,
    p_target_id: input.targetId,
    p_value: input.value,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/community");
  revalidatePath("/es/comunidad");
  return { ok: true as const, score: Number(data) };
}

export async function acceptAnswer(answerId: string) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("community_accept_answer", {
    p_answer_id: answerId,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/community");
  revalidatePath("/es/comunidad");
  return { ok: true as const };
}

export async function reportContent(input: {
  targetType: "question" | "answer" | "comment";
  targetId: string;
  reason: string;
}) {
  const userId = await getSessionUserId();
  if (!userId || !isSupabaseConfigured()) {
    return { ok: false as const, error: "login_required" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("community_reports").insert({
    reporter_id: userId,
    target_type: input.targetType,
    target_id: input.targetId,
    reason: input.reason.trim().slice(0, 500),
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function adminModerateQuestion(
  questionId: string,
  action: "remove" | "restore" | "close",
) {
  const auth = await requireAdminUser();
  if (!auth.ok) return auth;

  const status =
    action === "remove" ? "removed" : action === "close" ? "closed" : "open";
  const supabase = await createClient();
  const { error } = await supabase
    .from("community_questions")
    .update({ status })
    .eq("id", questionId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/community");
  revalidatePath("/community");
  return { ok: true as const };
}

export async function adminResolveReport(
  reportId: string,
  status: "resolved" | "dismissed",
) {
  const auth = await requireAdminUser();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { error } = await supabase
    .from("community_reports")
    .update({ status })
    .eq("id", reportId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/community");
  return { ok: true as const };
}
