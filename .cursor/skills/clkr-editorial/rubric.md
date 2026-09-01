# CLKR editorial rubric

Use with [SKILL.md](SKILL.md). Tick in the finding `evidence` line, not as a chat essay.

## Curator — outline + hub

Hub fields (`title`, `description`, `category`, `reading_time`, `sort_order`):

- [ ] EN and ES describe the **same** guide (not two different products)
- [ ] `description` is 1–2 sentences, concrete, no slogan
- [ ] `category` matches the mechanic (Immigration / Tax / …)
- [ ] `reading_time` is plausible for the body length
- [ ] Both locales exist; if not, finding `missing_locale` (do not invent the missing locale in curator)

Outline (section `id` + `title` only):

- [ ] Every EN `id` has an ES sibling (and the reverse)
- [ ] Order matches; a section that exists only in one locale is `missing_locale_section`
- [ ] Titles are parallel in meaning (not a legal fork)
- [ ] Category coverage: visas usually need what it is, who it is for, requirements, process, caveats / not-advice. Do not invent a mandatory template — only flag a hole that a reader of that guide would hit
- [ ] Internal links: `/clkr/guides/…`, `/es/clkr/guides/…`, `/clkr/norms/…` — note 404s or locale-mismatched prefixes
- [ ] Last beat should not-advice / limits of the page (informational). If missing, `major` not a rewrite yet

Curator does **not** fetch official gazettes unless a link is obviously broken.

## Critic — one section pair

Load EN html/markdown and ES html/markdown for **one** `section.id`.

Law:

- [ ] Every numbered ley / decreto / resolución / sentencia is named and fetchable
- [ ] The sentence in the guide is what the instrument actually says (no extra obligation)
- [ ] Dates and thresholds match the fetched page (or the guide hedges: “as of …”)
- [ ] Repealed / superseded instruments are marked or removed

Voice and product:

- [ ] Informational. No “you should file X this week” as if it were their case
- [ ] Colombian terms kept and glossed; EN is natural English (VOICE.md English note), not a calque
- [ ] No sermons, LinkedIn-speak, exclamation marks, unverifiable volume claims
- [ ] Prices / engagement model untouched unless the section already cites the live 45 min / USD 55 product correctly

Parity:

- [ ] Same legal content in EN and ES (examples, exceptions, numbers)
- [ ] Links point at the matching locale when a translation exists
- [ ] A stronger claim in one locale is a **blocker** or **major**, not “style”

If the official source cannot be fetched, severity stays **major** (unverified), never “confirmed”.

## Generator — only marked findings

- Rewrite **that section only**, both locales
- Keep `{#id}` unless curator asked to split/rename — then say so explicitly
- `###` subheads stay inside the section; do not emit a new `##` in the body of a single-section patch
- Do not add new legal claims without a fetched source in the source list
- Do not “complete” sections the critic did not flag
- CTA, if any: firm door (contact / booking), no hype

Markdown shape:

```markdown
## Section title {#existing-id}

Paragraph.

### Subhead

- list
```
