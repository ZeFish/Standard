---
title: "@stnd/styles"
aliases: []
created: 2026-07-04 23:27
modified: 2026-08-10T12:11:59.008Z
last_audited: 2026-07-14
audit_interval_days: 90
next_audit: 2026-10-12
audit_priority: 3
maturity: tree
mode: read
publish: true
status: active
tags:
  - package
  - stnd
theme: kernel
type: package
visibility: public
garden-url: https://francisfontaine.com/readme
garden-short: https://stnd.gd/sVwiaF
---

# @[stnd](../README)/styles

> The CSS typography and design system framework for the Standard Ecosystem.

---

This is the CSS. One seed color in, a whole harmonious palette out; one base font size in, a whole readable type scale out. You almost never touch this package directly — it’s on automatically (see `@stnd/modules/styles` in the Gold Standard). You touch it when you want to *change* the numbers behind the look (the golden-ratio scale, the OKLCH color math) rather than a specific theme’s colors (that’s `@stnd/themes`).

**You’re already using it.** Nothing to install or configure for a normal site.

## Overview

`@stnd/styles` is a comprehensive design system based on classical book design, the Golden Ratio, and OKLCH color spaces. It provides structural layout grids, clean typography scales, and automated color themes for all Standard applications with zero configuration.

---

## 1. Mathematical Spacing & Ratios

The system rejects arbitrary pixel coordinates. All spacing, font scaling, and line heights are tied to three mathematical constants:

- **Golden Ratio** ($\phi \approx 1.618$): Governs structural widths, block margins, and main layout columns.
- **Silver Ratio** ($\theta \approx 1.414$): Governs the typographic scale and base vertical rhythm.
- **Halfstep** ($\sqrt{\phi} \approx 1.272$): Square root of the Golden Ratio, used for subheadings, margins, and inline gaps.

---

## 2. Typographic Scale

Standard applies a strict modular font scale to prevent typographic clashes. Body font sizes map to CSS custom properties:

| CSS Variable | Scale Class | Value / Application |
| :--- | :--- | :--- |
| `--scale-8` | `.scale-8` | Large Display Title |
| `--scale-4` | `h1` | Primary Document Header |
| `--scale-2` | `h2` | Subheadings |
| `--scale` | `body` | **Base Body Text ($1\text{rem}$)** |
| `--scale-d2` | `.small`, `small` | Captions, Side Notes |
| `--scale-d3` | `.smaller` | Footnotes |
| `--scale-d4` | `.micro` | Meta Labels, Short Codes |
| `--scale-d5` | `.nano` | Micro-badges |

---

## 3. Spacing Grid (Baseline Rhythm)

Vertical rhythm is managed through a base unit `--space` (usually $1\text{rem}$ / $16\text{px}$). Multiples and fractions are locked:

- **Standard Spacing (Multiples)**:
    - `--space-2`, `--space-4`, `--space-8`, `--space-12`
- **Sub-units (Fractions)**:
    - `--space-half` (0.5x), `--space-third` (0.33x), `--space-d4` (0.25x), `--space-d8` (0.125x)

Elements align to this grid through a strict rule: *the sum of an element’s font-size, line-height, and margins must always be a multiple of `--space`.*

---

## 4. Color System (OKLCH Color Space)

Instead of hardcoding colors, the system generates complete color palettes dynamically. By using OKLCH color mathematics, one seed color generates borders, backgrounds, surfaces, and active states with uniform perceived brightness:

- `--color-accent`: Seed brand highlight color.
- `--color-background` / `--color-foreground`: Automatically calculated base canvas colors.
- `--color-surface`: Card/panel backgrounds.
- `--color-border`: Border colors.
- `--color-success` / `--color-warning` / `--color-error` / `--color-info`: Consistent status indicators.

---

## 5. Layout Modes & Templates

Specialized styling rules load automatically depending on document attributes:

- **Prose Mode** (`.prose`): Restricts reading width to an optimal measure ($\approx 65\text{ch}$) to prevent eye strain.
- **Dark Mode**: Evaluated via system settings (`prefers-color-scheme`) or overridden with the `.theme-dark` class.
- **E-Ink Mode** (`.standard-eink`): Strips out all transforms, blurs, and animations, switching colors to pure high-contrast black and white to prevent ghosting on e-readers.

---

## Integration

In your main SCSS stylesheet or Astro entry point:

```scss
// Load standard variables and layouts
@use "@stnd/styles/standard.scss";
```

> Most apps never need this — the Gold Standard `@stnd/modules/styles` module injects the stylesheet automatically. Import it manually only when composing your own SCSS entry point.

### Style Files Anatomy
- `standard.scss`: Framework index.
- `_standard-01-token.scss`: Variable dictionary.
- `_standard-02-color.scss`: Color space equations.
- `_standard-03-typography.scss`: Typography stacks.
- `_standard-06-prose.scss`: Prose limits and vertical alignments.
- `_standard-11-forms.scss`: Field components.
- `_standard-32-eink.scss`: High-contrast rules.

---

## Notes / Observations

*(jot down anything noticed here — quirks, gotchas, ideas)*

### Audit log (2026-07-14 → ongoing)

File-by-file pass, adding WHY-comments and checking for cascade/scope bugs. Fixed vs. flagged-only noted per item.

**Fixed:**
- **`$stnd-scope: ":root, body"` silently blocked frontmatter overrides.**
  A token declared on both `:root` and `body` always resolves to `body`'s   own copy for anything read by a non-inherited property at-or-below   `<body>` (its own `max-width`/`padding`) — inheritance never kicks in   because `body` already has an explicit declaration. Any `:root`-only   override (exactly what a note's frontmatter `inlineStyle` produces) was   silently ineffective for `--body-max-width`, `--line-width`,   `--gap-body`/`--gap-header`/`--gap-footer`. Root cause fixed at the   scope itself (`$stnd-scope` → `:root`-only) rather than patched   per-token. Caught via a live production repro on francisfontaine.com.
- **`$stnd-scope` vs `$stnd-theme-scope`** — two SCSS variables, always set
  to the identical selector in every build config (`:root` on web,   `body.stnd-theme` in Obsidian) since the fix above. Pure redundancy —   consolidated to one (`$stnd-theme-scope`, the more widely-used name).
- **`$elements-boxed`** (`_standard-00-variables.scss`) — defined, never
  consumed anywhere. Deleted.
- **Duplicate `--ease-aggressive`** — identical value declared twice in
  `_standard-01-token.scss`. Deleted the redundant copy.
- **`$mobile` docblock drift** — comment claimed `480px`, actual value is
  `600px` (confirmed correct). Comment fixed to match code.
