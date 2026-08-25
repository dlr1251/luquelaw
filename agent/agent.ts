import { defineAgent } from "eve";

/** Lucy AI — Colombian immigration consultation agent (eve runtime). */
export default defineAgent({
  model: process.env.LUCY_MODEL?.trim() || "google/gemini-2.5-flash-lite",
});
