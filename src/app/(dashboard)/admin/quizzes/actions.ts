"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/quizzes?error=Supabase+not+configured");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) redirect("/portal");
  return supabase;
}

export async function saveQuiz(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") redirect("/admin/quizzes?error=Invalid+locale");

  const payload = {
    slug_key: String(formData.get("slug_key") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    locale,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    topic_slug: String(formData.get("topic_slug") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  if (!payload.slug_key || !payload.title) {
    redirect("/admin/quizzes?error=Missing+fields");
  }

  let quizId = id;
  if (id) {
    const { error } = await supabase.from("quizzes").update(payload).eq("id", id);
    if (error) redirect(`/admin/quizzes?error=${encodeURIComponent(error.message)}`);
  } else {
    const { data, error } = await supabase.from("quizzes").insert(payload).select("id").single();
    if (error || !data) {
      redirect(`/admin/quizzes?error=${encodeURIComponent(error?.message ?? "insert failed")}`);
    }
    quizId = data.id;
  }

  const questionsRaw = String(formData.get("questions_json") ?? "").trim();
  if (questionsRaw && quizId) {
    let questions: Array<{
      prompt: string;
      choices: string[];
      correct_index: number;
      explanation?: string;
    }>;
    try {
      questions = JSON.parse(questionsRaw);
    } catch {
      redirect("/admin/quizzes?error=Invalid+questions+JSON");
    }

    await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);
    if (questions.length) {
      await supabase.from("quiz_questions").insert(
        questions.map((q, index) => ({
          quiz_id: quizId,
          prompt: q.prompt,
          choices: q.choices,
          correct_index: q.correct_index ?? 0,
          explanation: q.explanation ?? null,
          sort_order: index,
        })),
      );
    }
  }

  revalidatePath("/clkr/quizzes");
  revalidatePath("/es/clkr/quizzes");
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes?saved=1");
}

export async function deleteQuiz(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/quizzes?error=Missing+id");
  await supabase.from("quizzes").delete().eq("id", id);
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes?deleted=1");
}
