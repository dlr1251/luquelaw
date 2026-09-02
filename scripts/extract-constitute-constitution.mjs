/**
 * Pull the Constitute Project / Max Planck English Constitution (Colombia 1991, rev. 2015)
 * via the public HTML service (not the JS app shell).
 *
 *   node scripts/extract-constitute-constitution.mjs
 */

import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const OUT = resolve(root, "scripts/.suin-constitucion-colombia-en-constitute.json");
const SOURCE = "https://www.constituteproject.org/service/html?cons_id=Colombia_2015&lang=en";
const CITE = "https://constituteproject.org/constitution/Colombia_2015?lang=en";

function innerContent(html) {
  const paragraphs = [...html.matchAll(/<p class="content"[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => {
    const text = m[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? `<p>${text}</p>` : "";
  });
  return paragraphs.filter(Boolean).join("\n");
}

function extractArticles(html) {
  const articles = [];
  const parts = html.split(/<(?:h3|p)>\s*Article\s+(\d+[A-Z]?)\s*<\/(?:h3|p)>/i);
  // ["preamble", "1", "body1", "2", "body2", ...]
  for (let i = 1; i < parts.length; i += 2) {
    const num = parts[i];
    const body = parts[i + 1] || "";
    const key = `art-${String(num).toLowerCase()}`;
    const htmlBody = innerContent(body);
    if (!htmlBody) continue;
    articles.push({
      section_key: key,
      number_label: `Art. ${num}`,
      html: htmlBody,
    });
  }
  const seen = new Set();
  return articles.filter((a) => {
    if (seen.has(a.section_key)) return false;
    seen.add(a.section_key);
    return true;
  });
}

async function main() {
  console.log(`Fetching ${SOURCE}`);
  const res = await fetch(SOURCE, {
    headers: { "User-Agent": "LuqueLaw-CLKR/1.0 (+https://luquelaw.co)" },
  });
  if (!res.ok) throw new Error(`Constitute ${res.status}`);
  const payload = await res.json();
  const html = String(payload.html || "");
  const articles = extractArticles(html);
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        meta: {
          url: CITE,
          api: SOURCE,
          cutoff: "2015",
          note: "Unofficial English from Constitute Project / Max Planck. Amendments after 2015 remain in Spanish unless a desk translation is added.",
          generatedAt: new Date().toISOString(),
        },
        articles,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Wrote ${OUT}: ${articles.length} articles`);
  const art1 = articles.find((a) => a.section_key === "art-1");
  console.log("art-1 sample:", art1?.html?.slice(0, 180));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
