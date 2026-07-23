import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type CommunityQuestionListItem = {
  id: string;
  title: string;
  slug: string;
  score: number;
  answer_count: number;
  tags: string[];
  locale: string;
  status: string;
  author_display_name: string;
  created_at: string;
};

export async function listQuestions(opts?: {
  locale?: "en" | "es";
  sort?: "newest" | "top" | "unanswered";
  limit?: number;
}): Promise<CommunityQuestionListItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let q = supabase
    .from("community_questions")
    .select(
      "id, title, slug, score, answer_count, tags, locale, status, author_display_name, created_at",
    )
    .neq("status", "removed");

  if (opts?.locale) q = q.eq("locale", opts.locale);

  if (opts?.sort === "top") {
    q = q.order("score", { ascending: false });
  } else if (opts?.sort === "unanswered") {
    q = q.eq("answer_count", 0).order("created_at", { ascending: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  const { data } = await q.limit(opts?.limit ?? 40);
  return (data ?? []) as CommunityQuestionListItem[];
}

export async function getQuestionBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: question } = await supabase
    .from("community_questions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!question || question.status === "removed") return null;

  const [{ data: answers }, { data: comments }] = await Promise.all([
    supabase
      .from("community_answers")
      .select("*")
      .eq("question_id", question.id)
      .is("deleted_at", null)
      .order("is_accepted", { ascending: false })
      .order("score", { ascending: false }),
    supabase
      .from("community_comments")
      .select("*")
      .eq("question_id", question.id)
      .is("deleted_at", null)
      .order("created_at"),
  ]);

  const answerIds = (answers ?? []).map((a) => a.id);
  const { data: answerComments } = answerIds.length
    ? await supabase
        .from("community_comments")
        .select("*")
        .in("answer_id", answerIds)
        .is("deleted_at", null)
        .order("created_at")
    : { data: [] as never[] };

  return {
    question,
    answers: answers ?? [],
    questionComments: comments ?? [],
    answerComments: answerComments ?? [],
  };
}

export async function listOpenReports() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_reports")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function listRecentQuestionsAdmin() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_questions")
    .select("id, title, slug, status, score, created_at, author_display_name")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}
