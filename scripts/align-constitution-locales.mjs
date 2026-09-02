/**
 * Overlay Constitute English article HTML onto constitucion-colombia EN sections
 * matched by section_key (art-N). Does not rewrite Spanish.
 *
 *   node scripts/align-constitution-locales.mjs --apply
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const IN = resolve(root, "scripts/.suin-constitucion-colombia-en-constitute.json");
const SOURCE = "https://constituteproject.org/constitution/Colombia_2015?lang=en";

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
  if (!existsSync(IN)) {
    console.error("Missing Constitute extract. Run extract-constitute-constitution.mjs first.");
    process.exit(1);
  }
  const extract = JSON.parse(readFileSync(IN, "utf8"));
  if (!process.argv.includes("--apply")) {
    console.log(`Would align ${extract.articles.length} EN articles. Pass --apply.`);
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

  const { data: norm, error } = await supabase
    .from("norms")
    .select("id")
    .eq("slug_key", "constitucion-colombia")
    .eq("locale", "en")
    .maybeSingle();
  if (error) throw error;
  if (!norm) throw new Error("constitucion-colombia EN missing");

  await supabase
    .from("norms")
    .update({
      official_source_url: SOURCE,
      description:
        "Political Constitution of Colombia (1991). English from Constitute Project / Max Planck Institute, revision cutoff 2015. Not a Colombian gazette. Later amendments stay in Spanish unless we add a desk note.",
    })
    .eq("id", norm.id);

  const { data: sections } = await supabase
    .from("norm_sections")
    .select("id, section_key")
    .eq("norm_id", norm.id);
  const idByKey = new Map((sections || []).map((s) => [s.section_key, s.id]));

  let updated = 0;
  for (const article of extract.articles) {
    const id = idByKey.get(article.section_key);
    if (!id || !article.html) continue;
    const { error: upErr } = await supabase
      .from("norm_sections")
      .update({ html: article.html, number_label: article.number_label })
      .eq("id", id);
    if (upErr) throw upErr;
    updated += 1;
  }
  console.log(`Updated ${updated} EN constitution articles (Constitute 2015).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
