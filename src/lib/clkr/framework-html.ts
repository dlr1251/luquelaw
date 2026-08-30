import { normPublicPath } from "@/lib/norms/types";

type Locale = "en" | "es";

const CONSTITUTION_SUIN =
  "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Constitucion/1687988";
const CONSTITUTION_EVA =
  "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4125";
const ET_EVA =
  "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=6533";
const DECRETO_1625_EVA =
  "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=79573";

type OfficialHit = {
  slug?: string;
  href: string;
  label: string;
};

function senadoLey(n: string, year: string): string {
  return `https://www.secretariasenado.gov.co/senado/basedoc/ley_${n}_${year}.html`;
}

function matchOfficial(text: string): OfficialHit | null {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const looksLikeStatute =
    /ley\s+\d/.test(t) || /decreto\s+\d/.test(t) || /resoluci/.test(t);
  if (
    /constitucion politica/.test(t) ||
    /constitucion de 1991/.test(t) ||
    /political constitution/.test(t) ||
    (/constituci/.test(t) &&
      !/corte constitucional|constitutional court/.test(t) &&
      !looksLikeStatute)
  ) {
    return { slug: "constitucion-colombia", href: CONSTITUTION_EVA, label: "Función Pública" };
  }

  if (/codigo civil|civil code/.test(t) && !/comercio|commercial/.test(t)) {
    return {
      slug: "codigo-civil",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1827111",
      label: "SUIN-Juriscol",
    };
  }

  if (/codigo de comercio|commercial code|codigo comercio/.test(t)) {
    return { slug: "codigo-de-comercio", href: "", label: "" };
  }

  if (
    /codigo sustantivo del trabajo|\bcst\b|substantive labor code/.test(t)
  ) {
    return {
      slug: "codigo-sustantivo-del-trabajo",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30019323",
      label: "SUIN-Juriscol",
    };
  }

  if (/codigo penal|penal code|ley 599/.test(t) && !/procedimiento/.test(t)) {
    return {
      slug: "codigo-penal",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1663230",
      label: "SUIN-Juriscol",
    };
  }

  if (/\bcpaca\b|ley 1437/.test(t)) {
    return {
      slug: "cpaca",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1680117",
      label: "SUIN-Juriscol",
    };
  }

  if (/codigo general del proceso|\bcgp\b|ley 1564/.test(t)) {
    return {
      slug: "codigo-general-del-proceso",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1683572",
      label: "SUIN-Juriscol",
    };
  }

  if (/ley 1258/.test(t) || /ley de las sas|simplified stock company/.test(t)) {
    return { slug: "ley-sas", href: senadoLey("1258", "2008"), label: "Secretaría del Senado" };
  }

  if (/resoluci[oó]n 5477|resolution 5477/.test(text) || /resolucion 5477/.test(t)) {
    return {
      slug: "resolucion-5477-2022",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30052890",
      label: "SUIN-Juriscol",
    };
  }

  if (/resoluci[oó]n 2061|resolution 2061/.test(text) || /resolucion 2061/.test(t)) {
    return {
      slug: "resolucion-2061-2020",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30051731",
      label: "SUIN-Juriscol",
    };
  }

  if (/resoluci[oó]n 2357|resolution 2357/.test(text) || /resolucion 2357/.test(t)) {
    return {
      slug: "resolucion-2357-2020",
      href: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30052886",
      label: "SUIN-Juriscol",
    };
  }

  if (/estatuto tributario|decreto 624/.test(t)) {
    return {
      slug: "estatuto-tributario",
      href: ET_EVA,
      label: "Función Pública",
    };
  }

  if (/decreto 1625/.test(t)) {
    return { href: DECRETO_1625_EVA, label: "Función Pública" };
  }

  if (/ley 2277/.test(t)) {
    return { href: senadoLey("2277", "2022"), label: "Secretaría del Senado" };
  }

  if (/ley 1607/.test(t)) {
    return { href: senadoLey("1607", "2012"), label: "Secretaría del Senado" };
  }

  if (/decision 351|decisi[oó]n 351/.test(t)) {
    return {
      href: "https://www.comunidadandina.org/normativa/decisiones/dec351.htm",
      label: "Comunidad Andina",
    };
  }

  const ley = text.match(/ley\s+(\d+)\s*(?:de\s*)?\/?\s*(1[89]\d{2}|20\d{2})/i);
  if (ley) {
    return { href: senadoLey(ley[1], ley[2]), label: "Secretaría del Senado" };
  }

  return null;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function innerOf(tagHtml: string): string {
  return tagHtml.replace(/^<t[dh][^>]*>/i, "").replace(/<\/t[dh]>$/i, "").trim();
}

function isShallowHref(href: string): boolean {
  try {
    const u = new URL(href);
    const path = u.pathname.replace(/\/+$/, "") || "/";
    const host = u.hostname.replace(/^www\./, "");
    if (path === "/") return true;
    if (host === "suin-juriscol.gov.co" && !/viewdocument/i.test(u.pathname)) return true;
    if (host === "imprenta.gov.co" && !/gaceta/i.test(`${u.pathname}${u.search}`)) return true;
    if (host === "normograma.dian.gov.co" && path.split("/").filter(Boolean).length < 2) {
      return true;
    }
    if (host === "funcionpublica.gov.co" && !/norma\.php/i.test(u.pathname)) return true;
    if (host === "eva.funcionpublica.gov.co" && path === "/") return true;
    if (host === "migracioncolombia.gov.co" && path.split("/").filter(Boolean).length < 2) {
      return true;
    }
    if (host === "supersociedades.gov.co" && path.split("/").filter(Boolean).length < 2) {
      return true;
    }
    if (host === "comunidadandina.org" && path === "/") return true;
    return false;
  } catch {
    return true;
  }
}

function isWrongConstitutionSuin(href: string): boolean {
  try {
    const u = new URL(href);
    if (!u.hostname.includes("suin-juriscol")) return false;
    const ruta = u.searchParams.get("ruta") ?? "";
    return /^Constitucion\//i.test(ruta) && !ruta.endsWith("1687988");
  } catch {
    return false;
  }
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function anchorAttrs(href: string): string {
  const safe = href.replace(/"/g, "&quot;");
  if (isExternalHref(href)) {
    return `href="${safe}" target="_blank" rel="noopener noreferrer"`;
  }
  return `href="${safe}"`;
}

function rewriteHref(href: string, haystack: string): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;

  if (isWrongConstitutionSuin(trimmed)) return CONSTITUTION_SUIN;

  const hit = matchOfficial(haystack);
  if ((isShallowHref(trimmed) || isWrongConstitutionSuin(trimmed)) && hit?.href) {
    return hit.href;
  }

  return trimmed;
}

function rewriteAnchors(html: string, extraHaystack = ""): string {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_full, attrs: string, inner: string) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) return _full;
    const haystack = `${extraHaystack} ${stripTags(inner)}`.trim();
    const next = rewriteHref(hrefMatch[1], haystack);
    const hit = matchOfficial(haystack);
    const label = stripTags(inner).replace(/^🔗\s*/, "");
    const genericLabel =
      /^(suin-juriscol|suin|funcion publica|eva|dian|dian normograma|diario oficial|secretaria del senado)$/i.test(
        label.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      );
    const body =
      genericLabel && hit?.label && next !== hrefMatch[1] ? hit.label : inner;
    const withoutHref = attrs
      .replace(/href\s*=\s*["'][^"']+["']/i, "")
      .replace(/\s(target|rel)\s*=\s*["'][^"']+["']/gi, "")
      .trim();
    const extra = withoutHref ? ` ${withoutHref}` : "";
    return `<a ${anchorAttrs(next)}${extra}>${body}</a>`;
  });
}

