#!/usr/bin/env node
/**
 * CLKR article generation CLI
 *
 * Usage:
 *   node scripts/clkr-gen/cli.mjs export-queue
 *   node scripts/clkr-gen/cli.mjs gen-one --topic <id|slug> --locale en|es [--force]
 *   node scripts/clkr-gen/cli.mjs push-notion --topic <id|slug> [--locale en|es] [--force]
 *   node scripts/clkr-gen/cli.mjs upsert-supabase --topic <id|slug> [--locale en|es] [--force]
 *   node scripts/clkr-gen/cli.mjs run-one --topic <id|slug> [--force]   # gen both + notion + supabase
 *   node scripts/clkr-gen/cli.mjs run-batch [--priority P1] [--module Immigration] [--limit N] [--force]
 *   node scripts/clkr-gen/cli.mjs publish-batch [--slug <slug>] [--limit N]
 *   node scripts/clkr-gen/cli.mjs status
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve } from "path";
import {
  CHECKPOINT_PATH,
  CLKR_HUB_PAGE_ID,
  GEN_DIR,
  MODULE_TO_CATEGORY,
  OUT_DIR,
  PROMPTS_DIR,
  QUEUE_PATH,
  TOPICS_DATA_SOURCE,
  appendNotionBlocks,
  artifactPath,
  chatComplete,
  hasNotionToken,
  loadCheckpoint,
  loadEnvLocal,
  loadQueue,
  markdownToNotionBlocks,
  markdownToSections,
  notionRequest,
  parseFrontmatter,
  priorityRank,
  readArtifact,
  saveCheckpoint,
  getSupabase,
  slugKeyFromInput,
  sleep,
  sortTopics,
  translationGroupIdFor,
  writeArtifact,
  writeJson,
  readJson,
} from "./lib.mjs";


loadEnvLocal();

function parseArgs(argv) {
  const out = {
    cmd: argv[0] || "help",
    topic: null,
    locale: null,
    force: false,
    priority: null,
    module: null,
    limit: null,
    slug: null,
    delayMs: 1500,
  };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") out.force = true;
    else if (a === "--topic") out.topic = argv[++i];
    else if (a.startsWith("--topic=")) out.topic = a.slice(8);
    else if (a === "--locale") out.locale = argv[++i];
    else if (a.startsWith("--locale=")) out.locale = a.slice(9);
    else if (a === "--priority") out.priority = argv[++i];
    else if (a.startsWith("--priority=")) out.priority = a.slice(11);
    else if (a === "--module") out.module = argv[++i];
    else if (a.startsWith("--module=")) out.module = a.slice(9);
    else if (a === "--limit") out.limit = Number(argv[++i]);
    else if (a.startsWith("--limit=")) out.limit = Number(a.slice(8));
    else if (a === "--slug") out.slug = argv[++i];
    else if (a.startsWith("--slug=")) out.slug = a.slice(7);
    else if (a === "--delay-ms") out.delayMs = Number(argv[++i]);
  }
  if (out.locale && out.locale !== "en" && out.locale !== "es") {
    throw new Error(`Invalid locale: ${out.locale}`);
  }
  return out;
}

function enrichTopic(raw) {
  const category = MODULE_TO_CATEGORY[raw.modulo] || "Civil";
  const slug =
    raw.slug_key?.trim() ||
    slugKeyFromInput(raw.topic) ||
    slugKeyFromInput(raw.espanol) ||
    raw.id.slice(0, 8);
  return {
    ...raw,
    slug_key: slug,
    category,
  };
}

function findTopic(queue, needle) {
  const n = String(needle).trim().toLowerCase();
  const topics = queue.topics.map(enrichTopic);
  return (
    topics.find((t) => t.id === needle || t.id.replace(/-/g, "") === n.replace(/-/g, "")) ||
    topics.find((t) => t.slug_key === n) ||
    topics.find((t) => t.topic.toLowerCase() === n) ||
    null
  );
}

function loadPrompt(locale) {
  const path = resolve(PROMPTS_DIR, `${locale}.md`);
  if (!existsSync(path)) throw new Error(`Missing prompt ${path}`);
  return readFileSync(path, "utf8");
}

function buildUserPrompt(topic, locale) {
  const lines = [
    `Topic (EN): ${topic.topic}`,
    `Topic (ES): ${topic.espanol || "(n/a)"}`,
    `Module: ${topic.modulo}`,
    `CMS category: ${topic.category}`,
    `slug_key: ${topic.slug_key}`,
    `Locale to write: ${locale}`,
  ];
  if (topic.notas) lines.push(`Editor notes: ${topic.notas}`);
  lines.push(
    "",
    "Generate the complete CLKR article now, following the system prompt exactly.",
    "Prefer marking uncertain citations as unverified rather than inventing identifiers.",
  );
  return lines.join("\n");
}

async function cmdExportQueue(args) {
  const seedPath = resolve(GEN_DIR, "topics-seed.json");
  let topics = [];

  if (hasNotionToken()) {
    console.log("Fetching topics from Notion API…");
    topics = await fetchAllTopicsFromNotion();
  } else if (existsSync(seedPath)) {
    console.log(`No NOTION_TOKEN — using seed ${seedPath}`);
    const seed = readJson(seedPath);
    topics = seed.topics || [];
  } else {
    throw new Error("Need NOTION_TOKEN or topics-seed.json");
  }

  const enriched = sortTopics(topics.map(enrichTopic));
  const slugCounts = new Map();
  for (const t of enriched) {
    slugCounts.set(t.slug_key, (slugCounts.get(t.slug_key) || 0) + 1);
  }
  const collisions = [...slugCounts.entries()].filter(([, n]) => n > 1);
  if (collisions.length) {
    for (const t of enriched) {
      if (slugCounts.get(t.slug_key) > 1) {
        t.slug_key = `${t.slug_key}-${t.id.slice(0, 8)}`;
      }
    }
    console.warn(`Resolved ${collisions.length} slug collisions`);
  }

  const queue = {
    exported_at: new Date().toISOString(),
    count: enriched.length,
    topics: enriched,
  };
  writeJson(QUEUE_PATH, queue);

  // Best-effort: write slug_key back to Notion Topics rows
  if (hasNotionToken()) {
    let updated = 0;
    for (const t of enriched) {
      try {
        await notionRequest(`/pages/${t.id}`, {
          method: "PATCH",
          body: {
            properties: {
              slug_key: {
                rich_text: [{ type: "text", text: { content: t.slug_key } }],
              },
              ...(t.gen_status
                ? {}
                : {
                    "Gen status": { select: { name: "pending" } },
                  }),
            },
          },
        });
        updated++;
        await sleep(200);
      } catch (err) {
        console.warn(`slug_key update failed for ${t.topic}: ${err.message}`);
      }
    }
    console.log(`Updated Notion slug_key on ${updated}/${enriched.length} topics`);
  }

  console.log(`Wrote ${enriched.length} topics → ${QUEUE_PATH}`);
}

async function fetchAllTopicsFromNotion() {
  const topics = [];
  let cursor = undefined;
  do {
    const body = {
      page_size: 100,
      start_cursor: cursor,
    };
    const res = await notionRequest(`/databases/${TOPICS_DATA_SOURCE}/query`, {
      method: "POST",
      body,
    });
    // Note: data source id may need /data_sources/ in newer API; fall back to database id
    for (const page of res.results || []) {
      topics.push(notionPageToTopic(page));
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return topics;
}

function notionPageToTopic(page) {
  const props = page.properties || {};
  const text = (prop) => {
    const arr = prop?.rich_text || prop?.title || [];
    return arr.map((t) => t.plain_text || "").join("").trim();
  };
  const select = (prop) => prop?.select?.name || prop?.status?.name || null;
  const url = (prop) => prop?.url || "";
  return {
    id: page.id,
    url: page.url,
    topic: text(props.Topic) || text(props.title),
    espanol: text(props.Español) || text(props["Español"]),
    modulo: select(props.Módulo) || select(props["Módulo"]),
    prioridad: select(props.Prioridad),
    status: select(props.Status),
    articulo: url(props.Artículo) || url(props["Artículo"]),
    articulo_es: url(props["Artículo ES"]),
    slug_key: text(props.slug_key),
    gen_status: select(props["Gen status"]),
    notas: text(props.Notas),
  };
}

async function cmdGenOne(args) {
  const queue = loadQueue();
  const topic = findTopic(queue, args.topic);
  if (!topic) throw new Error(`Topic not found: ${args.topic}`);
  const locale = args.locale || "en";
  const existing = readArtifact(topic.slug_key, locale);
  if (existing && !args.force) {
    console.log(`Skip gen (exists): ${topic.slug_key}/${locale}.md (use --force)`);
    return { topic, locale, path: artifactPath(topic.slug_key, locale), skipped: true };
  }

  if (hasNotionToken()) {
    try {
      await notionRequest(`/pages/${topic.id}`, {
        method: "PATCH",
        body: { properties: { "Gen status": { select: { name: "en_gen" } } } },
      });
    } catch {
      /* ignore */
    }
  }

  console.log(`Generating ${topic.slug_key} [${locale}] — ${topic.topic}`);
  const system = loadPrompt(locale);
  const { content, model, usage } = await chatComplete({
    system,
    user: buildUserPrompt(topic, locale),
  });

  let cleaned = content.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:markdown|md|yaml)?\n?/i, "").replace(/\n?```$/, "");
  }
  const path = writeArtifact(topic.slug_key, locale, cleaned);
  const { meta, body } = parseFrontmatter(cleaned);
  const sections = markdownToSections(body);
  console.log(
    `Wrote ${path} (model=${model}, sections=${sections.length}, tokens=${usage?.total_tokens ?? "?"})`,
  );
  if (sections.length < 8) {
    console.warn("Warning: fewer than 8 H2 sections — check prompt compliance");
  }
  if (!meta.title) console.warn("Warning: missing frontmatter title");

  return { topic, locale, path, meta, sections, skipped: false };
}

async function cmdPushNotion(args) {
  if (!hasNotionToken()) {
    console.warn("No NOTION_TOKEN — writing notion-pending manifest only");
  }
  const queue = loadQueue();
  const topic = findTopic(queue, args.topic);
  if (!topic) throw new Error(`Topic not found: ${args.topic}`);
  const locales = args.locale ? [args.locale] : ["en", "es"];
  const results = [];

  for (const locale of locales) {
    const raw = readArtifact(topic.slug_key, locale);
    if (!raw) {
      console.warn(`Missing artifact for ${topic.slug_key}/${locale} — skip push`);
      continue;
    }
    const { meta, body } = parseFrontmatter(raw);
    const title =
      meta.title ||
      (locale === "es" ? topic.espanol || topic.topic : topic.topic);
    const pageTitle = `${title} (${locale.toUpperCase()})`;

    if (!hasNotionToken()) {
      const pendingPath = resolve(OUT_DIR, topic.slug_key, `notion-${locale}.pending.json`);
      writeJson(pendingPath, {
        parent: CLKR_HUB_PAGE_ID,
        title: pageTitle,
        locale,
        slug_key: topic.slug_key,
        topic_id: topic.id,
        markdown: body,
      });
      console.log(`Pending Notion push → ${pendingPath}`);
      results.push({ locale, pending: pendingPath });
      continue;
    }

    // Create fresh page under CLKR hub (regen replaces prior Artículo link)
    const created = await notionRequest("/pages", {
      method: "POST",
      body: {
        parent: { page_id: CLKR_HUB_PAGE_ID.replace(/-/g, "") },
        properties: {
          title: {
            title: [{ type: "text", text: { content: pageTitle.slice(0, 2000) } }],
          },
        },
      },
    });
    const pageId = created.id;
    const pageUrl = created.url;
    const blocks = markdownToNotionBlocks(body);
    // Intro callout as first paragraph
    await appendNotionBlocks(pageId, [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: `CLKR draft · ${topic.slug_key} · ${locale} · generated ${new Date().toISOString().slice(0, 10)} · pending legal review`,
              },
            },
          ],
        },
      },
      ...blocks,
    ]);

    const propName = locale === "es" ? "Artículo ES" : "Artículo";
    await notionRequest(`/pages/${topic.id}`, {
      method: "PATCH",
      body: {
        properties: {
          [propName]: { url: pageUrl },
          slug_key: {
            rich_text: [{ type: "text", text: { content: topic.slug_key } }],
          },
          "Gen status": { select: { name: "staged" } },
        },
      },
    });

    console.log(`Notion ${locale}: ${pageUrl}`);
    results.push({ locale, pageId, pageUrl });
    await sleep(args.delayMs);
  }
  return results;
}

async function cmdUpsertSupabase(args) {
  const queue = loadQueue();
  const topic = findTopic(queue, args.topic);
  if (!topic) throw new Error(`Topic not found: ${args.topic}`);
  const locales = args.locale ? [args.locale] : ["en", "es"];
  const supabase = getSupabase();
  const groupId = translationGroupIdFor(topic.slug_key);
  const results = [];

  for (const locale of locales) {
    const raw = readArtifact(topic.slug_key, locale);
    if (!raw) {
      console.warn(`Missing artifact ${topic.slug_key}/${locale} — skip upsert`);
      continue;
    }
    const { meta, body } = parseFrontmatter(raw);
    const sections = markdownToSections(body);
    if (!sections.length) throw new Error(`No sections parsed for ${topic.slug_key}/${locale}`);

    const title =
      meta.title ||
      (locale === "es" ? topic.espanol || topic.topic : topic.topic);
    const description =
      meta.description ||
      (locale === "es"
        ? `Guía CLKR sobre ${topic.espanol || topic.topic}.`
        : `CLKR guide on ${topic.topic}.`);
    const reading_time = meta.reading_time || "20 min";
    const category = meta.category || topic.category;

    const row = {
      slug_key: topic.slug_key,
      locale,
      title,
      description,
      category,
      reading_time,
      sections,
      status: "draft",
      sort_order: priorityRank(topic.prioridad) * 100,
      translation_group_id: groupId,
      published_at: null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing, error: findErr } = await supabase
      .from("clkr_articles")
      .select("id, status")
      .eq("slug_key", topic.slug_key)
      .eq("locale", locale)
      .maybeSingle();
    if (findErr) throw findErr;

    if (existing?.status === "published" && !args.force) {
      console.warn(
        `Skip upsert published ${topic.slug_key}/${locale} (use --force to overwrite as draft)`,
      );
      results.push({ locale, skipped: true, id: existing.id });
      continue;
    }

    let data;
    if (existing?.id) {
      const { data: updated, error } = await supabase
        .from("clkr_articles")
        .update(row)
        .eq("id", existing.id)
        .select("id, slug_key, locale, status")
        .single();
      if (error) throw error;
      data = updated;
      console.log(`Updated draft ${data.slug_key}/${data.locale} (${data.id})`);
    } else {
      const { data: inserted, error } = await supabase
        .from("clkr_articles")
        .insert(row)
        .select("id, slug_key, locale, status")
        .single();
      if (error) throw error;
      data = inserted;
      console.log(`Inserted draft ${data.slug_key}/${data.locale} (${data.id})`);
    }
    results.push({ locale, id: data.id, skipped: false });
  }

  if (hasNotionToken() && results.some((r) => !r.skipped)) {
    try {
      await notionRequest(`/pages/${topic.id}`, {
        method: "PATCH",
        body: { properties: { "Gen status": { select: { name: "staged" } } } },
      });
    } catch {
      /* ignore */
    }
  }

  return results;
}

async function cmdRunOne(args) {
  const queue = loadQueue();
  const topic = findTopic(queue, args.topic);
  if (!topic) throw new Error(`Topic not found: ${args.topic}`);

  for (const locale of ["en", "es"]) {
    await cmdGenOne({ ...args, topic: topic.id, locale });
    await sleep(args.delayMs);
  }
  await cmdPushNotion({ ...args, topic: topic.id, locale: null });
  await cmdUpsertSupabase({ ...args, topic: topic.id, locale: null });

  const cp = loadCheckpoint();
  cp.completed[topic.id] = {
    slug_key: topic.slug_key,
    at: new Date().toISOString(),
  };
  delete cp.failed[topic.id];
  saveCheckpoint(cp);
  console.log(`Done run-one: ${topic.slug_key}`);
}

function filterTopics(topics, args) {
  let list = sortTopics(topics.map(enrichTopic));
  if (args.priority) {
    const p = args.priority.toUpperCase().replace(/^P/, "");
    list = list.filter((t) => (t.prioridad || "").includes(`P${p}`) || (t.prioridad || "").includes(args.priority));
  }
  if (args.module) {
    const m = args.module.toLowerCase();
    list = list.filter(
      (t) =>
        (t.modulo || "").toLowerCase().includes(m) ||
        (t.category || "").toLowerCase() === m,
    );
  }
  if (args.limit && Number.isFinite(args.limit)) {
    list = list.slice(0, args.limit);
  }
  return list;
}

async function cmdRunBatch(args) {
  const queue = loadQueue();
  const cp = loadCheckpoint();
  const list = filterTopics(queue.topics, args);
  console.log(`Batch size: ${list.length}`);

  for (const topic of list) {
    const key = `${topic.id}`;
    if (cp.completed[key] && !args.force) {
      console.log(`Skip completed: ${topic.slug_key}`);
      continue;
    }
    if (topic.gen_status === "reviewed" && !args.force) {
      console.log(`Skip reviewed: ${topic.slug_key}`);
      continue;
    }
    try {
      await cmdRunOne({ ...args, topic: topic.id });
    } catch (err) {
      console.error(`FAILED ${topic.slug_key}: ${err.message}`);
      cp.failed[key] = {
        slug_key: topic.slug_key,
        error: String(err.message || err),
        at: new Date().toISOString(),
      };
      saveCheckpoint(cp);
    }
    await sleep(args.delayMs);
  }
  console.log(`Batch finished. Checkpoint: ${CHECKPOINT_PATH}`);
}

async function cmdPublishBatch(args) {
  const supabase = getSupabase();
  let query = supabase
    .from("clkr_articles")
    .select("id, slug_key, locale, status, title")
    .eq("status", "draft");
  if (args.slug) query = query.eq("slug_key", args.slug);
  const { data, error } = await query.order("slug_key");
  if (error) throw error;
  let rows = data || [];
  if (args.limit) rows = rows.slice(0, args.limit * 2);

  const now = new Date().toISOString();
  let n = 0;
  for (const row of rows) {
    const { error: upErr } = await supabase
      .from("clkr_articles")
      .update({ status: "published", published_at: now, updated_at: now })
      .eq("id", row.id);
    if (upErr) throw upErr;
    n++;
    console.log(`Published ${row.slug_key}/${row.locale}`);
  }
  console.log(`Published ${n} rows. Run: npm run index:lucy-rag`);
}

function cmdStatus() {
  const queue = existsSync(QUEUE_PATH) ? loadQueue() : { topics: [], count: 0 };
  const cp = loadCheckpoint();
  const completed = Object.keys(cp.completed || {}).length;
  const failed = Object.keys(cp.failed || {}).length;
  let artifacts = 0;
  if (existsSync(OUT_DIR)) {
    for (const slug of readdirSync(OUT_DIR)) {
      const dir = resolve(OUT_DIR, slug);
      if (!statSync(dir).isDirectory()) continue;
      for (const f of readdirSync(dir)) {
        if (f.endsWith(".md")) artifacts++;
      }
    }
  }
  console.log(
    JSON.stringify(
      {
        queue: queue.count || queue.topics?.length || 0,
        checkpoint_completed: completed,
        checkpoint_failed: failed,
        artifacts_md: artifacts,
        has_notion_token: hasNotionToken(),
      },
      null,
      2,
    ),
  );
}

function help() {
  console.log(`CLKR gen CLI — see header in scripts/clkr-gen/cli.mjs`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  switch (args.cmd) {
    case "export-queue":
      await cmdExportQueue(args);
      break;
    case "gen-one":
      if (!args.topic) throw new Error("--topic required");
      await cmdGenOne(args);
      break;
    case "push-notion":
      if (!args.topic) throw new Error("--topic required");
      await cmdPushNotion(args);
      break;
    case "upsert-supabase":
      if (!args.topic) throw new Error("--topic required");
      await cmdUpsertSupabase(args);
      break;
    case "run-one":
      if (!args.topic) throw new Error("--topic required");
      await cmdRunOne(args);
      break;
    case "run-batch":
      await cmdRunBatch(args);
      break;
    case "publish-batch":
      await cmdPublishBatch(args);
      break;
    case "status":
      cmdStatus();
      break;
    default:
      help();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
