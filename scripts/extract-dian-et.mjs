/**
 * Parse the DIAN Estatuto Tributario compilation (HTML + insRow JS)
 * into structured sections + apparatus + citation graph.
 *
 * Usage:
 *   node scripts/extract-dian-et.mjs
 *   node scripts/extract-dian-et.mjs --apply
 *   node scripts/extract-dian-et.mjs --apply --locale es
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import {
  DIAN_DOCS,
  ET_HTML_URL,
  ET_JS_URL,
  KNOWN_NORM_SLUGS,
  decodeEntities,
  extractCitationsFromHtml,
  kindFromDianFile,
  kindFromHeader,
  officialDianUrl,
  parseInsRows,
  slugFromDianFile,
  slugKeyFromInput,
  stripTags,
  titleFromDianFile,
} from "./lib/dian.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const HTML_CACHE = resolve(root, "scripts/.dian-estatuto-tributario.htm");
const JS_CACHE = resolve(root, "scripts/.dian-estatuto-tributario.js");
const OUT_JSON = resolve(root, "scripts/.dian-estatuto-tributario-extract.json");

const SLUG = "estatuto-tributario";
const SOURCE_URL = ET_HTML_URL;

const BOOK_ROMAN = {
  PRIMERO: "i",
  SEGUNDO: "ii",
  TERCERO: "iii",
  CUARTO: "iv",
  QUINTO: "v",
  SEXTO: "vi",
  SEPTIMO: "vii",
  SÉPTIMO: "vii",
  OCTAVO: "viii",
};

const OVERVIEW_ES = `<p>Decreto 624 de 1989 — Estatuto Tributario de los impuestos que administra la DIAN. Texto consolidado de la Compilación Jurídica DIAN, con notas de vigencia, concordancias, jurisprudencia, doctrina y legislación anterior.</p><p>No sustituye el Diario Oficial. Confirma la gaceta vigente para tu caso. Los textos entre marcas de editor los agregó la compilación DIAN; no son el articulado.</p>`;

const OVERVIEW_EN = `<p>Decree 624 of 1989 — Tax Statute for taxes administered by DIAN. Spanish operative text from the DIAN Legal Compilation, with in-force notes, concordances, case law, DIAN doctrine, and prior wording.</p><p>The English rendering is Luque Law’s unofficial desk translation (U.S. English), not a gazette. Confirm the official Spanish text before you act. Translator’s notes mark ambiguity and U.K./OECD equivalents.</p>`;

const DESC_ES =
  "Decreto 624 de 1989. Texto consolidado de la Compilación Jurídica DIAN, con vigencia, concordancias, jurisprudencia y doctrina. No es el Diario Oficial.";
const DESC_EN =
  "Decree 624 of 1989. DIAN compilation in Spanish, plus Luque Law’s unofficial U.S. English desk translation. Not a gazette; confirm the official Spanish text.";

function parseArgs(argv) {
  const args = argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  const localeArg = get("--locale");
  return {
    apply: args.includes("--apply"),
    skipFetch: args.includes("--skip-fetch"),
    locales: localeArg
      ? localeArg.split(",").map((s) => s.trim()).filter(Boolean)
      : ["es", "en"],
  };
}

async function ensureCache(skipFetch) {
  if (skipFetch && existsSync(HTML_CACHE) && existsSync(JS_CACHE)) return;
  if (!existsSync(HTML_CACHE) || !existsSync(JS_CACHE)) {
    if (skipFetch) {
      throw new Error("Missing DIAN cache. Run without --skip-fetch first.");
    }
  }
  if (!existsSync(HTML_CACHE)) {
    console.log("Fetching ET HTML…");
    const res = await fetch(ET_HTML_URL, {
      headers: { "User-Agent": "LuqueLaw-CLKR/1.0 (+https://luquelaw.co)" },
    });
    if (!res.ok) throw new Error(`ET HTML ${res.status}`);
    writeFileSync(HTML_CACHE, await res.text(), "utf8");
  }
  if (!existsSync(JS_CACHE)) {
    console.log("Fetching ET insRow JS…");
    const res = await fetch(ET_JS_URL, {
      headers: { "User-Agent": "LuqueLaw-CLKR/1.0 (+https://luquelaw.co)" },
    });
    if (!res.ok) throw new Error(`ET JS ${res.status}`);
    writeFileSync(JS_CACHE, await res.text(), "utf8");
  }
}

function extractPanel(html) {
  const start = html.search(/<div class="panel-documento"/i);
  if (start < 0) return html;
  const end = html.indexOf('<div class="left-panel-footer"', start);
  return end > start ? html.slice(start, end) : html.slice(start);
}

function tokenizePanel(panel) {
  const tokens = [];
  for (const match of panel.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    tokens.push({
      tag: "p",
      index: match.index,
      attrs: match[1] || "",
      inner: match[2] || "",
    });
  }
  const cajaRe =
    /<a class=["']caja_vja_encabezado[^"']*["'] href=["']javascript:insRow(\d+)\(\)["']>([\s\S]*?)<\/a>/gi;
  for (const match of panel.matchAll(cajaRe)) {
    tokens.push({
      tag: "caja",
      index: match.index,
      n: Number(match[1]),
      header: stripTags(match[2]),
    });
  }
  tokens.sort((a, b) => a.index - b.index);
  return tokens;
}

function bookmarkFromToken(token) {
  const m = token.inner.match(
    /<a[^>]*class=["'][^"']*bookmarkaj[^"']*["'][^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i,
  );
  if (!m) return null;
  return { name: m[1], title: stripTags(m[2]) };
}

function classifyHeading(text) {
  const t = decodeEntities(text)
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .trim();
  const book = t.match(/^LIBRO\s+([A-ZÁÉÍÓÚÑ]+)(?:[.\s]+(.+))?$/i);
  if (book) {
    const roman = BOOK_ROMAN[book[1].toUpperCase()] || slugKeyFromInput(book[1]);
    return { kind: "book", key: `libro-${roman}`, label: `Libro ${book[1]}`, title: (book[2] || "").replace(/\.+$/, "").trim() };
  }
  const title = t.match(/^(?:T[IÍ]TULO)\s+(PRELIMINAR|[IVXLC]+|\d+)(?:[.\s]+(.+))?$/i);
  if (title) {
    const roman = title[1].toLowerCase();
    return {
      kind: "title",
      key: `titulo-${roman}`,
      label: `Título ${title[1]}`,
      title: (title[2] || "").replace(/\.+$/, "").trim(),
    };
  }
  const chapter = t.match(/^(?:CAP[IÍ]TULO)\s+([IVXLC]+|\d+)(?:[.\s]+(.+))?$/i);
  if (chapter) {
    const roman = chapter[1].toLowerCase();
    return {
      kind: "chapter",
      key: `capitulo-${roman}`,
      label: `Capítulo ${chapter[1]}`,
      title: (chapter[2] || "").replace(/\.+$/, "").trim(),
    };
  }
  const extra = t.match(/^ART[IÍ]CULO\s+ADICIONAL\.?\s*(.*)$/i);
  if (extra) {
    return {
      kind: "article",
      num: "adicional",
      key: "art-adicional",
      label: "Art. adicional",
      title: (extra[1] || "").replace(/\.+$/, "").trim(),
    };
  }
  const art = t.match(/^ART[IÍ]CULO\s+(\d+(?:-\d+)?)(?:\s*[.°oº])?\s*(.*)$/i);
  if (art) {
    return {
      kind: "article",
      num: art[1],
      key: `art-${art[1]}`,
      label: `Art. ${art[1]}`,
      title: (art[2] || "").replace(/\.+$/, "").trim(),
    };
  }
  return null;
}

function shortRubric(heading) {
  let clean = decodeEntities(heading)
    .replace(/<[^>]+>/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/<Artículo[\s\S]*$/i, "")
    .replace(/<Art[ií]culo[\s\S]*$/i, "")
    .replace(/<Fuente[\s\S]*$/i, "")
    .replace(/<Par[aá]grafo[\s\S]*$/i, "")
    .replace(/<DEROGADO>.*$/i, "")
    .replace(/\.+$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (/^[A-ZÁÉÍÓÚÑ0-9\s,;:()\-]+$/.test(clean) && /[A-ZÁÉÍÓÚÑ]/.test(clean)) {
    clean = clean
      .toLowerCase()
      .replace(/(^|[\s(/])([a-záéíóúñ])/g, (_, pre, ch) => pre + ch.toUpperCase());
  }
  if (!clean) return "";
  if (clean.length <= 90) return clean;
  const cut = clean.slice(0, 87);
  const last = cut.lastIndexOf(" ");
  return `${(last > 40 ? cut.slice(0, last) : cut).trim()}…`;
}

function markEditorNotes(html) {
  return html.replace(/&lt;([\s\S]*?)&gt;/g, (_, inner) => {
    return `<span class="dian-editor-note">${inner}</span>`;
  });
}

function cleanArticleHtml(paragraphs) {
  const cleaned = paragraphs
    .map((p) => {
      let inner = p.replace(/<a[^>]*class=["'][^"']*bookmarkaj[^"']*["'][^>]*>[\s\S]*?<\/a>/i, "");
      inner = markEditorNotes(inner).trim();
      const text = stripTags(inner);
      if (!text) return "";
      if (/^(t[ií]tulo|cap[ií]tulo|libro|parte)\s+/i.test(text) && text.length < 80) {
        return "";
      }
      return `<p>${inner}</p>`;
    })
    .filter(Boolean);
  return cleaned.join("\n");
}

function inferAnchor(text) {
  const t = decodeEntities(text).replace(/\s+/g, " ").trim();
  const num = t.match(/^(\d+)\./);
  if (num) return `num-${num[1]}`;
  const lit = t.match(/^([a-z])\)/i);
  if (lit) return `lit-${lit[1].toLowerCase()}`;
  if (/^par[aá]grafo/i.test(t)) return "par";
  return null;
}

function uniqueKey(used, base) {
  let key = base;
  let n = 2;
  while (used.has(key)) {
    key = `${base}-${n}`;
    n += 1;
  }
  used.add(key);
  return key;
}

function parseEt(html, jsSource) {
  const insRows = parseInsRows(jsSource);
  const panel = extractPanel(html);
  const tokens = tokenizePanel(panel);
  const used = new Set(["overview"]);
  const sections = [];
  const apparatus = [];

  const pushStructural = (heading, bookmarkName, parentKey) => {
    const key = uniqueKey(used, heading.key);
    const title = heading.title
      ? `${heading.label} — ${shortRubric(heading.title)}`
      : heading.label;
    sections.push({
      section_key: key,
      kind: heading.kind,
      title_es: title,
      title_en: title,
      number_label_es: heading.label,
      number_label_en: heading.label,
      html_es: null,
      html_en: null,
      parent_hint: parentKey || "overview",
      bookmark: bookmarkName || null,
    });
    return key;
  };

  let currentBook = null;
  let currentTitle = null;
  let currentChapter = null;
  let currentArticle = null;
  let articleParas = [];
  let lastBodyText = "";
  let sawDecree = false;

  const flushArticle = () => {
    if (!currentArticle) return;
    currentArticle.html_es = cleanArticleHtml(articleParas);
    currentArticle.html_en = currentArticle.html_es;
    sections.push(currentArticle);
    currentArticle = null;
    articleParas = [];
    lastBodyText = "";
  };

  let pendingSubtitle = null;

  for (const token of tokens) {
    if (token.tag === "caja") {
      const kind = kindFromHeader(token.header);
      if (!kind || !token.n) continue;
      const payload = insRows.get(token.n) || "";
      const targetKey = currentArticle?.section_key || "overview";
      const midArticle = Boolean(currentArticle && articleParas.length > 1);
      apparatus.push({
        section_key: targetKey,
        kind,
        anchor_key: midArticle ? inferAnchor(lastBodyText) : null,
        html: payload,
        citations: extractCitationsFromHtml(payload),
      });
      continue;
    }

    if (token.tag !== "p") continue;
    const bookmark = bookmarkFromToken(token);
    const plain = stripTags(token.inner);
    if (!plain) continue;

    if (pendingSubtitle) {
      const dest = sections.find((s) => s.section_key === pendingSubtitle);
      if (dest && !classifyHeading(plain) && !bookmark) {
        dest.title_es = `${dest.number_label_es} — ${shortRubric(plain)}`;
        dest.title_en = dest.title_es;
        pendingSubtitle = null;
        continue;
      }
      pendingSubtitle = null;
    }

    if (!sawDecree && /DECRETO\s+624/i.test(plain)) sawDecree = true;

    const heading = (bookmark ? classifyHeading(bookmark.title) : null) || classifyHeading(plain);
    if (heading?.kind === "article") {
      flushArticle();
      const key = uniqueKey(used, heading.key);
      currentArticle = {
        section_key: key,
        kind: "article",
        title_es: heading.title
          ? `Artículo ${heading.num} — ${shortRubric(heading.title)}`
          : `Artículo ${heading.num}`,
        title_en: heading.title
          ? `Article ${heading.num} — ${shortRubric(heading.title)}`
          : `Article ${heading.num}`,
        number_label_es: heading.label,
        number_label_en: `Art. ${heading.num}`,
        html_es: null,
        html_en: null,
        parent_hint: currentChapter || currentTitle || currentBook || "overview",
        bookmark: bookmark?.name || heading.num,
        num: heading.num,
      };
      articleParas = [token.inner];
      lastBodyText = plain;
      continue;
    }

    if (heading?.kind === "book" || (bookmark && /^LIBRO/i.test(bookmark.title))) {
      flushArticle();
      const h = heading || (bookmark ? classifyHeading(bookmark.title) : null);
      if (h) {
        currentBook = pushStructural(h, bookmark?.name, "overview");
        currentTitle = null;
        currentChapter = null;
        pendingSubtitle = currentBook;
      }
      continue;
    }
    if (heading?.kind === "title" || (bookmark && /^T[IÍ]TULO/i.test(bookmark.title))) {
      flushArticle();
      const h = heading || (bookmark ? classifyHeading(bookmark.title) : null);
      if (h) {
        currentTitle = pushStructural(h, bookmark?.name, currentBook || "overview");
        currentChapter = null;
        pendingSubtitle = currentTitle;
      }
      continue;
    }
    if (heading?.kind === "chapter" || (bookmark && /^CAP[IÍ]TULO/i.test(bookmark.title))) {
      flushArticle();
      const h = heading || (bookmark ? classifyHeading(bookmark.title) : null);
      if (h) {
        const parent = currentTitle || currentBook || "overview";
        h.key = `${h.key}-${parent}`;
        currentChapter = pushStructural(h, bookmark?.name, parent);
        pendingSubtitle = currentChapter;
      }
      continue;
    }

    if (bookmark && !heading) {
      flushArticle();
      const key = uniqueKey(used, slugKeyFromInput(bookmark.name || bookmark.title) || "sec");
      sections.push({
        section_key: key,
        kind: "heading",
        title_es: shortRubric(bookmark.title) || key,
        title_en: shortRubric(bookmark.title) || key,
        number_label_es: null,
        number_label_en: null,
        html_es: null,
        html_en: null,
        parent_hint: currentChapter || currentTitle || currentBook || "overview",
        bookmark: bookmark.name,
      });
      continue;
    }

    if (currentArticle) {
      articleParas.push(token.inner);
      lastBodyText = plain;
    }
  }
  flushArticle();

  const overview = {
    section_key: "overview",
    kind: "overview",
    title_es: "Generalidades",
    title_en: "Overview",
    number_label_es: null,
    number_label_en: null,
    html_es: OVERVIEW_ES,
    html_en: OVERVIEW_EN,
    parent_hint: null,
    bookmark: null,
  };

  const ordered = [overview, ...sections];
  const keySet = new Set(ordered.map((s) => s.section_key));
  for (const section of ordered) {
    if (section.parent_hint && !keySet.has(section.parent_hint)) {
      section.parent_hint = "overview";
    }
    if (section.section_key === "overview") section.parent_section_key = null;
    else if (section.kind === "book") section.parent_section_key = "overview";
    else if (section.kind === "title") section.parent_section_key = section.parent_hint && keySet.has(section.parent_hint) ? section.parent_hint : "overview";
    else section.parent_section_key = section.parent_hint && keySet.has(section.parent_hint) ? section.parent_hint : "overview";
  }

  // depths + sort
  const byKey = new Map(ordered.map((s) => [s.section_key, s]));
  const depthOf = (key, seen = new Set()) => {
    const node = byKey.get(key);
    if (!node || !node.parent_section_key || seen.has(key)) return 0;
    seen.add(key);
    return depthOf(node.parent_section_key, seen) + 1;
  };
  const childCount = new Map();
  for (const section of ordered) {
    section.depth = depthOf(section.section_key);
    const parent = section.parent_section_key || "root";
    const n = childCount.get(parent) ?? 0;
    section.sort_order = n;
    childCount.set(parent, n + 1);
  }

  return { sections: ordered, apparatus, insRowCount: insRows.size };
}

function collectAuthorities(apparatus) {
  const map = new Map();
  for (const box of apparatus) {
    for (const cite of box.citations) {
      const file = cite.dian_file;
      if (!file) continue;
      const existing = map.get(file) || {
        dian_file: file,
        slug_key: slugFromDianFile(file),
        kind: kindFromDianFile(file),
        title: titleFromDianFile(file, cite.label),
        citation_label: cite.label,
        official_source_url: officialDianUrl(file),
        target_norm_slug_key: KNOWN_NORM_SLUGS[file] || null,
        citation_count: 0,
      };
      existing.citation_count += 1;
      if (cite.label.length > existing.citation_label.length && cite.label.length < 160) {
        existing.citation_label = cite.label;
      }
      map.set(file, existing);
    }
  }
  return [...map.values()].sort((a, b) => b.citation_count - a.citation_count);
}

function sectionsForLocale(sections, locale) {
  return sections.map((section) => ({
    section_key: section.section_key,
    title: locale === "en" ? section.title_en : section.title_es,
    number_label: locale === "en" ? section.number_label_en : section.number_label_es,
    html: locale === "en" ? section.html_en : section.html_es,
    sort_order: section.sort_order,
    depth: section.depth,
    parent_section_key: section.parent_section_key,
  }));
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

async function upsertInBatches(supabase, table, rows, onConflict, chunk = 80) {
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await supabase.from(table).upsert(slice, { onConflict });
    if (error) throw error;
    if (i > 0 && i % 800 === 0) console.log(`    ${table} ${i}/${rows.length}`);
  }
}

async function insertInBatches(supabase, table, rows, chunk = 80) {
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await supabase.from(table).insert(slice);
    if (error) throw error;
  }
}

async function replaceSections(supabase, normId, sections) {
  const { error: delError } = await supabase.from("norm_sections").delete().eq("norm_id", normId);
  if (delError) throw delError;

  const idByKey = new Map();
  const batchSize = 40;
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
    const { data, error } = await supabase.from("norm_sections").insert(batch).select("id, section_key");
    if (error) throw error;
    for (const row of data) idByKey.set(row.section_key, row.id);
  }

  const withParent = sections.filter((s) => s.parent_section_key);
  for (let i = 0; i < withParent.length; i += 20) {
    const slice = withParent.slice(i, i + 20);
    await Promise.all(
      slice.map(async (section) => {
        const sectionId = idByKey.get(section.section_key);
        const parentId = idByKey.get(section.parent_section_key);
        if (!sectionId || !parentId) return;
        const { error } = await supabase
          .from("norm_sections")
          .update({ parent_id: parentId })
          .eq("id", sectionId);
        if (error) throw error;
      }),
    );
  }
  return idByKey;
}

async function applyExtract(extract, locales) {
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

  const authorities = collectAuthorities(extract.apparatus);
  console.log(`  Upserting ${authorities.length} authorities…`);
  await upsertInBatches(
    supabase,
    "legal_authorities",
    authorities.map((row) => ({
      slug_key: row.slug_key,
      kind: row.kind,
      title: row.title,
      title_en: null,
      citation_label: row.citation_label,
      official_source_url: row.official_source_url,
      dian_file: row.dian_file,
      ingest_status: "stub",
      listed_in_hub: Boolean(row.target_norm_slug_key),
      target_norm_slug_key: row.target_norm_slug_key,
      citation_count: row.citation_count,
    })),
    "dian_file",
    60,
  );

  const { data: authRows, error: authErr } = await supabase
    .from("legal_authorities")
    .select("id, dian_file");
  if (authErr) throw authErr;
  const authorityIdByFile = new Map(
    (authRows || []).filter((r) => r.dian_file).map((r) => [r.dian_file, r.id]),
  );

  for (const locale of locales) {
    const { data: norm, error } = await supabase
      .from("norms")
      .select("id")
      .eq("slug_key", SLUG)
      .eq("locale", locale)
      .maybeSingle();
    if (error) throw error;
    if (!norm) {
      console.warn(`  skip: missing norm ${SLUG} (${locale})`);
      continue;
    }

    const { error: metaErr } = await supabase
      .from("norms")
      .update({
        official_source_url: SOURCE_URL,
        official_reference: "Decreto 624 de 1989 — Compilación Jurídica DIAN",
        description: locale === "en" ? DESC_EN : DESC_ES,
        title:
          locale === "en"
            ? "Tax Statute (Estatuto Tributario)"
            : "Estatuto Tributario",
        short_title: locale === "en" ? "Tax Statute" : "Estatuto Tributario",
      })
      .eq("id", norm.id);
    if (metaErr) throw metaErr;

    const localeSections = sectionsForLocale(extract.sections, locale);
    console.log(`  Replacing ${localeSections.length} sections (${locale})…`);
    const idByKey = await replaceSections(supabase, norm.id, localeSections);

    const apparatusRows = [];
    const citationPlan = [];
    extract.apparatus.forEach((box, index) => {
      const sectionId = idByKey.get(box.section_key);
      if (!sectionId) return;
      apparatusRows.push({
        _tmp: index,
        section_id: sectionId,
        kind: box.kind,
        anchor_key: box.anchor_key,
        sort_order: index,
        html: box.html || null,
      });
      citationPlan.push({ tmp: index, sectionId, citations: box.citations });
    });

    console.log(`  Inserting ${apparatusRows.length} apparatus boxes (${locale})…`);
    const insertedIds = [];
    for (let i = 0; i < apparatusRows.length; i += 40) {
      const slice = apparatusRows.slice(i, i + 40).map(({ _tmp, ...row }) => row);
      const { data, error: insErr } = await supabase
        .from("norm_section_apparatus")
        .insert(slice)
        .select("id");
      if (insErr) throw insErr;
      insertedIds.push(...(data || []).map((r) => r.id));
    }

    const citationRows = [];
    citationPlan.forEach((plan, i) => {
      const apparatusId = insertedIds[i];
      if (!apparatusId) return;
      plan.citations.forEach((cite, j) => {
        citationRows.push({
          apparatus_id: apparatusId,
          section_id: plan.sectionId,
          dian_file: cite.dian_file,
          dian_anchor: cite.dian_anchor,
          label: cite.label.slice(0, 240),
          target_authority_id: authorityIdByFile.get(cite.dian_file) || null,
          sort_order: j,
        });
      });
    });
    console.log(`  Inserting ${citationRows.length} citations (${locale})…`);
    await insertInBatches(supabase, "norm_citations", citationRows, 80);
    console.log(`  ✓ ${SLUG} (${locale})`);
  }
}

async function main() {
  const { apply, skipFetch, locales } = parseArgs(process.argv);
  await ensureCache(skipFetch);
  const html = readFileSync(HTML_CACHE, "utf8");
  const jsSource = readFileSync(JS_CACHE, "utf8");
  console.log("Parsing DIAN ET…");
  const parsed = parseEt(html, jsSource);
  const authorities = collectAuthorities(parsed.apparatus);
  const extract = {
    meta: {
      url: SOURCE_URL,
      jsUrl: ET_JS_URL,
      generatedAt: new Date().toISOString(),
      docsBase: DIAN_DOCS,
    },
    sections: parsed.sections,
    apparatus: parsed.apparatus,
    authorities,
    stats: {
      sections: parsed.sections.length,
      articles: parsed.sections.filter((s) => s.kind === "article").length,
      apparatus: parsed.apparatus.length,
      citations: parsed.apparatus.reduce((n, b) => n + b.citations.length, 0),
      authorities: authorities.length,
      insRows: parsed.insRowCount,
    },
  };

  const slimPath = OUT_JSON;
  writeFileSync(
    slimPath,
    JSON.stringify(
      {
        meta: extract.meta,
        stats: extract.stats,
        sections: extract.sections,
        apparatus: extract.apparatus.map((box) => ({
          section_key: box.section_key,
          kind: box.kind,
          anchor_key: box.anchor_key,
          html: box.html,
          citations: box.citations,
        })),
        authorities: extract.authorities,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(
    `Wrote ${slimPath}: ${extract.stats.articles} articles, ${extract.stats.apparatus} boxes, ${extract.stats.citations} citations, ${extract.stats.authorities} authorities`,
  );

  if (apply) {
    console.log(`\nApplying to Supabase (${locales.join(", ")})…`);
    await applyExtract(extract, locales);
    console.log("Done.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
