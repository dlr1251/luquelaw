# Luque Law — Design conventions

## Fonts

Four families, each with a specific role:

| Family | CSS variable | Role |
|---|---|---|
| Arbutus Slab | (use directly) | Display headings, hero type — class `.marketing-display`, `.marketing-title` |
| Libre Baskerville | (use directly) | Section headings, editorial serif — `h1`–`h3` inside `.marketing-theme` |
| Figtree | (use directly) | Body text, UI labels — class `.marketing-body`, `.marketing-lead`, `.marketing-eyebrow` |
| Geist | (use directly) | UI chrome, dashboard — rarely needed on the marketing surface |

All four are available from the imported Google Fonts URL in `styles.css`.

## Wrapping and setup

All marketing pages wrap their root element in `.marketing-theme`. Without it, most semantic tokens (`--heading`, `--muted-foreground`, `--hero`, etc.) are undefined and colors will look wrong.

```html
<div class="marketing-theme">
  <!-- your design here -->
</div>
```

The dashboard/admin surface uses `.dashboard-theme` instead (neutral shadcn scale, no brand green).

Dark mode is toggled by adding `class="dark"` to `<html>` — both themes have dark-mode overrides.

## Token vocabulary

Use CSS custom properties directly — there are no utility classes for tokens.

**Brand palette (always available, no theme class needed):**
```
--forest    #152919   Primary green — CTA backgrounds, hero, headings
--moss      #2a5c32   Accent green — hover states, links, accent-italic
--parchment #faf9f6   Warm off-white — page background, inverted button text
--ink       #1a1714   Near-black — body text
```

**Semantic tokens (require `.marketing-theme` on an ancestor):**
```
--background        var(--parchment)        Page background
--foreground        var(--ink)              Primary text
--muted             #ebe6de                 Subtle background
--muted-foreground  #625541                 De-emphasized text
--border            #d9d2c7                 Dividers, form borders
--surface           #f2efe8                 Card/panel background
--surface-strong    #e8e2d8                 Stronger surface
--heading           var(--forest)           Heading color
--primary           var(--forest)           Primary action color
--primary-foreground #ffffff                Text on primary
--hero              var(--forest)           Hero section background
--hero-foreground   #ffffff                 Text inside hero
--hero-accent       #7ecf8a                 Bright green accent inside hero
--hero-muted        rgb(255 255 255 / 0.76) Muted text inside hero
--hero-border       rgb(255 255 255 / 0.18) Borders inside hero
```

## Pre-built classes

**Typography utilities** (apply directly to text elements):
```
.marketing-display   — Large display heading (Arbutus Slab, fluid 2–3.25rem)
.marketing-title     — Section heading (Arbutus Slab, fluid 1.5–1.875rem)
.marketing-eyebrow   — Small all-caps label in --moss (Figtree, 0.6875rem, 0.16em tracking)
.marketing-lead      — Intro paragraph (Figtree, fluid 1–1.0625rem, 1.7 leading)
.marketing-body      — Standard body (Figtree, 1rem, --muted-foreground)
.accent-italic       — Serif italic in --moss (Libre Baskerville italic)
.marketing-eyebrow-on-hero — Eyebrow variant for use on the hero (uses --hero-accent)
```

**Layout:**
```
.marketing-section  — Block section padding (fluid 3.5–5rem vertical)
.brand-mark-dot     — Circular dot motif (0.5em × 0.5em, bordered circle)
```

**Buttons** (standalone, no framework dependency):
```
.btn-primary          — Forest background, parchment text, uppercase
.btn-secondary        — Transparent with forest border, uppercase
.btn-primary-inverted — Parchment background, forest text (for use on hero)
.btn-primary-sm / .btn-secondary-sm  — Compact size
.btn-primary-lg / .btn-secondary-lg  — Large size
```

## Idiomatic build example

```html
<div class="marketing-theme">
  <section style="background: var(--hero);" class="marketing-section">
    <p class="marketing-eyebrow-on-hero">Asesoría legal</p>
    <h1 class="marketing-display" style="color: var(--hero-foreground);">
      Luque Law
    </h1>
    <p class="marketing-lead" style="color: var(--hero-muted);">
      Especialistas en derecho inmobiliario y normativa arrendaticia.
    </p>
    <a href="#" class="btn-primary-inverted">Reservar consulta</a>
  </section>

  <section class="marketing-section" style="background: var(--background);">
    <p class="marketing-eyebrow">Servicios</p>
    <h2 class="marketing-title">Cómo podemos ayudarte</h2>
    <p class="marketing-body">
      Nuestro equipo resuelve conflictos entre arrendadores y arrendatarios,
      revisa contratos y asesora en <span class="accent-italic">normativa vigente</span>.
    </p>
    <a href="#" class="btn-primary">Ver servicios</a>
    <a href="#" class="btn-secondary" style="margin-left: 0.75rem;">Contactar</a>
  </section>
</div>
```
