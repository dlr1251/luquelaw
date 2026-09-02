/**
 * Seed high-risk translator notes for ET art. 10 (desk, U.S. English).
 *   node scripts/seed-et-art10-notes.mjs --apply
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const NOTES = [
  {
    span_es: "residencia para efectos tributarios",
    rendering_us: "tax residence",
    variant_uk: "fiscal residence / residence for tax purposes",
    risk: "high",
    note_html:
      "<p>This is a DIAN test, not a visa clock. Migración Colombia counts stay for immigration status. Article 10 counts 183 days in any 365-day stretch for tax residence. One does not decide the other.</p>",
  },
  {
    span_es: "ciento ochenta y tres (183) días calendario",
    rendering_us: "one hundred eighty-three (183) calendar days",
    variant_uk: "183 days (common-law tax residence often uses a similar day-count, but the statutory window here is Colombian)",
    risk: "medium",
    note_html:
      "<p>The 2012 text replaced the 1989 six-month rule. Prior wording is under legislación anterior. Do not restore ‘six months’ in the operative English.</p>",
  },
  {
    span_es: "paraíso fiscal",
    rendering_us: "tax haven (jurisdiction listed by the National Government)",
    variant_uk: "non-cooperative jurisdiction / listed territory",
    risk: "high",
    note_html:
      "<p>The statute uses paraíso fiscal. A U.S. reader may hear ‘tax haven’ as a slogan. The operative fact is the Government’s list, not OECD branding.</p>",
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
    console.log("Would seed art. 10 translator notes. Pass --apply.");
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

  const { data: enNorm } = await supabase
    .from("norms")
    .select("id")
    .eq("slug_key", "estatuto-tributario")
    .eq("locale", "en")
    .maybeSingle();
  if (!enNorm) throw new Error("ET EN missing");
  const { data: section } = await supabase
    .from("norm_sections")
    .select("id")
    .eq("norm_id", enNorm.id)
    .eq("section_key", "art-10")
    .maybeSingle();
  if (!section) throw new Error("art-10 EN missing");

  await supabase.from("norm_translation_notes").delete().eq("section_id", section.id);
  const { error } = await supabase.from("norm_translation_notes").insert(
    NOTES.map((note, i) => ({
      section_id: section.id,
      ...note,
      sort_order: i,
      status: "published",
    })),
  );
  if (error) throw error;
  console.log(`Seeded ${NOTES.length} translator notes on EN art. 10`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
