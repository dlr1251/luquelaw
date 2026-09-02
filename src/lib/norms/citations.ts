import { normPublicPath } from "@/lib/norms/types";

export type AuthorityKind =
  | "statute"
  | "decree"
  | "resolution"
  | "judgment"
  | "dian_doctrine"
  | "constitution"
  | "other";

export type AuthorityIngestStatus = "stub" | "ingested" | "published";

export type LegalAuthorityRecord = {
  id: string;
  slug_key: string;
  kind: AuthorityKind;
  title: string;
  title_en: string | null;
  citation_label: string;
  official_source_url: string | null;
  dian_file: string | null;
  ingest_status: AuthorityIngestStatus;
  listed_in_hub: boolean;
  target_norm_slug_key: string | null;
  html_es: string | null;
  html_en: string | null;
  citation_count: number;
  year: number | null;
  number_label: string | null;
};

export type ApparatusKind =
  | "vigencia"
  | "concordancias"
  | "jurisprudencia"
  | "jurisprudencia_vigencia"
  | "doctrina"
  | "legislacion_anterior"
  | "editor_dian";

export type NormCitationRecord = {
  id: string;
  apparatus_id: string;
  section_id: string;
  dian_file: string;
  dian_anchor: string | null;
  label: string;
  target_authority_id: string | null;
  sort_order: number;
  href: string;
  isStub: boolean;
};

export type ApparatusBox = {
  id: string;
  section_id: string;
  kind: ApparatusKind;
  anchor_key: string | null;
  sort_order: number;
  html: string | null;
  citations: NormCitationRecord[];
};

export type TranslationNoteRecord = {
  id: string;
  section_id: string;
  span_es: string;
  rendering_us: string;
  variant_uk: string | null;
  risk: "low" | "medium" | "high";
  note_html: string;
  sort_order: number;
  status: "draft" | "published" | "archived";
};

export const APPARATUS_KIND_ORDER: ApparatusKind[] = [
  "vigencia",
  "concordancias",
  "jurisprudencia",
  "jurisprudencia_vigencia",
  "doctrina",
  "legislacion_anterior",
  "editor_dian",
];

export function apparatusKindLabel(kind: ApparatusKind, locale: "en" | "es"): string {
  const labels: Record<ApparatusKind, { en: string; es: string }> = {
    vigencia: { en: "In-force notes", es: "Notas de vigencia" },
    concordancias: { en: "Concordances", es: "Concordancias" },
    jurisprudencia: { en: "Case law", es: "Jurisprudencia concordante" },
    jurisprudencia_vigencia: { en: "Case law on validity", es: "Jurisprudencia vigencia" },
    doctrina: { en: "DIAN doctrine", es: "Doctrina concordante" },
    legislacion_anterior: { en: "Prior wording", es: "Legislación anterior" },
    editor_dian: { en: "Compilation editor notes", es: "Notas del editor (compilación)" },
  };
  return labels[kind][locale];
}

export function authorityKindLabel(kind: AuthorityKind, locale: "en" | "es"): string {
  const labels: Record<AuthorityKind, { en: string; es: string }> = {
    statute: { en: "Statute", es: "Ley / estatuto" },
    decree: { en: "Decree", es: "Decreto" },
    resolution: { en: "Resolution", es: "Resolución" },
    judgment: { en: "Judgment", es: "Sentencia" },
    dian_doctrine: { en: "DIAN doctrine", es: "Doctrina DIAN" },
    constitution: { en: "Constitution", es: "Constitución" },
    other: { en: "Authority", es: "Autoridad" },
  };
  return labels[kind][locale];
}

/** DIAN compilation files that also live as catalog norms. */
export const KNOWN_DIAN_NORM_SLUGS: Record<string, string> = {
  "estatuto_tributario.htm": "estatuto-tributario",
  "decreto_1625_2016.htm": "decreto-1625-2016",
  "constitucion_politica_1991.htm": "constitucion-colombia",
  "ley_1607_2012.htm": "ley-1607-2012",
  "ley_1819_2016.htm": "ley-1819-2016",
  "ley_1943_2018.htm": "ley-1943-2018",
  "ley_2010_2019.htm": "ley-2010-2019",
  "ley_2277_2022.htm": "ley-2277-2022",
};

