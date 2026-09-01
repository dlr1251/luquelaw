import Link from "next/link";

import { AgentsLibrary } from "@/components/agents/agents-library";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleGate } from "@/components/clkr/clkr-module-gate";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { Container } from "@/components/container";
import { getPublishedAgents } from "@/lib/agents/get-agents";
import { requireEntitlement } from "@/lib/billing/entitlements";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Agents — CLKR Professional",
  description: "Configurable LegalAI agents for Colombian legal work. Requires Professional plan.",
  path: "/clkr/agents",
  locale: "en",
});

export default async function ClkrAgentsPage() {
  const access = await requireEntitlement("agents");
  const agents = access.ok ? await getPublishedAgents("en") : [];

  if (!access.ok) {
    return (
      <>
        <ClkrModuleGate locale="en" lockedReason={access.reason} />
        <Container className="pb-12">
          <p className="text-center text-sm text-muted-foreground">
            Prompts and skills are public in the{" "}
            <Link href="/clkr/library" className="font-semibold text-[color:var(--forest)] underline">
              library
            </Link>
            .
          </p>
        </Container>
      </>
    );
  }

  return (
    <main className="flex-1">
      <ClkrModuleHero
        locale="en"
        eyebrow="CLKR · Agents"
        title="Configurable agents"
        subtitle="Professional-plan agents for structured legal workflows. Copy prompts from the public library or run guided consultations in Lucy AI."
        contactCta="Open prompt library"
        contactLink="Browse library"
        contactHref="/clkr/library"
      />
      <Container className="py-12 sm:py-14">
        <AgentsLibrary agents={agents} locale="en" />
        <ClkrDisclaimer
          className="mt-12"
          text="Informational tools only. Not legal advice. You remain responsible for professional judgment."
        />
      </Container>
    </main>
  );
}
