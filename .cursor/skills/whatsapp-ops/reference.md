# WhatsApp Ops — links, IDs, snapshots, snippets

Fetch Notion pages only when writing or resolving ambiguity. Snapshot date: **2026-08-12**.

## Page icons (Updates)

| Canal | Icon | Notas |
|---|---|---|
| WhatsApp (barrido) | **📱** | Siempre en `create_pages` / `update_page` `icon`. No usar la campana default. |
| Email recibido / enviado | ✉️ | Misma familia visual cuando corra el barrido de correo. |
| Digest de pasada | 📱 | Página “Barrido WhatsApp — fecha” bajo el hub. |

Daniel (Person on Pendientes): `d47dbc80-4a1a-4582-babb-c525aca8ee6e`.

**Do not @mention Daniel in comments** — MCP writes as him, so Inbox stays empty.

**Reminders that ping:** `Due Date` datetime on Pendientes + one-time Remind on that property. Pass log: `<mention-date start="YYYY-MM-DD" startTime="HH:mm" timeZone="America/Bogota"/>`.

## Links & collection IDs

| Resource | ID / URL |
|---|---|
| Hub | https://app.notion.com/p/3b1a689f002581c58c2bfc3452783fca |
| Notion Skill | https://app.notion.com/p/3b1a689f0025817bb4f8c03cfa6c054e |
| WA Chat Reviews DB | https://app.notion.com/p/9748aa6562da41faa99cc3cb04153276 |
| Reviews data source | `collection://0045ec0e-0369-4aeb-898a-8f669490c15e` |
| Updates skill | https://app.notion.com/p/6c5704dcc28f4081a74883afb0f5c9cd |
| Updates data source | `collection://343a689f-0025-804f-870e-000bbc99dbf9` |
| Pendientes skill | https://app.notion.com/p/017560a756fc4a3aa0ea728297b9023e |
| Pendientes data source | `collection://343a689f-0025-8096-9812-000bb2e55176` |
| Contacts data source | `collection://343a689f-0025-80bb-92a7-000b17c2ed80` |
| Cases data source | `collection://343a689f-0025-8022-80ea-000b06cef6f9` |
| Messages & Templates | https://app.notion.com/p/373a689f002581b6998ded2473d0458a |
| Barrido FAQ (legacy CS) | https://app.notion.com/p/373a689f00258118a548fc90ce0c8ec4 |
| Protocol CS | https://app.notion.com/p/373a689f0025819786ced73101f381f3 |
| Revised FNC | https://app.notion.com/p/373a689f0025817d8216ecf417d88176 |
| Clients Drive root | https://drive.google.com/drive/u/0/folders/13soHE71GitCrjPQEo4Lnn5Qn_UsSYM2s |

## Disposition / Intention enums

**Disposition:** Ignored · Filed · Replied · Draft pending · Escalated · Needs human

**Intention:** Primer contacto · Cotización · Estado del caso · Documentos · Pagos · Ansiedad · Lead FAQ · Ruido · Otro

## Blacklist snapshot (hub is source of truth)

| Pattern / chat | Motivo |
|---|---|
| Rappi | Ruido / auto-reply |
| Uber, Didi, delivery apps | No-cliente |
| Papá / chats personales explícitos | Fuera de firma |
| Grupos OPS / **Capital M** noise | Interno no-cliente (≠ Luque Law) |
| Business spam | Marketing no solicitado |
| Contact Notes contains `WA:blacklist` | Marca manual |

Also **Ignored** (Disposition): Done sin sustancia, auto-replies de horario, ruido similar.

**Do not ignore:** `Luque Law` (internal ops), `Mateo Taborda` / associate case coordination → `Needs human`.

## WA label workflow

Exact label name in WhatsApp Business UI:

`Pendientes por registrar en notion`

Priority backlog: triage → Update / Pendiente / Review → **clear label**. Not optional when present.

## FNC agent file name

`🤖_{FNC_BODY}.{ext}` — emoji prefix outside semantic FNC body; extension separate.

Reacción de archivado: **👍** only.

## Safe reply snippets (May send)

Replace `[Name]`. Firm voice = **we**. Booking = **Google Calendar** (same as website `NEXT_PUBLIC_BOOKING_URL`), never Calendly:

