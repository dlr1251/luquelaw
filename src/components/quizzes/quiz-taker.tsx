"use client";

import { useMemo, useState } from "react";

import type { QuizQuestion, QuizRecord } from "@/lib/quizzes/get-quizzes";

type Props = {
  quiz: QuizRecord;
  questions: QuizQuestion[];
  locale: "en" | "es";
  onSubmit: (answers: Record<string, number>) => Promise<{ score: number; total: number }>;
};

export function QuizTaker({ quiz, questions, locale, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [pending, setPending] = useState(false);

  const copy =
    locale === "es"
      ? { submit: "Enviar", score: "Puntaje", again: "Reintentar" }
      : { submit: "Submit", score: "Score", again: "Try again" };

  const allAnswered = useMemo(
    () => questions.every((q) => answers[q.id] !== undefined),
    [answers, questions],
  );

  async function handleSubmit() {
    setPending(true);
    try {
      const res = await onSubmit(answers);
      setResult(res);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[color:var(--forest)]">{quiz.title}</h1>
        {quiz.description ? (
          <p className="mt-2 text-sm text-muted-foreground">{quiz.description}</p>
        ) : null}
      </div>

      {result ? (
        <div className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-6">
          <p className="font-display text-2xl text-[color:var(--forest)]">
            {copy.score}: {result.score}/{result.total}
          </p>
          <button
            type="button"
            className="btn-secondary mt-4"
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
          >
            {copy.again}
          </button>
        </div>
      ) : (
        <>
          <ol className="space-y-6">
            {questions.map((q, idx) => (
              <li key={q.id} className="border border-[color:var(--moss)]/20 p-4">
                <p className="font-medium text-[color:var(--forest)]">
                  {idx + 1}. {q.prompt}
                </p>
                <div className="mt-3 space-y-2">
                  {q.choices.map((choice, choiceIdx) => (
                    <label key={choiceIdx} className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === choiceIdx}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: choiceIdx }))}
                      />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn-primary"
            disabled={!allAnswered || pending}
            onClick={handleSubmit}
          >
            {pending ? "…" : copy.submit}
          </button>
        </>
      )}
    </div>
  );
}
