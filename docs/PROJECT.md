# Luque Law — Project master document

Living guide for humans and AI agents. **No fixed dates** — work proceeds by phase as capacity allows. Update checkboxes when items are done.

---

## 1. Product vision

**Luque Law** is legal counsel for international clients in Colombia (Medellín). The digital product has these layers:

| Layer | Purpose | Audience |
|-------|---------|----------|
| **Marketing site** | Trust, contact, practice areas, booking | Everyone |
| **CLKR** | LegalAI hub — norms, guides, agents/skills, quizzes | Public modules + subscriber modules |
| **Subscriber portal** | Overview, tickets, **Lucy** consultations, CLKR links | Authenticated (wallet / entitlements via Stripe) |
| **Properties** *(future)* | Promote rental and sale listings | Everyone |
| **Blog** | Shorter posts (`/posts`) | Public |

**CLKR** is the **LegalAI hub** for learning and practicing Colombian law, with four modules:

| Module | Route | Access |
|--------|-------|--------|
| **Normas** | `/clkr/norms` | Public read; annotations → subscriber |
| **Repositorio (guides)** | `/clkr/guides` | Public (SEO + trust) |
| **Agentes** | `/clkr/agents` | Subscriber (Professional / Student subset) |
| **Quizzes** | `/clkr/quizzes` | Subscriber (Student+) |

**Not in scope:** case/matter management, client file storage, legal deliverables workflow in the portal.

**Disclaimer:** All CLKR and portal content is informational, not legal advice.

---

## 2. Ontology (content & access)

### Content kinds

| Kind | Route / location | Access | Notes |
|------|------------------|--------|-------|
| **CLKR hub** | `/clkr`, `/es/clkr` | Public | Four-module landing |
| **CLKR Guide** | `/clkr/guides/[slug]` | Public when `published` | Long guides, JSON sections + TOC |
| **Norm** | `/clkr/norms/[slug]/...` | Public when `published` | Hierarchical statute browser |
| **Agent / skill / prompt** | `/clkr/agents/...` | Entitlement `agents` | Curated LegalAI toolkit |
| **Quiz** | `/clkr/quizzes/...` | Entitlement `quizzes` | Student evaluation |
| **Norm annotation** | on norm sections | Entitlement `norm_annotations` | Subscriber study notes |
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
| **Student** | Entitlements via Student plan (quizzes, subset agents, annotations) |
| **Client** | Client plan (portal tickets + firm resources) |
| **Professional** | Agents/skills/prompts + advanced norms |
| **Admin** | CMS, subscribers, tickets / Lucy review queue |

Roles are expressed via `profiles` flags (beta) and/or active Stripe `subscriptions`. A user may hold more than one plan.

### Plans → features

| Plan slug | Features |
|-----------|----------|
| `student` | `quizzes`, `norm_annotations`, subset `agents` |
| `professional` | `agents`, `norm_annotations` |
| `client` | `portal_tickets` |

### Lucy *(consultas legales AI-first)*

eve-inspired agent inside the portal (`agent/lucy/` + AI SDK / AI Gateway):

- **Projects** hold chats + files; personality dials (aggressiveness / technicality / flexibility) per chat.
- **Wallet:** prepaid USD credits (Stripe Checkout packs); usage debited per turn.
- **Escalate:** creates consultation ticket + email to firm (free to submit).
- **Pay-to-unlock:** after lawyer marks ready, client pays review fee to see verified answer.
- **Scope v1:** Immigration RAG (keyword over norms + guides).

### Tickets *(not cases)*

Lightweight requests to the firm: subject, category, description, thread with admin. Lucy escalations are `kind = consultation`. **Not** an expediente or matter tracker.

---

## 3. Architecture today

