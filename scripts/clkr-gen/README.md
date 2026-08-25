# CLKR article generation

Pipeline: Notion Topics → AI Gateway (Master Prompt EN/ES) → Notion staging pages → `clkr_articles` drafts → review → publish → `npm run index:lucy-rag`.

## Setup

1. `.env.local`: `AI_GATEWAY_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
2. Optional: `NOTION_TOKEN` (internal integration with access to CLKR Topics + hub). Without it, `export-queue` uses `topics-seed.json` and `push-notion` writes `*.pending.json` under `out/`.
3. Optional: `CLKR_GEN_MODEL` (default `LUCY_MODEL` or `anthropic/claude-sonnet-4.5`)

## Commands

```bash
npm run clkr:export-queue
npm run clkr:run-one -- --topic migrant-visa-type-m-investor
npm run clkr:run-batch -- --priority P1 --limit 11
npm run clkr:run-batch -- --module Immigration
npm run clkr:publish-batch -- --slug tax-residency-in-colombia
npm run clkr:status
npm run index:lucy-rag
```

Artifacts live in `scripts/clkr-gen/out/<slug>/{en,es}.md`. Checkpoint: `scripts/clkr-gen/checkpoint.json`.
