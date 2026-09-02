# Luque Law — Project master document

Living guide for humans and AI agents. **No fixed dates** — work proceeds by phase as capacity allows. Update checkboxes when items are done.

---

## 1. Product vision

**Luque Law** is legal counsel for international clients in Colombia (Medellín). The digital product has these layers:

| Layer | Purpose | Audience |
|-------|---------|----------|
| **Marketing site** | Trust, contact, practice areas, booking | Everyone |
| **CLKR** | LegalAI hub — norms, guides, agents/skills | Public modules + subscriber modules |
| **Portal** | Overview, tickets, **Lucy AI** consultations, CLKR links | Authenticated (wallet / entitlements via Stripe) |
| **Properties** *(future)* | Promote rental and sale listings | Everyone |
| **Blog** | Shorter posts (`/posts`) | Public |

**CLKR** is the **LegalAI hub** for learning and practicing Colombian law:

| Module | Route | Access |
|--------|-------|--------|
| **CLKR (Articles)** | `/clkr/guides` | Public — searchable article explorer |
| **Norms catalog** | `/clkr/norms` | Public read |
| **Skills & prompts** | `/clkr/library` | Public — copy-ready library linked to articles |
| **Agents** | `/clkr/agents` | Professional plan |

**Not in scope:** case/matter management, client file storage, legal deliverables workflow in the portal.

**Disclaimer:** All CLKR and portal content is informational, not legal advice.

---

## 2. Ontology (content & access)

### Content kinds

| Kind | Route / location | Access | Notes |
|------|------------------|--------|-------|
| **CLKR hub** | `/clkr`, `/es/clkr` | Public | Three-module landing |
| **CLKR Guide** | `/clkr/guides/[slug]` | Public when `published` | Long guides, JSON sections + TOC |
| **Norm** | `/clkr/norms/[slug]/...` | Public when `published` | Hierarchical statute browser (ET with DIAN apparatus; DUR 1625 and tax-reform laws in catalog) |
| **Authority record** | `/clkr/authorities/[slug]` | Public | Stub or ingested judgment / DIAN doctrine cited from the ET; official source at the foot. Not listed on the norms hub. |
| **Agent / skill / prompt** | `/clkr/agents/...` | Entitlement `agents` | Curated LegalAI toolkit |
| **Norm annotation** | on norm sections | Entitlement `norm_annotations` | Professional study notes |
| **Doctrinal commentary** | on norm sections | Public when `published` | Firm notes; CMS `/admin/commentaries` |
| **Norm discussion comment** | on norm sections | Public thread; Moderation `/admin/comments` | User discussion + reports |
| **Ticket** | `/portal/tickets` | General: entitlement `portal_tickets`; Lucy consultations: any auth user | Lightweight firm requests + Lucy review unlock |
| **Lucy consultation** | `/portal/lucy` | Authenticated + prepaid wallet | Projects, chats, files, escalate → pay-to-unlock |
| **Blog post** | `/posts/[slug]` | Public when `published` | Shorter articles |
| **Property listing** *(future)* | `/properties/[slug]` | Public | Rent or sale |

Legacy URLs redirect: `/norms` → `/clkr/norms`, `/clkr/[slug]` → `/clkr/guides/[slug]`, `/portal/chat` → `/portal/lucy`.

### User roles

| Role | Access |
|------|--------|
| Visitor | Public site + CLKR guides/norms (read) |
| Registered | Same + `/portal` shell + Lucy (with wallet credits) |
| **Client** | Client plan (portal tickets + firm resources) |
| **Professional** | Agents/skills/prompts + norm annotations |
| **Admin** | CMS, subscribers, tickets / Lucy review queue |

Roles are expressed via `profiles` flags (beta) and/or active Stripe `subscriptions`. A user may hold more than one plan.

### Plans → features

| Plan slug | Features |
|-----------|----------|
| `professional` | `agents`, `norm_annotations` |
| `client` | `portal_tickets` |

### Lucy AI *(consultas legales AI-first)*

Product name in UI: **Lucy AI**. Runtime: Vercel **`eve` package** (`withEve` in `next.config.ts`) + AI Gateway. Authored agent under `agent/` (instructions, tools, channel auth, wallet hook). Portal routes use `/portal/lucy` and `lucy_*` tables.

- **Projects** hold chats + files; personality dials per chat; Eve `sessionId` bound on `lucy_chats`. First login opens a chat (no project form).
- **Wallet:** new accounts receive **USD 10** signup credit; more via prepaid Stripe packs. Usage debited per Eve `step.completed`. Default model `google/gemini-2.5-flash-lite`.
- **Escalate:** consultation ticket + email to firm (free to submit).
- **Pay-to-unlock:** after lawyer marks ready, client pays review fee.
- **Scope v1:** Immigration RAG — pgvector + keyword fallback (norms + guides).
- **Node:** `engines.node` = `24.x` (required by eve).

