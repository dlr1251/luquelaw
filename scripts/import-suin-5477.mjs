/**
 * Build / apply CLKR norm_sections for Resolución 5477/2022 from a SUIN extract.
 *
 * Input: scripts/.suin-5477-extract.json (from browser-harness scrape)
 * Output: scripts/.suin-5477-seed.sql
 *
 * Usage:
 *   node scripts/import-suin-5477.mjs              # write SQL only
 *   node scripts/import-suin-5477.mjs --apply       # write SQL + push via service role
 *   node scripts/import-suin-5477.mjs --out path.sql
 *
 * --apply needs SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const defaultIn = resolve(root, "scripts/.suin-5477-extract.json");
const defaultOut = resolve(root, "scripts/.suin-5477-seed.sql");

const SUIN_URL =
  "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30052890";

const TITLE_META = {
  I: {
    key: "titulo-i",
    es: "Título I — Aspectos generales",
    en: "Title I — General provisions",
    labelEs: "Título I",
    labelEn: "Title I",
  },
  II: {
    key: "titulo-ii",
    es: "Título II — Tipos de visas, requisitos y características",
    en: "Title II — Visa types, requirements, and characteristics",
    labelEs: "Título II",
    labelEn: "Title II",
  },
  III: {
    key: "titulo-iii",
    es: "Título III — Procedimientos administrativos",
    en: "Title III — Administrative procedures",
    labelEs: "Título III",
    labelEn: "Title III",
  },
  IV: {
    key: "titulo-iv",
    es: "Título IV — Terminación y cancelación de la visa",
    en: "Title IV — Visa termination and cancellation",
    labelEs: "Título IV",
    labelEn: "Title IV",
  },
  V: {
    key: "titulo-v",
    es: "Título V — Obligaciones migratorias y de extranjería",
    en: "Title V — Immigration obligations",
    labelEs: "Título V",
    labelEn: "Title V",
  },
  VI: {
    key: "titulo-vi",
    es: "Título VI — Disposiciones finales",
    en: "Title VI — Final provisions",
    labelEs: "Título VI",
    labelEn: "Title VI",
  },
};

function sqlLiteral(value) {
  if (value == null) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function cleanText(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function articleHtml(body) {
  const cleaned = cleanText(body);
  if (!cleaned) return null;
  return cleaned
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortHeading(heading, body) {
  const raw = cleanText(heading || "");
  // "°. Objeto. Mediante esta..." → Objeto
  let h = raw.replace(/^[°\.\s]+/, "");
  const firstSentence = h.split(/(?<=\.)\s+/)[0] || h;
  // Prefer short label before first period if body restates full text
  const beforePeriod = firstSentence.replace(/\.$/, "");
  if (beforePeriod.length > 0 && beforePeriod.length <= 90) return beforePeriod;
  // Fall back: first line of body after "Artículo N"
  const m = cleanText(body).match(/^Artículo\s+\d+[°.]?\s*(.+?)(?:\.|$)/i);
  if (m) {
    const t = m[1].trim();
    if (t.length <= 90) return t;
    return `${t.slice(0, 87)}…`;
  }
  return beforePeriod.slice(0, 90) || "Artículo";
}

function dedupeArticles(articles) {
  const by = new Map();
  for (const a of articles) {
    const n = Number(a.num);
    if (!Number.isFinite(n)) continue;
    const prev = by.get(n);
    if (!prev || String(a.body || "").length > String(prev.body || "").length) {
      by.set(n, { ...a, num: n });
    }
  }
  return [...by.values()].sort((a, b) => a.num - b.num);
}

function assignTitle(romanArticles, article) {
  // titles sorted by index; article belongs to last title whose index <= article.index
  let current = "I";
  for (const t of romanArticles) {
    if (article.index >= t.index) current = t.roman;
  }
  return current;
}

function buildSections(extract) {
  const articles = dedupeArticles(extract.articles || []);
  const titles = (extract.titles || [])
    .map((t) => ({ ...t, roman: String(t.roman || "").toUpperCase() }))
    .sort((a, b) => a.index - b.index);

  // SUIN extract often misses Título I heading; force it for arts before II
  const titleOrder = ["I", "II", "III", "IV", "V", "VI"];

  const sections = [];
  sections.push({
    section_key: "overview",
    title_es: "Generalidades",
    title_en: "Overview",
    number_label_es: null,
    number_label_en: null,
    sort_order: 0,
    depth: 0,
    parent_section_key: null,
    html_es: articleHtml(
      "Resolución 5477 de 22 de julio de 2022 del Ministerio de Relaciones Exteriores (Diario Oficial No. 52.103). Texto oficial tomado de SUIN-Juriscol. Regula tipos de visa (V, M, R), requisitos, trámite, terminación/cancelación y obligaciones migratorias. Derogó las Resoluciones 1980 de 2014 y 6045 de 2017.",
    ),
    html_en: articleHtml(
      "Resolution 5477 of July 22, 2022 (Ministry of Foreign Affairs; Official Gazette No. 52.103). Official Spanish text from SUIN-Juriscol. Governs visa types (V, M, R), requirements, procedures, termination/cancellation, and immigration obligations. Repealed Resolutions 1980 of 2014 and 6045 of 2017.",
    ),
  });

  let titleSort = 10;
  for (const roman of titleOrder) {
    const meta = TITLE_META[roman];
    if (!meta) continue;
    const fromExtract = titles.find((t) => t.roman === roman);
    const esTitle = fromExtract?.title
      ? `${meta.labelEs} — ${toTitleCase(fromExtract.title)}`
      : meta.es;
    sections.push({
      section_key: meta.key,
      title_es: esTitle,
      title_en: meta.en,
      number_label_es: meta.labelEs,
      number_label_en: meta.labelEn,
      sort_order: titleSort,
      depth: 0,
      parent_section_key: null,
      html_es: null,
      html_en: null,
    });
    titleSort += 10;
  }

  const artsByTitle = new Map(titleOrder.map((r) => [r, []]));
  for (const art of articles) {
    const roman = assignTitle(titles, art);
    if (!artsByTitle.has(roman)) artsByTitle.set(roman, []);
    artsByTitle.get(roman).push(art);
  }

  for (const roman of titleOrder) {
    const meta = TITLE_META[roman];
    const list = artsByTitle.get(roman) || [];
    list.forEach((art, idx) => {
      const heading = shortHeading(art.heading, art.body);
      const html = articleHtml(art.body);
      sections.push({
        section_key: `art-${art.num}`,
        title_es: `Artículo ${art.num} — ${heading}`,
        title_en: `Article ${art.num} — ${heading}`,
        number_label_es: `Art. ${art.num}`,
        number_label_en: `Art. ${art.num}`,
        sort_order: idx,
        depth: 1,
        parent_section_key: meta.key,
        html_es: html,
        // Official Spanish body for EN locale (legal source of truth)
        html_en: html,
      });
    });
  }

  // Defensive: keep first occurrence of each section_key
  const seen = new Set();
  return sections.filter((section) => {
    if (seen.has(section.section_key)) return false;
    seen.add(section.section_key);
    return true;
  });
}

function toTitleCase(s) {
  const lower = cleanText(s).toLowerCase();
  return lower.replace(/(^|[\s—\-])([a-záéíóúñü])/g, (_, p, c) => p + c.toUpperCase());
}

function buildSqlForLocale(locale, sections) {
  const slug = "resolucion-5477-2022";
  const lines = [];
  lines.push(`-- ${slug} (${locale}) from SUIN extract`);
  lines.push(
    `update public.norms set official_source_url = ${sqlLiteral(SUIN_URL)}, updated_at = now() where slug_key = ${sqlLiteral(slug)} and locale = ${sqlLiteral(locale)};`,
  );
  lines.push(
    `delete from public.norm_sections where norm_id = (select id from public.norms where slug_key = ${sqlLiteral(slug)} and locale = ${sqlLiteral(locale)});`,
  );

  for (const section of sections) {
    const title = locale === "en" ? section.title_en : section.title_es;
    const number_label =
      locale === "en" ? section.number_label_en : section.number_label_es;
    const html = locale === "en" ? section.html_en : section.html_es;
    lines.push(
      `insert into public.norm_sections (norm_id, parent_id, section_key, title, number_label, html, sort_order, depth) select n.id, null, ${sqlLiteral(section.section_key)}, ${sqlLiteral(title)}, ${sqlLiteral(number_label)}, ${sqlLiteral(html)}, ${section.sort_order}, ${section.depth} from public.norms n where n.slug_key = ${sqlLiteral(slug)} and n.locale = ${sqlLiteral(locale)};`,
    );
  }

  for (const section of sections) {
    if (!section.parent_section_key) continue;
    lines.push(
      `update public.norm_sections child set parent_id = parent.id from public.norm_sections parent where child.norm_id = parent.norm_id and child.norm_id = (select id from public.norms where slug_key = ${sqlLiteral(slug)} and locale = ${sqlLiteral(locale)}) and child.section_key = ${sqlLiteral(section.section_key)} and parent.section_key = ${sqlLiteral(section.parent_section_key)};`,
    );
  }

  return lines.join("\n");
}

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
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

function sectionsForLocale(sections, locale) {
  return sections.map((section) => ({
    section_key: section.section_key,
    title: locale === "en" ? section.title_en : section.title_es,
    number_label:
      locale === "en" ? section.number_label_en : section.number_label_es,
    html: locale === "en" ? section.html_en : section.html_es,
    sort_order: section.sort_order,
    depth: section.depth,
    parent_section_key: section.parent_section_key,
  }));
}

async function replaceSections(supabase, normId, sections) {
  const { error: delError } = await supabase
    .from("norm_sections")
    .delete()
    .eq("norm_id", normId);
  if (delError) throw delError;

  const idByKey = new Map();
  for (const section of sections) {
    const { data, error } = await supabase
      .from("norm_sections")
      .insert({
        norm_id: normId,
        parent_id: null,
        section_key: section.section_key,
        title: section.title,
        number_label: section.number_label ?? null,
        html: section.html ?? null,
        sort_order: section.sort_order ?? 0,
        depth: section.depth ?? 0,
      })
      .select("id, section_key")
      .single();
    if (error) throw error;
    idByKey.set(data.section_key, data.id);
  }

  for (const section of sections) {
    if (!section.parent_section_key) continue;
    const sectionId = idByKey.get(section.section_key);
    const parentId = idByKey.get(section.parent_section_key);
    if (!sectionId || !parentId) {
      throw new Error(
        `Missing parent ${section.parent_section_key} for ${section.section_key}`,
      );
    }
    const { error } = await supabase
      .from("norm_sections")
      .update({ parent_id: parentId })
      .eq("id", sectionId);
    if (error) throw error;
  }
}

async function applySections(sections, locales = ["es", "en"]) {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !serviceKey) {
    throw new Error("Add SUPABASE_SERVICE_ROLE_KEY to .env.local for --apply");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const slug = "resolucion-5477-2022";

  for (const locale of locales) {
    const { data: norm, error } = await supabase
      .from("norms")
      .select("id")
      .eq("slug_key", slug)
      .eq("locale", locale)
      .maybeSingle();
    if (error) throw error;
    if (!norm) {
      console.warn(`  skip: norm not found ${slug} (${locale})`);
      continue;
    }

    const { error: urlError } = await supabase
      .from("norms")
      .update({ official_source_url: SUIN_URL })
      .eq("id", norm.id);
    if (urlError) throw urlError;

    const localeSections = sectionsForLocale(sections, locale);
    await replaceSections(supabase, norm.id, localeSections);
    const { count, error: countError } = await supabase
      .from("norm_sections")
      .select("*", { count: "exact", head: true })
      .eq("norm_id", norm.id);
    if (countError) throw countError;
    if (count !== localeSections.length) {
      throw new Error(
        `Count mismatch for ${locale}: expected ${localeSections.length}, got ${count}`,
      );
    }
    console.log(`  ✓ ${slug} (${locale}) — ${count} sections`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const inIdx = args.indexOf("--in");
  const outIdx = args.indexOf("--out");
  const apply = args.includes("--apply");
  const localeIdx = args.indexOf("--locale");
  const locales =
    localeIdx >= 0
      ? args[localeIdx + 1].split(",").map((s) => s.trim()).filter(Boolean)
      : ["es", "en"];
  const inPath = inIdx >= 0 ? resolve(args[inIdx + 1]) : defaultIn;
  const outPath = outIdx >= 0 ? resolve(args[outIdx + 1]) : defaultOut;

  if (!existsSync(inPath)) {
    console.error(`Missing extract: ${inPath}`);
    process.exit(1);
  }

  const extract = JSON.parse(readFileSync(inPath, "utf8"));
  const sections = buildSections(extract);
  const sql = [
    "-- Generated by scripts/import-suin-5477.mjs",
    `-- Source: ${SUIN_URL}`,
    `-- Articles: ${sections.filter((s) => s.section_key.startsWith("art-")).length}`,
    "begin;",
    buildSqlForLocale("es", sections),
    "",
    buildSqlForLocale("en", sections),
    "commit;",
    "",
  ].join("\n");

  writeFileSync(outPath, sql, "utf8");
  console.log(
    `Wrote ${outPath} (${sections.length} section templates × 2 locales, ${(sql.length / 1024).toFixed(1)} KB)`,
  );

  if (apply) {
    console.log(`\nApplying to Supabase (${locales.join(", ")})…`);
    await applySections(sections, locales);
    console.log("Done.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
