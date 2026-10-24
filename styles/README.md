---
title: "@stnd/styles"
aliases: []
created: 2026-07-04 23:27
modified: 2026-10-21
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
theme: maker
type: package
visibility: public
garden-url: https://standard.garden/@francis/readme
garden-short: https://stnd.gd/Yl18ps
permalink: readme
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

## 6. Buttons & Cards

Both are read by their **elements**, not by extra classes.

### Buttons

A native `<button>` (or `a.btn`) is the primary action by default — no `.primary` class exists.

- **Variants**: `.accent` (tinted with the accent color), `.outline`, `.ghost`, `.link`, `.destructive`, `.icon` (`.badge.accent` follows the same naming).
- **Sizes**: `.small`, `.smaller`, `.large`.
- **Placement**: Buttons inside a card belong in its `<footer>` (or inside a `.btn-group`), never loose inside a card's body.

> [!warning] Renamed in October 2026
> `.secondary` became **`.accent`** (buttons and badges), and `.primary` was dropped. Migrating a site: replace `class="secondary"` with `class="accent"` on buttons and badges, and delete `primary` from button class lists. Nothing else changes.

### Cards

An `article.card` is composed of three optional structural regions:

```html
<article class="card">
  <header>
    <h3>Title</h3>
    <svg width="1cap" height="1cap">…</svg> <!-- optional icon, outside the heading -->
  </header>
  <div>
    <p>The body keeps its own vertical rhythm.</p>
  </div>
  <footer class="flex-right">
    <a href="#">Read more</a>
    <a href="#" class="btn">Continue</a>
  </footer>
</article>
```

- **`<header>`**: Holds the heading and an optional sibling icon aligned to the far end on the title's first baseline (`width="1cap" height="1cap"`).
- **`<div>` (Body)**: Holds explanatory prose with its own vertical rhythm (never place body copy inside `<header>`).
- **`<footer>`**: Holds card actions aligned with `.flex-right` or `.flex-left`.

---

## Roles: which token to reach for

> **Companion to the generated token reference** ([`/manual/css/color`](../../apps/stnd.build/modules/manual/content/standard/color.md)): the CSS reference documents **what each token is and its computed value** directly from the SCSS source; this section defines **which semantic role to reach for, and when**.

### 1. Principles

1. **Industry standards first.** A name is not a matter of taste: where an established system already names the role (Apple, Atlassian, GitHub Primer, IBM Carbon, Material, shadcn/ui, CSS itself), we use that word.
2. **Name by role, never by value or by scheme.** A component asks for "the raised surface", not "a lighter background" and not "the dark-mode grey".
3. **One job per token.** If two tokens are used for the same thing, one of them is wrong.
4. **Seeds in, roles out.** A theme supplies a handful of seeds. Every role is a deterministic function of those seeds, so a new theme cannot omit a role.
5. **Components never read seeds.** Only the semantic layer reads the scheme-specific seeds; everything downstream is scheme-blind and flips automatically via `light-dark()`.
6. **A role is only real if it is testable.** Each role carries an automated conformance check (`tests/styles/`).
7. **Never repurpose a role.** Do not use the separator color as text, or a secondary label as a background.

### 2. The four layers

| Layer | Who writes it | Who reads it | Example |
|---|---|---|---|
| **Seeds** | a theme (`tokens.yaml`) | the palette layer only | `--color-light-background`, `--color-dark-foreground` |
| **Palette** | the framework (formulas) | the semantic layer only | `--color-dark-border`, `--color-light-muted` |
| **Roles** | the framework (`light-dark()`) | components, apps, users | `--color-background`, `--color-surface`, `--color-muted` |
| **Component aliases** | a component or an app | itself | `--canvas`, `--pane-edge` |

#### 2.1 Overriding a role on a subtree

CSS custom properties that reference another custom property are resolved **where they are declared**, not where they are read:

