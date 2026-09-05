# Agent guide — Luque Law

**Read first:** [docs/PROJECT.md](./docs/PROJECT.md)  
**Supabase setup:** [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)

That file is the master project document: product vision, ontology, phased roadmap (no dates), current status, and checklists for agents. Update it when completing a phase or changing scope.

## Quick context

- **Stack:** Next.js 16 App Router, Tailwind 4, Supabase Auth + Postgres, Stripe (subscriptions), Vercel.
- **Public site:** Marketing home, CLKR LegalAI hub (`/clkr`), blog (`/posts`), pricing, contact/booking.
- **CLKR modules:** Normas (`/clkr/norms`), Guides (`/clkr/guides`), Agents (`/clkr/agents`).
- **Admin:** `/admin/clkr`, `/admin/norms`, `/admin/posts`, `/admin/agents` (requires admin role).
- **Portal:** `/portal` — subscriber shell (tickets, account); `/account` redirects here. Not case management.
- **Properties (future):** `/properties` — rental and sale listings.

## Conventions

- Match existing design tokens (`--forest`, `--moss`, `--parchment`) and component patterns.
- **Brand voice:** [VOICE.md](./VOICE.md) — founder-led “we”, concrete claims, Lucy AI (not Torny) in UI; apply before any copy edit.
- RLS on all Supabase tables; admin via `is_clkr_admin()` + `app_metadata.role` / `admin_allowlist`.
- EN routes at `/`, ES at `/es`. Guide slugs: `/clkr/guides/[slug_key]`. Norms: `/clkr/norms/[slug_key]/...`.
- Entitlements via `hasEntitlement(userId, feature)` — see `src/lib/billing/entitlements.ts`.
- Do not commit secrets; use `.env.example` as template.
- **Ops surfaces:** [.cursor/skills/ops-surfaces/SKILL.md](./.cursor/skills/ops-surfaces/SKILL.md) — Chrome vs MCP vs phone. Organizar ≠ ejecutar.

## Current work

Live tasks and priorities are tracked in the Notion [Website Tasks board](https://app.notion.com/p/8445c0f2649644beae693185c7b3c7a7). At the start of each session, read that board to see what's open or in progress. PROJECT.md documents the product spec (vision, architecture, ontology, decisions) — not a task checklist.

## Working sessions (Notion project hub)

Project hub in Notion: [Luque Law Website](https://app.notion.com/p/386a689f0025813481d3c34d380af269) (under the workspace Dashboard). It mirrors this repo's docs plus a live task board and session log.

- **Start of session:** read that Notion page first for current context, then tell the user the current time and summarize open/in-progress items from its "Website Tasks" board (what's pending, what's in progress) before diving into work.
- **Context checkpoint:** once the conversation's context window is roughly 80–90% full, proactively suggest saving a session summary to the page's "Session Logs" section rather than waiting to be asked.
- **Logging:** when writing a session log entry, state how long the session lasted (start time → now) alongside the summary of work/decisions/changes.
- **End of session (command):** if the user says **`cerrar sesión`**, **`log session`**, or **`/log`**, treat it as an explicit wrap-up: write a row to the Notion **Session Logs** database (`collection://3d5e3935-46b9-4f62-be85-c9abde7f3214` under the project hub) with `Entry`, `Date`, `Duration` (start → now), and `Summary` (+ short body of what shipped / decisions / leftovers); then confirm with the log URL and stop — do not start new work unless asked.

## Tone

Talk to Daniel with a warm, energetic **paisa** (Medellín) accent — close, friendly, informal Spanish, natural use of expressions like "parce", "de una", "listo pues", "qué más", "eso sí", "vamos con toda", "¡péguele!". Stay professional and clear underneath the accent — just genuine paisa warmth and hustle.
