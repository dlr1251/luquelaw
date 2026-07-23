# Luque Law — Project master document

Living guide for humans and AI agents. **No fixed dates** — work proceeds by phase as capacity allows. Update checkboxes when items are done.

---

## 1. Product vision

**Luque Law** is legal counsel for international clients in Colombia (Medellín). The digital product has these layers:

| Layer | Purpose | Audience |
|-------|---------|----------|
| **Marketing site** | Trust, contact, practice areas, booking | Everyone |
| **CLKR** | LegalAI hub — norms, guides, agents/skills | Public modules + subscriber modules |
| **Subscriber portal** | Overview, tickets, **Lucy** consultations, CLKR links | Authenticated (wallet / entitlements via Stripe) |
| **Properties** *(future)* | Promote rental and sale listings | Everyone |
| **Blog** | Shorter posts (`/posts`) | Public |

**CLKR** is the **LegalAI hub** for learning and practicing Colombian law, with three modules:

| Module | Route | Access |
|--------|-------|--------|
| **Normas** | `/clkr/norms` | Public read; annotations → Professional |
| **Repositorio (guides)** | `/clkr/guides` | Public (SEO + trust) |
| **Agentes** | `/clkr/agents` | Subscriber (Professional) |

**Not in scope:** case/matter management, client file storage, legal deliverables workflow in the portal.

**Disclaimer:** All CLKR and portal content is informational, not legal advice.

---

## 2. Ontology (content & access)

### Content kinds

| Kind | Route / location | Access | Notes |
|------|------------------|--------|-------|
| **CLKR hub** | `/clkr`, `/es/clkr` | Public | Three-module landing |
| **CLKR Guide** | `/clkr/guides/[slug]` | Public when `published` | Long guides, JSON sections + TOC |
| **Norm** | `/clkr/norms/[slug]/...` | Public when `published` | Hierarchical statute browser |
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

### Torny *(consultas legales AI-first)*

Product name in UI: **Torny**. Runtime: Vercel **`eve` package** (`withEve` in `next.config.ts`) + AI Gateway. Authored agent under `agent/` (instructions, tools, channel auth, wallet hook). Portal routes may still use `/portal/lucy` and `lucy_*` tables.

- **Projects** hold chats + files; personality dials per chat; Eve `sessionId` bound on `lucy_chats`.
- **Wallet:** prepaid USD credits (Stripe packs); usage debited per Eve `step.completed` (user pays tokens; firm recovers via wallet).
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
├── /login, /portal (Torny, tickets, settings, saved; /account → /portal)
├── /admin/clkr, /admin/norms, /admin/posts, /admin/commentaries, /admin/comments, /admin/community, /admin/agents, /admin/tickets
└── Supabase
    ├── Auth + profiles (+ reputation)
    ├── clkr_articles, norms, posts, user_saves
    ├── community_questions/answers/comments/votes/reports
    ├── plans, subscriptions, tickets
    ├── lucy_* (Torny wallet/projects/chats; Eve session columns)
    └── lucy_knowledge_chunks (pgvector RAG)
