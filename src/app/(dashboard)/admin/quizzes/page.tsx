import Link from "next/link";

import { deleteQuiz, saveQuiz } from "@/app/(dashboard)/admin/quizzes/actions";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllQuizzesForAdmin } from "@/lib/quizzes/get-quizzes";

const SAMPLE_QUESTIONS = `[
  {
    "prompt": "Sample question?",
    "choices": ["A", "B", "C"],
    "correct_index": 0,
    "explanation": "Because A."
  }
]`;

export default async function AdminQuizzesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const quizzes = await getAllQuizzesForAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">CLKR Quizzes</h1>
        <p className="text-sm text-muted-foreground">
          Student evaluation. Public at{" "}
          <Link href="/clkr/quizzes" className="underline">
            /clkr/quizzes
          </Link>
        </p>
      </div>

      {sp.error ? <p className="text-sm text-red-700">{sp.error}</p> : null}
      {sp.saved ? <p className="text-sm text-green-700">Saved.</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New / update quiz</CardTitle>
          <CardDescription>
            Optional questions_json replaces all questions for the quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveQuiz} className="grid gap-3 sm:grid-cols-2">
            <input name="id" placeholder="id (optional)" className="rounded border px-3 py-2 text-sm" />
            <input name="slug_key" required placeholder="slug_key" className="rounded border px-3 py-2 text-sm" />
            <select name="locale" className="rounded border px-3 py-2 text-sm" defaultValue="en">
              <option value="en">en</option>
              <option value="es">es</option>
            </select>
            <select name="status" className="rounded border px-3 py-2 text-sm" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <input name="title" required placeholder="title" className="rounded border px-3 py-2 text-sm sm:col-span-2" />
            <textarea name="description" placeholder="description" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={2} />
            <input name="topic_slug" placeholder="topic_slug (optional guide slug)" className="rounded border px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue={0} className="rounded border px-3 py-2 text-sm" />
            <textarea
              name="questions_json"
              placeholder="questions_json"
              defaultValue={SAMPLE_QUESTIONS}
              className="rounded border px-3 py-2 font-mono text-xs sm:col-span-2"
              rows={10}
            />
            <button type="submit" className="btn-primary sm:col-span-2">
              Save quiz
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quizzes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quizzes yet.</p>
          ) : (
            quizzes.map((q) => (
              <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {q.title}{" "}
                    <span className="text-muted-foreground">
                      ({q.locale} · {q.status})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{q.id}</p>
                </div>
                <form action={deleteQuiz}>
                  <input type="hidden" name="id" value={q.id} />
                  <button type="submit" className="text-red-700 underline">
                    Delete
                  </button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ButtonLink href="/admin/clkr" variant="outline">
        Back to guides admin
      </ButtonLink>
    </div>
  );
}
