/**
 * Generic SUIN → CLKR norm_sections importer.
 *
 * Input:  scripts/.suin-<slug>-extract.json
 * Output: scripts/.suin-<slug>-seed.sql
 *
 * Usage:
 *   node scripts/import-suin-norm.mjs --slug constitucion-colombia
 *   node scripts/import-suin-norm.mjs --slug constitucion-colombia --apply
 *   node scripts/import-suin-norm.mjs --slug resolucion-5477-2022 --apply --locale es
 *
 * --apply needs SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** @typedef {{ slug: string, suinUrl: string, overviewEs: string, overviewEn: string, forceTitleI?: boolean }} NormSpec */

/** @type {Record<string, NormSpec>} */
const NORMS = {
  "constitucion-colombia": {
    slug: "constitucion-colombia",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Constitucion/1687988",
    overviewEs:
      "Constitución Política de Colombia de 1991 (Gaceta Constitucional No. 114). Texto oficial tomado de SUIN-Juriscol, con su estructura de títulos, capítulos y artículos.",
    overviewEn:
      "Political Constitution of Colombia of 1991 (Constitutional Gazette No. 114). Official Spanish text from SUIN-Juriscol, structured by titles, chapters, and articles.",
    forceTitleI: true,
  },
  "resolucion-5477-2022": {
    slug: "resolucion-5477-2022",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30052890",
    overviewEs:
      "Resolución 5477 de 22 de julio de 2022 del Ministerio de Relaciones Exteriores (Diario Oficial No. 52.103). Texto oficial tomado de SUIN-Juriscol. Regula tipos de visa (V, M, R), requisitos, trámite, terminación/cancelación y obligaciones migratorias.",
    overviewEn:
      "Resolution 5477 of July 22, 2022 (Ministry of Foreign Affairs; Official Gazette No. 52.103). Official Spanish text from SUIN-Juriscol. Governs visa types (V, M, R), requirements, procedures, termination/cancellation, and immigration obligations.",
    forceTitleI: true,
  },
  "resolucion-2061-2020": {
    slug: "resolucion-2061-2020",
    suinUrl: "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30051731",
    overviewEs:
      "Resolución 2061 de 1 de septiembre de 2020 de la Unidad Administrativa Especial Migración Colombia (Diario Oficial No. 51.428). Resolución Única de Trámites del Proceso de Gestión de Extranjería: registro, cédula de extranjería, PTP/prórrogas, salvoconductos, CMM y demás trámites.",
    overviewEn:
      "Resolution 2061 of September 1, 2020 (Migración Colombia; Official Gazette No. 51.428). Unified procedure resolution for extranjería: foreigner registration, cédula de extranjería, PTP/extensions, safe-conducts, migration movement certificates, and related filings.",
  },
  "resolucion-2357-2020": {
    slug: "resolucion-2357-2020",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30052886",
    overviewEs:
      "Resolución 2357 de 29 de septiembre de 2020 de la Unidad Administrativa Especial Migración Colombia (Diario Oficial No. 51.475). Criterios para el cumplimiento de obligaciones migratorias (SIRE) y el procedimiento administrativo sancionatorio.",
    overviewEn:
      "Resolution 2357 of September 29, 2020 (Migración Colombia; Official Gazette No. 51.475). Criteria for immigration compliance obligations (SIRE) and Migración Colombia’s administrative sanction procedure.",
  },
  "codigo-sustantivo-del-trabajo": {
    slug: "codigo-sustantivo-del-trabajo",
    suinUrl: "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30019323",
    overviewEs:
      "Código Sustantivo del Trabajo (edición oficial con modificaciones; Diario Oficial No. 27.622 del 7 de junio de 1951). Compila los Decretos 2663 y 3743 de 1950 y 905 de 1951. Texto oficial tomado de SUIN-Juriscol.",
    overviewEn:
      "Substantive Labor Code (official edition with amendments; Official Gazette No. 27.622 of June 7, 1951). Compiles Decrees 2663 and 3743 of 1950 and 905 of 1951. Official Spanish text from SUIN-Juriscol.",
  },
  "codigo-penal": {
    slug: "codigo-penal",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1663230",
    overviewEs:
      "Ley 599 de 2000 — Código Penal. Texto oficial tomado de SUIN-Juriscol, con Parte General y Parte Especial.",
    overviewEn:
      "Law 599 of 2000 — Penal Code. Official Spanish text from SUIN-Juriscol, including General and Special Parts.",
  },
  cpaca: {
    slug: "cpaca",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1680117",
    overviewEs:
      "Ley 1437 de 2011 — Código de Procedimiento Administrativo y de lo Contencioso Administrativo (CPACA). Texto oficial tomado de SUIN-Juriscol.",
    overviewEn:
      "Law 1437 of 2011 — Code of Administrative Procedure and Administrative Litigation (CPACA). Official Spanish text from SUIN-Juriscol.",
  },
  "codigo-general-del-proceso": {
    slug: "codigo-general-del-proceso",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1683572",
    overviewEs:
      "Ley 1564 de 2012 — Código General del Proceso. Texto oficial tomado de SUIN-Juriscol. Regula la actividad procesal en asuntos civiles, comerciales, de familia y agrarios.",
    overviewEn:
      "Law 1564 of 2012 — General Code of Procedure. Official Spanish text from SUIN-Juriscol. Governs procedural activity in civil, commercial, family, and agrarian matters.",
  },
  "codigo-civil": {
    slug: "codigo-civil",
    suinUrl:
      "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1827111",
    overviewEs:
      "Ley 84 de 1873 — Código Civil de los Estados Unidos de Colombia (vigente como Código Civil colombiano, con modificaciones). Texto oficial tomado de SUIN-Juriscol.",
    overviewEn:
      "Law 84 of 1873 — Civil Code of the United States of Colombia (in force as the Colombian Civil Code, as amended). Official Spanish text from SUIN-Juriscol.",
  },
};