```

**Auth admin:** `ADMIN_EMAILS` env and/or Supabase `app_metadata.role = "admin"` and/or `admin_allowlist` table (RLS uses the latter two).

**Env:** see `.env.example` (includes Stripe keys when billing is configured). Plan price IDs: [docs/STRIPE_PLANS.md](./STRIPE_PLANS.md).

---

## 4. Phased roadmap

### Phase 1 — CLKR CMS *(done)*

- [x] `clkr_articles` table + RLS
- [x] Seed starter articles
- [x] Dynamic guide routes
- [x] Admin CRUD
- [x] Hub reads from DB
- [x] Study paths and enhanced navigation
- [x] Article relationships (prerequisites, next steps)
- [ ] Admin fills/edits full article bodies in production
- [ ] Deprecate `clkr_article_settings` (optional)

### Phase A — CLKR LegalAI hub + Normas under CLKR

- [x] `/clkr` four-module hub
- [x] Guides at `/clkr/guides`, norms at `/clkr/norms`
- [x] Redirects from `/norms` and legacy `/clkr/[slug]`
- [x] Nav: single CLKR link
- [x] Agents/quizzes placeholder routes → agents shipped; quizzes retired 2026-07

### Phase B — Profiles + portal shell

- [x] `profiles` table + signup trigger
- [x] `/portal` (redirect `/account`)
- [x] Auth gate for agents routes
- [x] Login `?next=` return URL, password reset, auth-code-error page
- [x] Header/footer Pricing + footer Portal respects session

### Phase C — Stripe subscriptions

- [x] `plans` + `subscriptions` tables
- [x] Entitlement helper
- [x] Checkout + webhook + `/pricing`
- [x] Gate premium modules
- [x] Profile entitlement columns protected (trigger); `isAppAdmin` uses app_metadata only
- [x] Checkout `subscription_data.metadata`; webhook fails loud without service role; multi-plan flag sync
- [x] Seed `plans.stripe_price_id` helper (`STRIPE_PRICE_*` env) + docs for live cutover
- [x] Align `admin_allowlist` rows with `ADMIN_EMAILS` env (team: Daniel, Alina, Mateo, Camilo)
- [ ] Flip Stripe to **live** keys + webhook secret in Vercel Production

### Phase D — Agents / skills / prompts

- [x] Tables + admin CMS
- [x] Gated public UI

### Phase E — Quizzes *(retired 2026-07)*

- [x] Tables + attempts (historical; not exposed in app)
- [x] Product surface removed (routes, CMS, Student plan deactivated)

### Phase F — Annotations, tickets, chatbot

- [x] Norm annotations (subscriber)
- [x] Tickets + admin queue shell
- [x] Chatbot conversations shell (superseded by Lucy)
- [x] Norm discussion comments + admin Moderation
- [x] Firm doctrinal commentaries CMS (`norm_doctrinal_commentaries` + `/admin/commentaries`)

### Phase H — Torny consultas legales *(shipped MVP + eve)*

- [x] Projects / chats / files + wallet + Stripe top-up
- [x] Eve package (`eve` + `withEve` + `useEveAgent`) under `agent/`
- [x] Immigration RAG (norms + guides)
- [x] Escalate → email → admin draft → pay-to-unlock
- [x] Discovery CTA on CLKR hub + portal access/wallet status
- [x] pgvector embeddings RAG (`lucy_knowledge_chunks` + `npm run index:lucy-rag`; keyword fallback)
- [ ] Expand beyond Immigration
- [ ] Exact review fee + email to client when review is ready

### Phase I — Account surface *(shipped)*

- [x] About page: free email registration pitch (no spam; Torny prepaid; forum)
- [x] Portal profile settings (`display_name`, `locale`, short bio)
- [x] `user_saves` bookmarks for guides/norms + `/portal/saved`

### Phase J — Community forum *(shipped MVP)*

- [x] `/community` + `/es/comunidad` Q&A (ask, answer, comment, vote, accept)
- [x] Reputation via SECURITY DEFINER RPCs
- [x] `/admin/community` moderation + reports
- [x] Disclaimer: peer help, not legal advice

### Phase G — Properties *(future)*

- [ ] `property_listings` + public `/properties`

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
| Agents | `src/lib/agents/*`, `src/components/agents/*`, `src/app/.../clkr/agents` |
| Entitlements | `src/lib/billing/entitlements.ts` |
| Torny / Eve | `agent/*`, `src/lib/lucy/*`, `src/app/(dashboard)/portal/lucy/`, `src/app/api/lucy/*`, `eve` + `withEve` |
| Community | `src/lib/community/*`, `src/components/community/*`, `/community`, `/admin/community` |
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
| Torny runtime | **`eve` package** + AI Gateway + `withEve` / `useEveAgent`; wallet recovers token cost | User direction 2026-07-23; supersedes AI-SDK-only decision |
| Torny review payment | Pay-to-unlock after lawyer draft | Cash after value delivered |
| Torny wallet | Prepaid Stripe packs; debit on Eve `step.completed` | Transparent usage; firm does not gift tokens |
| Torny RAG v1 | Keyword ILIKE Immigration norms/guides | Ship without pgvector blocker |
| Torny RAG v2 | pgvector + `openai/text-embedding-3-small` via AI Gateway; keyword fallback | Better recall; reindex via `npm run index:lucy-rag` |
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
| 2026-07 | Admin team (4) + doctrinal commentaries CMS; norms visual editor; Moderation polish |

---

*Last updated: 2026-07 — update this file when completing roadmap items or changing product scope.*
