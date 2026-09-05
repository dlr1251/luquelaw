---
name: social-ops
description: >-
  Luque Law Instagram (@luque_restrepo) and Facebook Page (Luque Law) ops:
  route work to Chrome Meta Business Suite, Instagram web, phone Instagram,
  or connectors. Use when the user mentions IG, Instagram, Facebook, FB,
  Meta Business Suite, captions, planner, follows, Page, or social growth.
  Read iphone-ops for device constraints. No Meta API connector in this repo.
---

# Social ops — IG + FB

Canonical site: https://luquelaw.co  
IG: `@luque_restrepo` (professional, linked to Page).  
FB: Page **Luque Law**.  
Voice: [VOICE.md](../../VOICE.md). No Sunday Properties on Luque Law captions.
Engagement model unchanged (45 min → Concepto + quote in 3 business days).

Captions + schedule: [tmp/instagram/CAPTIONS.md](../../tmp/instagram/CAPTIONS.md).  
Coach: [instagram-coach canvas](/Users/danielluque/.cursor/projects/Users-danielluque-Projects-luquelaw/canvases/instagram-coach.canvas.tsx).

## Where to work (read before acting)

**Chrome (browser-harness, local profile already logged into Meta)** — default:

- Meta Business Suite planner (schedule IG-only vs FB, check ola 1–2)
- Facebook Page: about, cover, roles, queued posts
- instagram.com: follow official accounts, unfollow (only after he confirms the list), public comments on **our** posts
- Insights that MBS exposes for both properties

**iPhone (phone-harness)** — only these:

- Bio + website/links (desktop cannot edit the link sticker)
- Highlights (from stories)
- Stories, Reels camera, posting if MBS cannot
- Screen Time / notifs (see iphone-ops; Screen Time passcode skipped)

**Connectors (no Meta Graph in this workspace):**

- Notion — tasks, session log
- Google Calendar — block the 45-min create window / post times
- Gmail — not for posting; leads that arrive by email
- Drive — carousel PNGs already under `tmp/instagram/` and `tmp/facebook-page/`

Do **not** invent a Meta MCP. Do **not** use cloud Chrome (needs his Meta session).

**MBS trap:** `business.facebook.com` often opens **Sunday Properties** (29 followers).
Luque Law + `@luque_restrepo` live under the **Navi pages** portfolio. Confirm the
combobox says Luque Law before scheduling or posting. Never publish firm
content while the header still says Sunday Properties.

Planner that is Luque Law when the asset is selected:

`https://business.facebook.com/latest/content_calendar?business_id=638320349992761&asset_id=1282983321572904`

### MBS speed (measured 5 Sep)

- Skip `wait_for_load()` (hangs). Skip dumping `innerText`. Filter the AX
  tree. Screenshot helper is `capture_screenshot`, not `screenshot`.
- Week view is **Sun–Sat**. Posts for 7 / 9 / 11 live on the **next** week.
  Next-week control is AX `button` named `Right \u200b` (zero-width space),
  not `aria-label=Right`. Box-model → `click_at_xy`.
- `Create post` `click_at_xy` can **TimeoutError** and still not open the
  composer. Do not retry the same click. Stop and use another entry
  (day cell / a different Create control) or ask.
- Schedule by **calendar date**, not weekday labels in
  `tmp/instagram/CAPTIONS.md` (13 Sep 2026 is Sunday, not Saturday).

## Consent

Ask before: publish, comment as the brand, mass unfollow, change Page name,
boost/ads spend, or send DMs.

## Reels pipeline

Talking-head, 20–35s, vertical 9:16. **Cursor writes the script** → **Daniel
films on the iPhone** (native Reels camera, not CapCut; it was offloaded) →
on-screen hook 3–6 words + auto captions → caption from
[tmp/instagram/REELS.md](../../tmp/instagram/REELS.md) → schedule **IG-only**
in MBS as Luque Law (never Sunday Properties).

On camera, first person is allowed (Daniel is on screen). Caption = **we**.
CTA: luquelaw.co, not “DM me”. Informational, not legal advice. No Sunday
Properties. No politics.

Cadence: **one EN Reel per week** in the Calendar block “IG create — no feed”
(lun–vie 18:00). Carousels stay in MBS; Reels are the discovery layer.

Do not invent a second editor on the phone. If a branded bumper is needed,
generate a still in the carousel `generate.mjs` system and drop it as the
first/last frame in the IG editor — do not reinstall CapCut for that.

## Queue (5 Sep 2026, verified Luque Law planner)

Ola 1 IG-only 10:00: **5, 7, 9, 11 Sep** (FB also 7 10:00, 9 11:31, 11 11:32).
Ola 2: **only 13 Sep 10:00 IG** is queued. Still empty: **16, 18, 20, 23, 25**.
Assets + captions ready in `CAPTIONS.md` / `tmp/instagram/c5`–`c10`. FB ola 2
squares exist — do not duplicate IG carousels onto FB unless he asks.

Official follows done in Chrome 5 Sep. Unfollow noise only with explicit
“de una”. Highlights + first EN Reel = phone (script #1 in REELS.md).
