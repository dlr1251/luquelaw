"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireEntitlement } from "@/lib/billing/entitlements";

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, number>,
): Promise<{ score: number; total: number } | { error: string }> {
  const access = await requireEntitlement("quizzes");
  if (!access.ok) return { error: access.reason };
  if (!isSupabaseConfigured()) return { error: "not_configured" };

  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, correct_index")
    .eq("quiz_id", quizId);

  if (!questions?.length) return { error: "no_questions" };

  let score = 0;
  const answerRows: Array<{
    question_id: string;
    selected_index: number;
    is_correct: boolean;
  }> = [];

  for (const q of questions) {
    const selected = answers[q.id];
    const isCorrect = selected === q.correct_index;
    if (isCorrect) score += 1;
    if (selected !== undefined) {
      answerRows.push({
        question_id: q.id,
        selected_index: selected,
        is_correct: isCorrect,
      });
    }
  }

  const { data: attempt, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      user_id: access.userId,
      score,
      total: questions.length,
    })
    .select("id")
    .single();

  if (error || !attempt) return { error: error?.message ?? "attempt_failed" };

  if (answerRows.length) {
    await supabase.from("quiz_answers").insert(
      answerRows.map((row) => ({
        attempt_id: attempt.id,
        ...row,
      })),
    );
  }

  return { score, total: questions.length };
}
