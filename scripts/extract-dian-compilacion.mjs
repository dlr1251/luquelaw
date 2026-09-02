/**
 * Build a citation-ranked manifest of DIAN compilation files cited from the ET.
 *
 *   node scripts/extract-dian-compilacion.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { DIAN_DOCS } from "./lib/dian.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const EXTRACT = resolve(root, "scripts/.dian-estatuto-tributario-extract.json");
const OUT = resolve(root, "scripts/.dian-manifest.json");

function main() {
  if (!existsSync(EXTRACT)) {
    console.error("Run extract-dian-et.mjs first.");
    process.exit(1);
  }
  const extract = JSON.parse(readFileSync(EXTRACT, "utf8"));
  const items = (extract.authorities || []).map((row, index) => ({
    rank: index + 1,
    slug_key: row.slug_key,
    kind: row.kind,
    dian_file: row.dian_file,
    citation_count: row.citation_count,
    title: row.title,
    url: `${DIAN_DOCS}${row.dian_file}`,
    target_norm_slug_key: row.target_norm_slug_key,
    ingest_status: "stub",
  }));
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: extract.meta?.url,
    total: items.length,
    byKind: items.reduce((acc, row) => {
      acc[row.kind] = (acc[row.kind] || 0) + 1;
      return acc;
    }, {}),
    items,
  };
  writeFileSync(OUT, JSON.stringify(manifest, null, 2), "utf8");
  console.log(
    `Wrote ${OUT}: ${manifest.total} files (${Object.entries(manifest.byKind)
      .map(([k, n]) => `${k} ${n}`)
      .join(", ")})`,
  );
}

main();
