/**
 * Ingest one DIAN compilation HTML file into legal_authorities.html_es.
 *
 *   node scripts/ingest-dian-authority.mjs --file decreto_1625_2016.htm
 *   node scripts/ingest-dian-authority.mjs --top 8 --stubs --kinds judgment,dian_doctrine
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { DIAN_DOCS } from "./lib/dian.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const CACHE = resolve(root, "scripts/.dian-cache");

function parseArgs(argv) {
  const args = argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  return {
    file: get("--file"),
    top: Number(get("--top") || 0),
    delayMs: Number(get("--delay") || 800),
    stubs: args.includes("--stubs"),
    kinds: (get("--kinds") || "")
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

function panelHtml(html) {
  const start = html.search(/<div class="panel-documento"/i);
  const slice = start >= 0 ? html.slice(start) : html;
  const end = slice.search(/<div class="left-panel-footer"/i);
  const panel = end > 0 ? slice.slice(0, end) : slice.slice(0, 400000);
  return panel
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<a class="caja_vja_encabezado[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<table id="Table\d+"[\s\S]*?<\/table>/gi, "")
    .replace(/javascript:insRow\d+\(\)/g, "#")
    .slice(0, 350000);
}

async function fetchFile(file) {
  mkdirSync(CACHE, { recursive: true });
  const dest = resolve(CACHE, file);
  if (existsSync(dest)) return readFileSync(dest, "utf8");
  const url = `${DIAN_DOCS}${file}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "LuqueLaw-CLKR/1.0 (+https://luquelaw.co)" },
  });
  if (!res.ok) throw new Error(`${file} ${res.status}`);
  const html = await res.text();
  writeFileSync(dest, html, "utf8");
  return html;
}

async function ingestFile(supabase, file) {
  const html = await fetchFile(file);
  const body = panelHtml(html);
  const { data, error } = await supabase
    .from("legal_authorities")
    .update({
      html_es: body,
      ingest_status: body.length > 400 ? "ingested" : "stub",
    })
    .eq("dian_file", file)
    .select("slug_key, ingest_status, target_norm_slug_key");
  if (error) throw error;
  const row = data?.[0];
  if (row?.target_norm_slug_key && body.length > 400) {
    const { data: norms } = await supabase
      .from("norms")
      .select("id, locale")
      .eq("slug_key", row.target_norm_slug_key);
    for (const norm of norms || []) {
      await supabase
        .from("norm_sections")
        .update({ html: body })
        .eq("norm_id", norm.id)
        .eq("section_key", "overview");
    }
  }
  console.log(`  ${file} → ${row?.slug_key || "?"} (${row?.ingest_status || "miss"})`);
}

async function main() {
  const { file, top, delayMs, stubs, kinds } = parseArgs(process.argv);
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !serviceKey) throw new Error("Need SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const files = [];
  if (file) files.push(file);
  if (top > 0) {
    let query = supabase
      .from("legal_authorities")
      .select("dian_file")
      .neq("dian_file", "estatuto_tributario.htm")
      .order("citation_count", { ascending: false })
      .limit(top);
    if (stubs) query = query.eq("ingest_status", "stub");
    if (kinds.length) query = query.in("kind", kinds);
    const { data, error } = await query;
    if (error) throw error;
    for (const row of data || []) {
      if (row.dian_file) files.push(row.dian_file);
    }
  }
  if (!files.length) {
    console.error(
      "Usage: node scripts/ingest-dian-authority.mjs --file <htm> | --top N [--stubs] [--kinds judgment,dian_doctrine]",
    );
    process.exit(1);
  }

  for (let i = 0; i < files.length; i += 1) {
    await ingestFile(supabase, files[i]);
    if (i < files.length - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
