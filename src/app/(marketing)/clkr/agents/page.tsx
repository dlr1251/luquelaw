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
  title: "Agents & prompts — CLKR",
  description: "Curated LegalAI agents, skills, and prompts for Colombian legal work.",
  path: "/clkr/agents",
  locale: "en",
});

export default async function ClkrAgentsPage() {
  const access = await requireEntitlement("agents");
  if (!access.ok) {
    return <ClkrModuleGate kind="agents" locale="en" lockedReason={access.reason} />;
  }

  const [agents, prompts, skills] = await Promise.all([
    getPublishedAgents("en"),
    getPublishedPrompts("en"),
    getPublishedSkills("en"),
  ]);

  return (
    <main className="flex-1">
      <Container className="py-14 sm:py-16">
        <p className="marketing-eyebrow">CLKR · Agents</p>
        <h1 className="marketing-display mt-3 text-[color:var(--forest)]">
          Agents, skills & prompts
        </h1>
        <p className="marketing-body mt-4 max-w-2xl">
          Copy prompts into your AI tools. Always verify outputs against primary sources.
        </p>
        <p className="mt-4">
          <Link href="/clkr" className="text-sm font-bold text-[color:var(--forest)] hover:underline">
            ← Back to CLKR
          </Link>
        </p>
        <div className="mt-10">
          <AgentsLibrary agents={agents} prompts={prompts} skills={skills} locale="en" />
        </div>
        <ClkrDisclaimer
          className="mt-12"
          text="Informational tools only. Not legal advice. You remain responsible for professional judgment."
        />
      </Container>
    </main>
  );
}
