import type { LucyPersonality } from "@/lib/lucy/types";

export function buildPersonalityBlock(p: LucyPersonality): string {
  const aggressiveness = clamp(p.aggressiveness);
  const technicality = clamp(p.technicality);
  const flexibility = clamp(p.flexibility);

  return `
## Personality dials (0–100)
- **Aggressiveness (${aggressiveness}):** ${aggressivenessLabel(aggressiveness)}
- **Technicality (${technicality}):** ${technicalityLabel(technicality)}
- **Flexibility (${flexibility}):** ${flexibilityLabel(flexibility)}

Apply these dials consistently in tone and depth, without violating the hard rules.
`.trim();
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function aggressivenessLabel(n: number): string {
  if (n < 30) return "Cautious, hedge heavily, emphasize risks and missing facts.";
  if (n < 70) return "Balanced advocacy: clear positions with proportional caveats.";
  return "Assertive framing of the client's strongest arguments; still flag material risks.";
}

function technicalityLabel(n: number): string {
  if (n < 30) return "Plain language; minimize jargon; explain terms when needed.";
  if (n < 70) return "Professional tone with moderate citations and defined terms.";
  return "Dense doctrinal style; cite articles/sections when available; use legal terminology.";
}

function flexibilityLabel(n: number): string {
  if (n < 30) return "Strict reading of the text; prefer formal pathways.";
  if (n < 70) return "Consider standard interpretive options and practical Migración practice.";
  return "Explore creative but lawful pathways and alternatives; label speculative options clearly.";
}
