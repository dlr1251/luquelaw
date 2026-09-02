/**
 * Seed catalog norms for DUR 1625 and top reforming tax laws, and point
 * legal_authorities.target_norm_slug_key at them.
 *
 *   node scripts/seed-tax-sister-norms.mjs --apply
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

import { DIAN_DOCS, KNOWN_NORM_SLUGS } from "./lib/dian.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SISTERS = [
  {
    slug: "decreto-1625-2016",
    dian: "decreto_1625_2016.htm",
    sort: 105,
    title_es: "Decreto 1625 de 2016 (DUR tributario)",
    title_en: "Decree 1625 of 2016 (tax DUR)",
    desc_es:
      "Decreto Único Reglamentario en materia tributaria. Compilación DIAN. No sustituye el Diario Oficial.",
    desc_en:
      "Single Regulatory Decree for tax matters. DIAN compilation. Not a gazette.",
    reference: "Decreto 1625 de 2016",
  },
  {
    slug: "ley-1607-2012",
    dian: "ley_1607_2012.htm",
    sort: 106,
    title_es: "Ley 1607 de 2012",
    title_en: "Law 1607 of 2012",
    desc_es: "Reforma tributaria que, entre otras, reescribió la residencia fiscal (art. 10 ET).",
    desc_en: "Tax reform that, among other things, rewrote tax residence (ET art. 10).",
    reference: "Ley 1607 de 2012",
  },
  {
    slug: "ley-1819-2016",
    dian: "ley_1819_2016.htm",
    sort: 107,
    title_es: "Ley 1819 de 2016",
    title_en: "Law 1819 of 2016",
    desc_es: "Reforma tributaria estructural de 2016. Compilación DIAN.",
    desc_en: "2016 structural tax reform. DIAN compilation.",
    reference: "Ley 1819 de 2016",
  },
  {
    slug: "ley-1943-2018",
    dian: "ley_1943_2018.htm",
    sort: 108,
    title_es: "Ley 1943 de 2018",
    title_en: "Law 1943 of 2018",
    desc_es: "Ley de financiamiento de 2018. Compilación DIAN.",
    desc_en: "2018 financing law. DIAN compilation.",
    reference: "Ley 1943 de 2018",
  },
  {
    slug: "ley-2010-2019",
    dian: "ley_2010_2019.htm",
    sort: 109,
    title_es: "Ley 2010 de 2019",
    title_en: "Law 2010 of 2019",
    desc_es: "Ley de crecimiento económico. Compilación DIAN.",
    desc_en: "Economic growth law. DIAN compilation.",
    reference: "Ley 2010 de 2019",
  },
  {
    slug: "ley-2277-2022",
    dian: "ley_2277_2022.htm",
    sort: 110,
    title_es: "Ley 2277 de 2022",
    title_en: "Law 2277 of 2022",
    desc_es: "Reforma tributaria de 2022. Compilación DIAN.",
    desc_en: "2022 tax reform. DIAN compilation.",
    reference: "Ley 2277 de 2022",
  },
];

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

async function main() {
  if (!process.argv.includes("--apply")) {
    console.log(`Would seed ${SISTERS.length} tax sister norms. Pass --apply.`);
    process.exit(0);
  }
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !serviceKey) throw new Error("Need SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const spec of SISTERS) {
    const groupId = randomUUID();
    for (const locale of ["es", "en"]) {
      const { data: existing } = await supabase
        .from("norms")
        .select("id")
        .eq("slug_key", spec.slug)
        .eq("locale", locale)
        .maybeSingle();
      const payload = {
        slug_key: spec.slug,
        locale,
        title: locale === "en" ? spec.title_en : spec.title_es,
        short_title: locale === "en" ? spec.title_en : spec.title_es,
        description: locale === "en" ? spec.desc_en : spec.desc_es,
        norm_type: "law",
        category: "tax",
        official_reference: spec.reference,
        official_source_url: `${DIAN_DOCS}${spec.dian}`,
        status: "published",
        sort_order: spec.sort,
        published_at: new Date().toISOString(),
      };
      if (existing) {
        const { error } = await supabase.from("norms").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("norms").insert({
          ...payload,
          translation_group_id: groupId,
        });
        if (error) throw error;
      }
    }

    const { data: norms } = await supabase
      .from("norms")
      .select("id, locale")
      .eq("slug_key", spec.slug);
    for (const norm of norms || []) {
      const html =
        norm.locale === "en"
          ? `<p>${spec.desc_en}</p><p>Full text is being ingested from the DIAN compilation. Open the official source until the article tree is loaded.</p>`
          : `<p>${spec.desc_es}</p><p>El texto completo se está ingiriendo desde la Compilación Jurídica DIAN. Mientras tanto usa la fuente oficial.</p>`;
      await supabase.from("norm_sections").delete().eq("norm_id", norm.id).eq("section_key", "overview");
      await supabase.from("norm_sections").insert({
        norm_id: norm.id,
        parent_id: null,
        section_key: "overview",
        title: norm.locale === "en" ? "Overview" : "Generalidades",
        number_label: null,
        html,
        sort_order: 0,
        depth: 0,
      });
    }

    const { error: authErr } = await supabase
      .from("legal_authorities")
      .update({
        target_norm_slug_key: spec.slug,
        listed_in_hub: false,
      })
      .eq("dian_file", spec.dian);
    if (authErr) throw authErr;
    console.log(`  ✓ ${spec.slug}`);
  }

  await supabase
    .from("legal_authorities")
    .update({ target_norm_slug_key: "constitucion-colombia" })
    .eq("dian_file", "constitucion_politica_1991.htm");
  await supabase
    .from("legal_authorities")
    .update({ target_norm_slug_key: "estatuto-tributario" })
    .eq("dian_file", "estatuto_tributario.htm");

  console.log("Sister norms seeded.");
  console.log("Known slugs:", Object.values(KNOWN_NORM_SLUGS).join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
