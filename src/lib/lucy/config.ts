export const LUCY_DEFAULT_MODEL =
  process.env.LUCY_MODEL?.trim() || "google/gemini-2.5-flash-lite";

export const LUCY_EMBEDDING_MODEL =
  process.env.LUCY_EMBEDDING_MODEL?.trim() || "openai/text-embedding-3-small";
