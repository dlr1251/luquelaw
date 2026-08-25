---
name: whatsapp-ops
description: >-
  Runs Luque Law WhatsApp Business sweeps: scout inbox without burning Unread,
  file media to Drive (FNC + 👍), log Updates/Pendientes/WA Chat Reviews, send
  only safe FAQ/CS replies. Use when the user says revisar WhatsApp, barrido WA,
  pasada WhatsApp, whatsapp sweep, or asks to triage/file WhatsApp chats.
---

# WhatsApp Ops (Barrido)

Local Cursor execution of the Notion protocol. Source of truth (blacklist edits, hub views): [WhatsApp Ops](https://app.notion.com/p/3b1a689f002581c58c2bfc3452783fca). Full protocol: [Skill: WhatsApp Ops (Barrido)](https://app.notion.com/p/3b1a689f0025817bb4f8c03cfa6c054e).

**Browser:** always use `browser-harness` (read that skill). Attach to **local** Chrome with WA Business already logged in. Do not use cloud browser (needs the firm session).

**Cadence:** prefer **07:30 / 10:45 / 14:45 / 19:00** Colombia — not continuous loops. WhatsApp Web must run on **this Mac** with the firm session (cloud Automation cannot see the inbox).

IDs, blacklist snapshot, templates, Drive root, and CDP snippets: [reference.md](./reference.md).

## Token budget (mandatory)

1. **Scout → exit** only if **all three queues** are empty post-blacklist (see Phase A). Do not open chats “to check”.
2. Do **not** re-fetch the full Notion skill every pass. This file + `reference.md` + hub blacklist (if stale) is enough; fetch Notion only when writing or a rule is ambiguous.
3. Open a chat **once**, finish file/voice/classify/reply/log, then leave.
4. Batch Notion writes per chat (Update + Pendiente + Review in one burst).
5. No mega-lists only in agent chat — each future item → Pendiente or Review `Draft pending`.
6. Never run a tight `/loop` on WhatsApp. If scheduling, at most the four daily windows (07:30 / 10:45 / 14:45 / 19:00 COT), then stop. Cloud-only runs skip WA and only do email if Gmail is connected.

## Preflight (browser)

1. `browser-harness --doctor` if attach fails; allow Chrome remote debugging when prompted.
2. `list_tabs()` → `switch_tab(targetId)` to the tab titled like `(N) WhatsApp Business` / `web.whatsapp.com`. Do not assume the current tab is WA.
3. Stay on filter tab **All**. Do **not** rely on the **Unread** filter tab alone (it often shows empty while All still has `N unread message` rows).

## Phase A — Scout (cheap)

1. Focus WA Business Web. **Do not click chat rows yet.**
2. Extract roster from side pane / AX **without** selecting rows (avoids clearing Unread).
3. Parse unread from AX/DOM on **All**: row names / aria-labels like `1 unread message` / `2 unread messages` (English or `no leído`). Also note **Archived** unread badge if present — only open Archived when the pass explicitly covers backlog.
4. Drop blacklist (see `reference.md`; hub is editable source of truth): Rappi, Uber/Didi/delivery, Papá / personal, OPS/**Capital M** noise, business spam, Contacts Notes `WA:blacklist`, Done/auto-reply with no substance.
5. **Never blacklist** firm ops chats: **Luque Law** (internal), **Mateo Taborda** / associates coordinating cases → treat as `Needs human` / escalate, not Ignored.
6. Build **queue = union** (oldest / most urgent first):
   1. **Unread badges** on All (client/lead after blacklist).
   2. WA label **`Pendientes por registrar en notion`** (exact UI name) — priority backlog: triage → Update/Pendiente/Review → **then clear label**.
   3. Open **WA Chat Reviews** with Disposition `Draft pending` | `Escalated` | `Needs human` (query Reviews DS; skip if already handled this pass / no new client message).
7. If queue empty → report “inbox limpio (post-blacklist + secondary queues)” and **stop**.

## Phase B — Deep (only queued chats)

For each chat, in order:

1. Open → read last messages + media. Note `Unread before`.
2. One **Intention**: Primer contacto · Cotización · Estado del caso · Documentos · Pagos · Ansiedad · Lead FAQ · Ruido · Otro.
3. **Ignored** → Review row only (`Disposition=Ignored`); no Update. (Not for Luque Law internal.)
4. **Files:** download → name `🤖_{FNC}.{ext}` → ensure Drive folder under clients root (create if Contacts.`Google Drive` empty; save URL) → upload → Contact URL → react **👍** (not ✅).
5. **Voice:** download → transcribe (Gemini / AI Gateway if keyed; else note fallback in Review Notes + Pendiente “escuchar / pedir texto”) → treat transcript as client text. Do not leave voice as silent Needs human without a Pendiente.
6. **Update** (Type=WhatsApp) only if new fact/doc/payment **or** status/instructions ask. Link Contact + Case when case exists; Duration estimate; Notes ≤ 5 sentences. No Update for noise.
   - Page **icon = 📱** (always). Distinct from the Updates DB bell. Email recibido/enviado → ✉️ when that pass exists.
   - Notify Daniel: **do not @mention him in comments** (the agent writes as Daniel; self-mentions never hit Inbox). Use a **Reminder**:
     1. Pendientes that need him → `Due Date` as **datetime** (Colombia) when there is a real deadline; Person = Daniel.
     2. Digest of the pass → one `<mention-date start="YYYY-MM-DD" startTime="HH:mm" timeZone="America/Bogota"/>` on the pass log (next window 07:30 / 10:45 / 14:45 / 19:00).
     3. One-time in Notion: Pendientes DB → property **Due Date** → Remind (e.g. at time of event). After that, filling Due Date is what pings Inbox.
7. **Reply:**
   - **Send** if safe class (below) **and** user did not require “draft only / OK first”.
   - Else **Draft + Pendiente** (atomic future). Do not send legal/tax/price/strategy.
8. Create **WA Chat Reviews** row (`collection://0045ec0e-0369-4aeb-898a-8f669490c15e`): Chat, Pass Date, Contact, Case, Intention, Disposition, Unread before, Files filed, Voice transcribed, Update, Pendiente, Draft/Sent reply, Drive folder, Notes, Agent=`Cursor`.
9. If chat had label `Pendientes por registrar en notion` and registration is done → clear the label in WA UI.

### May send

- Ack after filed doc + 👍
- FAQ/CS templates in `reference.md`: initial consult + Google booking link (website), language, intermediary→beneficiary, firm email resend, hours
- Case status **only** repeating a milestone already on Case/CSR — no new deadlines
- Already-approved logistics (Google booking link, known account, “recibido”)

### Must not send → Draft + Pendiente

- Tax / DIAN / RUT
- New legal opinion
- Missing quote or scope/price change
- Unconfirmed time promises
- Strategic anxiety reframe
- Voice call with no actionable transcript → Pendiente “Llamar / pedir texto a X”
- Anything the pass marked “proyectar — NOT sent / needs Daniel OK”

## Anti-patterns

- Trusting the **Unread** filter tab as the only queue source
- Clicking Unread rows to explore without classifying
- Exiting after “Unread empty” while Draft pending / Needs human / label queue still open
- Treating **Luque Law** internal as blacklist / Ignored
- Update without Case when the event belongs to a case
- Drive upload without FNC / without `🤖_` agent prefix
- Archived reaction other than 👍
- Aggregate “Barrido WA HH:MM” Update instead of per-chat Reviews + per-chat Updates
- Mega-list of Daniel todos only in agent chat (each → Pendiente)
- Sending from cloud Automation / headless without the firm WA session
- Reinventing full AX scrapers every pass — reuse snippets in `reference.md`

## Pass report (short)

After the pass, reply with: scout unread → label queue → secondary Reviews → processed → filed → sent → drafted/escalated → ignored. Link any new Review rows / Pendientes. No novel essay.
