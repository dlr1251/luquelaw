# Luque Law — Project master document

Living guide for humans and AI agents. **No fixed dates** — work proceeds by phase as capacity allows. Update checkboxes when items are done.

---

## 1. Product vision

**Luque Law** is legal counsel for international clients in Colombia (Medellín). The digital product has three layers:

| Layer | Purpose | Audience |
|-------|---------|----------|
| **Marketing site** | Trust, contact, practice areas, booking | Everyone |
| **CLKR** | Colombian Legal Knowledge Repository — didactic legal guides | Public (SEO + education) |
| **Subscriber portal** *(future)* | Study modules, normative resources, chatbot guide, tickets to the firm | Paying subscribers |
| **Properties** *(future)* | Promote rental and sale listings | Everyone |

**Not in scope:** case/matter management, client file storage, legal deliverables workflow in the portal.

**Disclaimer:** All CLKR and portal content is informational, not legal advice.

---

## 2. Ontology (content & access)

### Content kinds

| Kind | Route / location | Access | Notes |
|------|------------------|--------|-------|
| **CLKR Article** | `/clkr/[slug]`, `/es/clkr/[slug]` | Public when `published` | Long guides, JSON sections + TOC |
| **Study module** *(future)* | `/portal/study/...` | Subscriber | Didactic units |
| **Normative resource** *(future)* | `/portal/normative/...` | Subscriber | Regulations, resolutions, commented |
| **Resource asset** *(future)* | Portal / downloads | Subscriber or public | PDFs, checklists |
| **Property listing** *(future)* | `/properties`, `/properties/[slug]` | Public | Rent or sale |

### User roles *(future phases)*

| Role | Access |
|------|--------|
| Visitor | Public site + CLKR |
| Registered | Same (optional later) |
| **Subscriber** | Portal: study, normative, chatbot, tickets |
| **Admin** | CMS, tickets queue, subscribers (later) |

### Tickets *(future — not cases)*

Lightweight requests to the firm: subject, category, description, thread with admin. Escalation from chatbot. **Not** an expediente or matter tracker.

### Chatbot guide *(future)*

Orientation on immigration, real estate, etc., grounded in CLKR + subscriber content. Always disclaims non-advice. Can suggest opening a ticket.

---

## 3. Architecture today

```
Next.js App Router
├── Public pages (home, CLKR hub + articles)
├── /login, /account (placeholder portal)
├── /admin/clkr (CMS)
└── Supabase
    ├── Auth (email/password)
    ├── clkr_articles (full article CMS)     ← Phase 1
    └── clkr_article_settings (legacy)       ← deprecated after Phase 1
```

**Auth admin:** `ADMIN_EMAILS` env and/or Supabase `app_metadata.role = "admin"` and/or `admin_allowlist` table (RLS uses the latter two).

**Env:** see `.env.example`.

---

## 4. Phased roadmap

### Phase 1 — CLKR CMS (current focus)

Goal: Articles in Supabase; admin can create, edit, publish; public dynamic routes.

- [x] `clkr_articles` table + RLS
- [x] Seed starter articles (investor-visa, real-estate-transactions × EN/ES)
- [x] Dynamic `/clkr/[slug]` and `/es/clkr/[slug]`
- [x] Admin: list, create, edit (title, meta, sections, status, sort)
- [x] Hub reads from DB (`getHubArticles`)
- [ ] Run migration on production Supabase
- [ ] Admin fills/edits full article bodies in production
- [x] Remove legacy static article pages (done in repo)
- [ ] Deprecate `clkr_article_settings` (optional cleanup migration)

### Phase 2 — Portal shell (no payments)

Goal: `/portal` for authenticated users; placeholder for study/normative; manual `is_subscriber` flag for beta.

- [ ] `profiles` table
- [ ] Rename or redirect `/account` → `/portal`
- [ ] Portal layout + dashboard
- [ ] Placeholder pages: Study, Normative, Chat, Tickets
- [ ] Middleware: portal routes require auth

### Phase 3 — Chatbot guide

