import Link from "next/link";
import { notFound } from "next/navigation";

import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { Container } from "@/components/container";
import { QuizPageClient } from "@/components/quizzes/quiz-page-client";
import { requireEntitlement } from "@/lib/billing/entitlements";
import { getQuizWithQuestions } from "@/lib/quizzes/get-quizzes";

type Props = { params: Promise<{ slug: string }> };

export default async function ClkrQuizDetailPage({ params }: Props) {
  const { slug } = await params;
  const access = await requireEntitlement("quizzes");
  if (!access.ok) {
    return <ClkrModuleGate kind="quizzes" locale="en" lockedReason={access.reason} />;
  }

  const data = await getQuizWithQuestions(slug, "en");
  if (!data) notFound();

  return (
    <main className="flex-1">
      <Container className="py-14 sm:py-16">
        <Link href="/clkr/quizzes" className="text-sm font-bold text-[color:var(--forest)] hover:underline">
          ← All quizzes
        </Link>
        <div className="mt-8">
          <QuizPageClient quiz={data.quiz} questions={data.questions} locale="en" />
        </div>
      </Container>
    </main>
  );
}
