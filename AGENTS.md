# Agent guide — Luque Law

**Read first:** [docs/PROJECT.md](./docs/PROJECT.md)  
**Supabase setup:** [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)

That file is the master project document: product vision, ontology, phased roadmap (no dates), current status, and checklists for agents. Update it when completing a phase or changing scope.

## Quick context

- **Stack:** Next.js 16 App Router, Tailwind 4, Supabase Auth + Postgres, Vercel.
- **Public site:** Marketing home, CLKR legal library (`/clkr`), contact in hero.
- **Admin:** `/admin/clkr` — CMS for CLKR articles (requires Supabase + admin role).
- **Portal (future):** Subscriber study/normative resources, chatbot guide, tickets — not case management.
- **Properties (future):** `/properties` — rental and sale listings.

## Conventions

- Match existing design tokens (`--forest`, `--moss`, `--parchment`) and component patterns.
- RLS on all Supabase tables; admin via `is_clkr_admin()` + `app_metadata.role` / `admin_allowlist`.
- EN routes at `/`, ES at `/es`. CLKR slugs: `/clkr/[slug_key]`, `/es/clkr/[slug_key]`.
- Do not commit secrets; use `.env.example` as template.

## Immediate priority (Phase 1)

CLKR articles stored in Supabase, editable in admin, rendered on dynamic routes. See PROJECT.md § Phase 1 checklist.
