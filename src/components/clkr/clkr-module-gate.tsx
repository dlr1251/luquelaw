import Link from "next/link";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { loginHref } from "@/lib/auth/safe-next";
import type { ClkrHubLocale } from "@/lib/clkr/hub-content";

type ModuleKind = "agents" | "quizzes";

const copy = {
  en: {
    agents: {
      eyebrow: "CLKR · Agents",
      title: "Agents, skills & prompts",
      body: "A curated toolkit of LegalAI agents, skills, and prompts for day-to-day legal work. Sign in with an active subscription to unlock the library.",
      ctaLogin: "Sign in",
      ctaPricing: "View plans",
      back: "Back to CLKR",
      disclaimer:
        "Informational tools only. Not legal advice. You remain responsible for professional judgment and verification.",
    },
    quizzes: {
      eyebrow: "CLKR · Quizzes",
      title: "Quizzes & evaluation",
      body: "Topic-linked quizzes for students of Colombian law. Sign in with a Student (or higher) plan to take assessments and track progress.",
      ctaLogin: "Sign in",
      ctaPricing: "View plans",
      back: "Back to CLKR",
      disclaimer:
        "For educational purposes only. Scores do not certify legal competence or replace professional study.",
    },
  },
  es: {
    agents: {
      eyebrow: "CLKR · Agentes",
      title: "Agentes, skills y prompts",
      body: "Kit curado de agentes LegalAI, skills y prompts para el trabajo jurídico diario. Inicia sesión con una suscripción activa para desbloquear la biblioteca.",
      ctaLogin: "Iniciar sesión",
      ctaPricing: "Ver planes",
      back: "Volver a CLKR",
      disclaimer:
        "Solo herramientas informativas. No es asesoría jurídica. Tú respondes por el criterio profesional y la verificación.",
    },
    quizzes: {
      eyebrow: "CLKR · Quizzes",
      title: "Quizzes y evaluación",
      body: "Quizzes vinculados a temas para estudiantes de derecho colombiano. Inicia sesión con un plan Estudiante (o superior) para evaluar y seguir tu progreso.",
      ctaLogin: "Iniciar sesión",
      ctaPricing: "Ver planes",
      back: "Volver a CLKR",
      disclaimer:
        "Solo fines educativos. Los puntajes no certifican competencia jurídica ni sustituyen el estudio profesional.",
    },
  },
} as const;

type Props = {
  kind: ModuleKind;
  locale?: ClkrHubLocale;
  lockedReason?: "auth" | "entitlement";
};

export function ClkrModuleGate({ kind, locale = "en", lockedReason = "auth" }: Props) {
  const t = copy[locale][kind];
  const prefix = locale === "es" ? "/es" : "";
  const hubHref = `${prefix}/clkr`;
  const pricingHref = `${prefix}/pricing`;
  const modulePath = kind === "agents" ? `${prefix}/clkr/agents` : `${prefix}/clkr/quizzes`;

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-14 sm:py-16">
          <p className="marketing-eyebrow">{t.eyebrow}</p>
          <h1 className="marketing-display mt-3 max-w-3xl text-[color:var(--forest)]">
            {t.title}
          </h1>
          <p className="marketing-body mt-4 max-w-2xl text-base">{t.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {lockedReason === "auth" ? (
              <Link href={loginHref(modulePath)} className="btn-primary">
                {t.ctaLogin}
              </Link>
            ) : null}
            <Link href={pricingHref} className="btn-secondary">
              {t.ctaPricing}
            </Link>
            <Link
              href={hubHref}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:underline"
            >
              {t.back}
            </Link>
          </div>
          <ClkrDisclaimer text={t.disclaimer} className="mt-10" />
        </Container>
      </section>
    </main>
  );
}