### Tickets *(not cases)*

Lightweight requests to the firm: subject, category, description, thread with admin. Lucy escalations are `kind = consultation`. **Not** an expediente or matter tracker.

---

## 3. Architecture today

```
Next.js App Router
├── Public: home, /clkr hub, /clkr/guides, /clkr/norms, /community, /posts, /pricing
├── Gated: /clkr/agents (auth + entitlement)
├── /login, /portal (Lucy AI, tickets, settings, saved; /account → /portal)
├── /admin/clkr, /admin/norms, /admin/posts, /admin/visas, /admin/commentaries, /admin/comments, /admin/community, /admin/agents, /admin/prompts, /admin/tickets
└── Supabase
    ├── Auth + profiles (+ reputation)
    ├── clkr_articles, norms, posts, visa_categories, user_saves
    ├── community_questions/answers/comments/votes/reports
    ├── plans, subscriptions, tickets
    ├── lucy_* (Lucy AI wallet/projects/chats; Eve session columns)
    └── lucy_knowledge_chunks (pgvector RAG)
```
**Auth admin:** `ADMIN_EMAILS` env and/or Supabase `app_metadata.role = "admin"` and/or `admin_allowlist` table (RLS uses the latter two).

**Env:** see `.env.example` (includes Stripe keys when billing is configured). Plan price IDs: [docs/STRIPE_PLANS.md](./STRIPE_PLANS.md).

---

## 4. Phased roadmap

### Live tracking

