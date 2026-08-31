#!/usr/bin/env node
/**
 * Seed CLKR prompts and skills from prompts-seed.json into Supabase.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings → API → service_role).
 *
 * Usage:
 *   npm run seed:prompts
 *   node scripts/seed-prompts.mjs
 *   node scripts/seed-prompts.mjs --dry-run
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");
const seedPath = join(__dirname, "prompts-gen", "prompts-seed.json");
const dryRun = process.argv.includes("--dry-run");

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
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

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadSeed() {
  if (!existsSync(seedPath)) {
    console.error(`Missing seed file: ${seedPath}`);
    console.error("Run: node scripts/prompts-gen/build-prompts-seed.mjs");
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(seedPath, "utf8"));
  if (!Array.isArray(raw) || raw.length < 52) {
    console.error(`Expected at least 52 entries in ${seedPath}, got ${Array.isArray(raw) ? raw.length : 0}`);
    process.exit(1);
  }
  return raw;
}

function expandPromptRows(entry, translationGroupId) {
  const slugKey = slugify(entry.slug_key);
  const rows = [];
  for (const locale of ["en", "es"]) {
    const loc = entry[locale];
    if (!loc?.title || !loc?.prompt_text) {
      throw new Error(`Entry ${slugKey} missing ${locale} title or prompt_text`);
    }
    rows.push({
      slug_key: slugKey,
      locale,
      title: loc.title.trim(),
      description: (loc.description ?? "").trim(),
      prompt_text: loc.prompt_text.trim(),
      category: entry.category,
      article_slug_key: entry.article_slug_key ?? null,
      use_case: entry.use_case ?? null,
      translation_group_id: translationGroupId,
      access_tier: "professional",
      status: "published",
      sort_order: Number(entry.sort_order) || 0,
    });
  }
  return rows;
}

function expandSkillRows(entry, translationGroupId) {
  const slugKey = slugify(entry.slug_key);
  const rows = [];
  for (const locale of ["en", "es"]) {
    const loc = entry[locale];
    if (!loc?.title || !loc?.prompt_text) {
      throw new Error(`Skill ${slugKey} missing ${locale} content`);
    }
    rows.push({
      slug_key: slugKey,
      locale,
      title: loc.title.trim(),
      description: (loc.description ?? "").trim(),
      body: loc.prompt_text.trim(),
      category: entry.category,
      article_slug_key: entry.article_slug_key ?? null,
      translation_group_id: translationGroupId,
      access_tier: "professional",
      status: "published",
      sort_order: Number(entry.sort_order) || 0,
    });
  }
  return rows;
}

async function upsertBatch(supabase, table, rows) {
  const { error } = await supabase.from(table).upsert(rows, {
    onConflict: "slug_key,locale",
  });
  if (error) throw new Error(`${table} upsert failed: ${error.message}`);
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const entries = loadSeed();
  const promptRows = [];
  const skillRows = [];

  for (const entry of entries) {
    const translationGroupId = randomUUID();
    promptRows.push(...expandPromptRows(entry, translationGroupId));
    if (entry.as_skill) {
      skillRows.push(...expandSkillRows(entry, translationGroupId));
    }
  }

  const skillEntries = entries.filter((e) => e.as_skill).length;

  console.log(`Seed file: ${entries.length} logical entries`);
  console.log(`Prompt rows: ${promptRows.length} (${entries.length} × en/es)`);
  console.log(`Skill rows: ${skillRows.length} (${skillEntries} skills × en/es)`);

  if (dryRun) {
    console.log("Dry run — no database writes.");
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const chunkSize = 50;
  for (let i = 0; i < promptRows.length; i += chunkSize) {
    await upsertBatch(supabase, "clkr_prompts", promptRows.slice(i, i + chunkSize));
  }
  for (let i = 0; i < skillRows.length; i += chunkSize) {
    await upsertBatch(supabase, "clkr_skills", skillRows.slice(i, i + chunkSize));
  }

  console.log("Done. Upserted clkr_prompts and clkr_skills.");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