const KNOWN_SLUG_TO_DIAN_FILE: Record<string, string> = Object.fromEntries(
  Object.entries(KNOWN_DIAN_NORM_SLUGS).map(([file, slug]) => [slug, file]),
);

const ARTICLE_TREE_SLUGS = new Set(["estatuto-tributario", "constitucion-colombia"]);

export function authorityPublicPath(slugKey: string, locale: "en" | "es"): string {
  const prefix = locale === "es" ? "/es" : "";
  return `${prefix}/clkr/authorities/${slugKey}`;
}

export function etDeskTranslationNotice(locale: "en" | "es"): string {
  return locale === "es"
    ? "Texto consolidado de la Compilación Jurídica DIAN. No sustituye el Diario Oficial."
    : "Spanish is the DIAN compilation. English is Luque Law’s unofficial U.S. desk translation, not a gazette.";
}

export function etArticleSectionKey(anchor: string | null): string | null {
  if (!anchor) return null;
  const num = anchor.replace(/^art(?:iculo)?-?/i, "").replace(/^0+/, "");
  if (/^\d+(-\d+)?$/.test(num)) return `art-${num}`;
  if (/^\d+(-\d+)?$/.test(anchor)) return `art-${anchor}`;
  return null;
}

function catalogHref(
  slug: string,
  locale: "en" | "es",
  dianAnchor: string | null,
): string {
  if (ARTICLE_TREE_SLUGS.has(slug)) {
    const key = etArticleSectionKey(dianAnchor);
    return key ? normPublicPath(slug, locale, [key]) : normPublicPath(slug, locale);
  }
  return normPublicPath(slug, locale);
}

export function resolveCitationHref(input: {
  locale: "en" | "es";
  dianFile: string;
  dianAnchor: string | null;
  authority: Pick<
    LegalAuthorityRecord,
    "slug_key" | "target_norm_slug_key" | "ingest_status"
  > | null;
}): { href: string; isStub: boolean } {
  const file = input.dianFile.toLowerCase();
  const catalogSlug =
    KNOWN_DIAN_NORM_SLUGS[file] ?? input.authority?.target_norm_slug_key ?? null;
  if (catalogSlug) {
    return {
      href: catalogHref(catalogSlug, input.locale, input.dianAnchor),
      isStub: false,
    };
  }

  if (input.authority) {
    return {
      href: authorityPublicPath(input.authority.slug_key, input.locale),
      isStub: input.authority.ingest_status === "stub",
    };
  }

  return {
    href: authorityPublicPath(
      file.replace(/\.htm$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      input.locale,
    ),
    isStub: true,
  };
}

const HREF_RE = /href\s*=\s*(["'])([^"']+)\1/gi;

export function rewriteDianHrefs(
  html: string,
  locale: "en" | "es",
  resolveFile: (file: string, anchor: string | null) => string,
): string {
  return html.replace(HREF_RE, (full, quote: string, raw: string) => {
    const trimmed = raw.trim();
    const authMatch = trimmed.match(
      /^(?:https?:\/\/[^/]+)?(?:\/es)?\/clkr\/authorities\/([^/#?]+)(?:#(.*))?$/i,
    );
    if (authMatch) {
      const file = KNOWN_SLUG_TO_DIAN_FILE[authMatch[1]];
      if (file) {
        return `href=${quote}${resolveFile(file, authMatch[2] || null)}${quote}`;
      }
      return full;
    }
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("#")) {
      if (/normograma\.dian\.gov\.co/i.test(trimmed)) {
        const name = trimmed.split("/").pop() || "";
        const [path, hash] = name.split("#");
        if (path.endsWith(".htm")) {
          return `href=${quote}${resolveFile(path.toLowerCase(), hash || null)}${quote}`;
        }
      }
      return full;
    }
    const [path, hash] = trimmed.split("#");
    const file = path.split("/").pop()?.split("?")[0]?.toLowerCase() || "";
    if (!file.endsWith(".htm")) return full;
    return `href=${quote}${resolveFile(file, hash || null)}${quote}`;
  });
}