Open work, priorities, and fine-grained tasks are tracked in the Notion [Website Tasks board](https://app.notion.com/p/8445c0f2649644beae693185c7b3c7a7). This document records **shipped**, **retired**, and **future** phase labels for context — not an active checklist.

### Shipped phases

**Phase 1 — CLKR CMS**  
DB-backed guides system: 238 published articles (EN+ES), admin editor, study paths, relationships. Ongoing lawyer spot-check of citations and norm alignment happens in Notion.

**Phase A — CLKR LegalAI hub + Normas under CLKR**  
Four-module hub at `/clkr`: Guides, Normas, Agents, Community. Norms moved under CLKR. Legacy redirects in place.

**Phase B — Profiles + portal shell**  
`profiles` table, `/portal` shell (redirects `/account`), auth gate, login `?next=` return, password reset.

**Phase C — Stripe subscriptions**  
Plans + subscriptions tables, entitlement helper, checkout + webhook, `/pricing`, multi-plan sync. **Not yet done:** flip to live Stripe keys in Production (tracked in Notion).

**Phase D — Agents / skills / prompts**  
Tables, admin CMS, gated public UI at `/clkr/agents`. Entitlement: Professional plan.

**Phase F — Annotations, tickets, chatbot**  
Norm annotations (Professional), tickets + admin queue, norm discussion comments + moderation, firm doctrinal commentaries CMS.

**Phase H — Torny consultas legales (MVP + eve)**  
Projects / chats / files, wallet (prepaid Stripe packs), Eve runtime (`eve` package + `withEve` / `useEveAgent`), Immigration RAG (pgvector + AI Gateway embeddings, keyword fallback), escalate → pay-to-unlock. **Not yet done:** expand beyond Immigration, exact review fee + client email (tracked in Notion).

**Phase I — Account surface**  
About page (registration pitch), portal profile settings (`display_name`, `locale`, bio), bookmarks (`user_saves` + `/portal/saved`).

**Phase J — Community forum (MVP)**  
Public Q&A at `/community`, auth to post/vote/comment, reputation, admin moderation + reports.

### Retired phases

**Phase E — Quizzes**  
Tables remain (historical attempts); product surface removed (routes, CMS, Student plan deactivated) 2026-07.

### Future phases

**Phase G — Properties**  
`property_listings` table + public `/properties` route for rental and sale listings. Spec TBD.

---

## 5. CLKR article schema

Table: `public.clkr_articles` — see migration `20260526120000_clkr_articles.sql`.

Unique: `(slug_key, locale)`. RLS: public SELECT where `status = 'published'`; admin CRUD via `is_clkr_admin()`.

---

## 6. File map (agents)

| Area | Paths |
|------|-------|
| Project doc | `docs/PROJECT.md`, `AGENTS.md` |
| CLKR hub / guides | `src/components/clkr/*`, `src/lib/clkr/*` (includes study paths, navigation) |
| Normas | `src/components/norms/*`, `src/lib/norms/*` |
| Commentaries | `src/lib/commentaries/*`, `src/components/admin/commentary-editor.tsx`, `/admin/commentaries` |
| Agents / prompts | `src/lib/agents/*`, `src/components/agents/*`, `/admin/agents`, `/admin/prompts`, `src/app/.../clkr/agents` |
| Entitlements | `src/lib/billing/entitlements.ts` |
| Lucy AI / Eve | `agent/*`, `src/lib/lucy/*`, `src/app/(dashboard)/portal/lucy/`, `src/app/api/lucy/*`, `eve` + `withEve` |
| Community | `src/lib/community/*`, `src/components/community/*`, `/community`, `/admin/community` |
| Visa categories CMS | `src/lib/visas/*`, `src/components/admin/visa-editor.tsx`, `/admin/visas` (published rows override hardcoded `VISAS_CATALOG`) |
| Saves | `src/lib/saves/*`, `src/components/saves/*`, `/portal/saved` |
| Portal | `src/app/(dashboard)/portal/` |
| Migrations | `supabase/migrations/` |
| Auth admin | `src/lib/auth/is-admin.ts` |

---

## 7. Operational notes

1. **New migration:** add SQL under `supabase/migrations/`; apply via SQL editor, Supabase MCP, or CLI. See [docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
2. **Admin access:** `admin_allowlist` OR `app_metadata.role = "admin"`.
3. **Align allowlists:** `ADMIN_EMAILS` should match RLS admins.
4. **Deploy:** push to `main` → Vercel; set env vars including Stripe when enabling billing.
5. **After schema change:** revalidate `/clkr`, `/es/clkr`, `/admin/*`.

---

## 8. Decisions log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Portal purpose | Education + chatbot + tickets, not case mgmt | User direction |
| Profile entitlement flags | Admin/service-role only; users cannot self-grant | Authz audit 2026-07 |
| `is_subscriber` | Display only (has any active sub); not an entitlement | Align with PLAN_FEATURES |
| Auth admin check | `app_metadata.role` + `ADMIN_EMAILS` only (never `user_metadata`) | Prevent privilege escalation |
| CLKR identity | LegalAI hub (3 modules), not guides-only | Product direction 2026-07; quizzes retired |
| Normas placement | Under `/clkr/norms`, not sibling nav | Part of CLKR |
| Guides path | `/clkr/guides/[slug]` | Hub owns `/clkr` |
| Monetization | Stripe plans Professional / Client | Dropped Student + quizzes 2026-07 |
| Guides access | Public | Marketing + SEO |
| Agents | Entitlement-gated (Professional) | Monetization |
| Quizzes / Student plan | Retired from product | Scope cut 2026-07 |
| Article body storage | `sections` JSON with HTML | TOC + admin simplicity |
| Properties route | `/properties` | User direction |
| Dates in roadmap | None | Project rhythm TBD |
| Lucy AI runtime | **`eve` package** + AI Gateway + `withEve` / `useEveAgent`; default `google/gemini-2.5-flash-lite` | User direction 2026-08-14 (was Torny + Sonnet) |
| Lucy AI review payment | Pay-to-unlock after lawyer draft | Cash after value delivered |
| Lucy AI wallet | USD 10 signup credit + prepaid Stripe packs; debit on Eve `step.completed` | First-screen access; firm recovers usage above the gift |
| Lucy AI RAG v1 | Keyword ILIKE Immigration norms/guides | Ship without pgvector blocker |
| Lucy AI RAG v2 | pgvector + `openai/text-embedding-3-small` via AI Gateway; keyword fallback | Better recall; reindex via `npm run index:lucy-rag` |
| Community forum | Public read; auth to post/vote; `/community` | Peer help + admin moderation |

---

## 9. Changelog (high level)

| When | What |
|------|------|
| 2026-05 | Marketing site unified EN/ES; CLKR hub redesign; mobile-first pass |
| 2026-05 | Supabase env handling; graceful degradation without keys |
| 2026-05 | Phase 1 CLKR CMS (DB articles, admin editor, dynamic routes) |
| 2026-07 | CLKR LegalAI hub roadmap: norms under CLKR, profiles, Stripe, agents, quizzes, tickets/chat shells |
| 2026-07 | Lucy: projects/wallet/streaming chat, Immigration RAG, escalate + pay-to-unlock |
| 2026-07 | Lucy RAG v2: pgvector chunks + AI Gateway embeddings; index script + semantic tools |
| 2026-07 | Immigration norms: Resoluciones 2061 y 2357 de 2020 (Migración Colombia) + reindex Lucy |
| 2026-07 | Authz hardening (profiles trigger, admin metadata), auth UX (next/reset), billing webhook reliability, portal access status + Lucy CTA on CLKR hub |
| 2026-07 | Retired Quizzes module + Student plan from product surface |
| 2026-07-23 | Torny on real `eve` package (`withEve`/`useEveAgent`); About account pitch; profile/saves; community forum |
| 2026-08-14 | Product name **Lucy AI**; USD 10 signup credit; default model `google/gemini-2.5-flash-lite`; login lands in chat |
| 2026-09 | Estatuto Tributario from DIAN compilation with apparatus graph; unofficial U.S. desk translation (art. 10 first); `/clkr/authorities` stubs; DUR 1625 + tax-reform sisters in catalog |

---

*Last updated: 2026-09 — update this file when completing roadmap items or changing product scope.*
