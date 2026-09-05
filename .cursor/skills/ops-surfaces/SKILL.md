---
name: ops-surfaces
description: >-
  Routes Luque Law ops to Chrome (browser-harness), MCP connectors, or
  phone-harness. Use when the user mentions browser-harness, WhatsApp
  Business, Meta Business Suite, Facebook, Instagram, Canva, or asks
  what apps the harness can run. Distinguishes organización vs ejecución.
---

# Ops surfaces — Chrome vs MCP vs phone

Read this **before** opening WhatsApp, Meta, or Canva. Detail stays in
the named skill. This file is the router.

Human mirror: [Skill: Ops surfaces](https://app.notion.com/p/3d2a689f0025816f93d5f25fb935defd)
in Documentation. Repo wins if they drift.

## Session mode (ask if unclear)

| Mode | What to do | What not to do |
| --- | --- | --- |
| **Organización** | Map surfaces, update this file / domain skills, leave work as Notion rows | Barrido WA, send, schedule, publish, quote, call, “cerrar” Pendientes |
| **Ejecución** | Run the named skill on **that** surface only | Invent a second job (Reel, ola 2, inbox) from a “dale” |

Triggers for **ejecución**: `barrido` / `revisar WhatsApp` / `programá` /
`publicá` naming the surface. A bare **dale** after a menu is not enough
if the thread is about harness capability or organización.

Pendientes created mid-pass **stay in Notion**. Do not execute them
unless this session is explicitly ejecución for that row.

## Chrome attach

- Local profile only. `browser-harness --doctor` if attach fails.
- `list_tabs()` → `switch_tab` — never assume the current tab.
- First navigation is `new_tab(url)`, not `goto_url`.
- Do **not** use a cloud / Browser Use browser for WhatsApp or Meta
  (needs his session). Cloud auth can stay failed; that is fine.
- MBS: skip `wait_for_load()` (hangs). Screenshot helper is
  `capture_screenshot`.

## Where to work

Default: **Chrome local + `browser-harness`** for any web app without an
MCP.

| Job | Surface | Skill / connector |
| --- | --- | --- |
| WA Business inbox, labels, 👍 | Chrome `web.whatsapp.com` | [whatsapp-ops](../whatsapp-ops/SKILL.md) |
| BWALL / Meta Business Agent paste | Chrome WA / MBA UI | [bwall-mba-config](../bwall-mba-config/SKILL.md) — not a sweep |
| Planner, Page, captions, follows | Chrome MBS / facebook.com / instagram.com | [social-ops](../social-ops/SKILL.md) |
| Carousels 1080×1350 | Repo `tmp/instagram/generate.mjs` → MBS | social-ops + `CAPTIONS.md` |
| Canva one-off (Sunday, flyer, story) | Chrome `canva.com` if logged in | This file — not the ola pipeline |
| IG bio, Highlights, Stories, Reels camera | iPhone Instagram | [iphone-ops](../iphone-ops/SKILL.md) |
| Gmail firm `daniel@luquelaw.co` (`mail/u/0`) | **MCP** (Chrome tab is backup) | Gmail |
| Gmail personal `daniel.luqx@gmail.com` (`mail/u/2`) | **MCP** if connected; else Chrome | Gmail — do not triage ~1400 on the phone |
| Drive (FNC, case folders) | **MCP** (Chrome tab is backup) | Google Drive. Clients root in [whatsapp-ops/reference.md](../whatsapp-ops/reference.md) |
| Google Calendar + booking | **MCP** | Google Calendar. Booking is Google appointments, never Calendly (URL in whatsapp-ops reference) |
| Notion dates / Pendientes | **MCP** | Notion. `calendar.notion.so` tab is a view — skip harness if MCP can query |
| Notion, Pendientes, Updates, Reviews | **MCP** | Notion |
| Stripe / Vercel / Supabase | **MCP** | those servers |
| DIAN / Migración / SUIN / Diario Oficial | Chrome | [blog-writer/sources.md](../blog-writer/sources.md) |
| X / blog scout | Chrome | [blog-writer](../blog-writer/SKILL.md) |
| CLKR guide review | Repo + `/admin/clkr` | [clkr-editorial](../clkr-editorial/SKILL.md) — never auto-publish |
| Bancolombia, Nequi, Rappi, personal WA | Neither | Do not open |
| Notion AI chat tabs (e.g. a case chat) | Neither | Do not operate his Notion chats |

**MBS trap:** `business.facebook.com` often opens **Sunday Properties**.
Luque Law planner (confirm combobox):

`https://business.facebook.com/latest/content_calendar?business_id=638320349992761&asset_id=1282983321572904`

## Chrome snapshot (5 Sep 2026 ~09:29 COT)

Tabs that were actually open — treat as the frequent-app set, do not
close or “clean up”:

| Tab | Route |
| --- | --- |
| Drive “Requerimiento 1” | MCP first; case folder, do not wander |
| Notion Calendar | MCP Pendientes / Google Calendar instead |
| Pendientes | MCP |
| MBS planner (Luque Law URL above) | Chrome + social-ops |
| Canva Home | Chrome one-off only |
| Stuart Andrews — Notion chat | Leave it |
| Gmail personal (~1402) | MCP / Chrome backup; not a sweep unless asked |
| WhatsApp Business | Chrome + whatsapp-ops **only in ejecución** |
| Gmail firm (radicado thread) | MCP / Chrome backup |

## WhatsApp Business

- Local Chrome only. Title badge lies; scout **All** + label
  `Pendientes por registrar en notion` + open Reviews.
- Cadence (repo + Notion skill v1.3.0): 07:30 / 10:45 / 14:45 / 19:00
  COT. Four windows, not a tight loop. Cloud-only runs skip WA.
  Archived hub still lists 08:00 / 11:00 / 15:00 / 20:00 — ignore.
- Cloud agent on this Mac can attach if Chrome remote debugging is on.
- Organización: scout + report is enough. Phase B (open chats / send)
  only in ejecución.
- Search: `fill_input('input[data-tab="3"]', …)`. After a bad click,
  `type_text` dumps into compose — clear compose with
  `fill_input('#main footer [contenteditable="true"]', "", clear_first=True)`.
- Label chips: **Edit** opens the contact, not labels. If chips cannot
  be cleared in UI, say so in the Review and leave them.

## Meta (FB + IG + MBS)

- Chrome for planner, Page about, follows, comments on **our** posts.
- Ask before publish, brand comment, unfollow, ads, DMs.
- Reels: script in repo → he films on the phone → schedule IG-only as
  Luque Law.

## Canva

Measured 5 Sep 2026: `canva.com` Home logged in, **Recent designs
empty**, frequently used **Instagram Post 4:5**, trial/Pro upsell.

- Use for a one-off he names (Sunday listing, flyer, story).
- Do **not** rebuild the Luque Law carousel ola in Canva. That kit is
  `tmp/instagram/` + `generate.mjs` (site tokens + Arbutus Slab).
- iPhone Canva app is offloaded; web on this Mac is enough.

## MCP connected here (skip Chrome unless the API fails)

Gmail, Google Drive, Google Calendar, Notion, Vercel, Supabase.
No Meta Graph. No WhatsApp API.

## Other leftovers

Phone-only: Screen Time (passcode forgotten — leave it), IG website
field, Highlights.

Mac app, not Chrome: Spotify.

Harness-worthy with no MCP: WhatsApp, MBS/IG/FB, Canva, official
Colombia sites, X, Google booking page if Calendar MCP is not enough.

## Update this file

When he corrects a surface (“eso es Sunday”, “eso va por MCP”), patch
the table here in the same turn. Do not wait for a strategy page.
Then patch the Notion Documentation mirror if it exists.
