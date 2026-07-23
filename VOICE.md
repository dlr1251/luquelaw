# Luque Law — brand voice

Source of truth for all user-facing copy (EN and ES). Agents: read this before editing marketing strings, CTAs, SEO, emails, empty states, or WhatsApp prefills.

## Who we are

Luque Law is a boutique bilingual firm in Medellín, founded and led by Daniel Luque Restrepo (JD UPB), with a focused team. We serve international clients in Colombia — immigration, real estate, corporate, labour, family, and tax orientation.

The site speaks as a **founder-led team**, not a faceless institution and not a solo practice brochure.

## Locked product decisions

| Decision | Rule |
|---|---|
| Brand spelling | **Luque Law** (space) everywhere user-facing |
| Firm vs founder | Firm = **we / nosotros**. **I** only where Daniel signs personally (About founder note, blog bylines) |
| Contact door | Public copy is the **firm** (“we’ll reply”). Operational channels may still reach Daniel; WhatsApp prefill addresses **Luque Law**, not “Hi Daniel…” |
| AI product name | **Torny** only in user-facing UI. Do not expose “Lucy” to visitors. Routes/modules may still use `lucy` on disk |
| Engagement model | 45-minute initial consultation → written legal concept (**Concepto Jurídico**) + quotation within **3 business days** → scoped workplan or hourly retainer |
| Booking product | Match live product: **45 min / USD 55** (Google Meet). Do not invent a 1-hour product in copy |

## The two writers

Daniel has two internal writers:

- **The real writer** — from inside. Direct, associative, warm, dry humor, concrete images. When present, the text feels inevitable.
- **The academic writer** — generic, riskless, pretentious. Sounds like an improved version of him. When present, the text can be deleted with zero loss.

Only the first writer ships. If a sentence sounds like the second, cut or rewrite it.

## Master rule

> If it sounds like a sermon, cut it. If it sounds like someone trying to sound smart, cut it. If it sounds like Daniel talking to someone he trusts about something he cares about, publish it.

## Voice DNA

1. **Founder-led “we”.** Personal, never corporate. Never “the firm provides…”. Say plainly who the team is, where it comes from, what it has seen.
2. **Concrete over abstract.** Name mechanics: civil law vs common law, garantías reales vs escrow, Concepto Jurídico, Migración Colombia. Replace “high-value counsel” with a deliverable, timeframe, or document.
3. **Rhythm: long sentence, then a short punch.** Build, then land. Short sentences may stand alone as paragraphs.
4. **Honest questions.** Anticipate the client’s real fear and answer plainly.
5. **Dry humor, small doses.** Seasoning only. Never where legal certainty matters (deadlines, consent, prices).
6. **Experience shown, not claimed.** Lived texture over badges. No unverifiable “hundreds of clients” or vague “network of allies”.
7. **Bilingual sensibility.** Keep Colombian legal terms and gloss them: “written legal concept (Concepto Jurídico)”.
8. **Warmth without servility.** Helpful and direct. No begging, no exclamation marks, no “we’d love to!”.

## Brand archetype (Jungian mix)

| Weight | Archetype | Job |
|---|---|---|
| ~60% | Sage | Teach. Leave the reader with clarity — “por fin entiendo las reglas del juego”. Authority from cited knowledge and method. |
| ~25% | Explorer | First impression: empathy with the journey of living/operating in another country. |
| ~15% | Outlaw | Candor — say what other lawyers avoid. Dry humor site-wide, salt not sauce. |

Magician & Ruler appear as **evidence** (CLKR, Torny, ordered engagement) — never as “innovative disruptive solutions” language.

**Anti-archetypes:** motivational guru, cheap visa tramitador, stuffy solemn firm, lawyer-influencer, faceless corporate brand.

### Tone dials

- Authority: HIGH (earned by specificity)
- Clarity: MAXIMUM
- Warmth: MEDIUM
- Humor: LOW–MEDIUM
- Candor: HIGH
- Hype: ZERO

## Hard rules

**Do**

- Apply the voice matrix site-wide.
- Make every claim concrete and verifiable.
- Keep CTAs, form labels, and buttons short and scannable.
- Explain Colombian legal reality plainly when it matters to the reader.
- Keep information architecture; change words, not structure, unless a heading is dead weight.

**Don’t**

- No sermons, LinkedIn-speak (“leverage”, “seamless”, “world-class”, “solutions”, “high-value”).
- No superlatives without data.
- No exclamation marks. No emojis in body copy.
- Never alter meaning of: legal notice, Law 1581 consent, contact details, prices, deadlines, or engagement terms.
- Never invent credentials, case results, or client counts.

## Litmus tests (every string)

1. **Sermon** — does it preach? Cut.
2. **Smart** — is it trying to impress? Cut.
3. **Table** — would Daniel say this across the table? If not, rewrite.
4. **Pointing** — can you point at a document, date, or mechanism? If not, concretize or delete.
5. **Archetype** — after the section: (a) taught something true? (b) understands the journey? (c) one honest unvarnished line? If 0 of 3, rewrite.

## English note

Daniel’s published literary voice lives in his Spanish essays (danielluque.substack.com). Transpose those traits into clean, natural English. Do **not** imitate his early English Substack piece, and do **not** translate Spanish phrasing literally.

## Out of scope for voice PRs

- Business logic, routes, pricing amounts, legal consent text meaning.
- Renaming `lucy` modules on disk (user-facing label is Torny; code paths may lag).
- CMS article/norm/post bodies in Supabase (content ops, separate from site chrome).
