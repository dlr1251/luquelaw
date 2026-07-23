/**
 * Index Immigration norms + CLKR guides into lucy_knowledge_chunks (pgvector).
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   AI_GATEWAY_API_KEY
 *
 * Usage:
 *   npm run index:lucy-rag
 *   npm run index:lucy-rag -- --locale=es
 *   npm run index:lucy-rag -- --force
 */

import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

/** When set, only these guide slugs are indexed. When empty/null, index all published guides. */
const GUIDE_SLUG_ALLOWLIST = process.env.LUCY_GUIDE_SLUGS?.trim()
  ? process.env.LUCY_GUIDE_SLUGS.split(",").map((s) => s.trim()).filter(Boolean)
  : null;

const EMBEDDING_MODEL =
  process.env.LUCY_EMBEDDING_MODEL?.trim() || "openai/text-embedding-3-small";
const TARGET_CHARS = 1200;
const OVERLAP_CHARS = 150;
const EMBED_BATCH = 32;

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const out = { force: false, locale: null };
  for (const arg of argv) {
    if (arg === "--force") out.force = true;
    else if (arg.startsWith("--locale=")) {
      const loc = arg.slice("--locale=".length);
      if (loc === "en" || loc === "es") out.locale = loc;
    }
  }
  return out;
}

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashContent(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 32);
}

function splitText(text, target = TARGET_CHARS, overlap = OVERLAP_CHARS) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (cleaned.length <= target) return [cleaned];

  const chunks = [];
  let start = 0;
  while (start < cleaned.length) {
    let end = Math.min(start + target, cleaned.length);
    if (end < cleaned.length) {
      const slice = cleaned.slice(start, end);
      const lastBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(" "));
      if (lastBreak > target * 0.4) end = start + lastBreak + 1;
    }
    const piece = cleaned.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= cleaned.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

function buildDrafts({ source_kind, source_id, slug_key, locale, title, text, metadata }) {
  return splitText(text).map((content, chunk_index) => ({
    source_kind,
    source_id,
    slug_key,
    locale,
    title,
    chunk_index,
    content,
    content_hash: hashContent(content),
    metadata: metadata ?? {},
  }));
}

async function embedBatch(apiKey, values) {
  const res = await fetch("https://ai-gateway.vercel.sh/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: values,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Embeddings failed (${res.status}): ${body.slice(0, 400)}`);
  }
  const json = await res.json();
  const data = Array.isArray(json.data) ? json.data : [];
  return data
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((row) => row.embedding);
}