type ColKind = "level" | "instrument" | "vigencia" | "source" | "other";

function classifyHeader(text: string): ColKind {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (/^(nivel|level|jerarquia|hierarchy)$/.test(t)) return "level";
  if (/^(norma|norm|instrumento|instrument|disposicion)$/.test(t)) return "instrument";
  if (/^(vigencia|validity|status|estado)$/.test(t)) return "vigencia";
  if (/enlace|source|official|fuente|^url$|^link/.test(t)) return "source";
  return "other";
}

function kindsForHeaders(headers: string[], locale: Locale): ColKind[] {
  const kinds = headers.map(classifyHeader);
  if (kinds.includes("instrument") || kinds.includes("level")) return kinds;

  if (headers.length >= 4) {
    return locale === "es"
      ? ["level", "instrument", "vigencia", "source"]
      : ["instrument", "level", "vigencia", "source"];
  }
  if (headers.length === 3) {
    return locale === "es"
      ? ["level", "instrument", "source"]
      : ["instrument", "level", "source"];
  }
  return headers.map(() => "other");
}

function pick(cells: string[], kinds: ColKind[], kind: ColKind): string {
  const i = kinds.indexOf(kind);
  if (i === -1) return "";
  return cells[i] ?? "";
}

function sourceLinksHtml(
  sourceHtml: string,
  haystack: string,
  locale: Locale,
  instrumentHtml: string,
): string {
  const hit = matchOfficial(haystack);
  const rewritten = rewriteAnchors(sourceHtml, haystack);
  const already = instrumentHtml;
  const extras: string[] = [];

  if (hit?.slug && !already.includes(`/clkr/norms/${hit.slug}`)) {
    const href = normPublicPath(hit.slug, locale);
    const label = locale === "es" ? "Texto CLKR" : "CLKR text";
    extras.push(`<a ${anchorAttrs(href)}>${label}</a>`);
  }

  if (hit?.href && !already.includes(hit.href)) {
    extras.push(`<a ${anchorAttrs(hit.href)}>${hit.label}</a>`);
  } else if (!hit?.href && /<a\b/i.test(rewritten) && !anchorIsShallow(rewritten)) {
    extras.push(rewritten);
  }

  const seen = new Set<string>();
  const parts: string[] = [];
  for (const extra of extras) {
    const href = extra.match(/href="([^"]+)"/)?.[1] ?? extra;
    if (seen.has(href) || already.includes(href)) continue;
    seen.add(href);
    parts.push(extra);
  }

  return parts.join(" · ");
}

