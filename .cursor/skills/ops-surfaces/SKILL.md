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

## Where to work

Default: **Chrome local + `browser-harness`** for any web app without an
MCP. Attach to the firm profile (`browser-harness --doctor`). Do **not**
use a cloud / Browser Use browser for WhatsApp or Meta (needs his
session).

| Job | Surface | Skill / connector |
| --- | --- | --- |
| WA Business inbox, labels, 👍 | Chrome `web.whatsapp.com` | [whatsapp-ops](../whatsapp-ops/SKILL.md) |
| Planner, Page, captions, follows | Chrome MBS / facebook.com / instagram.com | [social-ops](../social-ops/SKILL.md) |
| Carousels 1080×1350 | Repo `tmp/instagram/generate.mjs` → MBS | social-ops + `CAPTIONS.md` |
| Canva one-off (Sunday, flyer, story) | Chrome `canva.com` if logged in | This file — not the ola pipeline |
| IG bio, Highlights, Stories, Reels camera | iPhone Instagram | [iphone-ops](../iphone-ops/SKILL.md) |
| Gmail, Calendar, Drive | **MCP** (Chrome tab is backup) | Gmail / Google Calendar / Drive |
| Notion, Pendientes, Updates | **MCP** | Notion |
| Stripe / Vercel / Supabase | **MCP** | those servers |
| DIAN / Migración / SUIN scrape | Chrome | browser-harness (already used for SUIN 5477) |
| X / blog scout | Chrome | [blog-writer](../blog-writer/SKILL.md) |
| Bancolombia, Nequi, Rappi, personal WA | Neither | Do not open |

**MBS trap:** `business.facebook.com` often opens **Sunday Properties**.
Luque Law planner (confirm combobox):

`https://business.facebook.com/latest/content_calendar?business_id=638320349992761&asset_id=1282983321572904`

## WhatsApp Business

- Local Chrome only. Title badge lies; scout **All** + label
  `Pendientes por registrar en notion` + open Reviews.
- Cadence (skill): 07:30 / 10:45 / 14:45 / 19:00 COT — not a tight loop.
- Cloud agent on this Mac can attach if Chrome remote debugging is on.
- Organización: scout + report is enough. Phase B (open chats / send)
  only in ejecución.

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

## Other apps we actually use

Harness-worthy (no MCP): WhatsApp, MBS/IG/FB, Canva, official
Colombia sites, X, Google booking page if Calendar MCP is not enough.

MCP-first (skip Chrome unless the API fails): Gmail (firm + personal),
Drive, Calendar, Notion, Stripe, Vercel, Supabase.

Phone-only leftovers: Screen Time (passcode forgotten — leave it),
IG website field, Highlights.

Mac app, not Chrome: Spotify.

## Update this file

When he corrects a surface (“eso es Sunday”, “eso va por MCP”), patch
the table here in the same turn. Do not wait for a strategy page.
