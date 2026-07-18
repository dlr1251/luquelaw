/**
 * Build a SUIN-style extract JSON from plain text (Cancillería / SUIN markdown dumps).
 *
 * Usage:
 *   node scripts/extract-norm-from-text.mjs \
 *     --in path/to.txt \
 *     --out scripts/.suin-resolucion-2061-2020-extract.json \
 *     --url "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30051731" \
 *     --title "RESOLUCION 2061 DE 2020"
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const ROMAN = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  return {
    inPath: get("--in"),
    outPath: get("--out"),
    url: get("--url") || "",
    title: get("--title") || "Norm extract",
  };
}

function normalizeText(raw) {
  return String(raw || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toArabic(roman) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  const s = String(roman || "")
    .toUpperCase()
    .replace(/[^IVXLC]/g, "");
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const val = map[s[i]] || 0;
    if (val < prev) total -= val;
    else total += val;
    prev = val;
  }
  return total || null;
}

function extract(text, url, docTitle) {
  const chapters = [];
  const articles = [];

  // Split on CAPÍTULO / ARTÍCULO markers while keeping delimiters
  const re =
    /(^|\n)\s*((?:CAP[ÍI]TULO|CAPITULO)\s+([IVXLC0-9]+)[.\s]*([^\n]*)|(?:ART[ÍI]CULO|ARTICULO)\s+(\d+)\s*(?:o\.?|°\.?|º\.?)?\s*[.\-–]?\s*([^\n]*))/gi;

  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    matches.push({
      index: m.index + (m[1] ? m[1].length : 0),
      full: m[2],
      kind: m[3] != null ? "chapter" : "article",
      romanOrNum: m[3] ?? m[5],
      rest: (m[4] ?? m[6] ?? "").trim(),
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const start = cur.index;
    const end = next ? next.index : text.length;
    const block = text.slice(start, end).trim();

    if (cur.kind === "chapter") {
      let roman = String(cur.romanOrNum || "").toUpperCase();
      if (/^\d+$/.test(roman)) roman = ROMAN[Number(roman)] || roman;
      const titleLine = cur.rest.replace(/^\.+/, "").trim();
      // Sometimes title is on next line
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      let title = titleLine;
      if (!title && lines[1] && !/^(ART[ÍI]CULO|ARTICULO)/i.test(lines[1])) {
        title = lines[1];
      }
      chapters.push({
        roman,
        title: title.replace(/\.$/, "").trim(),
        index: start,
      });
      continue;
    }

    const num = Number(cur.romanOrNum);
    if (!Number.isFinite(num)) continue;
    const heading = cur.rest.replace(/^\.+/, "").trim() || `Artículo ${num}`;
    articles.push({
      num,
      heading,
      body: block,
      index: start,
    });
  }

  // Dedupe articles by num (keep first)
  const seen = new Set();
  const deduped = [];
  for (const a of articles) {
    if (seen.has(a.num)) continue;
    seen.add(a.num);
    deduped.push(a);
  }

  return {
    meta: { url, docTitle },
    titles: [],
    chapters,
    articles: deduped,
  };
}

function main() {
  const { inPath, outPath, url, title } = parseArgs(process.argv);
  if (!inPath || !outPath) {
    console.error(
      "Usage: node scripts/extract-norm-from-text.mjs --in <txt> --out <json> [--url <suin>] [--title <name>]",
    );
    process.exit(1);
  }
  const resolvedIn = resolve(root, inPath);
  const resolvedOut = resolve(root, outPath);
  if (!existsSync(resolvedIn)) {
    console.error(`Missing input: ${resolvedIn}`);
    process.exit(1);
  }

  const text = normalizeText(readFileSync(resolvedIn, "utf8"));
  const extractJson = extract(text, url, title);
  writeFileSync(resolvedOut, JSON.stringify(extractJson, null, 2), "utf8");
  console.log(
    `Wrote ${resolvedOut}: ${extractJson.chapters.length} chapters, ${extractJson.articles.length} articles`,
  );
}

main();
