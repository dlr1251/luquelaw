"use client";

import { QuizTaker } from "@/components/quizzes/quiz-taker";
import { submitQuizAttempt } from "@/app/(marketing)/clkr/quizzes/actions";
import type { QuizQuestion, QuizRecord } from "@/lib/quizzes/get-quizzes";

type Props = {
  quiz: QuizRecord;
  questions: QuizQuestion[];
  locale: "en" | "es";
};

export function QuizPageClient({ quiz, questions, locale }: Props) {
  return (
    <QuizTaker
      quiz={quiz}
      questions={questions}
      locale={locale}
      onSubmit={async (answers) => {
        const result = await submitQuizAttempt(quiz.id, answers);
        if ("error" in result) return { score: 0, total: questions.length };
        return result;
      }}
    />
  );
}
