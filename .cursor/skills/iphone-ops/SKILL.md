---
name: iphone-ops
description: >-
  Operate Daniel Luque's real iPhone via phone-harness (iPhone Mirroring):
  Settings, Screen Time, Home layout, Instagram @luque_restrepo, WhatsApp
  Business. Use when the user asks to change iPhone settings, audit Screen
  Time, edit Instagram from the phone, implement the iPhone master plan, or
  run phone-side IG/ops. Read phone-harness first. Never send, post, purchase,
  or guess passcodes.
---

# iPhone Ops — Daniel's phone

**Always read the phone-harness skill first** (helpers, `# task:` line,
measured iOS gotchas). This skill is **this device and this firm**, not how
to tap iOS. Web vs phone routing: [ops-surfaces](../ops-surfaces/SKILL.md).

Canvases from the 4–5 Sep 2026 audit (Cursor opens the live copies beside
chat; git copies are under `.cursor/canvases/` in this repo):

- [Plan maestro iPhone](../canvases/iphone-plan-maestro.canvas.tsx)
- [Coach Instagram](../canvases/instagram-coach.canvas.tsx)

Phone-harness helpers backup: [agent_helpers.py](./agent_helpers.py). Live
file remains `~/.phone-harness/agent-workspace/agent_helpers.py`.

## Consent (hard)

This is Daniel's daily driver. **Stop and ask** before:

- Sending WhatsApp / iMessage / Instagram DM
- Posting, scheduling, or commenting as `@luque_restrepo`
- Mass unfollow
- Deleting apps (offload is OK when he asked for the master plan)
- Canceling **Bumble**, **Meta One**, or **iCloud+**
- Entering a Screen Time or device passcode he did not **just** type in chat
- Guessing any PIN (including “first four of a six-digit memory”)

**Never** tap **Connect** on “iPhone in Use”. Ask him to **lock** the iPhone.

**Never** store Screen Time codes in this file.

## Surfaces — phone vs Chrome vs connectors

Default: **Chrome (browser-harness)** for anything with a web app. **phone-harness**
only when iOS is the source of truth. **MCP connectors** when the API exists
and we already have the session. There is **no Meta Graph connector** in this
workspace — Instagram/Facebook go through Chrome (Meta Business Suite) or the
phone app.

| Job | Surface | Why |
| --- | --- | --- |
| Screen Time limits, Downtime, Always Allowed | Phone | iOS only. **Skipped 5 Sep 2026** — passcode forgotten; do not guess. Reset is Apple ID on device, his action. |
| Auto-Lock, Action Button, Private Relay, badges, offload, Home icons | Phone | Done 4 Sep. Dock (Spotify/Camera) still phone if we resume. |
| Focus / Reduce Interruptions | Phone | Settings → Focus. Not Screen Time; can try without the passcode. |
| Sign in with Apple revoke | Phone | Apple Account on device. Ghosts revoked 5 Sep (see below). |
| WhatsApp “Save to Photos”, trim 13 GB | Phone | In-app. **Save to Photos already Off** (5 Sep). Do not bulk-delete 13 GB. Inbox sweeps are **not** this — `whatsapp-ops` + Chrome. |
| Spotify download purge | Mac Spotify app first | Faster than the phone. Phone only if the cache is on-device. |
| Gmail VIP / archive 1,475 | Chrome Gmail or Gmail MCP | Badge already off on iOS. Do not triage 1,475 on the phone at night. |
| Calendar blocks for posting | Google Calendar MCP | Recurring “IG 45 min” / post times. |
| Session notes, tasks | Notion MCP | Not the phone Journal. |
| IG bio, website links, highlights, stories | Phone Instagram | Desktop cannot edit the website field. Highlights = stories. |
| Follow / unfollow public accounts | Chrome instagram.com | Faster than mirroring. Confirm before mass unfollow. |
| Insights 30-day (professional) | Phone app **or** Meta Business Suite | In-app was the audit source. MBS is faster for planner + both IG and FB. |
| Schedule IG/FB posts, captions, Page | Chrome Meta Business Suite | Already used for ola 1–2. Do not post from the phone composer if MBS is queued. |
| Facebook Page about, cover, roles | Chrome facebook.com / MBS | Not the iPhone Facebook app. |
| Comments on brand posts | Chrome | Faster. Do not reply political threads from the brand. |
| DMs Instagram | Phone (or IG web if logged in) | Do not send without ask. |