- **`obsidian.scss` docblock drift** — claimed tokens live "inside :root";
  actually scoped to `body.stnd-theme` (deliberately, for namespacing in   Obsidian's shared window). Comment corrected.
- **`body`'s own dead `--max-width` fallback** (`_standard-07-base.scss`)
  — `max-width: var(--body-max-width, var(--max-width))`, left over from   *my own* `--max-width` removal earlier this session (missed this one   file at the time). `--body-max-width` always has a value, so the   fallback never fired — harmless, but stale. Now matches `.prose`'s   equivalent rule (`var(--body-max-width)`, no fallback).
- **Garbled leftover comment** (`_standard-07-base.scss`) — a `[id]`
  block's comment repeated the same incomplete CSS fragment   (`background: var(--color-surface-highest);`) four times, pure noise.   Replaced with an actual explanation of what `scroll-margin-top` there   is for (keeps anchor-linked headings clear of the sticky header).
- **`.negate-body-padding*` docblock described a nonexistent API**
  (`_standard-07-base.scss`) — those three class names, and the usage   example, don't match the real implementation (`.no-body-margin`, and   far more restrictive: only `<footer>`/`<header>` that are direct   children of `<body>` and first/last-of-type). Neither name is used   anywhere in `apps/` today, so nothing broke in practice, but the docs   would have misled whoever reached for it next. Rewrote to match reality.
- **Duplicate identical `font-family` on `select`** (`_standard-11-forms.scss`)
  — same line twice, zero behavior difference either way. Removed one.
- **Stale file reference** (`_standard-12-code.scss`) — comment pointed to
  `standard-98-utilities.scss`, which doesn't exist; real file is   `_standard-50-utilities.scss`. Corrected.
- **`.bg-surface` defined three times, identically** (`_standard-50-utilities.scss`) — same declaration, zero behavior difference. Consolidated to one; verified the computed color is unchanged.

**Fixed — round 2 (2026-07-14, same day, follow-up pass on everything round 1 had flagged):**
Every flagged item below got fixed except three, which are real judgment calls and stayed open on purpose (see the next section). Grouped by file:
- `_standard-01-token.scss`: `--z-launher` → `--z-launcher` (typo fixed; still unused, but spelled correctly).
- `_standard-02-color.scss`: dark-mode purple/pink/brown now reassign to their `--color-dark-*` counterparts (in both the `prefers-color-scheme: dark` block and the `[data-color-mode="dark"]` blocks); added the missing Stage 8 non-OKLCH fallback hex for all three; deleted the dead `0 solid transparent` `--border` line (kept `none` — see deferred items, the *value* wasn't touched); collapsed `--shadow`'s duplicated `--shadow-ambient` layer to one.
- `_standard-03-typography.scss`: `grid-line-height` mixin now reads `var(--font-header-line-height, ...)` instead of ignoring the token outright — headings actually respond to the frontmatter token now; deleted the dead hardcoded second `.font-interface` block.
- `_standard-04-grid.scss`: deleted the dead `--grid-gap` copy of `.grid.compact`/`.relaxed`; replaced every `[class^="grid-"]`/`[class|="grid"]` attribute selector with an explicit, order-independent `$grid-selectors` list (confirmed fix against real markup: `apps/stnd.build/modules/core/routes/index.astro`'s `class="cover grid-12"`).
- `_standard-06-prose.scss`: `.mycelial-graft` now uses real tokens (`--color-muted`, `--color-accent`, `--color-surface-high`); deleted the stale `h1:first-child` comment.
- `_standard-07-base.scss`: mobile header padding-negation now sets `margin-block-start` (matching the desktop rule and the footer's symmetric block), not `margin-block-end`.
- `_standard-08-media.scss`: deleted the dead `--gap-body` padding line on `.image-zoom-overlay`; hardcoded `768px` → `#{$small}`.
- `_standard-09-lists.scss` / `_standard-50-utilities.scss`: removed all 5 dead `--base-gap` lines; `.display-flex` → `.flex` (the real class).
- `_standard-10-tables.scss`: `min-height: var(--line-height)` (invalid, unitless) → `min-height: calc(1em * var(--line-height-compact))`.
- `_standard-11-forms.scss`: `--color-on-cce` typo → `--color-on-accent`; deleted the flat `background` override that was silently killing "THE FILL MAGIC" slider gradient (confirmed live: `Slider.astro` sets `--slider-value` via JS), added a `50%` fallback to both gradient stops.
- `_standard-13-components.scss`: deleted the pointless `@each $type` badge loop (zero effect on output); `--alert-border-color` → `--color-alert`.
- `_standard-14-analog.scss`: hardcoded `z-index: 9999` → `var(--z-image-zoom)`.
- `_standard-30-contrast.scss` / `_standard-32-eink.scss`: added `html::after` to both grain-hiding selector lists (the overlay actually lives there, not on `body::before/after`).
- `_standard-31-print.scss`: dead `--body-padding` → real `--gap-body`/`--gap-header`/`--gap-footer` overrides.
- `_standard-32-eink.scss`: added the missing `@use "standard-00-variables" as *;`; `.card, .button, .image` → `.card, :where(button), a.btn, img` (real selectors); `--text-accent` → `--color-accent`.
- `_standard-50-utilities.scss`: `.line-s`/`.line-l`/`.columns-auto` → `--line-width-sm`/`--line-width-lg`; `.purple`/`.pink`/`.bg-purple`/`.bg-pink` → their real distinct tokens (no longer both rendering as magenta); `@supports not (display: grid)` fallback → `var(--gap)`; deleted the dead `[class|="columns"].compact`/`.relaxed` pair; removed dead `--color-msg` lines from all 4 alert variants.
- `_standard-99-debug.scss`: `--gap-grid` (undefined) → `var(--gap)` everywhere (the debug overlay's own column math now actually works); `--z-tooltip` (undefined) → hardcoded `10000` matching the file's own baseline.

All 17 files verified via a running dev server (both `stnd.gd` and `stnd.build`): zero compile errors, pixel-identical baseline screenshots, plus targeted computed-style spot-checks on the trickiest fixes (purple/pink/brown dark-mode switching, the grid attribute-selector fix against real production markup, the slider gradient rendering, `--font-header-line-height` genuinely driving heading line-height).

**Flagged — deliberately left as judgment calls, not bugs to silently fix:**
- **`--border` currently resolves to `none` sitewide** (`_standard-02-color.scss`) — affects cards, buttons, inputs, tables. The dead duplicate declaration is gone, but the final value was left alone: making it visible would be a real, sitewide visual design change (dozens of components), not a bug fix.
- **`.rhythm`'s base 1x-spacing rule has no `>` combinator; every other rule in the same block does** (`_standard-05-rhythm.scss`) — applies at any nesting depth instead of direct children only. Left alone: adding `>` risks a real regression on nested content (e.g. a paragraph inside a `.callout` inside `.rhythm`) that's impossible to fully rule out without a visual pass over every place `.rhythm` is used.
- **`.compact`/`.relaxed` are unnamespaced and collide across `_standard-09-lists.scss` and `_standard-50-utilities.scss`** — resolving this properly means renaming part of the framework's public class API, which is an architectural decision, not a mechanical fix.

**Documented, not a bug:**
- The `generate-scale` mixin's `"trim"`/`"leading"` scale keys (feeding `.mt-trim`, `.p-leading`, etc.) use `--size-2xs`/`--size-xs` — not the real `--trim`/`--leading` rhythm tokens that happen to share the same words. `.mt-trim` does not use `--trim`. A naming collision worth knowing about, not something to change.

**Where the mechanism is real but the hook is currently unused:**
- `--corner` (theme override for `--radius`) — documented, no theme sets
  it yet. Not dead, just unclaimed.

### How to keep this going

Batches (see `packages/styles/*.scss`, foundation → layout → elements → components → modes → utilities): work through in dependency order, add WHY-comments for anything non-obvious, append findings above as they surface. Ask before silently fixing anything with real blast radius; docblock drift / dead code / pure redundancy are safe to just fix inline.

**Gotcha for whoever writes the comments**: Sass block comments (`/* */`) are interpolation-aware — `#{$i}` (or any `#{...}`) written literally inside a comment, describing a `@for` loop's output, gets evaluated as real Sass and breaks the build with "Undefined variable" if that variable isn't in scope at the comment's location. Learned this the hard way auditing `_standard-04-grid.scss` (2026-07-14) — write `.grid-N`, not `.grid-#{$i}`, when a comment needs to describe generated class names.

## Todo

- [x] **CSS framework audit / cleanup** *(completed 2026-07-14 — all 8 batches, foundation through utilities/debug, plus a same-day round-2 fix pass — see Audit log above. ~15 items fixed inline during the audit itself, then ~33 more of the ~36 flagged findings fixed in round 2 (undefined/typo'd custom properties, dead code, the grid attribute-selector footgun, several "duplicate declaration silently kills the first" cases). 3 left as deliberate judgment calls (`--border`'s value, `.rhythm`'s missing `>` combinator, `.compact`/`.relaxed` naming collision) — real behavior/API changes, not obviously safe to auto-fix. Every edit verified against a running dev server on both `stnd.gd` and `stnd.build`; nothing here changed the site's actual rendered output except the two root-cause bugs fixed early on (the `:root, body` scope bug and its `--max-width` cleanup) and the intentional restorations listed above (e.g. `--font-header-line-height` and the slider gradient now actually work).)*
- [ ] Feeds into the future theme creation/editing UX (see `@stnd/themes` Todo) — that UX will need to expose these tokens live. [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]

---

## 🔗 Liens & Normes

Ce paquet de styles implémente la charte visuelle et les tokens de l’écosystème Standard. Pour plus de détails sur les spécifications graphiques et de code, consultez :
- **Architecture Système** : [4.1 Architecture](../../apps/stnd.build/modules/manual/content/4-system/4.1-architecture.md)
- **Principes de Code** : [4.2 Code Standards](../../apps/stnd.build/modules/manual/content/4-system/4.2-code-standards.md)
- **Normes de Documentation** : [4.9 Normes README](../../apps/stnd.build/modules/manual/content/4-system/4.9-readme-standard.md)
- **Le Standard** : [packages/README.md](../README.md)
- **Charte Graphique** : [3.1 Color System](../../apps/stnd.build/modules/manual/content/3-graphics/3.1-color-system.md) et [3.2 Typography](../../apps/stnd.build/modules/manual/content/3-graphics/3.2-typography-and-typefaces.md)