const TITLE_EN = {
  I: "Title I",
  II: "Title II",
  III: "Title III",
  IV: "Title IV",
  V: "Title V",
  VI: "Title VI",
  VII: "Title VII",
  VIII: "Title VIII",
  IX: "Title IX",
  X: "Title X",
  XI: "Title XI",
  XII: "Title XII",
  XIII: "Title XIII",
  XIV: "Title XIV",
  XV: "Title XV",
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

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function toTitleCase(s) {
  const lower = cleanText(s).toLowerCase();
  return lower.replace(/(^|[\s—\-])([a-záéíóúñü])/g, (_, p, c) => p + c.toUpperCase());
}

function shortHeading(heading, body) {
  const raw = cleanText(heading || "").replace(/^[°\.\s]+/, "");
  const firstSentence = raw.split(/(?<=\.)\s+/)[0] || raw;
  const beforePeriod = firstSentence.replace(/\.$/, "");
  if (beforePeriod.length > 0 && beforePeriod.length <= 100) return beforePeriod;
  const m = cleanText(body).match(/^Artículo\s+\d+[°.]?\s*(.+?)(?:\.|$)/i);
  if (m) {
    const t = m[1].trim();
    if (t.length <= 100) return t;
    return `${t.slice(0, 97)}…`;
  }
  return beforePeriod.slice(0, 100) || "Artículo";
}

function slugifyKey(prefix, label) {
  const base = cleanText(label)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${prefix}-${base || "x"}`;
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
  return [...by.values()].sort((a, b) => a.num - b.num || a.index - b.index);
}

function containerLabel(roman) {
  return String(roman || "")
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9ÁÉÍÓÚÑ\s-]/g, "")
    .replace(/\s+/g, "-");
}

function nearestBefore(nodes, index) {
  let best = null;
  for (const n of nodes) {
    if (n.index <= index) best = n;
  }
  return best;
}

/**
 * Build hierarchical sections from a SUIN text extract.
 * Supports: overview, preámbulo, libros, títulos, capítulos, artículos.
 */
function buildSections(extract, spec) {
  const articles = dedupeArticles(extract.articles || []);
  const books = (extract.books || [])
    .map((b, i) => ({
      ...b,
      roman: containerLabel(b.roman) || String(i + 1),
      index: Number(b.index) || 0,
      title: cleanText(b.title),
    }))
    .filter((b) => b.roman)
    .sort((a, b) => a.index - b.index);

  const titles = (extract.titles || [])
    .map((t, i) => ({
      ...t,
      roman: containerLabel(t.roman) || String(i + 1),
      index: Number(t.index) || 0,
      title: cleanText(t.title),
    }))
    .filter((t) => t.roman)
    .sort((a, b) => a.index - b.index);

  const chapters = (extract.chapters || [])
    .map((c, i) => ({
      ...c,
      roman: containerLabel(c.roman) || String(i + 1),
      index: Number(c.index) || 0,
      title: cleanText(c.title),
    }))
    .sort((a, b) => a.index - b.index);

  if (spec.forceTitleI && titles.length && titles[0].roman !== "I") {
    titles.unshift({
      roman: "I",
      title: "",
      index: articles[0]?.index ?? 0,
    });
  }

  /** @type {Array<Record<string, unknown>>} */
  const sections = [];
  const usedKeys = new Set();
  const uniqueKey = (base) => {
    let key = base;
    let n = 2;
    while (usedKeys.has(key)) {
      key = `${base}-${n}`;
      n += 1;
    }
    usedKeys.add(key);
    return key;
  };

  sections.push({
    section_key: "overview",
    title_es: "Generalidades",
    title_en: "Overview",
    number_label_es: null,
    number_label_en: null,
    sort_order: 0,
    depth: 0,
    parent_section_key: null,
    html_es: articleHtml(spec.overviewEs),
    html_en: articleHtml(spec.overviewEn),
  });
  usedKeys.add("overview");

  if (extract.preambulo?.body) {
    sections.push({
      section_key: "preambulo",
      title_es: "Preámbulo",
      title_en: "Preamble",
      number_label_es: "Preámbulo",
      number_label_en: "Preamble",
      sort_order: 5,
      depth: 0,
      parent_section_key: null,
      html_es: articleHtml(extract.preambulo.body),
      html_en: articleHtml(extract.preambulo.body),
    });
    usedKeys.add("preambulo");
  }

  const bookNodes = [];
  let bookSort = 10;
  for (const b of books) {
    const key = uniqueKey(`libro-${b.roman.toLowerCase()}`);
    const node = { ...b, section_key: key, depth: 0 };
    bookNodes.push(node);
    const label = b.roman.replace(/-/g, " ");
    sections.push({
      section_key: key,
      title_es: b.title
        ? `Libro ${toTitleCase(label)} — ${toTitleCase(b.title)}`
        : `Libro ${toTitleCase(label)}`,
      title_en: b.title
        ? `Book ${toTitleCase(label)} — ${toTitleCase(b.title)}`
        : `Book ${toTitleCase(label)}`,
      number_label_es: `Libro ${label}`,
      number_label_en: `Book ${label}`,
      sort_order: bookSort,
      depth: 0,
      parent_section_key: null,
      html_es: null,
      html_en: null,
    });
    bookSort += 10;
  }

  const titleNodes = [];
  const titleSortByParent = new Map();
  for (const t of titles) {
    const book = nearestBefore(bookNodes, t.index);
    const parentKey = book?.section_key ?? null;
    const depth = book ? 1 : 0;
    const sort = titleSortByParent.get(parentKey || "root") ?? (book ? 0 : 10);
    titleSortByParent.set(parentKey || "root", sort + (book ? 1 : 10));
    const key = uniqueKey(`titulo-${t.roman.toLowerCase()}`);
    const node = { ...t, section_key: key, parent_section_key: parentKey, depth };
    titleNodes.push(node);
    const label = t.roman.replace(/-/g, " ");
    const esTitle = t.title
      ? `Título ${toTitleCase(label)} — ${toTitleCase(t.title)}`
      : `Título ${toTitleCase(label)}`;
    const enTitle = t.title
      ? `${TITLE_EN[t.roman] || `Title ${toTitleCase(label)}`} — ${toTitleCase(t.title)}`
      : TITLE_EN[t.roman] || `Title ${toTitleCase(label)}`;
    sections.push({
      section_key: key,
      title_es: esTitle,
      title_en: enTitle,
      number_label_es: `Título ${label}`,
      number_label_en: TITLE_EN[t.roman] || `Title ${label}`,
      sort_order: sort,
      depth,
      parent_section_key: parentKey,
      html_es: null,
      html_en: null,
    });
  }

  const chapterNodes = [];
  const chapterSortByParent = new Map();
  for (const c of chapters) {
    const title = nearestBefore(titleNodes, c.index);
    const book = nearestBefore(bookNodes, c.index);
    const parentKey = title?.section_key || book?.section_key || null;
    if (!parentKey) continue;
    const depth = (title?.depth ?? book?.depth ?? 0) + 1;
    const sort = chapterSortByParent.get(parentKey) ?? 0;
    chapterSortByParent.set(parentKey, sort + 1);
    const key = uniqueKey(
      slugifyKey(`cap-${c.roman.toLowerCase()}`, c.title || String(sort)),
    );
    chapterNodes.push({
      ...c,
      section_key: key,
      parent_section_key: parentKey,
      sort_order: sort,
      depth,
    });
    sections.push({
      section_key: key,
      title_es: c.title
        ? `Capítulo ${c.roman} — ${toTitleCase(c.title)}`
        : `Capítulo ${c.roman}`,
      title_en: c.title
        ? `Chapter ${c.roman} — ${toTitleCase(c.title)}`
        : `Chapter ${c.roman}`,
      number_label_es: `Cap. ${c.roman}`,
      number_label_en: `Ch. ${c.roman}`,
      sort_order: sort,
      depth,
      parent_section_key: parentKey,
      html_es: null,
      html_en: null,
    });
  }

  const artSortByParent = new Map();
  for (const art of articles) {
    const chapter = nearestBefore(chapterNodes, art.index);
    const title = nearestBefore(titleNodes, art.index);
    const book = nearestBefore(bookNodes, art.index);
    const parent = chapter || title || book;
    const parentKey = parent?.section_key ?? null;
    const depth = parent ? (parent.depth ?? 0) + 1 : 1;

    const sort = artSortByParent.get(parentKey || "root") ?? 0;
    artSortByParent.set(parentKey || "root", sort + 1);

    const heading = shortHeading(art.heading, art.body);
    const html = articleHtml(art.body);
    const key = uniqueKey(`art-${art.num}`);
    sections.push({
      section_key: key,
      title_es: `Artículo ${art.num} — ${heading}`,
      title_en: `Article ${art.num} — ${heading}`,
      number_label_es: `Art. ${art.num}`,
      number_label_en: `Art. ${art.num}`,
      sort_order: sort,
      depth,
      parent_section_key: parentKey,
      html_es: html,
      html_en: html,
    });
  }

  return sections;
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

function buildSqlForLocale(slug, locale, sections, suinUrl) {
  const lines = [];
  lines.push(`-- ${slug} (${locale}) from SUIN extract`);
  lines.push(
    `update public.norms set official_source_url = ${sqlLiteral(suinUrl)}, updated_at = now() where slug_key = ${sqlLiteral(slug)} and locale = ${sqlLiteral(locale)};`,
  );
  lines.push(
    `delete from public.norm_sections where norm_id = (select id from public.norms where slug_key = ${sqlLiteral(slug)} and locale = ${sqlLiteral(locale)});`,
  );

  for (const section of sectionsForLocale(sections, locale)) {
    lines.push(
      `insert into public.norm_sections (norm_id, parent_id, section_key, title, number_label, html, sort_order, depth) select n.id, null, ${sqlLiteral(section.section_key)}, ${sqlLiteral(section.title)}, ${sqlLiteral(section.number_label)}, ${sqlLiteral(section.html)}, ${section.sort_order}, ${section.depth} from public.norms n where n.slug_key = ${sqlLiteral(slug)} and n.locale = ${sqlLiteral(locale)};`,
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

async function replaceSections(supabase, normId, sections) {
  const { error: delError } = await supabase
    .from("norm_sections")
    .delete()
    .eq("norm_id", normId);
  if (delError) throw delError;

  // Batch insert (no parents yet)
  const batchSize = 50;
  const idByKey = new Map();
  for (let i = 0; i < sections.length; i += batchSize) {
    const batch = sections.slice(i, i + batchSize).map((section) => ({
      norm_id: normId,
      parent_id: null,
      section_key: section.section_key,
      title: section.title,
      number_label: section.number_label ?? null,
      html: section.html ?? null,
      sort_order: section.sort_order ?? 0,
      depth: section.depth ?? 0,
    }));
    const { data, error } = await supabase
      .from("norm_sections")
      .insert(batch)
      .select("id, section_key");
    if (error) throw error;
    for (const row of data) idByKey.set(row.section_key, row.id);
  }

  // Parent updates in batches via individual updates (PostgREST has no multi-row CASE easily)
  const withParent = sections.filter((s) => s.parent_section_key);
  for (const section of withParent) {
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

async function applySections(slug, suinUrl, sections, locales) {
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
      .update({ official_source_url: suinUrl })
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

function parseArgs(argv) {
  const args = argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  const slug = get("--slug");
  const localeArg = get("--locale");
  return {
    slug,
    apply: args.includes("--apply"),
    inPath: get("--in"),
    outPath: get("--out"),
    locales: localeArg
      ? localeArg.split(",").map((s) => s.trim()).filter(Boolean)
      : ["es", "en"],
  };
}

async function main() {
  const { slug, apply, inPath, outPath, locales } = parseArgs(process.argv);
  if (!slug) {
    console.error(
      `Usage: node scripts/import-suin-norm.mjs --slug <slug> [--apply] [--locale es,en]\nKnown: ${Object.keys(NORMS).join(", ")}`,
    );
    process.exit(1);
  }

  const spec = NORMS[slug];
  if (!spec) {
    console.error(`Unknown slug "${slug}". Add it to NORMS in import-suin-norm.mjs`);
    process.exit(1);
  }

  const resolvedIn = inPath
    ? resolve(root, inPath)
    : resolve(root, `scripts/.suin-${slug}-extract.json`);
  const resolvedOut = outPath
    ? resolve(root, outPath)
    : resolve(root, `scripts/.suin-${slug}-seed.sql`);

  if (!existsSync(resolvedIn)) {
    console.error(`Missing extract: ${resolvedIn}`);
    console.error(
      `Scrape SUIN first (${spec.suinUrl}) and save JSON to that path.`,
    );
    process.exit(1);
  }

  const extract = JSON.parse(readFileSync(resolvedIn, "utf8"));
  const sections = buildSections(extract, spec);
  const arts = sections.filter((s) => String(s.section_key).startsWith("art-")).length;
  const sql = [
    `-- Generated by scripts/import-suin-norm.mjs --slug ${slug}`,
    `-- Source: ${spec.suinUrl}`,
    `-- Sections: ${sections.length} (articles: ${arts})`,
    "begin;",
    buildSqlForLocale(slug, "es", sections, spec.suinUrl),
    "",
    buildSqlForLocale(slug, "en", sections, spec.suinUrl),
    "commit;",
    "",
  ].join("\n");

  writeFileSync(resolvedOut, sql, "utf8");
  console.log(
    `Wrote ${resolvedOut} (${sections.length} sections × 2 locales, ${(sql.length / 1024).toFixed(1)} KB; ${arts} articles)`,
  );

  if (apply) {
    console.log(`\nApplying to Supabase (${locales.join(", ")})…`);
    await applySections(slug, spec.suinUrl, sections, locales);
    console.log("Done.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
