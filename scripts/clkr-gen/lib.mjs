/**
 * Shared helpers for CLKR article generation pipeline.
 */
import { createHash, randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "../..");
export const GEN_DIR = __dirname;
export const OUT_DIR = resolve(GEN_DIR, "out");
export const QUEUE_PATH = resolve(GEN_DIR, "queue.json");
export const CHECKPOINT_PATH = resolve(GEN_DIR, "checkpoint.json");
export const PROMPTS_DIR = resolve(GEN_DIR, "prompts");

export const TOPICS_DATA_SOURCE = "416e6da3-2f65-4059-9f41-bd87358fc38e";
export const CLKR_HUB_PAGE_ID = "d0de02325d874536bdfb6eb7e58452f4";

export const MODULE_TO_CATEGORY = {
  "🛂 Immigration & Visas": "Immigration",
  "🏠 Real Estate Law": "Real Estate",
  "⚖️ Labour Law": "Labor",
  "💰 Tax Law": "Tax",
  "🏢 Business & Corporate Law": "Corporate",
  "👨‍⚖️ Family & Civil Law": "Family",
  "💻 Digital & Consumer Law": "Digital",
  "🏛️ Civil & Contract Law": "Civil",
  "⚙️ Administrative & Procedural Law": "Administrative",
  "🔬 Intellectual Property": "IP",
  "⚠️ Criminal Law": "Criminal",
  "🌐 International & Public Law": "International",
};

export const SECTION_ANCHORS = [
  { id: "definition", en: "I. Legal Definition", es: "I. Definición jurídica" },
  { id: "legal-framework", en: "II. Legal Framework", es: "II. Marco normativo" },
  { id: "jurisprudence", en: "III. Jurisprudence", es: "III. Jurisprudencia" },
  { id: "core-elements", en: "IV. Core Legal Elements", es: "IV. Elementos jurídicos esenciales" },
  { id: "doctrinal-note", en: "V. Doctrinal Note", es: "V. Nota doctrinal" },
  { id: "examples", en: "VI. Examples", es: "VI. Ejemplos" },
  { id: "faq", en: "VII. FAQ", es: "VII. Preguntas frecuentes" },
  { id: "glossary", en: "VIII. Glossary", es: "VIII. Glosario" },
  { id: "translation-notes", en: "IX. Translation & Commentaries", es: "IX. Traducción y comentarios" },
  { id: "fun-facts", en: "X. Fun Facts and Curiosities", es: "X. Datos curiosos" },
  { id: "bibliography", en: "XI. Bibliography", es: "XI. Bibliografía" },
];

export function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
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

export function slugKeyFromInput(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function notionPageIdFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/([a-f0-9]{32}|[a-f0-9-]{36})(?:\?|$)/i);
  if (!m) return null;
  const raw = m[1].replace(/-/g, "");
  if (raw.length !== 32) return null;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function loadQueue() {
  const queue = readJson(QUEUE_PATH);
  if (!queue?.topics?.length) {
    throw new Error(`Missing or empty queue at ${QUEUE_PATH}. Run: node scripts/clkr-gen/cli.mjs export-queue`);
  }
  return queue;
}

export function loadCheckpoint() {
  return readJson(CHECKPOINT_PATH, { completed: {}, failed: {} });
}

export function saveCheckpoint(cp) {
  writeJson(CHECKPOINT_PATH, cp);
}

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function markdownToSections(markdown) {
  const text = String(markdown ?? "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const chunks = [];
  const headingRe = /^##\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?\s*$/;
  let current = null;

  for (const line of text.split("\n")) {
    const match = line.match(headingRe);
    if (match) {
      if (current) {
        chunks.push({
          title: current.title,
          id: current.id,
          body: current.lines.join("\n").trim(),
        });
      }
      current = {
        title: match[1].trim(),
        id: match[2] || undefined,
        lines: [],
      };
      continue;
    }
    if (!current) continue;
    current.lines.push(line);
  }
  if (current) {
    chunks.push({
      title: current.title,
      id: current.id,
      body: current.lines.join("\n").trim(),
    });
  }

  return chunks.map((chunk, i) => {
    const id =
      chunk.id ||
      slugKeyFromInput(chunk.title) ||
      `section-${i + 1}`;
    const html = marked.parse(chunk.body || "", { async: false });
    return { id, title: chunk.title, html: String(html).trim() };
  });
}

export function parseFrontmatter(raw) {
  const text = String(raw ?? "").trim();
  if (!text.startsWith("---")) {
    return { meta: {}, body: text };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: text };
  const fm = text.slice(3, end).trim();
  const body = text.slice(end + 4).trim();
  const meta = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    meta[m[1]] = val;
  }
  return { meta, body };
}

