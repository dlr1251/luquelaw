import { readFile } from "node:fs/promises";
import path from "node:path";

import { buildPersonalityBlock } from "@/lib/lucy/personality";
import type { LucyPersonality } from "@/lib/lucy/types";

let cachedInstructions: string | null = null;

export async function loadLucyInstructions(): Promise<string> {
  if (cachedInstructions) return cachedInstructions;
  const filePath = path.join(process.cwd(), "agent/instructions.md");
  cachedInstructions = await readFile(filePath, "utf8");
  return cachedInstructions;
}

export async function buildLucySystemPrompt(
  personality: LucyPersonality,
  extras?: { locale?: string; fileNames?: string[] },
): Promise<string> {
  const base = await loadLucyInstructions();
  const dials = buildPersonalityBlock(personality);
  const locale = extras?.locale === "es" ? "es" : "en";
  const files =
    extras?.fileNames?.length
      ? `\n## Project files available\n${extras.fileNames.map((n) => `- ${n}`).join("\n")}\n`
      : "";

  return `${base}\n\n${dials}\n\n## Chat locale\nPrefer ${locale === "es" ? "Spanish" : "English"}.${files}`;
}