- **Root-level resolution**: `--color-ring` is declared on `:root` as `oklch(from var(--color-accent) …)`. A child subtree that overrides `--color-accent` alone still inherits `:root`'s already-resolved `--color-ring`.
- **Container re-declaration**: A `[data-theme]` container works because the framework re-declares all derived roles (`--color-ring`, `--color-link`, `--border-accent`) on that selector. Any local subtree override must likewise re-declare the derived roles it depends on (for example, `apps/reveal/modules/develop/DevelopPanel.svelte` sets a local `--color-accent` per tonal zone and re-declares `--color-ring`).
- **Rule of thumb**: Read `var(--color-accent)` directly when a component must reflect local subtree overrides; read a derived role when `:root`'s value is intended.

### 3. Role catalogue

#### 3.1 Ground and surfaces

The surfaces form a *ladder relative to the ground*. Direction is fixed by meaning, not by lightness: **raised** is toward the viewer, **sunken** is away from it.

| Role | Job |
|---|---|
| `--color-background` | **The ground.** The main field of the app or page. Sidebars, rails, and content all sit on it. |
| `--color-surface-sunken` | Inputs, wells, code blocks, table stripes, switch tracks. |
| `--color-surface-raised` | Cards, panes, panels: anything that sits on the ground (`--color-surface` is the short alias). |
| `--color-surface-overlay` | Menus, popovers, dialogs, tooltips: anything that floats over a surface. |
| `--color-stage` | Neutral backdrop behind media (photos, video, canvas), darker than the ground in both schemes so the picture carries the contrast. |
| `--color-glass` | Translucent chrome over moving content. |

#### 3.2 Content (text and icons)

| Role | Job |
|---|---|
| `--color-foreground` | Primary text. |
| `--color-muted` | Secondary text, captions. |
| `--color-subtle` | Tertiary text, decorative icons. |
| `--color-placeholder` | Placeholder text in form fields. |
| `--color-header` | Headings, when a theme customizes heading color. |

#### 3.3 Borders & lighting

| Role | Job |
|---|---|
| `--color-border` | Hairlines: separators, card and pane outlines (`~10%` foreground mix, matching macOS `separatorColor`). |
| `--color-highlight` | **Specular** top light on raised elements (`--shadow-raised`). Not an outline color. |
| `--color-shadow` | Shadow seed. |

#### 3.4 Interaction

Translucent overlays that work on every rung of the surface ladder without recomputation:

| Role | Job |
|---|---|
| `--color-hover` | Row, button, or item under the pointer. |
| `--color-active` | Pressed state (`:active`). |
| `--color-selected` | Selected row or active item. |
| `--color-ring` | Keyboard focus indicator (defaults to `accent`). |
| `--color-stripe` | Alternating row or column background. |

#### 3.5 Accent, links, status

| Role | Job |
|---|---|
| `--color-accent` | Single brand/interactive color. |
| `--color-on-accent` | Text drawn on an accent fill. |
| `--color-link` | Hyperlinks (defaults to blue). |
| `--color-success`, `--color-warning`, `--color-error`, `--color-info` | Semantic status colors. |
| `--color-<status>-background`, `--color-<status>-border` | Tinted fill (`12%`) and border (`30%`) for alerts, badges, and highlighted rows. |
| `--color-red` … `--color-brown` | Raw hue palette (prefer semantic status or accent roles when meaning exists). |

### 4. "I am building…" — which token?

| Building | Use |
|---|---|
| App window, page | `background` |
| Sidebar that belongs to the app | `background`, separated by `border` |
| Recessed sidebar (Claude desktop style) | `surface-sunken` |
| Floating pane (inspector, side panel, app sidebar) | `.pane`: `surface` + `--shadow` + `--pane-edge`, inset by `--window-inset`, radius `--pane-radius`; rows use `.item` (`hover`, `selected`), hairlines use `.divider` |
| Card, grouped list | `surface` |
| Menu, popover, dialog | `surface-overlay` |
| Text field, code block, well | `surface-sunken`, `border` |
| Photo or video backdrop | `stage` |
| Divider, outline of a card | `border` |
| Hovered / selected row | `hover` / `selected` |
| Placeholder, helper text | `placeholder` / `subtle` |
| Disabled control or zone | Native platform state (`disabled`, `<fieldset disabled>`, `inert`), dimmed automatically to `--opacity-disabled` |
| Focus ring | `ring` / `accent` |
| Primary button | `accent` fill, `on-accent` text |

