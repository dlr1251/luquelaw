# Output examples

## Curator (outline)

```
slug_key: investor-visa
section.id: (outline)
pass: curator
severity: major

finding: ES is missing section id `qualifying-investment`; EN has it after `who-it-is-for`.
evidence: EN outline […, who-it-is-for, qualifying-investment, process, …]; ES outline skips to process.
proposed_fix: —
```

## Critic (section)

```
slug_key: investor-visa
section.id: qualifying-investment
pass: critic
severity: blocker

finding: EN states a USD floor that the fetched Cancillería page does not state for this visa type.
evidence: EN: “from USD 100,000”. https://www.cancilleria.gov.co/… (fetched YYYY-MM-DD) — no such floor in the cited instrument. ES does not mention the floor (parity break).
proposed_fix: —
```

## Generator (same section)

```
slug_key: investor-visa
section.id: qualifying-investment
pass: generator
severity: blocker

finding: Remove unverified USD floor; restore EN/ES parity; hedge as of fetch date.

proposed_fix:

--- EN ---
## Qualifying investment {#qualifying-investment}

The M-type investor visa is tied to an investment Migración / Cancillería actually list for this class. Amounts and eligible vehicles change. Confirm the instrument in force before you treat a number as a requirement.

[…]

--- ES ---
## Inversión que califica {#qualifying-investment}

La visa M de inversionista está atada a la inversión que Migración / Cancillería listen para esta clase. Montos y vehículos cambian. Confirme el instrumento vigente antes de tratar un número como requisito.

[…]
```

Sources (after generator):

- Cancillería, {title}, {URL}, {date}, official
