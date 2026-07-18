import Link from "next/link";

import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { Container } from "@/components/container";
import { requireEntitlement } from "@/lib/billing/entitlements";
import { getPublishedQuizzes } from "@/lib/quizzes/get-quizzes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Quizzes — CLKR",
  description: "Quizzes vinculados a temas para estudiantes de derecho colombiano.",
  path: "/es/clkr/quizzes",
  locale: "es",
});

export default async function ClkrQuizzesEsPage() {
  const access = await requireEntitlement("quizzes");
  if (!access.ok) {
    return <ClkrModuleGate kind="quizzes" locale="es" lockedReason={access.reason} />;
  }

  const quizzes = await getPublishedQuizzes("es");

  return (
    <main className="flex-1">
      <Container className="py-14 sm:py-16">
        <p className="marketing-eyebrow">CLKR · Quizzes</p>
        <h1 className="marketing-display mt-3 text-[color:var(--forest)]">Quizzes y evaluación</h1>
        <p className="mt-4">
          <Link
            href="/es/clkr"
            className="text-sm font-bold text-[color:var(--forest)] hover:underline"
          >
            ← Volver a CLKR
          </Link>
        </p>
        <ul className="mt-10 space-y-4">
          {quizzes.length === 0 ? (
            <li className="text-sm text-muted-foreground">Aún no hay quizzes publicados.</li>
          ) : (
            quizzes.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/es/clkr/quizzes/${q.slug_key}`}
                  className="block border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/50"
                >
                  <h2 className="font-display text-xl text-[color:var(--forest)]">{q.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{q.description}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </main>
  );
}
