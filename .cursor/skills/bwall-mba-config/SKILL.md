---
name: bwall-mba-config
description: >-
  Configure Meta Business Agent (BWALL) on Luque Law WhatsApp Business via
  browser harness. Paste verbatim blocks from Notion BWALL Agent Guide. Do not
  run WhatsApp Ops sweep. Use when the user says configure BWALL, configurar
  MBA, train Meta Business Agent, pegar BWALL, or setup WhatsApp AI.
---

# BWALL MBA Config

## When to use

User says: configure BWALL, configurar MBA, train Meta Business Agent, pegar BWALL, setup WhatsApp AI.

## Source of truth

Notion: Documentation → [BWALL — Meta Business Agent (WhatsApp Luque Law)](https://app.notion.com/p/de556751026c4e0096f1898f1b4438a9) (Agent Guide).

Read current Version. Paste only PASTE blocks A (instructions), B (business info), C (FAQs).

Execution skill (Notion): [Skill: BWALL MBA Config (Cursor)](https://app.notion.com/p/6c7c8ce6a74146f983b7505f2b635fda).

## Hard rules

- Verbatim paste. No tone rewrites.
- Audience = New contacts only unless Daniel says Everyone.
- Number = Luque Law +57 300 679 1123. No CTWA requirement.
- No invented attorney fees, SMLMV, or case status.
- Not a substitute for skill whatsapp-ops (inbox sweep).
- Local Chrome only. Router: [ops-surfaces](../ops-surfaces/SKILL.md).

## Steps

1. Attach browser harness to Chrome with WA Business / Meta Business Agent UI for Luque Law.
2. Snapshot current agent settings.
3. Paste Bloque A → instructions.
4. Paste Bloque B → business knowledge.
5. Paste Bloque C FAQs (priority C1–C3, C6–C7, C9–C10).
6. Set audience New contacts only. Save.
7. Run synthetic tests table from Notion skill page; log results on BWALL Changelog.
8. Stop. Report pass/fail + any UI label mismatches.

## Done means

Instructions + business info + core FAQs saved, audience correct, tests logged, no Capital M leakage.