export function artifactPath(slug, locale) {
  return resolve(OUT_DIR, slug, `${locale}.md`);
}

export function readArtifact(slug, locale) {
  const path = artifactPath(slug, locale);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

export function writeArtifact(slug, locale, content) {
  const path = artifactPath(slug, locale);
  ensureDir(dirname(path));
  writeFileSync(path, content.endsWith("\n") ? content : `${content}\n`, "utf8");
  return path;
}

export function translationGroupIdFor(slug) {
  // Deterministic UUID from slug so re-runs keep EN/ES paired.
  const hex = createHash("sha256").update(`clkr:${slug}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function priorityRank(p) {
  if (p?.includes("P1")) return 1;
  if (p?.includes("P2")) return 2;
  if (p?.includes("P3")) return 3;
  return 9;
}

export function moduleWaveRank(mod) {
  const order = [
    "🛂 Immigration & Visas",
    "🏠 Real Estate Law",
    "🏢 Business & Corporate Law",
    "⚖️ Labour Law",
    "💰 Tax Law",
    "👨‍⚖️ Family & Civil Law",
    "🏛️ Civil & Contract Law",
    "💻 Digital & Consumer Law",
    "⚙️ Administrative & Procedural Law",
    "🔬 Intellectual Property",
    "⚠️ Criminal Law",
    "🌐 International & Public Law",
  ];
  const i = order.indexOf(mod);
  return i === -1 ? 99 : i;
}

export function sortTopics(topics) {
  return [...topics].sort((a, b) => {
    const pr = priorityRank(a.prioridad) - priorityRank(b.prioridad);
    if (pr) return pr;
    const mw = moduleWaveRank(a.modulo) - moduleWaveRank(b.modulo);
    if (mw) return mw;
    return String(a.topic).localeCompare(String(b.topic));
  });
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function chatComplete({ system, user, model }) {
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (!apiKey) throw new Error("Need AI_GATEWAY_API_KEY");
  const chosen =
    model ||
    process.env.CLKR_GEN_MODEL?.trim() ||
    process.env.LUCY_MODEL?.trim() ||
    "anthropic/claude-sonnet-4.5";

  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chosen,
      temperature: 0.2,
      max_tokens: 16000,
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
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty completion from AI Gateway");
  return { content: String(content), model: chosen, usage: json.usage ?? null };
}

export async function notionRequest(path, { method = "GET", body } = {}) {
  const token =
    process.env.NOTION_TOKEN?.trim() ||
    process.env.NOTION_API_KEY?.trim() ||
    process.env.NOTION_API_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Need NOTION_TOKEN (internal integration secret) for Notion API calls",
    );
  }
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `Notion API ${method} ${path} failed (${res.status}): ${text.slice(0, 500)}`,
    );
  }
  return json;
}

export function hasNotionToken() {
  return Boolean(
    process.env.NOTION_TOKEN?.trim() ||
      process.env.NOTION_API_KEY?.trim() ||
      process.env.NOTION_API_TOKEN?.trim(),
  );
}

/** Convert markdown body to Notion rich text blocks (paragraphs + headings). */
export function markdownToNotionBlocks(markdown) {
  const blocks = [];
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  let para = [];

  const flushPara = () => {
    const text = para.join(" ").trim();
    para = [];
    if (!text) return;
    for (const chunk of chunkText(text, 1800)) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: chunk } }],
        },
      });
    }
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)(?:\s+\{#[a-z0-9-]+\})?\s*$/);
    const h3 = line.match(/^###\s+(.+)\s*$/);
    if (h2 || h3) {
      flushPara();
      const content = (h2?.[1] || h3?.[1] || "").trim().slice(0, 2000);
      const type = h2 ? "heading_2" : "heading_3";
      blocks.push({
        object: "block",
        type,
        [type]: {
          rich_text: [{ type: "text", text: { content } }],
        },
      });
      continue;
    }
    if (!line.trim()) {
      flushPara();
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  return blocks;
}

function chunkText(text, size) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

export async function appendNotionBlocks(pageId, blocks) {
  // Notion allows max 100 children per request
  for (let i = 0; i < blocks.length; i += 100) {
    const slice = blocks.slice(i, i + 100);
    await notionRequest(`/blocks/${pageId}/children`, {
      method: "PATCH",
      body: { children: slice },
    });
  }
}

export { randomUUID };
