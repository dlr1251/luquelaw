import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type QuizRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  topic_slug: string | null;
  status: string;
  sort_order: number;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation: string | null;
  sort_order: number;
};

export async function getPublishedQuizzes(locale: "en" | "es"): Promise<QuizRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("quizzes")
    .select("id, slug_key, locale, title, description, topic_slug, status, sort_order")
    .eq("locale", locale)
    .eq("status", "published")
    .order("sort_order");
  return (data as QuizRecord[]) ?? [];
}

export async function getQuizWithQuestions(
  slugKey: string,
  locale: "en" | "es",
): Promise<{ quiz: QuizRecord; questions: QuizQuestion[] } | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, slug_key, locale, title, description, topic_slug, status, sort_order")
    .eq("slug_key", slugKey)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();

  if (!quiz) return null;

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, quiz_id, prompt, choices, correct_index, explanation, sort_order")
    .eq("quiz_id", quiz.id)
    .order("sort_order");

  const parsed = ((questions ?? []) as Array<Omit<QuizQuestion, "choices"> & { choices: unknown }>).map(
    (q) => ({
      ...q,
      choices: Array.isArray(q.choices) ? q.choices.map(String) : [],
    }),
  );

  return { quiz: quiz as QuizRecord, questions: parsed };
}

export async function getAllQuizzesForAdmin(): Promise<QuizRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("quizzes")
    .select("id, slug_key, locale, title, description, topic_slug, status, sort_order")
    .order("sort_order");
  return (data as QuizRecord[]) ?? [];
}