`https://calendar.google.com/calendar/appointments/schedules/AcZssZ1PxjHZPiCZbOns1zr-EYuWLk_19yM4IvqGWWkdyBuoXHRNAdwqUKyZonGdfdmaO0IFlko6ePvO?gv=true`

Initial consult fee: **USD 55** (≈ COP 190,000); credited if they hire afterward — do not invent other prices.

### Lead FAQ — initial consult (EN)

```
Hi [Name], thank you for reaching out.

We cover that in an initial 45-minute consultation (USD 55 / about COP 190,000). If you hire us afterward, that fee is credited toward the service.

Book here: https://calendar.google.com/calendar/appointments/schedules/AcZssZ1PxjHZPiCZbOns1zr-EYuWLk_19yM4IvqGWWkdyBuoXHRNAdwqUKyZonGdfdmaO0IFlko6ePvO?gv=true

Or reply with a few preferred times (Colombia time) and we will confirm.
```

### Doc filed ack (EN)

```
Hi [Name] — thank you. We have the document on file.
```

### Language switch (EN)

```
We appreciate your effort to communicate in Spanish. We are finding it a bit difficult to understand the message. Would you like to continue in English?
```

### Intermediary → beneficiary (EN)

```
Hi [Name], thank you for contacting us on behalf of [Client]. For visa matters we need to speak directly with the beneficiary. Could you share their contact details or ask them to message us?
```

For richer scripts, fetch Messages & Templates / Barrido FAQ only when needed.

## Secondary queue SQL (Reviews)

```sql
SELECT Chat, Disposition, Intention, "date:Pass Date:start" AS pass_date, Notes
FROM "collection://0045ec0e-0369-4aeb-898a-8f669490c15e"
WHERE Disposition IN ('Draft pending', 'Escalated', 'Needs human')
ORDER BY datetime("date:Pass Date:start") DESC
LIMIT 40
```

## Browser snippets (browser-harness)

### Switch to WA tab

```python
tabs = list_tabs()
wa = next(t for t in tabs if "whatsapp" in (t.get("title") or "").lower()
          or "web.whatsapp.com" in (t.get("url") or ""))
switch_tab(wa["targetId"])
print(page_info())
```

### Scout roster + unread (no clicks)

```python
import re
ax = cdp("Accessibility.getFullAXTree")["nodes"]

def name_of(n):
    nm = n.get("name")
    return nm.get("value") if isinstance(nm, dict) else (nm or "")

def role_of(n):
    r = n.get("role")
    return r.get("value") if isinstance(r, dict) else (r or "")

rows = []
for n in ax:
    if role_of(n) != "row":
        continue
    name = name_of(n)
    if not name or name.startswith("New messages") or len(name) < 3:
        continue
    rows.append(name)

unread = [r for r in rows if re.search(r"\bunread\b|no le[ií]d", r, re.I)]
print("rows", len(rows), "unread-named", len(unread))
for r in unread:
    print(r[:220])
```

### Open chat by search (preferred over scroll guessing)

```python
import time
ax = cdp("Accessibility.getFullAXTree")["nodes"]

def name_of(n):
    nm = n.get("name")
    return nm.get("value") if isinstance(nm, dict) else (nm or "")

def role_of(n):
    r = n.get("role")
    return r.get("value") if isinstance(r, dict) else (r or "")

query = "Victor Omiyale"  # set per chat
for n in ax:
    if role_of(n) == "textbox" and "search" in name_of(n).lower():
        bid = n["backendDOMNodeId"]
        box = cdp("DOM.getBoxModel", backendNodeId=bid)["model"]["content"]
        x, y = sum(box[0::2]) / 4, sum(box[1::2]) / 4
        click_at_xy(x, y)
        break
time.sleep(0.2)
# type query via CDP Input or page-focused typing helpers available in harness
```

Prefer search → click matching **row** containing the contact name → read `#main` bubbles via `js(...)`.

### Send text (safe classes only)

Find compose textbox (`Type a message` / `mensaje`), focus, insert text, send with Enter. Confirm bubble appeared before logging `Sent reply`.

### React 👍 on latest doc bubble

Fragile: hover/right-click reaction UI. If reaction fails after one serious attempt, note in Review Notes and continue (file + Update still count); do not burn the pass retrying endlessly.