function anchorIsShallow(html: string): boolean {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  return hrefs.length === 0 || hrefs.every((h) => isShallowHref(h) || isWrongConstitutionSuin(h));
}

function tableToList(tableHtml: string, locale: Locale): string {
  const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1]);
  if (!rows.length) return tableHtml;

  const parsed = rows.map((row) =>
    [...row.matchAll(/<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi)].map((c) => innerOf(c[0])),
  );

  const hasTh = /<th\b/i.test(rows[0] ?? "");
  const headerCells = hasTh ? parsed[0].map(stripTags) : (parsed[0] ?? []).map(() => "");
  const dataRows = hasTh ? parsed.slice(1) : parsed;

  const kinds = kindsForHeaders(headerCells, locale);
  const groups: { level: string; items: string[] }[] = [];

  for (const cells of dataRows) {
    if (!cells.length) continue;
    const levelRaw = pick(cells, kinds, "level");
    const instrumentRaw = pick(cells, kinds, "instrument") || cells[0] || "";
    const vigenciaRaw = pick(cells, kinds, "vigencia");
    const sourceRaw = pick(cells, kinds, "source") || cells[cells.length - 1] || "";

    const level = stripTags(levelRaw) || (locale === "es" ? "Norma" : "Norm");
    const instrumentHay = stripTags(instrumentRaw);
    const haystack = `${instrumentHay} ${stripTags(sourceRaw)} ${level}`;
    const instrumentHtml = rewriteAnchors(instrumentRaw, haystack);
    const vigencia = stripTags(vigenciaRaw);
    const sources = sourceLinksHtml(sourceRaw, haystack, locale, instrumentHtml);

    const meta: string[] = [];
    if (vigencia) {
      const label = locale === "es" ? "Vigencia" : "Status";
      meta.push(`<li>${label}: ${escapeText(vigencia)}</li>`);
    }
    if (sources) {
      const label = locale === "es" ? "Fuente" : "Source";
      meta.push(`<li>${label}: ${sources}</li>`);
    }

    const item = `<li>${instrumentHtml}${
      meta.length ? `<ul class="clkr-framework-meta">${meta.join("")}</ul>` : ""
    }</li>`;

    const last = groups[groups.length - 1];
    if (last && last.level === level) last.items.push(item);
    else groups.push({ level, items: [item] });
  }

  if (!groups.length) return tableHtml;

  const body = groups
    .map(
      (g) =>
        `<li><p class="clkr-framework-level">${escapeText(g.level)}</p><ul>${g.items.join("")}</ul></li>`,
    )
    .join("");

  return `<ul class="clkr-framework-list">${body}</ul>`;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function prepareClkrSectionHtml(
  html: string,
  opts: { locale?: Locale; sectionId?: string } = {},
): string {
  const locale = opts.locale ?? "en";
  let next = html;
  if (opts.sectionId === "legal-framework") {
    next = next.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => tableToList(table, locale));
  }
  return rewriteAnchors(next);
}
