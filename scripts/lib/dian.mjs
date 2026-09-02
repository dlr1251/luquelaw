/** Shared DIAN compilation helpers (filenames, insRow payloads, kind labels). */

export const DIAN_DOCS =
  "https://normograma.dian.gov.co/dian/compilacion/docs/";

export const ET_HTML_URL = `${DIAN_DOCS}estatuto_tributario.htm`;
export const ET_JS_URL = `${DIAN_DOCS}js/estatuto_tributario.js?v=2.0`;

export const HEADER_KIND = {
  "Notas de Vigencia": "vigencia",
  "Resumen de Notas de Vigencia": "vigencia",
  Concordancias: "concordancias",
  "Jurisprudencia Concordante": "jurisprudencia",
  "Jurisprucdencia Concordante": "jurisprudencia",
  "Jurisprudencia concordante": "jurisprudencia",
  "Jurisprudencia Unificación": "jurisprudencia",
  "Jurisprudencia Unificacion": "jurisprudencia",
  "Jurisprudencia Vigencia": "jurisprudencia_vigencia",
  "Doctrina Concordante": "doctrina",
  "Legislación Anterior": "legislacion_anterior",
  "Notas del Editor": "editor_dian",
};

export const KNOWN_NORM_SLUGS = {
  "estatuto_tributario.htm": "estatuto-tributario",
  "decreto_1625_2016.htm": "decreto-1625-2016",
  "constitucion_politica_1991.htm": "constitucion-colombia",
  "ley_1607_2012.htm": "ley-1607-2012",
  "ley_1819_2016.htm": "ley-1819-2016",
  "ley_1943_2018.htm": "ley-1943-2018",
  "ley_2010_2019.htm": "ley-2010-2019",
  "ley_2277_2022.htm": "ley-2277-2022",
};

export function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&#160;/g, " ")
    .replace(/\u00a0/g, " ");
}

export function stripTags(html) {
  return decodeEntities(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function slugKeyFromInput(input) {
  return decodeEntities(input)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeDianFile(href) {
  if (!href) return { file: "", anchor: "" };
  const raw = decodeEntities(href).trim().replace(/\\'/g, "'");
  const [path, hash] = raw.split("#");
  const file = path.split("/").pop().split("?")[0].toLowerCase();
  return { file, anchor: (hash || "").replace(/inicio/i, "").toLowerCase() };
}

export function kindFromDianFile(file) {
  if (!file) return "other";
  if (file.startsWith("constitucion")) return "constitution";
  if (file.startsWith("estatuto") || file.startsWith("ley_")) return "statute";
  if (file.startsWith("decreto")) return "decree";
  if (file.startsWith("resolucion")) return "resolution";
  if (file.startsWith("oficio") || file.startsWith("concepto")) return "dian_doctrine";
  if (/^c-\d+/.test(file) || /^\d{5}-/.test(file)) return "judgment";
  return "other";
}

export function slugFromDianFile(file) {
  if (KNOWN_NORM_SLUGS[file]) return KNOWN_NORM_SLUGS[file];
  const base = file.replace(/\.htm$/i, "");
  const concepto = base.match(/^concepto_tributario_dian_0*(\d+)_(\d+)$/i);
  if (concepto) return `concepto-dian-${concepto[1]}-${concepto[2]}`;
  const oficio = base.match(/^oficio_dian_0*(\d+)_(\d+)$/i);
  if (oficio) return `oficio-dian-${oficio[1]}-${oficio[2]}`;
  return slugKeyFromInput(base).slice(0, 90);
}

export function parseInsRows(jsSource) {
  const map = new Map();
  const re =
    /function\s+insRow(\d+)\(\)\s*\{[\s\S]*?description\[0\]\s*=\s*"((?:\\.|[^"\\])*)"/g;
  for (const match of jsSource.matchAll(re)) {
    const html = match[2]
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\\//g, "/");
    map.set(Number(match[1]), html);
  }
  return map;
}

export function kindFromHeader(label) {
  const clean = decodeEntities(label).replace(/\s+/g, " ").trim();
  return HEADER_KIND[clean] || null;
}

export function extractCitationsFromHtml(html) {
  const citations = [];
  const seen = new Set();
  const re = /<a\b[^>]*href\s*=\s*['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of String(html || "").matchAll(re)) {
    const { file, anchor } = normalizeDianFile(match[1]);
    if (!file.endsWith(".htm")) continue;
    const label = stripTags(match[2]) || file;
    const key = `${file}#${anchor}#${label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    citations.push({ dian_file: file, dian_anchor: anchor || null, label });
  }
  return citations;
}

export function officialDianUrl(file, anchor) {
  if (!file) return DIAN_DOCS;
  const hash = anchor ? `#${anchor}` : "";
  return `${DIAN_DOCS}${file}${hash}`;
}

export function titleFromDianFile(file, fallbackLabel) {
  const known = {
    "estatuto_tributario.htm": "Estatuto Tributario (Decreto 624 de 1989)",
    "decreto_1625_2016.htm": "Decreto 1625 de 2016 (DUR tributario)",
    "constitucion_politica_1991.htm": "Constitución Política de Colombia",
  };
  if (known[file]) return known[file];
  if (fallbackLabel && fallbackLabel.length > 3 && fallbackLabel.length < 180) {
    return fallbackLabel;
  }
  return file.replace(/\.htm$/i, "").replace(/_/g, " ");
}