If a task lists both phone and Chrome, **do Chrome first**, then a short phone
pass for the leftovers.

## Screen Time

- Passcode UI is **4 digits**. Forgotten as of 5 Sep 2026 — **leave it**. Do
  not retry or guess. If he ever resets it via Apple ID,
  then Instagram 45 min + Downtime 23:30–07:00 + always-allow Phone, WA
  Business, WhatsApp, Uber, Waze.
- Existing “All Apps & Categories” 8h limit has been **Off** and ignored.

## Do not reverse without asking

Leave alone: both WhatsApps, Notion + Notion Calendar, Safari, Phone,
Bancolombia / Nequi / Rappi, Uber / Waze, Journal if he uses it.

Bumble Premium: **leave subscribed** unless he says cancel (he said no for
now, 5 Sep 2026). Renews ~7 Sep.

## Home (after 4 Sep 2026 pass)

Sparse page 1: Spotify, Notion, Notion Calendar, Journal. Instagram, X, and
Gmail were **removed from Home** (still in App Library). Dock unchanged: WA
Business, WhatsApp, Safari, Phone. Gmail **badge off**. Instagram iOS
notifications were already off. Action Button: **Silent Mode**. Auto-Lock:
**1 minute**. Private Relay: **On**. Offloaded (reinstallable): CapCut,
Coinbase, Base, Trust, Strava, Sudoku, Canva.

## Instagram `@luque_restrepo`

Professional account, Facebook Page Luque Law, 34 posts, ~437 followers /
~441 following (audit 4 Sep 2026). Bio and first link were set to Luque Law
+ `https://luquelaw.co` (Substack and WhatsApp still on the link list).

Growth and unfollow lists live on the Instagram coach canvas — do not
mass-unfollow from this skill alone. Desktop cannot edit the website field;
use the **Instagram iOS app**. Do not post Sunday Properties on Luque Law
captions. Firm voice: [VOICE.md](../../VOICE.md) if you change bio/copy.

Nav checkmark = title-row right, not the status bar. Bio: ASCII + backspace
to clear; `cmd+a` does not Select All.

## Sign in with Apple (5 Sep 2026)

Revoked: Bird, Adobe XD, AmpMe, Come Ya, Cooking Madness, GIPHY, Komoot,
Lime, Merqueo. **Keep:** Airalo, Airchat, FitPro, Goodnotes, Gumroad, Kimi,
Notion, Uber, Whoosh, Tiimo, and the rest still on the list.

Flow: Apple Account → Sign in with Apple → app → Delete →
`tap_exact("Stop Using", pick="last")`. Verify on the **list** (detail page
still OCRs the app name). Do not scroll-to-top looking for a name you just
removed.

## WhatsApp on device

Dock: **WA Business** (left, + badge) then **personal WhatsApp**. Dock labels
rarely OCR — `tap_image_point` 2nd icon, or `open_app("WhatsApp")` then leave
the restored chat with `nav_back()` (`window.x+36` at the contact-name `y`).
Do not quote chat contents in the reply.

Settings is the **You** tab (far right), not a “Settings” label. The Chats
**settings row** OCRs as `• Chats` (higher on screen) vs the Chats **tab**.
Save media: **Save to Photos** — already Off. 13 GB: do not wipe. Phone
WhatsApp is **not** the inbox barrido (`whatsapp-ops` + WA Business Web).

Focus Reduce Interruptions: Phone + WA Business allowed (5 Sep). Notion
Calendar never made the allow-list (search concatenated). User turns Focus
on from Control Center — we only configured it.

## Task line

Keep `# task:` identical across `phone-harness` scripts for one user request.
Include `# step:` per invocation.
