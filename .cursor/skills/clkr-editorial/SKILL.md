---
name: clkr-editorial
description: >-
  Internal CLKR editorial desk: curator, critic, and generator for guide
  pairs (EN+ES) at section grain. Never auto-publish. Use when the user asks
  to review a CLKR article, curar/ criticar/ reescribir una guía, par EN/ES,
  mesa editorial, /clkr-editorial, or to run the phase-1 editorial skill on
  Immigration/visa guides.
---

# CLKR editorial (phase 1)

Ops skill for Daniel. **Not Lucy.** Not the public agents at `/clkr/agents`. Not eve.

This desk **reviews, criticizes, and proposes**. Daniel (or whoever signs) publishes in `/admin/clkr`.

Read [VOICE.md](../../../VOICE.md) before any rewrite. Product name **Lucy AI**. Firm = **we / nosotros**. No exclamation marks. No invented leyes, fechas, URLs, client counts, or case results.

Full checklists: [rubric.md](rubric.md). Sample output: [examples.md](examples.md). Official URLs: [../blog-writer/sources.md](../blog-writer/sources.md).

## Hard rules

- **Never** `UPDATE` / insert `clkr_articles`. Never set `status = published`. Phase 1 delivers findings in chat (and optional markdown Daniel can paste).
- Work unit is **`slug_key` + `section.id` + the EN/ES pair**. Do not “improve the whole article” in one blob.
- Return **markdown** for a section (`## Title {#id}` + body). Never propose raw HTML.
- **Legal parity**, not fluency. A pretty ES that says something the EN does not is a defect.
- Primary law beats press. Press beats X. Do not cite from a snippet alone — fetch the page.
- Informational, not legal advice. Do not rewrite locked privacy, Law 1581 consent, prices, or the 45-min → Concepto Jurídico engagement model.
- Do not mix this with unrelated code diffs.

## Default order

Immigration first (traffic + risk), then Tax, then the rest. If Daniel does not name a slug, propose **one** visa guide (prefer `investor-visa` or `migrant-visa-type-m-investor`) and stop — unless he said “de una” / “péguele” / named the slug.

A guide is “done” only when **every** section in the pair has passed curator + critic, and generator fixes are accepted or discarded **by Daniel**. Phase 1 never marks CMS status.

## Token budget

1. Load **one** `slug_key` per pass.
2. Curator sees **outline only** (section `id` + `title` + hub fields). Do not dump every HTML body.
3. Critic + generator: **one section pair** at a time (EN body + ES body for that `id`).
4. After the outline + the first flagged section, **stop and ask** to continue unless he asked for the full article.

## Open a pair

Use Supabase MCP `execute_sql` (`plugin-supabase-supabase` or `user-supabase`).

Outline (curator):

```sql
select
  id, slug_key, locale, title, description, category, reading_time, status, sort_order, updated_at,
  (
    select jsonb_agg(jsonb_build_object('id', elem->>'id', 'title', elem->>'title') order by ord)
    from jsonb_array_elements(sections) with ordinality as t(elem, ord)
  ) as outline
from clkr_articles
where slug_key = :slug_key
order by locale;
```

One section pair (critic / generator) — filter in the agent after fetch, or pull `sections` and keep only matching `id`s:

```sql
select id, locale, title, sections
from clkr_articles
where slug_key = :slug_key
order by locale;
```

Align EN/ES sections by **`id` first**, then by title. If an `id` exists in only one locale, that is a curator finding (`missing_locale_section`).

Admin URLs: `/admin/clkr/{id}/edit`. Public: `/clkr/guides/{slug_key}` and `/es/clkr/guides/{slug_key}`.

Convert stored HTML to markdown the same way as `htmlToMarkdown` in `src/lib/clkr/markdown.ts` (paragraphs, lists, `###`, links, strip tags). Proposed fixes must round-trip through `## Title {#anchor}` — that is what `markdownToSections` expects.

## Three passes (do not merge roles)

Same dossier each time: outline or section pair + linked norms + VOICE.md.

| Pass | Job | Touches body? |
|------|-----|----------------|
| **1 Curator** | Structure. Missing sections for the category? EN/ES outlines diverge? Broken links to `/clkr/norms/…` or other guides? Hub `description` / category / reading_time off? | No rewrites. Findings only. |
| **2 Critic** | Substance. Does the cited norm say that? Did the law move? Sounds like advice? Claim without source? ES ≠ EN legally? | No rewrites. Findings only. |
| **3 Generator** | Only where critic (or curator, for structure) marked. Propose the section markdown **in both locales**. | Proposal only. Still no DB write. |

Run curator on the whole outline first. Then critic → generator on **one** flagged section. Do not generate unsolicited “tone improvements”.

## Output (every pass)

Structured rows, not an essay. Use this block:

```
slug_key:
section.id:
pass: curator | critic | generator
severity: blocker | major | minor

finding:
evidence: (norm / URL / quote from EN or ES / “missing in ES”)
proposed_fix: (generator only — full section markdown EN then ES; else “—”)
```

Severity:

- **blocker** — wrong law, contradictory EN/ES, sounds like advice on a specific case, invented citation
- **major** — stale norm, missing sibling section, broken canonical link, claim with no source
- **minor** — voice, outline order, reading_time, description length

After generator markdown, add a **source list** (title, URL, date, official | press | X-signal). Flag anything unverified.

## Linked norms

Extract `/clkr/norms/…` and obvious ley/decreto citations from the section. Fetch the live norm page or SUIN / Función Pública / Diario Oficial. If the fetch fails, say so — do not “confirm” from memory.

## Anti-patterns

- Autopublish or silent CMS updates
- EN→ES literal translation billed as bilingual
- One bilingual Frankenstein section
- “Se ve bien” / “mejora de tono” with no finding row
- Reviewing 238 articles in one turn
- Mixing Lucy consultation tone or public-agent copy into the guide
