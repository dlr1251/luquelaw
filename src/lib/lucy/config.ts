export const LUCY_DEFAULT_MODEL =
  process.env.LUCY_MODEL?.trim() || "anthropic/claude-sonnet-4.5";

export const LUCY_EMBEDDING_MODEL =
  process.env.LUCY_EMBEDDING_MODEL?.trim() || "openai/text-embedding-3-small";
