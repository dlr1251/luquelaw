/**
 * Unofficial U.S. English desk translation for Estatuto Tributario articles.
 *
 *   node scripts/et-translate/run.mjs --limit 5
 *   node scripts/et-translate/run.mjs --keys art-10,art-12-1 --apply
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const OUT_DIR = resolve(root, "scripts/et-translate/out");
const STYLE = readFileSync(resolve(__dirname, "style.md"), "utf8");
const GLOSSARY = readFileSync(resolve(__dirname, "glossary.json"), "utf8");

function parseArgs(argv) {
  const args = argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  return {
    apply: args.includes("--apply"),
    limit: Number(get("--limit") || 8),
    keys: (get("--keys") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
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

function supabaseAdmin() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !serviceKey) throw new Error("Need SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function chatComplete({ system, user }) {
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (!apiKey) throw new Error("Need AI_GATEWAY_API_KEY");
  const model =
    process.env.ET_TRANSLATE_MODEL?.trim() ||
    process.env.CLKR_GEN_MODEL?.trim() ||
    "anthropic/claude-sonnet-4.5";
  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 8000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI Gateway failed (${res.status}): ${body.slice(0, 600)}`);
  }
  const json = await res.json();
  return String(json.choices?.[0]?.message?.content || "");
}

function parseJson(content) {
  const fenced = content.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : content;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  return JSON.parse(raw.slice(start, end + 1));
}

async function main() {
  const { apply, limit, keys } = parseArgs(process.argv);
  mkdirSync(OUT_DIR, { recursive: true });
  const supabase = supabaseAdmin();

  const { data: esNorm } = await supabase
    .from("norms")
    .select("id")
    .eq("slug_key", "estatuto-tributario")
    .eq("locale", "es")
    .maybeSingle();
  const { data: enNorm } = await supabase
    .from("norms")
    .select("id")
    .eq("slug_key", "estatuto-tributario")
    .eq("locale", "en")
    .maybeSingle();
  if (!esNorm || !enNorm) throw new Error("ET norms missing");

  let query = supabase
    .from("norm_sections")
    .select("id, section_key, title, number_label, html")
    .eq("norm_id", esNorm.id)
    .like("section_key", "art-%")
    .not("html", "is", null)
    .order("sort_order", { ascending: true });
  if (keys.length) query = query.in("section_key", keys);
  const { data: articles, error } = await query.limit(limit);
  if (error) throw error;

  const { data: enSections } = await supabase
    .from("norm_sections")
    .select("id, section_key")
    .eq("norm_id", enNorm.id)
    .limit(5000);
  const enIdByKey = new Map((enSections || []).map((s) => [s.section_key, s.id]));

  const results = [];
  for (const article of articles || []) {
    console.log(`Translating ${article.section_key}…`);
    const content = await chatComplete({
      system: `${STYLE}\n\nLocked glossary (JSON):\n${GLOSSARY}`,
      user: `Translate this article.\n\nTitle: ${article.title}\nLabel: ${article.number_label}\n\nHTML:\n${article.html}`,
    });
    const parsed = parseJson(content);
    const out = {
      section_key: article.section_key,
      html: String(parsed.html || ""),
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
    writeFileSync(resolve(OUT_DIR, `${article.section_key}.json`), JSON.stringify(out, null, 2));
    results.push(out);

    if (apply) {
      const enId = enIdByKey.get(article.section_key);
      if (!enId) continue;
      const { error: upErr } = await supabase
        .from("norm_sections")
        .update({ html: out.html })
        .eq("id", enId);
      if (upErr) throw upErr;
      await supabase.from("norm_translation_notes").delete().eq("section_id", enId);
      if (out.notes.length) {
        const { error: nErr } = await supabase.from("norm_translation_notes").insert(
          out.notes.map((note, i) => ({
            section_id: enId,
            span_es: String(note.span_es || "").slice(0, 240),
            rendering_us: String(note.rendering_us || "").slice(0, 240),
            variant_uk: note.variant_uk ? String(note.variant_uk).slice(0, 240) : null,
            risk: ["low", "medium", "high"].includes(note.risk) ? note.risk : "medium",
            note_html: String(note.note_html || ""),
            sort_order: i,
            status: "published",
          })),
        );
        if (nErr) throw nErr;
      }
    }
  }
  console.log(`Wrote ${results.length} article translations to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
