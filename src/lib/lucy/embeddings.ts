import { embed, embedMany } from "ai";
import { gateway } from "@ai-sdk/gateway";

import { LUCY_EMBEDDING_MODEL } from "@/lib/lucy/config";

export const LUCY_EMBEDDING_DIMENSIONS = 1536;

export function getLucyEmbeddingModel() {
  return gateway.textEmbeddingModel(LUCY_EMBEDDING_MODEL);
}

export async function embedLucyQuery(value: string): Promise<number[]> {
  const { embedding } = await embed({
    model: getLucyEmbeddingModel(),
    value,
  });
  return embedding;
}

export async function embedLucyChunks(values: string[]): Promise<number[][]> {
  if (!values.length) return [];
  const { embeddings } = await embedMany({
    model: getLucyEmbeddingModel(),
    values,
  });
  return embeddings;
}
