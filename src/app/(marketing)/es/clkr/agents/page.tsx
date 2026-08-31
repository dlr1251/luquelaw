import Link from "next/link";

import { AgentsLibrary } from "@/components/agents/agents-library";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { getPublishedAgents } from "@/lib/agents/get-agents";
import { requireEntitlement } from "@/lib/billing/entitlements";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Agentes — CLKR Profesional",
  description: "Agentes LegalAI configurables para trabajo jurídico en Colombia. Requiere plan Profesional.",
  path: "/es/clkr/agents",
  locale: "es",
});

export default async function ClkrAgentsEsPage() {
  const access = await requireEntitlement("agents");
  const agents = access.ok ? await getPublishedAgents("es") : [];

  if (!access.ok) {
    return (
      <>
        <ClkrModuleGate locale="es" lockedReason={access.reason} />
        <Container className="pb-12">
          <p className="text-center text-sm text-muted-foreground">
            Los prompts y skills son públicos en la{" "}
            <Link href="/es/clkr/library" className="font-semibold text-[color:var(--forest)] underline">
              biblioteca
            </Link>
            .
          </p>
        </Container>
      </>
    );
  }

  return (
    <main className="flex-1">
      <ClkrProductNav locale="es" signedIn />
      <ClkrModuleHero
        locale="es"
        eyebrow="CLKR · Agentes"
        title="Agentes configurables"
        subtitle="Agentes del plan Profesional para flujos jurídicos estructurados. Copia prompts desde la biblioteca pública o usa consultas guiadas en Lucy AI."
        contactCta="Abrir biblioteca de prompts"
        contactLink="Ver biblioteca"
        contactHref="/es/clkr/library"
      />
      <Container className="py-12 sm:py-14">
        <AgentsLibrary agents={agents} locale="es" />
        <ClkrDisclaimer
          className="mt-12"
          text="Solo herramientas informativas. No es asesoría jurídica. Tú respondes por el criterio profesional."
        />
      </Container>
    </main>
  );
}
