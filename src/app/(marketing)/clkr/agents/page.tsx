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
  title: "Agents & prompts — CLKR",
  description: "Curated LegalAI agents, skills, and prompts for Colombian legal work.",
  path: "/clkr/agents",
  locale: "en",
});

export default async function ClkrAgentsPage() {
  const access = await requireEntitlement("agents");
  if (!access.ok) {
    return <ClkrModuleGate locale="en" lockedReason={access.reason} />;
  }

  const [agents, prompts, skills] = await Promise.all([
    getPublishedAgents("en"),
    getPublishedPrompts("en"),
    getPublishedSkills("en"),
  ]);

  return (
    <main className="flex-1">
      <ClkrProductNav locale="en" signedIn />
      <ClkrModuleHero
        locale="en"
        eyebrow="CLKR · Agents"
        title="Agents, skills & prompts"
        subtitle="Copy prompts into your AI tools. Always verify outputs against primary sources."
        contactCta="Need a guided consultation?"
        contactLink="Meet Lucy"
        contactHref="/portal/lucy"
      />
      <Container className="py-12 sm:py-14">
        <AgentsLibrary agents={agents} prompts={prompts} skills={skills} locale="en" />
        <ClkrDisclaimer
          className="mt-12"
          text="Informational tools only. Not legal advice. You remain responsible for professional judgment."
        />
      </Container>
    </main>
  );
}