### 5. Elevation in light and dark

Elevation pairs a **surface** with its **shadow**:

| Level | Surface | Shadow |
|---|---|---|
| Sunken | `--color-surface-sunken` | `--shadow-inset` |
| Ground | `--color-background` | none |
| Raised | `--color-surface-raised` | `--shadow-raised` |
| Overlay | `--color-surface-overlay` | `--shadow-overlay` (alias of `--shadow-lg`) |

- **Dark schemes:** A higher level is also *lighter* (Material 3, Atlassian), because shadows are hard to see on dark backgrounds. The lightness step does the primary work and the shadow reinforces it.
- **Light schemes:** A color cannot go lighter than white. Light grounds sit at `L >= 0.97` in 24 of the 28 themes, so `raised` and `overlay` often share white (17 themes) or sit one small step apart (6 themes).
  - **The invariant:** Ground, raised, and overlay must differ in **color OR shadow** ("no two neighboring levels look identical").
  - **Verification:** Enforced across all themes and schemes by `tests/styles/elevation.test.mjs` (`calm`, flat by design, is the sole named exception).
- **Studio preview:** The Studio's *Elevation* mockup displays all four levels of the active theme and indicates whenever a level relies on shadow to separate from the rung below.

### 6. Conformance checks (`tests/styles/`)

Executed automatically against every theme in both light and dark schemes:

1. **Monotonic ladder:** `sunken <= background <= surface <= overlay` (`tests/styles/conformance.test.mjs`).
2. **Neighbor separation:** Adjacent elevation levels differ in color or shadow (`tests/styles/elevation.test.mjs`).
3. **Text contrast:** `foreground >= 7:1` on `background` across all themes.
4. **Achromatic stage:** `stage` chroma is `~0` and its lightness sits at or below `background`.
5. **Single disabled dimming:** Disabled controls and zones dim once via `--opacity-disabled` (`tests/styles/disabled.test.mjs`).
6. **Zero scheme leakage:** No consumer component reads `--color-light-*` or `--color-dark-*` seed tokens directly.
7. **WebKit dynamic system colors:** Verified against AppKit ground truth in `tests/styles/webkit.test.mjs`.

### 7. Industry Cross-Reference

| Role | Apple (AppKit / UIKit) | Atlassian | Primer | Carbon | shadcn/ui | Standard Token |
|---|---|---|---|---|---|---|
| Ground | `windowBackgroundColor` / `systemBackground` | default surface | `bgColor-default` | `$background` | `background` | `--color-background` |
| Recessed | `textBackgroundColor` | `sunken` | `bgColor-inset` | — | — | `--color-surface-sunken` |
| Raised | `controlBackgroundColor` / `secondarySystemBackground` | `raised` | — | `$layer-01` | `card` | `--color-surface-raised` (`--color-surface`) |
| Floating | Material (`Liquid Glass` / `regular`) | `overlay` | — | `$layer-02` | `popover` | `--color-surface-overlay` / `--color-glass` |
| Border | `separatorColor` | — | `borderColor-default` | `$border-subtle-01` | `border` | `--color-border` |
| Text levels | `labelColor` … `tertiaryLabelColor` | — | `fgColor-default` / `-muted` | `$text-primary` / `-secondary` | `foreground` / `muted-foreground` | `--color-foreground`, `--color-muted`, `--color-subtle` |
| Placeholder | `placeholderTextColor` | — | — | `$text-placeholder` | — | `--color-placeholder` |
| Selected | `unemphasizedSelectedContentBackgroundColor` | — | — | `$layer-selected-01` | — | `--color-selected` |
| Focus | `keyboardFocusIndicatorColor` | — | — | `$focus` | `ring` | `--color-ring` |
| Accent | `controlAccentColor` | — | — | `$interactive` | — | `--color-accent` |
| Link | `linkColor` | — | — | `$link-primary` | — | `--color-link` |
| Hover / Active | `secondarySystemFill` / `systemFill` | — | — | `$layer-hover-01` / `-active-01` | — | `--color-hover`, `--color-active` |