```
Next.js App Router
├── Public: home, /clkr hub, /clkr/guides, /clkr/norms, /clkr/study, /posts, /pricing
├── Gated: /clkr/agents, /clkr/quizzes (auth + entitlement)
├── /login, /portal (Lucy, tickets; /account → /portal)
├── /admin/clkr, /admin/norms, /admin/posts, /admin/agents, /admin/quizzes, /admin/tickets
└── Supabase
    ├── Auth + profiles
    ├── clkr_articles, clkr_study_paths, clkr_study_path_steps, clkr_article_relations, clkr_user_progress
    ├── norms, norm_sections, norm_annotations, posts
    ├── plans, subscriptions
    ├── clkr_agents, clkr_skills, clkr_prompts
    ├── quizzes, quiz_questions, quiz_attempts, quiz_answers
    ├── tickets, ticket_messages
    ├── lucy_projects, lucy_chats, lucy_messages, lucy_files
    ├── lucy_wallets, lucy_wallet_ledger
    └── chat_conversations, chat_messages (legacy shell)
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
- [x] Agents/quizzes placeholder routes

### Phase B — Profiles + portal shell

- [x] `profiles` table + signup trigger
- [x] `/portal` (redirect `/account`)
- [x] Auth gate for agents/quizzes routes
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
- [x] Align `admin_allowlist` rows with `ADMIN_EMAILS` env (verified `daniel@luquelaw.co`)
- [ ] Flip Stripe to **live** keys + webhook secret in Vercel Production

### Phase D — Agents / skills / prompts

- [x] Tables + admin CMS
- [x] Gated public UI

### Phase E — Quizzes

- [x] Tables + attempts
- [x] Admin CRUD + student UI

### Phase F — Annotations, tickets, chatbot

- [x] Norm annotations (subscriber)
- [x] Tickets + admin queue shell
- [x] Chatbot conversations shell (superseded by Lucy)

### Phase H — Lucy consultas legales *(in progress / shipped MVP)*

- [x] Projects / chats / files + wallet + Stripe top-up
- [x] AI SDK + AI Gateway streaming agent (`agent/lucy/`)
- [x] Immigration keyword RAG (norms + guides)
- [x] Escalate → email → admin draft → pay-to-unlock
- [x] Discovery CTA on CLKR hub + portal access/wallet status
- [ ] pgvector embeddings RAG upgrade
- [ ] Expand beyond Immigration
- [ ] Exact review fee + email to client when review is ready

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
| Agents | `src/lib/agents/*`, `src/components/agents/*`, `src/app/.../clkr/agents` |
| Quizzes | `src/lib/quizzes/*`, `src/components/quizzes/*` |
| Entitlements | `src/lib/billing/entitlements.ts` |
| Lucy | `agent/lucy/*`, `src/lib/lucy/*`, `src/app/(dashboard)/portal/lucy/`, `src/app/api/lucy/*` |
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
| CLKR identity | LegalAI hub (4 modules), not guides-only | Product direction 2026-07 |
| Normas placement | Under `/clkr/norms`, not sibling nav | Part of CLKR |
| Guides path | `/clkr/guides/[slug]` | Hub owns `/clkr` |
| Monetization | Stripe plans Student / Professional / Client | Students + clients |
| Guides access | Public | Marketing + SEO |
| Agents / quizzes | Entitlement-gated | Monetization |
| Article body storage | `sections` JSON with HTML | TOC + admin simplicity |
| Properties route | `/properties` | User direction |
| Dates in roadmap | None | Project rhythm TBD |
| Lucy runtime | AI SDK + AI Gateway (eve-inspired `agent/lucy/`), not eve package | Fits existing Next/Supabase portal |
| Lucy review payment | Pay-to-unlock after lawyer draft | Cash after value delivered |
| Lucy wallet | Prepaid Stripe packs; per-turn debit | Transparent usage |
| Lucy RAG v1 | Keyword ILIKE Immigration norms/guides | Ship without pgvector blocker |

---

## 9. Changelog (high level)

| When | What |
|------|------|
| 2026-05 | Marketing site unified EN/ES; CLKR hub redesign; mobile-first pass |
| 2026-05 | Supabase env handling; graceful degradation without keys |
| 2026-05 | Phase 1 CLKR CMS (DB articles, admin editor, dynamic routes) |
| 2026-07 | CLKR LegalAI hub roadmap: norms under CLKR, profiles, Stripe, agents, quizzes, tickets/chat shells |
| 2026-07 | Lucy: projects/wallet/streaming chat, Immigration RAG, escalate + pay-to-unlock |
| 2026-07 | Authz hardening (profiles trigger, admin metadata), auth UX (next/reset), billing webhook reliability, portal access status + Lucy CTA on CLKR hub |

---

*Last updated: 2026-07 — update this file when completing roadmap items or changing product scope.*
