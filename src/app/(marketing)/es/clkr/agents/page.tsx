import Link from "next/link";

import { AgentsLibrary } from "@/components/agents/agents-library";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { Container } from "@/components/container";
import {
  getPublishedAgents,
  getPublishedPrompts,
  getPublishedSkills,
} from "@/lib/agents/get-agents";
import { requireEntitlement } from "@/lib/billing/entitlements";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Agentes y prompts — CLKR",
  description: "Agentes LegalAI, skills y prompts curados para el trabajo jurídico en Colombia.",
  path: "/es/clkr/agents",
  locale: "es",
});

export default async function ClkrAgentsEsPage() {
  const access = await requireEntitlement("agents");
  if (!access.ok) {
    return <ClkrModuleGate kind="agents" locale="es" lockedReason={access.reason} />;
  }

  const [agents, prompts, skills] = await Promise.all([
    getPublishedAgents("es"),
    getPublishedPrompts("es"),
    getPublishedSkills("es"),
  ]);

  return (
    <main className="flex-1">
      <Container className="py-14 sm:py-16">
        <p className="marketing-eyebrow">CLKR · Agentes</p>
        <h1 className="marketing-display mt-3 text-[color:var(--forest)]">
          Agentes, skills y prompts
        </h1>
        <p className="marketing-body mt-4 max-w-2xl">
          Copia prompts en tus herramientas de IA. Verifica siempre contra fuentes primarias.
        </p>
        <p className="mt-4">
          <Link
            href="/es/clkr"
            className="text-sm font-bold text-[color:var(--forest)] hover:underline"
          >
            ← Volver a CLKR
          </Link>
        </p>
        <div className="mt-10">
          <AgentsLibrary agents={agents} prompts={prompts} skills={skills} locale="es" />
        </div>
        <ClkrDisclaimer
          className="mt-12"
          text="Solo herramientas informativas. No es asesoría jurídica. Tú respondes por el criterio profesional."
        />
      </Container>
    </main>
  );
}
