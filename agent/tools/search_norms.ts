import { defineTool } from "eve/tools";
import { z } from "zod";

import { searchTornyKnowledge } from "../lib/knowledge";

export default defineTool({
  description:
    "Search Colombian immigration norms and statute sections relevant to the user's question.",
  inputSchema: z.object({
    query: z.string().min(2).describe("Search query in English or Spanish"),
  }),
  async execute({ query }, ctx) {
    const locale =
      typeof ctx.session.auth.current?.attributes?.locale === "string" &&
      ctx.session.auth.current.attributes.locale === "es"
        ? "es"
        : "en";
    return searchTornyKnowledge(query, locale, 6, "norm");
  },
});
