#!/usr/bin/env node
/**
 * Build a Markdown index of generated CLKR drafts for Notion hub staging.
 * Usage: node scripts/clkr-gen/build-staging-index.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  CHECKPOINT_PATH,
  OUT_DIR,
  QUEUE_PATH,
  loadEnvLocal,
  readJson,
  parseFrontmatter,
} from "./lib.mjs";

loadEnvLocal();

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "staging-index.md");

const queue = readJson(QUEUE_PATH, { topics: [] });
const cp = readJson(CHECKPOINT_PATH, { completed: {}, failed: {} });
const byId = new Map(queue.topics.map((t) => [t.id, t]));

const lines = [
  "# CLKR Generation Staging Index",
  "",
  `Updated: ${new Date().toISOString()}`,
  "",
  `Completed: ${Object.keys(cp.completed).length} · Failed: ${Object.keys(cp.failed).length} · Queue: ${queue.topics.length}`,
  "",
  "Drafts live in Supabase `clkr_articles` (status=draft) and `scripts/clkr-gen/out/<slug>/{en,es}.md`.",
  "",
  "| slug_key | topic | module | locales |",
  "|---|---|---|---|",
];

for (const [id, meta] of Object.entries(cp.completed)) {
  const t = byId.get(id);
  const slug = meta.slug_key;
  const en = existsSync(resolve(OUT_DIR, slug, "en.md"));
  const es = existsSync(resolve(OUT_DIR, slug, "es.md"));
  let title = t?.topic || slug;
  if (en) {
    const { meta: fm } = parseFrontmatter(readFileSync(resolve(OUT_DIR, slug, "en.md"), "utf8"));
    if (fm.title) title = fm.title;
  }
  lines.push(
    `| \`${slug}\` | ${title} | ${t?.modulo || "?"} | ${[en && "en", es && "es"].filter(Boolean).join("+")} |`,
  );
}

if (Object.keys(cp.failed).length) {
  lines.push("", "## Failures", "");
  for (const [id, meta] of Object.entries(cp.failed)) {
    lines.push(`- \`${meta.slug_key || id}\`: ${meta.error}`);
  }
}

writeFileSync(outPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${outPath}`);
