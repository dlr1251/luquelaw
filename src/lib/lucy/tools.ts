import { gateway } from "@ai-sdk/gateway";
import { tool, type ToolSet } from "ai";
import { z } from "zod";

import { LUCY_DEFAULT_MODEL } from "@/lib/lucy/config";
import { searchLucyKnowledge } from "@/lib/lucy/rag";

export function getLucyModel() {
  return gateway(LUCY_DEFAULT_MODEL);
}

export function createLucyTools(locale: "en" | "es"): ToolSet {
  return {
    search_norms: tool({
      description:
        "Search Colombian immigration norms and statute sections relevant to the user's question.",
      inputSchema: z.object({
        query: z.string().min(2).describe("Search query in English or Spanish"),
      }),
      execute: async ({ query }) => {
        return searchLucyKnowledge(query, locale, 6, "norm");
      },
    }),
    search_guides: tool({
      description:
        "Search Luque Law Immigration CLKR guides (investor visa, visas ground rules, last legal day, etc.).",
      inputSchema: z.object({
        query: z.string().min(2).describe("Search query in English or Spanish"),
      }),
      execute: async ({ query }) => {
        return searchLucyKnowledge(query, locale, 6, "guide");
      },
    }),
  };
}