- [ ] `chat_conversations`, `chat_messages`
- [ ] RAG over published CLKR (+ later subscriber content)
- [ ] Disclaimers + “escalate to ticket” CTA
- [ ] EN/ES by user locale

### Phase 4 — Tickets

- [ ] `tickets`, `ticket_messages`
- [ ] Client: create + view thread
- [ ] Admin: queue, reply, close
- [ ] Email notify admin on new ticket

### Phase 5 — Subscriptions (Stripe)

- [ ] Plans + Checkout
- [ ] Webhooks → `subscriptions` table
- [ ] Gate portal content on active subscription
- [ ] `/pricing` page

### Phase 6 — Study & normative content

- [ ] Extend CMS or `content_items` with `kind` + `access_tier`
- [ ] Study modules UI
- [ ] Normative library UI + filters (year, type, topic)

### Phase 7 — Properties

Goal: Promote rental and sale properties at **`/properties`**.

- [ ] `property_listings` table (title, slug, type: rent|sale, price, location, description, photos, status)
- [ ] Supabase Storage for images
- [ ] Public grid + detail `/properties/[slug]`
- [ ] Admin CRUD `/admin/properties`
- [ ] Optional: featured on home, EN/ES fields
- [ ] SEO metadata per listing

---

## 5. CLKR article schema (Phase 1)

Table: `public.clkr_articles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `slug_key` | text | URL segment, e.g. `investor-visa` |
| `locale` | text | `en` \| `es` |
| `title`, `description` | text | Hub + article hero |
| `category` | text | Immigration, Real Estate, … |
| `reading_time` | text | e.g. `12 min` |
| `sections` | jsonb | `[{ id, title, html }]` |
| `status` | text | `draft` \| `published` \| `archived` |
| `sort_order` | int | Hub order |
| `published_at` | timestamptz | nullable |
| `translation_group_id` | uuid | optional link EN↔ES |

Unique: `(slug_key, locale)`.

**RLS:** public SELECT where `status = 'published'`; admin CRUD via `is_clkr_admin()`.

---

## 6. File map (agents)

| Area | Paths |
|------|-------|
| Project doc | `docs/PROJECT.md`, `AGENTS.md` |
| CLKR types | `src/lib/clkr/types.ts`, `articles.ts` (fallback) |
| CLKR data access | `src/lib/clkr/get-hub-articles.ts`, `get-article.ts` |
| CLKR UI | `src/components/clkr/*` |
| CLKR public routes | `src/app/clkr/`, `src/app/es/clkr/` |
| Admin CMS | `src/app/admin/clkr/` |
| Migrations | `supabase/migrations/` |
| Auth admin | `src/lib/auth/is-admin.ts` |

---

## 7. Operational notes

1. **New migration:** add SQL under `supabase/migrations/`; apply in Supabase SQL editor or CLI.
2. **Admin access:** insert email into `admin_allowlist` OR set `app_metadata.role = "admin"` on user in Supabase Dashboard.
3. **Align allowlists:** `ADMIN_EMAILS` (app UI gate) should match who can pass RLS (`admin_allowlist` or `app_metadata`).
4. **Deploy:** push to `main` → Vercel auto-deploy; set env vars on Vercel.
5. **After schema change:** revalidate paths `/clkr`, `/es/clkr`, `/admin/clkr`.

---

## 8. Decisions log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Portal purpose | Education + chatbot + tickets, not case mgmt | User direction |
| CLKR access | Public | Marketing + trust |
| Subscriber content | Gated later via Stripe | Deferred |
| Article body storage | `sections` JSON with HTML | TOC + admin editor simplicity |
| Properties route | `/properties` | User direction |
| Dates in roadmap | None | Project rhythm TBD |

---

## 9. Changelog (high level)

| When | What |
|------|------|
| 2026-05 | Marketing site unified EN/ES; CLKR hub redesign; mobile-first pass |
| 2026-05 | Supabase env handling; graceful degradation without keys |
| 2026-05 | **This document** + Phase 1 CLKR CMS (DB articles, admin editor, dynamic routes) |

---

*Last updated: 2026-05 — update this file when completing roadmap items or changing product scope.*
