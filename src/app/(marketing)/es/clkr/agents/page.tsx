import { AgentsLibrary } from "@/components/agents/agents-library";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
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
    return <ClkrModuleGate locale="es" lockedReason={access.reason} />;
  }

  const [agents, prompts, skills] = await Promise.all([
    getPublishedAgents("es"),
    getPublishedPrompts("es"),
    getPublishedSkills("es"),
  ]);

  return (
    <main className="flex-1">
      <ClkrProductNav locale="es" signedIn />
      <ClkrModuleHero
        locale="es"
        eyebrow="CLKR · Agentes"
        title="Agentes, skills y prompts"
        subtitle="Copia prompts en tus herramientas de IA. Verifica siempre contra fuentes primarias."
        contactCta="¿Consulta guiada?"
        contactLink="Conoce a Lucy"
        contactHref="/portal/lucy"
      />
      <Container className="py-12 sm:py-14">
        <AgentsLibrary agents={agents} prompts={prompts} skills={skills} locale="es" />
        <ClkrDisclaimer
          className="mt-12"
          text="Solo herramientas informativas. No es asesoría jurídica. Tú respondes por el criterio profesional."
        />
      </Container>
    </main>
  );
}