### 8. References

- **Apple** — [Human Interface Guidelines: Color](https://developer.apple.com/design/human-interface-guidelines/color), *Materials*, *Layout*, and *Typography*.
- **Atlassian** — [Elevation](https://atlassian.design/foundations/elevation) (`sunken`, `default`, `raised`, `overlay`).
- **shadcn/ui** — [Theming](https://ui-v4.shadcn.com/docs/theming) (`background`, `card`, `popover`, `muted`, `border`, `ring`).
- **GitHub Primer** — [Token names](https://primer.style/foundations/primitives/token-names).
- **IBM Carbon** — [Color](https://carbondesignsystem.com/elements/color/overview/).
- **Material Design 3** — [`ColorScheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme).
- **Radix** — [Understanding the scale](https://radix-ui.com/colors/docs/palette-composition/understanding-the-scale).
- **W3C Design Tokens Community Group** — [Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/).

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
- `_standard-01-token.scss`: Variable dictionary, base modular scales, and window/application tokens.
- `_standard-02-color.scss`: Color space equations.
- `_standard-03-typography.scss`: Typography stacks.
- `_standard-06-prose.scss`: Prose limits and vertical alignments.
- `_standard-11-forms.scss`: Field components.
- `_standard-32-eink.scss`: High-contrast rules.

---

## Notes / Observations

### Audit log (2026-07-14 → ongoing)

File-by-file pass, adding WHY-comments and checking for cascade/scope bugs. Fixed vs. flagged-only noted per item.

**Fixed:**
- **`$stnd-scope: ":root, body"` scope collision**: Declaring tokens on both `:root` and `body` caused `body`'s explicit copy to shadow `:root`-only frontmatter `inlineStyle` overrides (`--body-max-width`, `--line-width`, `--gap-*`). Resolved by scoping `$stnd-theme-scope` to `:root` on web and `body.stnd-adapter` in Obsidian.
- **`$stnd-scope` vs `$stnd-theme-scope`**: Consolidated redundant scope variables into `$stnd-theme-scope`.
- **`$elements-boxed`** (`_standard-00-variables.scss`): Removed unused variable.
- **Duplicate `--ease-aggressive`**: Removed duplicate declaration in `_standard-01-token.scss`.
- **Docblock drift**: Synced `$mobile` (`600px`), `obsidian.scss` (`body.stnd-adapter`), `.no-body-margin` (`_standard-07-base.scss`), and `_standard-50-utilities.scss` comments with actual code.
- **Redundant declarations**: Removed dead `--max-width` fallback (`_standard-07-base.scss`), duplicate `select` font-family (`_standard-11-forms.scss`), and duplicate `.bg-surface` definitions (`_standard-50-utilities.scss`).

**Fixed — round 2 (2026-07-14):**
- `_standard-01-token.scss`: `--z-launher` → `--z-launcher`.
- `_standard-02-color.scss`: Dark-mode purple/pink/brown now reassign to `--color-dark-*` counterparts with Stage 8 hex fallbacks; collapsed duplicate `--shadow-ambient` layer.
- `_standard-03-typography.scss`: `grid-line-height` mixin now reads `var(--font-header-line-height, ...)`; removed duplicate `.font-interface` block.
- `_standard-04-grid.scss`: Replaced `[class^="grid-"]`/`[class|="grid"]` attribute selectors with explicit order-independent `$grid-selectors` list.
- `_standard-06-prose.scss`: `.mycelial-graft` migrated to semantic tokens (`--color-muted`, `--color-accent`, `--color-surface-light-1`).
- `_standard-07-base.scss`: Mobile header padding-negation aligned to `margin-block-start`.
- `_standard-08-media.scss`: Removed dead `--gap-body` padding on `.image-zoom-overlay`; replaced hardcoded `768px` with `#{$small}`.
- `_standard-09-lists.scss` / `_standard-50-utilities.scss`: Removed dead `--base-gap` lines; `.display-flex` → `.flex`.
- `_standard-10-tables.scss`: `min-height: var(--line-height)` → `min-height: calc(1em * var(--line-height-compact))`.
- `_standard-11-forms.scss`: `--color-on-cce` → `--color-on-accent`; restored `--slider-value` fill gradient with `50%` fallback.
- `_standard-13-components.scss`: Removed no-op `@each $type` badge loop; `--alert-border-color` → `--color-alert`.
- `_standard-14-analog.scss`: Hardcoded `z-index: 9999` → `var(--z-image-zoom)`.
- `_standard-30-contrast.scss` / `_standard-32-eink.scss`: Added `html::after` to grain-hiding selectors; synced E-Ink selectors and `@use` imports.
- `_standard-31-print.scss`: Replaced `--body-padding` with `--gap-body`/`--gap-header`/`--gap-footer`.
- `_standard-50-utilities.scss`: Fixed `.line-s`/`.line-l` token references, separated `.purple` and `.pink` tokens, and cleaned up alert/column rules.
- `_standard-99-debug.scss`: Replaced undefined `--gap-grid` with `var(--gap)`.

**Flagged — deliberate architectural judgment calls:**
- **`--border` resolves to `none` sitewide** (`_standard-02-color.scss`): Changing the default affects cards, buttons, inputs, and tables across all themes.
- **`.rhythm` base 1x-spacing rule has no `>` combinator** (`_standard-05-rhythm.scss`): Applies to nested descendants; adding `>` requires a visual audit of nested callouts.
- **`.compact` / `.relaxed` namespace overlap** (`_standard-09-lists.scss` and `_standard-50-utilities.scss`): Renaming requires a public class API change.

**Resolved:**
- The `generate-scale` mixin's `"trim"` and `"leading"` scale keys (`.mt-trim`, `.mb-leading`, etc.) connect directly to `var(--trim)` and `var(--leading)`, filtering out invalid `padding: auto` and `gap: auto` declarations.

> [!caution] Sass Block Comment Interpolation Gotcha
> Sass block comments (`/* */`) evaluate `#{...}` interpolation even inside comments. Writing `.grid-#{$i}` inside a comment outside the `@for` loop scope breaks compilation with `"Undefined variable"`. Always write `.grid-N` in documentation comments.

## Todo

- [x] **CSS framework audit / cleanup** *(completed 2026-07-14 — all 8 batches and round-2 fixes verified across `stnd.gd` and `stnd.build`; see Audit log above).*
- [ ] Feeds into the future theme creation/editing UX (see `@stnd/themes` Todo) — that UX will need to expose these tokens live. [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]

---

## Links & Standards

This stylesheet package implements the visual system and design tokens of the Standard ecosystem. For further details on visual and engineering specifications, see:
- **System Architecture**: [Framework Guide & Invariants](../../apps/stnd.build/modules/manual/content/system/framework-guide.md)
- **Engineering Philosophy**: [Engineering Philosophy](../../apps/stnd.build/modules/manual/content/philosophy/engineering-philosophy.md)
- **Package Ecosystem**: [packages/README.md](../README.md)
- **Visual System**: [Color System](../../apps/stnd.build/modules/manual/content/standard/color.md) and [Typography](../../apps/stnd.build/modules/manual/content/standard/typography.md)
