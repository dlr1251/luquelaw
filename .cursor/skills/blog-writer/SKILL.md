---
name: blog-writer
description: >-
  Internal Luque Law editorial skill: scout migration and Colombian-law news
  (official sources, press, X as signal only), interview Daniel, then draft
  blog posts in brand voice for /posts CMS. Never auto-publish. Use when the
  user asks for a blog article, artículo de blog, post draft, scout noticias,
  research on X about migración, derecho colombiano vigente, or runs
  /blog-writer.
---

# Blog writer (internal)

Ops skill for Daniel. Not Lucy. Do not mix client-consultation tone or Lucy tools into this flow.

Read [VOICE.md](../../../VOICE.md) before any draft. Blog bylines may use **I**; body still sounds like Daniel talking to someone he trusts. Firm CTAs stay **we / nosotros**. Product name **Lucy AI**. No exclamation marks. No invented citations, client counts, or case results.

## Modes

Infer from the user. If unclear, start with **Scout**.

| Mode | Do |
|------|----|
| **Scout** | Research only. Return 3–5 angles. Stop. Do not draft. |
| **Interview** | Ask the consultation questions. Stop until Daniel answers (unless he said skip). |
| **Draft** | Write after scout + interview (or skip granted). Deliver CMS-ready markdown. |
| **Revise** | Edit an existing draft against voice + source check. |

Never insert a row in Supabase or set `status = published`. Deliver copy for `/admin/posts/new?locale=…`. Only write to the CMS if Daniel explicitly asks.

## Hard legal rules

- Informational, not legal advice. Keep the hub disclaimer idea; do not rewrite locked privacy/consent/pricing/engagement terms.
- Primary law beats press. Press beats X. X is **conversation signal**, never authority.
- Do not invent leyes, decretos, resoluciones, fechas, or URLs. If a source is thin, say so and keep the claim narrow or drop it.
- Colombian terms in the original, then a short gloss in the post locale.
- Prices on the site stay locked (45 min / USD 55; Concepto Jurídico in 3 business days). Do not quote other fees unless Daniel supplied them.

## Phase 1 — Scout

Use WebSearch + WebFetch. Prefer URLs in [sources.md](sources.md). Also search the repo (`clkr_articles` copy, guides, norms mentions) so the post can point at live `/clkr` pages when they exist.

For each candidate story capture:

- What changed (or what people think changed)
- Date + publisher / handle
- Official source (or “none found”)
- Why a reader in Medellín / coming to Colombia would care
- Category: `Immigration` | `Real Estate` | `Business`

**X:** search `site:x.com` (or twitter) for Migración Colombia, Cancillería, Corte Constitucional, and the topic. Quote handles and dates. Treat viral threads as rumor until an official page or Diario Oficial confirms.

Return a short scout (not an essay):

1. **Headline of the week** — one sentence.
2. **Three angles** — title + why + source quality (official / press / X-only).
3. **Recommend one** — and the 2–4 interview questions that would make the piece true.

Stop unless Daniel picks an angle or says draft now.

## Phase 2 — Interview

Ask only what the draft needs. Default set (cut what already answered):

1. Angle and reader (visa shopper, resident, buyer, company).
2. What he is seeing in practice vs the paper rule.
3. One concrete image or anecdote he will own (no fake clients).
4. Locale: `en`, `es`, or both (write separately; do not literal-translate).
5. Anything that must stay off the record.

If he says “escribí” / “skip interview”, proceed with caveats listed at the top of the draft.

## Phase 3 — Draft

Length: shorter than a CLKR guide. Aim **4–8 min** (`reading_time` like `6 min`). One idea per post.

Voice litmus (from VOICE.md): sermon → cut; trying to sound smart → cut; would he say this across the table → keep; can you point at a norm/date/mechanism → keep.

Structure the **body** only with `##` section titles (CMS TOC). Optional `{#slug}` anchors. `###` inside a section is fine. No `#` title in the body (title is a form field).

Deliver in chat as:

```
locale: en | es
slug_key: lowercase-hyphens
title:
description: 1–2 sentences, meta + hub card
category: Immigration | Real Estate | Business
reading_time: N min
status: draft

## Section one {#section-one}

…

## What this is not {#not-advice}

Informational. Colombian rules move. Your facts still need a lawyer.
```

Last section is always the not-advice close, then a firm CTA (contact / booking) without hype.

After the markdown, a **source list** (title, URL, date, role: official | press | X). Flag anything unverified.

If both locales: write ES from the Spanish essayist voice; write EN as clean natural English (VOICE.md English note — do not calque).

## Anti-patterns

- Drafting Lucy-style “marco normativo / análisis jurídico / caveats” as the post skeleton
- “According to sources” with no URL
- LinkedIn-speak, superlatives, emojis, exclamation marks
- Auto-publishing or mixing this with unrelated code diffs
- Treating an X thread as the legal change
- One bilingual Frankenstein file instead of two posts
