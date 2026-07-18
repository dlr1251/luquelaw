#!/usr/bin/env node
/**
 * Bootstrap visa catalog stubs from scripts/.suin-5477-extract.json
 * into scripts/.visas-catalog-stubs.json. Hand-curated bilingual copy
 * lives in src/lib/practice-areas/visas-catalog.ts (regenerate carefully).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extract = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/.suin-5477-extract.json"), "utf8"),
);

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^visa\s+[vmr]\s+/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function categoryFrom(heading) {
  const m = heading.match(/^Visa\s+([VMR])\b/i);
  return m ? m[1].toUpperCase() : null;
}

const visas = [];
for (const a of extract.articles ?? []) {
  const heading = String(a.heading || "")
    .replace(/\s+/g, " ")
    .trim();
  const category = categoryFrom(heading);
  if (!category) continue;
  const nameEs = heading.replace(/\.$/, "");
  visas.push({
    slug: slugify(nameEs),
    category,
    articleNum: a.num,
    nameEs,
  });
}

const out = path.join(root, "scripts/.visas-catalog-stubs.json");
fs.writeFileSync(out, JSON.stringify(visas, null, 2));
console.log(`Wrote ${visas.length} stubs → ${out}`);
