import { defineAgent } from "eve";

/** Torny — Colombian immigration consultation agent (eve runtime). */
export default defineAgent({
  model: process.env.LUCY_MODEL?.trim() || "anthropic/claude-sonnet-4.5",
});
