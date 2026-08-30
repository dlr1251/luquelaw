/**
 * Parse a Función Pública EVA HTML dump into the SUIN-style extract JSON
 * that import-suin-norm.mjs consumes.
 *
 * Usage:
 *   node scripts/extract-eva-norm.mjs \
 *     --in /tmp/et-eva.html \
 *     --out scripts/.suin-estatuto-tributario-extract.json \
 *     --url "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=6533" \
 *     --title "Decreto 624 de 1989 — Estatuto Tributario"
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BOOK_ROMAN = {
  PRIMERO: "I",
  SEGUNDO: "II",
  TERCERO: "III",
  CUARTO: "IV",
  QUINTO: "V",
  SEXTO: "VI",
  SEPTIMO: "VII",
  SÉPTIMO: "VII",
  OCTAVO: "VIII",
  NOVENO: "IX",
  DECIMO: "X",
  DÉCIMO: "X",
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

function stripTags(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function rewriteLinks(html) {
  return html.replace(
    /href="(norma\.php[^"]+)"/gi,
    'href="https://www.funcionpublica.gov.co/eva/gestornormativo/$1"',
  );
}

function paragraphs(html) {
  const start = html.search(/ESTATUTO TRIBUTARIO<\/strong>/i);
  const slice = start >= 0 ? html.slice(start) : html;
  return [...slice.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m, i) => ({
    i,
    raw: rewriteLinks(m[1]),
    text: stripTags(m[1]),
  }));
}

function classify(text) {
  const t = text.replace(/\s+/g, " ").trim();
  const book = t.match(/^LIBRO\s+([A-ZÁÉÍÓÚÑ]+)["']?$/i);
  if (book) {
    const name = book[1].toUpperCase();
    return { kind: "book", roman: BOOK_ROMAN[name] || name, title: "" };
  }

  const title = t.match(
    /^(?:T[IÍ]TULO)\s+(PRELIMINAR|[IVXLC]+|\d+)(?:[.\s]+(.+))?$/i,
  );
  if (title) {
    return {
      kind: "title",
      roman: title[1].toUpperCase(),
      title: (title[2] || "").replace(/\.+$/, "").trim(),
    };
  }

  const chapter = t.match(
    /^(?:CAP[IÍ]TULO)\s+([IVXLC]+|\d+)(?:[.\s]+(.+))?$/i,
  );
  if (chapter) {
    return {
      kind: "chapter",
      roman: chapter[1].toUpperCase(),
      title: (chapter[2] || "").replace(/\.+$/, "").trim(),
    };
  }

  const art = t.match(
    /^ART[IÍ]CULO\s+(\d+(?:-\d+)?)(?:\s*[.°º])?\s*(.*)$/i,
  );
  if (art) {
    return {
      kind: "article",
      num: art[1],
      heading: (art[2] || "").replace(/\.+$/, "").trim(),
    };
  }

  return { kind: "body" };
}

function extract(html, url, docTitle) {
  const books = [];
  const titles = [];
  const chapters = [];
  const articles = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    current.body = current.parts.join("\n\n").trim();
    delete current.parts;
    articles.push(current);
    current = null;
  };

  for (const p of paragraphs(html)) {
    if (!p.text) continue;
    const cls = classify(p.text);

    if (cls.kind === "book") {
      flush();
      const next = paragraphs(html)[p.i + 1];
      const maybeTitle =
        next && classify(next.text).kind === "body" ? next.text : "";
      books.push({
        roman: cls.roman,
        title: cls.title || maybeTitle,
        index: p.i,
      });
      continue;
    }
    if (cls.kind === "title") {
      flush();
      if (cls.roman !== "PRELIMINAR") {
        titles.push({ roman: cls.roman, title: cls.title, index: p.i });
      }
      continue;
    }
    if (cls.kind === "chapter") {
      flush();
      chapters.push({ roman: cls.roman, title: cls.title, index: p.i });
      continue;
    }
    if (cls.kind === "article") {
      flush();
      current = {
        num: cls.num,
        heading: cls.heading || `Artículo ${cls.num}`,
        parts: [p.text],
        index: p.i,
      };
      continue;
    }
    if (current) current.parts.push(p.text);
  }
  flush();

  const byNum = new Map();
  for (const a of articles) {
    if (!byNum.has(a.num)) byNum.set(a.num, a);
  }

  return {
    meta: { url, docTitle },
    books,
    titles,
    chapters,
    articles: [...byNum.values()].sort((a, b) => a.index - b.index),
  };
}

function main() {
  const { inPath, outPath, url, title } = parseArgs(process.argv);
  if (!inPath || !outPath) {
    console.error(
      "Usage: node scripts/extract-eva-norm.mjs --in <html> --out <json> [--url <eva>] [--title <name>]",
    );
    process.exit(1);
  }
  const resolvedIn = resolve(root, inPath);
  const resolvedOut = resolve(root, outPath);
  if (!existsSync(resolvedIn)) {
    console.error(`Missing input: ${resolvedIn}`);
    process.exit(1);
  }

  const html = readFileSync(resolvedIn, "utf8");
  const extractJson = extract(html, url, title);
  writeFileSync(resolvedOut, JSON.stringify(extractJson, null, 2), "utf8");
  console.log(
    `Wrote ${resolvedOut}: ${extractJson.books.length} books, ${extractJson.titles.length} titles, ${extractJson.chapters.length} chapters, ${extractJson.articles.length} articles`,
  );
}

main();