async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();

  if (!url || !serviceKey) {
    console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!gatewayKey) {
    console.error("Need AI_GATEWAY_API_KEY for embeddings");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Model: ${EMBEDDING_MODEL}`);
  console.log(`Force reindex: ${args.force}`);
  if (args.locale) console.log(`Locale filter: ${args.locale}`);

  let normsQuery = supabase
    .from("norms")
    .select("id, slug_key, title, locale, status, category")
    .eq("status", "published")
    .eq("category", "immigration");
  if (args.locale) normsQuery = normsQuery.eq("locale", args.locale);

  const { data: norms, error: normsErr } = await normsQuery;
  if (normsErr) throw normsErr;

  let guidesQuery = supabase
    .from("clkr_articles")
    .select("id, slug_key, title, description, locale, status, sections, category")
    .eq("status", "published");
  if (GUIDE_SLUG_ALLOWLIST?.length) {
    guidesQuery = guidesQuery.in("slug_key", GUIDE_SLUG_ALLOWLIST);
  }
  if (args.locale) guidesQuery = guidesQuery.eq("locale", args.locale);

  const { data: guides, error: guidesErr } = await guidesQuery;
  if (guidesErr) throw guidesErr;

  const allDrafts = [];

  for (const norm of norms ?? []) {
    const { data: sections, error: secErr } = await supabase
      .from("norm_sections")
      .select("id, title, number_label, html, section_key")
      .eq("norm_id", norm.id)
      .order("sort_order", { ascending: true });
    if (secErr) throw secErr;

    for (const section of sections ?? []) {
      const plain = stripHtml(section.html);
      if (!plain || plain.length < 40) continue;
      const label = section.number_label ? `${section.number_label} ` : "";
      const title = `${norm.title}: ${label}${section.title}`;
      allDrafts.push(
        ...buildDrafts({
          source_kind: "norm",
          source_id: section.id,
          slug_key: norm.slug_key,
          locale: norm.locale,
          title,
          text: `${title}\n\n${plain}`,
          metadata: {
            norm_id: norm.id,
            section_key: section.section_key,
            number_label: section.number_label,
          },
        }),
      );
    }
  }

  for (const guide of guides ?? []) {
    const guideChunks = [];
    const desc = String(guide.description ?? "").trim();
    if (desc.length >= 40) {
      guideChunks.push(
        ...buildDrafts({
          source_kind: "guide",
          source_id: guide.id,
          slug_key: guide.slug_key,
          locale: guide.locale,
          title: guide.title,
          text: `${guide.title}\n\n${desc}`,
          metadata: { part: "description", category: guide.category },
        }),
      );
    }

    const sections = Array.isArray(guide.sections) ? guide.sections : [];
    for (const section of sections) {
      if (!section || typeof section !== "object") continue;
      const sectionTitle = String(section.title ?? "").trim();
      const plain = stripHtml(section.html);
      if (!plain || plain.length < 40) continue;
      const title = sectionTitle ? `${guide.title}: ${sectionTitle}` : guide.title;
      guideChunks.push(
        ...buildDrafts({
          source_kind: "guide",
          source_id: guide.id,
          slug_key: guide.slug_key,
          locale: guide.locale,
          title,
          text: `${title}\n\n${plain}`,
          metadata: {
            section_id: section.id ?? null,
            part: "section",
            category: guide.category,
          },
        }),
      );
    }

    guideChunks.forEach((chunk, i) => {
      allDrafts.push({ ...chunk, chunk_index: i });
    });
  }

  console.log(
    `Prepared ${allDrafts.length} chunks (${norms?.length ?? 0} norms, ${guides?.length ?? 0} guides)`,
  );

  let toEmbed = allDrafts;
  if (!args.force && allDrafts.length) {
    const { data: existing, error: exErr } = await supabase
      .from("lucy_knowledge_chunks")
      .select("source_kind, source_id, chunk_index, locale, content_hash");
    if (exErr) throw exErr;
    const seen = new Set(
      (existing ?? []).map(
        (r) => `${r.source_kind}:${r.source_id}:${r.chunk_index}:${r.locale}:${r.content_hash}`,
      ),
    );
    toEmbed = allDrafts.filter(
      (d) =>
        !seen.has(
          `${d.source_kind}:${d.source_id}:${d.chunk_index}:${d.locale}:${d.content_hash}`,
        ),
    );
    console.log(
      `Unchanged skipped: ${allDrafts.length - toEmbed.length}; to embed: ${toEmbed.length}`,
    );
  }

  let upserted = 0;
  for (let i = 0; i < toEmbed.length; i += EMBED_BATCH) {
    const batch = toEmbed.slice(i, i + EMBED_BATCH);
    const embeddings = await embedBatch(
      gatewayKey,
      batch.map((b) => b.content),
    );
    if (embeddings.length !== batch.length) {
      throw new Error(
        `Embedding count mismatch: got ${embeddings.length}, expected ${batch.length}`,
      );
    }

    const rows = batch.map((b, j) => ({
      source_kind: b.source_kind,
      source_id: b.source_id,
      slug_key: b.slug_key,
      locale: b.locale,
      title: b.title,
      chunk_index: b.chunk_index,
      content: b.content,
      content_hash: b.content_hash,
      embedding: embeddings[j],
      metadata: b.metadata,
      updated_at: new Date().toISOString(),
    }));

    const { error: upErr } = await supabase
      .from("lucy_knowledge_chunks")
      .upsert(rows, { onConflict: "source_kind,source_id,chunk_index,locale" });
    if (upErr) throw upErr;

    upserted += rows.length;
    console.log(`Upserted ${upserted}/${toEmbed.length}`);
  }

  const keepKeys = new Set(
    allDrafts.map((d) => `${d.source_kind}:${d.source_id}:${d.chunk_index}:${d.locale}`),
  );

  let staleQuery = supabase
    .from("lucy_knowledge_chunks")
    .select("id, source_kind, source_id, chunk_index, locale");
  if (args.locale) staleQuery = staleQuery.eq("locale", args.locale);
  const { data: allRows, error: allErr } = await staleQuery;
  if (allErr) throw allErr;

  const staleIds = (allRows ?? [])
    .filter((r) => !keepKeys.has(`${r.source_kind}:${r.source_id}:${r.chunk_index}:${r.locale}`))
    .map((r) => r.id);

  if (staleIds.length) {
    for (let i = 0; i < staleIds.length; i += 100) {
      const slice = staleIds.slice(i, i + 100);
      const { error: delErr } = await supabase
        .from("lucy_knowledge_chunks")
        .delete()
        .in("id", slice);
      if (delErr) throw delErr;
    }
    console.log(`Removed ${staleIds.length} stale chunks`);
  }

  console.log(`Done. Target chunks: ${allDrafts.length}; newly upserted: ${upserted}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
