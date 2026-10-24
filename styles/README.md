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

> **Status: draft — a playground.** Nothing here is implemented yet. This note is where we settle *roles*, *names* and *architecture* first; the code (`_standard-01-token.scss`, `_standard-02-color.scss`, the themes) follows once we are satisfied. Evidence for what follows: [`AUDIT-COLORS.md`](./AUDIT-COLORS.md) (what exists, who reads it, what is missing). Companion to the token reference (generated from the code, so it cannot drift): that page says **what each token is and its value**; this chapter says **which token to reach for, and when**.

### 1. Principles

1. **Industry standards first.** A name is not a matter of taste: where an established system already names the role (Apple, Atlassian, GitHub Primer, IBM Carbon, Material, shadcn/ui, CSS itself), we use that word. We invent only where none exists, and say so (roles §11).
2. **Name by role, never by value or by scheme.** A component asks for "the raised surface", not "a lighter background" and not "the dark-mode grey". (Apple, Material and Radix all do this; none of them lets the light/dark scheme leak into a name a component uses.)
3. **One job per token.** If two tokens are used for the same thing, one of them is wrong.
4. **Seeds in, roles out.** A theme supplies a handful of seeds. Every role is a deterministic function of those seeds (the Material 3 model), so a new theme cannot "forget" a role.
5. **Components never read seeds.** Only the semantic layer reads the scheme-specific seeds; everything downstream is scheme-blind and flips for free.
6. **A role is only real if it is testable.** Each role below carries a conformance check (roles §8). A role we cannot check is a wish.
7. **Never repurpose a role.** Apple's rule, stated with its own examples: don't use the separator colour as text, or secondary label as a background. A token used outside its job is a bug in the usage, and a sign the right token is missing (roles §10).

### 2. The four layers

| Layer | Who writes it | Who reads it | Example |
|---|---|---|---|
| **Seeds** | a theme (`tokens.yaml`) | the palette layer only | `--color-light-background`, `--color-dark-foreground` |
| **Palette** | the framework (formulas) | the semantic layer only | `--color-dark-border`, `--color-light-muted` |
| **Roles** | the framework (scheme switch) | components, apps, users | `--color-background`, `--color-surface`, `--color-muted` |
| **Component aliases** | a component or an app | itself | `--canvas`, `--pane-edge` |

Today the seed and palette layers share the `--color-light-*` / `--color-dark-*` names with the role layer's polarity aliases (see roles §7.1). The guide treats that as the main thing to fix.

#### 2.1 Overriding a role on a subtree

CSS custom properties that reference another custom property are resolved **where they are declared**, not where they are read:

- **Root-level resolution**: `--color-ring` is declared on `:root` as `oklch(from var(--color-accent) …)`. A child subtree that overrides `--color-accent` alone still inherits `:root`'s already-resolved `--color-ring`.
- **Container re-declaration**: A `[data-theme]` container works because the framework re-declares all derived roles (`--color-ring`, `--color-link`, `--border-accent`) on that selector. Any local subtree override must likewise re-declare the derived roles it depends on (for example, `apps/reveal/modules/develop/DevelopPanel.svelte` sets a local `--color-accent` per tonal zone and re-declares `--color-ring`).
- **Rule of thumb**: Read `var(--color-accent)` directly when a component must reflect local subtree overrides; read a derived role when `:root`'s value is intended.

### 3. Role catalogue (proposed)

Current name → proposed name where they differ. **Bold = new role.**

#### 3.1 Ground and surfaces

The surfaces form a *ladder relative to the ground*. Direction is fixed by meaning, not by lightness: **raised** is toward the viewer, **sunken** is away from it.

| Role | Current | Job |
|---|---|---|
| `--color-background` | same | **The ground.** The main field of the app or page. Sidebars, rails and content all sit on it. |
| `--color-surface-sunken` | `surface-dark-1` | Inputs, wells, code blocks, table stripes, switch tracks. |
| `--color-surface-raised` | `surface` = `surface-light-1` | Cards, panes, panels: anything that sits on the ground. `--color-surface` stays as the short alias. |
| `--color-surface-overlay` | `surface-light-2/3` | Menus, popovers, dialogs, tooltips: anything that floats over a surface. |
| **`--color-stage`** | none (Reveal improvises `--canvas`) | The backdrop behind media (photos, video, a canvas). Neutral, darker than the ground in both schemes, so the picture carries the contrast, not the chrome. (AppKit has this exact role: `underPageBackgroundColor`, "the background behind a document's content".) |
| `--color-glass` | same | Translucent chrome over moving content. |

#### 3.2 Content (text and icons)

| Role | Current | Job |
|---|---|---|
| `--color-foreground` | same | Primary text. |
| `--color-muted` | same | Secondary text, captions. |
| `--color-subtle` | same | Tertiary text, placeholders, decorative icons. |
| **`--color-disabled`** | none | Quaternary level: disabled controls (Apple's `quaternaryLabel`, `disabledControlTextColor`). |
| **`--color-placeholder`** | `subtle` (overloaded) | Placeholder text in fields. Apple keeps it separate from tertiary text; today `subtle` also does decorative icons. |
| `--color-header` | same | Headings, when a theme wants them to differ. |

#### 3.3 Borders

Two weights, as in Carbon (`$border-subtle-01` / `$border-strong-01`, the strong one documented as a 3:1 non-text contrast border) and Primer (`borderColor-muted` / `-default` / `-emphasis`). The word is `border`: it is the industry's, and the CSS property's.

| Role | Current | Job |
|---|---|---|
| `--color-border` | same | Hairlines: separators, card and pane outlines. Decorative, not a boundary a user must see. |
| `--color-border-strong` | — | **Not adopted** (2026-10-07). Carbon's strong border exists for WCAG 3:1; Apple has none: macOS draws a field with its separator, the foreground at 9.8 %, which is our `--color-border`. The `contrast` theme is where a heavier border belongs. |
| `--color-highlight` | same | **Specular** top light on raised things (`--shadow-raised`). Not an outline colour. |
| `--color-shadow` | same | Shadow seed. |

> `--pane-edge` (the ring around panes and the window) should be built on `--color-border`, not on `--color-highlight`: highlight is derived from the *foreground*, so its brightness depends on the text colour rather than on the surface it is drawn on. See 7.3.

#### 3.4 Interaction

All three are translucent overlays on whatever surface they sit on, so they work on every level of the ladder without being recomputed.

| Role | Job |
|---|---|
| **`--color-hover`** | Row, button or item under the pointer. |
| **`--color-active`** | Pressed (`:active`). |
| **`--color-selected`** | Selected row or current item. (Today `.item` uses `surface-dark-1/2` for these, which couples interaction to the surface ladder.) |
| **`--color-selected-inactive`** | The same selection when the window or pane is not focused. macOS dims it (`unemphasizedSelectedContentBackgroundColor`); a desktop app should too. |
| **`--color-ring`** | Keyboard focus indicator (shadcn/ui's `--ring`) (`keyboardFocusIndicatorColor`). Defaults to `accent`, but is its own role so it can be thickened for increased contrast. |
| **`--color-stripe`** | Alternating row or column background (`alternatingContentBackgroundColors`). A hair above or below `background`; not `sunken`. |

#### 3.5 Accent, links, status

| Role | Job |
|---|---|
| `--color-accent` | The single brand/interactive colour. |
| `--color-on-accent` | Text drawn on an accent fill. |
| `--color-link` | Links (defaults to blue). |
| `--color-success` `--color-warning` `--color-error` `--color-info` | Status. Each should get an `on-` partner when used as a fill. |
| `--color-success-background` `-border` (and the same for `warning`, `error`, `info`) | The tinted fill and edge of an alert, badge or highlighted row: the status colour at 12 % and 30 %. Text and icon stay the full status colour. Named with the CSS property, as Atlassian (`color.background.danger`) does, because `muted` here is a text level and Primer's `bgColor-danger-muted` would collide with it. Added from `apps/avelo-stat`, which had fifteen hand-written `rgba(...)` for this. |
| `--color-red` … `--color-brown` | The hue palette. Not roles: use them through the status or accent roles when meaning exists. |

### 4. "I am building…" — which token?

| Building | Use |
|---|---|
| App window, page | `background` |
| Sidebar that belongs to the app | `background`, separated by `border` |
| Sidebar that should read as recessed (Claude's look) | `surface-sunken` |
| Floating pane (inspector, side panel, app sidebar) | `.pane`: `surface` + `--shadow` + `--pane-edge`, inset by `--window-inset`, radius `--pane-radius`; its rows are `.item` (`hover`, `selected`), its hairlines `.divider` (`_standard-15-application.scss`) |
| Card, grouped list | `surface` |
| Menu, popover, dialog | `surface-overlay` |
| Text field, code block, well | `surface-sunken`, `border` |
| Photo or video backdrop | `stage` |
| Divider, outline of a card | `border` |
| Hovered / selected row | `hover` / `selected` |
| Placeholder, helper text | `subtle` |
| Disabled label | `disabled` |
| A control, or a whole zone, that cannot act | the platform state, never a class of yours: `disabled`, `<fieldset disabled>`, `inert` (dimmed to `--opacity-disabled` by the framework) |
| Focus ring | `accent` |
| Primary button | `accent` fill, `on-accent` text |

### 5. Elevation in light and dark

**Decided (2026-10-07): the shadow carries the elevation.** Elevation is a pair, a surface and its shadow:

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
- **Why we do not force distinct light-mode colors:** Tinting 24 theme grounds just to make room for white cards would alter every light theme's character, and compressing the steps into `~0.014 L` increments falls below human perceptual thresholds.
- **Studio preview:** The Studio's *Elevation* mockup displays all four levels of the active theme and indicates whenever a level relies on shadow to separate from the rung below.

### 6. Case study — Reveal

Reveal made `--color-background` darker so photos would contrast with the chrome. That put two jobs on one token: the *ground* (where sidebars sit) and the *stage* (behind a picture). Every other app wants a normal ground, so Reveal's theme choice leaked into shared themes.

Resolution: the macOS theme keeps an ordinary ground; Reveal's `--canvas` becomes the **`stage`** role, derived darker than the ground. Same effect in the app, no distortion in the theme.

**Calibration data.** Claude desktop, dark, measured from a screenshot (hex are approximate):

| Region | Hex | OKLCH L | Step |
|---|---|---|---|
| Sidebar | `#111111` | 0.178 | |
| Panels, bubbles | `#1a1a1a` | 0.218 | +0.040 |
| Content | `#222222` | 0.252 | +0.034 |
| Hairline | `#2a2a2a` | 0.285 | +0.033 |

Our formula's ±0.03 step is already in the right range; the gap is the missing `sunken`/`stage` levels below the ground.

### 7. Known problems in the current tokens

> **Update 2026-10-07:** the scheme switch described in 7.1 is gone from the code: each role is one `light-dark()` declaration and `color-scheme` picks the scheme (see `AUDIT-COLORS.md`, Progress). The naming problems in 7.1, 7.2 and 7.3 are still open.

#### 7.1 "light" and "dark" mean three things

| Where | Meaning |
|---|---|
| `--color-light-background`, `--color-dark-border` | the **scheme** (seed / palette layer) |
| `--color-light`, `--color-dark` | the **polarity** of the active scheme: lighter / darker end |
| `--color-surface-light-1` | a **direction**: lighter than the background |

Proposed: schemes keep the `light-` / `dark-` prefix but only in the seed and palette layers; polarity becomes `--color-pole-high` / `--color-pole-low` (or similar); direction disappears into the role names of 3.1.

#### 7.2 Surface hierarchy collapses in light schemes (resolved by design: roles §5)

`surface-light-N = min(1, L + 0.03·N)`. With a ground at L = 0.982 all three steps clamp to 1, so a card, a menu and a dialog are the same colour in every light theme.

#### 7.3 Two tokens that look like borders but are not

- `--color-dark-border` is derived from the *background* at 25 % opacity — it is a shadow tone, not a light edge. The macOS theme overrides it with `rgba(255,255,255,.12)`.
- `--color-highlight` is derived from the *foreground* (dark: 11 % opacity), so its brightness follows the text colour. Right for a specular highlight, wrong for a pane outline.

#### 7.4 One border weight, no interactive states, no stage

See 3.3, 3.4 and 3.1.

### 8. Conformance checks (to be written as tests)

Run against every theme, in both schemes:

1. **Ladder is monotonic:** `sunken`, `background`, `surface`, `surface-overlay` differ by at least 0.02 L, in the right direction.
2. **Text contrast:** `foreground` ≥ 7:1 and `muted` ≥ 4.5:1 on `background`, `surface` and `overlay`.
3. **Border:** the foreground at about 10 % (macOS `separatorColor` is 9.8 %). No contrast target: subtlety is the point, and the `contrast` theme covers WCAG.
4. **Stage is neutral:** chroma of `stage` ≈ 0 and its L is below `background`'s.
5. **Interaction overlays** stay legible on every rung: `selected` text contrast ≥ 4.5:1.
6. **Four variants, not two:** every role resolves in light, dark, and increased-contrast for each (Apple asks for all four, even for an app that ships one appearance). The framework already has `_standard-30-contrast.scss`; the checks above must pass on all four.
7. **No scheme names in consumers:** no component reads a `--color-light-*` or `--color-dark-*` token.

### 9. Open questions

1. **Names — resolved by the industry (roles §11):** named levels, the Atlassian ladder `sunken` / default / `raised` / `overlay`. A numeric ladder (Radix) only for raw neutrals.
2. **Light elevation — resolved (2026-10-07):** the shadow carries it (roles §5).
3. **`border` vs `edge` — resolved:** `border`. No standard system uses `edge` (roles §11).
4. **Polarity names:** `pole-high/low`, `on-ground/…`, or drop them (are they used)?
5. **DTCG:** should `tokens.yaml` become (or export to) the W3C Design Tokens JSON format so Figma and other tools can consume it?
6. **Scope of `stage`:** neutral in both schemes, or tinted by the theme?
7. **System colours at runtime — resolved (2026-10-07):** see roles §10.4; WebKit accepts most of them and they equal AppKit's. (Original question:) could the macOS theme *resolve* the system's colours instead of copying hex values? Apple warns that documented values "may fluctuate from release to release". WebKit exposes `-apple-system-*` colour keywords (control background, separator, label, …) — not documented by Apple; to verify inside Reveal's webview before relying on it. If it works, the macOS theme becomes a mapping (roles §10.2), not a palette.
8. **Increased contrast:** where does that variant live (a fourth seed set per theme, or a formula that stretches the ladder and edges)?
9. **Wide colour:** our OKLCH formulas can leave sRGB. Apple asks to test both sRGB and P3 and to avoid gradients that clip; do we gamut-map explicitly?
10. **Fills — resolved (2026-10-07):** yes: `--color-fill` and four more, with the values macOS returns (9.8 / 7.8 / 4.7 / 2.7 / 0.8 %, roles §10.5), named by shape size as AppKit documents. `hover` is the secondary fill and `active` the primary one; `selected` is Apple's unemphasized selection. (iOS's heavier 20 / 16 / 12 / 8 % were tried first and dropped.) `selected-inactive` has no reader and is not defined.
11. **Glass thickness.** One level today (`regular`). Add `thin` and `thick`, with Apple's words?
12. **Migration:** every old name stays as an alias for one release so themes, Obsidian and standard.garden keep working while we rename.

### 10. What Apple's guidelines add

Source: the HIG *Color* page (revision of 16 December 2025), as exported to PDF by Francis.

#### 10.1 Rules worth adopting

- **Don't redefine a role** — separator-as-text, secondary-label-as-background are the examples. `--color-highlight` used as an outline is the same mistake (AppKit calls `highlightColor` "the virtual light source onscreen" and `shadowColor` "the virtual shadow cast by a raised object": two *lighting* seeds, not edges).
- **Don't use one colour for two meanings** (e.g. the brand colour for both interactive and non-interactive text).
- **Don't hard-code system values.** They "may fluctuate from release to release".
- **Light, dark and increased contrast, for every colour.**
- **Never rely on colour alone** for state or meaning.

#### 10.2 Our roles against AppKit

| Our role (draft) | AppKit | Apple's description |
|---|---|---|
| `background` | `windowBackgroundColor` | The background of a window. |
| `surface` | `controlBackgroundColor` | The background of a large interface element, such as a browser or table. |
| `stage` | `underPageBackgroundColor` | The background behind a document's content. |
| `surface-sunken` | `textBackgroundColor` | The background behind text. |
| `stripe` | `alternatingContentBackgroundColors` | Backgrounds of alternating rows or columns. |
| `foreground` `muted` `subtle` `disabled` | `labelColor` … `quaternaryLabelColor`, `disabledControlTextColor` | Four label levels, plus unavailable control text. |
| `placeholder` | `placeholderTextColor` | A placeholder string in a control or text view. |
| `border` | `separatorColor` | A separator between different sections of content. (iOS also has an opaque variant; no web standard has one, so we do not add it.) |
| `selected` / `selected-inactive` | `selectedContentBackgroundColor` / `unemphasizedSelectedContentBackgroundColor` | Selected content in a key / non-key window. |
| `ring` | `keyboardFocusIndicatorColor` | The ring around the focused control during keyboard navigation. |
| `accent` | `controlAccentColor` | The accent the person picked in System Settings. |
| `highlight` / `shadow` | `highlightColor` / `shadowColor` | Virtual light and virtual shadow. |
| `link` | `linkColor` | A link to other content. |

#### 10.3 What it changes in the draft

- **The ladder is containment depth, not just elevation.** iOS names its backgrounds *primary* (the overall view), *secondary* (grouping inside it) and *tertiary* (grouping inside a secondary). So `surface` means "one level in", and the ladder should keep going when panes nest inside panes. Two sets exist — *system* and *grouped* — with the same three ranks: a hint for roles §5 that a ground can be chosen per context.
- **Naming precedent.** Apple uses ordinal words for hierarchy (primary / secondary / tertiary, four label levels) and numerals only for the raw neutral ramp (`systemGray` … `systemGray6`). A reasonable answer to question 1: ordinal or named roles; a numbered ramp only for raw neutrals.
- **`subtle` is overloaded.** Apple separates tertiary label, quaternary label, placeholder and disabled text. We fold all four into `subtle` and one missing level.
- **Selection has two states** (key and non-key window). Reveal has several panels in one window, so `selected-inactive` is not hypothetical.
- **Accent can belong to the user.** On macOS 11+ the system accent replaces an app's accent unless it is "multicolor". A macOS-flavoured theme should defer to it rather than fix `#007aff`.
- **Liquid Glass has no colour of its own**; it takes the colour of what is behind it. `--color-glass` should therefore stay a tint-free translucent seed, not a theme colour.

#### 10.4 Direction & Implementation

- **Native `macos` theme resolution (reworked 2026-10-07):**
  - **Accepted WebKit keywords:** WKWebView resolves `-apple-system-control-background`, label hierarchy keywords, `separator`, `control-accent`, unemphasized selection, and eight system hues directly from AppKit (`roles §10.5`), following `color-scheme` per element.
  - **Palette fallbacks:** Rejected or missing keywords (`window-background`, `under-page-background`, `cyan`, link, and the surface ladder) remain backed by the OKLCH palette and are verified by `tests/styles/webkit.test.mjs`.
- **Calibrated `claude` theme (completed 2026-10-07):**
  - **Dark mode (measured from desktop app):** Content ground at `L = 0.252` (`#222222`), sunken sidebar/stage at `L = 0.178` (`#111111`), foreground at `L = 0.90` (`#ececec`), preserving the terracotta accent.
  - **Light mode:** Warm parchment ground at `L = 0.982` (`#faf9f5`).

#### 10.5 macOS ground truth (read from the system)

`packages/themes/macos/system-colors.json` holds the values macOS itself returns for its dynamic colours, in both appearances, produced by `_scripts/dump-system-colors.swift` (macOS 27.0.0 on 2026-10-07). Apple warns they "may fluctuate from release to release", hence the recorded version. The values that settled decisions:

| System colour | Light | Dark | What it settled |
|---|---|---|---|
| `separatorColor` | black 9.8 % | white 9.8 % | `--color-border` (10 % light) is exactly Apple's; no strong border |
| `placeholderTextColor` | black 49.8 % | white 54.9 % | placeholder is the **secondary-label** weight, not 25 % |
| `disabledControlTextColor` | black 24.7 % | white 24.7 % | the tertiary-label weight; not defined, the framework dims with `opacity` |
| `systemFill` … `quinarySystemFill` | 9.8 / 7.8 / 4.7 / 2.7 / 0.8 % | same, in white | the fill ladder (iOS's 20 / 16 / 12 / 8 % are 2 to 3 times heavier) |
| `unemphasizedSelectedContentBackgroundColor` | 220 grey | 70 grey | selected = foreground at 14 % / 18 % |
| `selectedContentBackgroundColor` | 0 100 225 | 0 89 209 | emphasized selection is a solid, slightly deeper accent |
| `keyboardFocusIndicatorColor` | 0 103 244 at 49.8 % | 26 169 255 at 49.8 % | the ring is the accent at half opacity, not 3:1 |
| `underPageBackgroundColor` | 246 | 40 | see `stage`, roles §11 |
| `windowBackgroundColor` = `controlBackgroundColor` = `textBackgroundColor` | 255 | 30 | one ground; macOS raises by fills and materials, not by a lighter colour |
| `controlColor` | 255 | white 24.7 % | a control's face is translucent in dark |
| `linkColor` | 0 104 218 | 65 156 255 | the link is the accent adjusted for its ground (darker in light, lighter in dark) |
| `labelColor` / secondary / tertiary / quaternary | 84.7 / 49.8 / 25.9 / 9.8 % | 84.7 / 54.9 / 24.7 / 9.8 % | our `muted` (60 %) and `subtle` (40 %) are heavier than Apple's 50 % and 26 % |

**Our departures from it, on purpose:** `hover` (macOS has none), `stage` (darker than Apple's under-page), `muted` and `subtle` (kept for the 214 places that read them).

### 11. Naming against the industry

Checked on 2026-10-07 against each system's own documentation. Apple's column comes from the HIG *Color* page (revision of 16 December 2025, read in full); the others from their public docs. Where several systems agree, that is the name; where none does, we say what we invented and why.

| Role | **Apple** (AppKit / UIKit) | Atlassian | Primer | Carbon | shadcn/ui | Decision |
|---|---|---|---|---|---|---|
| Ground | `windowBackgroundColor` / `systemBackground` | default surface | `bgColor-default` | `$background` | `background` | `--color-background` |
| Recessed | `textBackgroundColor`, `underPageBackgroundColor` / — | `sunken` | `bgColor-inset` | — | — | `--color-surface-sunken` |
| Raised | `controlBackgroundColor` / `secondarySystemBackground` | `raised` | — | `$layer-01` | `card` | `--color-surface-raised` (alias `--color-surface`) |
| Floating | no colour: a **material** (Liquid Glass, or standard `ultraThin` / `thin` / `regular` / `thick`); iOS `tertiarySystemBackground` is nesting | `overlay` | — | — (`$layer-02` is nesting) | `popover` | `--color-surface-overlay`, and `--color-glass` for the translucent case (see below) |
| Border | `separatorColor`, `gridColor` / `separator`, `opaqueSeparator` | — | `borderColor-default` / `-muted` / `-emphasis` | `$border-subtle-01` / `$border-strong-01` | `border` | `--color-border`, `--color-border-strong` |
| Text levels | `labelColor` … `quaternaryLabelColor` | — | `fgColor-default` / `-muted` | `$text-primary` / `$text-secondary` | `foreground` / `muted-foreground` | `--color-foreground`, `muted`, `subtle` (see below) |
| Placeholder | `placeholderTextColor` | — | — | `$text-placeholder` | — | `--color-placeholder` |
| Disabled text | `disabledControlTextColor` | — | — | `$text-disabled` | — | `--color-disabled` |
| Selected | `selectedContentBackgroundColor`, `unemphasizedSelectedContentBackgroundColor` | — | — | `$layer-selected-01` | — | `--color-selected`, `--color-selected-inactive` |
| Focus | `keyboardFocusIndicatorColor` | — | — | `$focus` | `ring` | `--color-ring` |
| Accent | `controlAccentColor` | — | — | `$interactive` | — | `--color-accent` |
| Link | `linkColor` | — | — | `$link-primary` | — | `--color-link` |
| Virtual light / shadow | `highlightColor` / `shadowColor` | `elevation.shadow` | — | — | — | `--color-highlight` / `--color-shadow` |
| Hover, active | (system controls draw their own) | — | — | `$layer-hover-01`, `$layer-active-01` | — | `--color-hover`, `--color-active` (CSS `:hover`, `:active`) |
| Modal scrim | a "dark dimming layer of 35 % opacity" behind clear glass over bright content | `blanket` | — | `$overlay` ("background overlay") | — | `--color-scrim`, starting at black 35 % |
| Status | none: system hues only (`systemRed`…) | — | `danger` (as a modifier) | `$support-error` / `-success` / `-warning` | — | `--color-error`, `success`, `warning`, plus `-background` / `-border` tints |

*An empty cell means I could not confirm the name in that system's documentation today, not that the system lacks it. Atlassian's token pages are rendered client-side and could not be read; its row is limited to what its published Elevation page states.*

**Where Apple's word wins (we adopt it):** `placeholder`, `disabled`, `selected`, `accent`, `link`, `highlight`, `shadow`. Our existing names already match Apple on four of them.

**Where Apple differs from the web, and why we keep the web's word:**
- *Border.* Apple says **separator**: a divider *between sections of content*. Our role also covers the outline of a card and of a field, which Apple leaves to the controls themselves. Three of the four web systems checked say `border` (Primer, Carbon, shadcn/ui), and it is the CSS property. We keep `border`, and the macOS theme maps `border` to `separatorColor`.
- *Text levels.* Apple (and Carbon) rank them: label, secondary, tertiary, quaternary. shadcn and Primer say `muted`. That is a genuine split, not a majority. We keep `muted` and `subtle` because nothing is gained by migrating 214 reads, and map them to secondary and tertiary on macOS.
- *Floating surfaces.* Apple does not use a colour for them; it uses translucent materials. Our `overlay` is the web's answer (Atlassian, shadcn). The HIG *Materials* page would settle how the macOS theme should render it; not read yet.

**What Apple's *Materials* page settles (read in full).**
- Apple does not colour its floating layer; it uses **materials**. Liquid Glass is for controls and navigation (sidebars, tab bars) that float above the content layer, in a *regular* variant (more blur, for sidebars, alerts and popovers with a lot of text) and a *clear* variant (for components over media such as photos and videos). The four standard materials (`ultraThin`, `thin`, `regular`, `thick`) are for the content layer. Choose by **semantic meaning, not by the colour it happens to give**, which is our own role principle.
- So the web has two floating cases, and they need two tokens: `--color-surface-overlay` for a solid floating surface (menu, dialog), and `--color-glass` with `--filter-glass` for the translucent one. What we call `glass` today (background at 80 % alpha, blur 20 px) is one thickness, Apple's `regular`. If we ever need more, the words are already the standard's: `thin`, `regular`, `thick`.
- Reveal sits exactly in Apple's "clear over media" case (controls over photos). Apple's guidance there: add a dark dimming layer of **35 %** when the content behind is bright. That is where the `--color-scrim` default comes from.
- Text on a material uses dedicated **vibrant** colours, not the plain label colours. For the web: text on `glass` should have its own role if contrast on translucent surfaces proves a problem.
- Apple's vibrancy has three families: **labels** (`label`, `secondary`, `tertiary`, `quaternary`), **fills** (`fill`, `secondaryFill`, `tertiaryFill`) and **one** separator. Levels are named by *relative contrast* (default is highest, quaternary lowest; avoid quaternary on thin materials). This is Apple's side of the `muted` / `subtle` split. The fills are a role we do not have: see open question 10.

**Why numeric surface steps (`surface-light-3`, `surface-dark-2/3`) are being retired:**
- No industry design system extends elevation beyond four named levels (`sunken` / `background` / `raised` / `overlay`).
- The 15 places in the codebase that previously read numeric steps were actually styling three distinct roles:
  1. **Interactive states** (`--color-hover`, `--color-active`, `--color-selected`)
  2. **Control tracks** (Apple's `--color-fill` ladder)
  3. **Media backdrop** (`--color-stage` in Reveal)
- Replacing numeric lightness offsets with dedicated semantic roles also fixes light-mode hover states (where `background + 0.09` previously clamped to invisible white).

**The hue set.** Apple's system colours are red, orange, yellow, green, mint, teal, cyan, blue, indigo, purple, pink, brown (plus a grey ramp). We have ten: all of them except mint, teal and indigo, plus `magenta`, which Apple does not list (it is in CSS and ANSI). So `pink` and `brown` are standard names, and the audit's suggestion to drop them was wrong; they stay as optional hues.

**Invented, no industry equivalent:**
- `--color-stage` (backdrop behind media). The nearest precedent is AppKit's `underPageBackgroundColor`, "the background behind a document's content" — but its *values* differ from ours: read from the system, it is 246 against a 255 window in light, and 40 against 30 in **dark, so lighter than the window** (roles §10.5). That is a desk behind a page. Our `stage` is deliberately darker, 0.09 in lightness, because a photograph is better judged on a dark neutral. Kept, flagged as a Standard word.
- `--color-stripe`. AppKit has `alternatingContentBackgroundColors`; the web has no token for it.

**To reconcile:** `--pane-edge` (added 2026-10-07 for the pane and window outline) uses the word `edge`, which no standard does. The industry word for a hairline ring is `ring` (shadcn/ui), and the framework already has `--shadow-ring`. Fold it into that one before it spreads.

**Not adopted:** `edge` (nobody uses it), an opaque border (Apple iOS only), `pressed` (CSS says `active`), `border-strong` (WCAG-driven; Apple has none).

**A note on `surface`.** Material and Atlassian use *surface* for the ground itself; we use `background` for that (as shadcn, Primer, Carbon and Apple do) and `surface-*` for the levels above and below it. The prefix keeps the family together; the alias `--color-surface` stays because 95 places read it.

### 12. Apple Layout and Typography: facts recorded for the next chantiers

Not applied, colour is the scope. Read in full on 2026-10-07 (HIG *Layout*, revision 9 September 2026; *Typography*, revision 16 December 2025). What matters for the framework:

**Already in line with Apple.**
- macOS default text size is **13 pt**, minimum **10 pt**. The macOS theme and Reveal use 13 px.
- macOS **Body** is 13 / 16 (leading ratio about 1.23). Reveal pins `--line-height: 1.25`.
- The system serif is **New York** and the monospace is SF Mono; the macOS theme already names both.
- "Restrict the width of text for optimal readability": the framework's `--prose-width` and `--font-line-width`.
- "Avoid light font weights; prefer Regular, Medium, Semibold or Bold".
- "Minimize the number of typefaces".

**Where Apple differs.**
- The macOS text styles are a hand-tuned ladder, not a modular scale: Large Title 26/32, Title 1 22/26, Title 2 17/22, Title 3 15/20, Headline 13/16 (bold), Body 13/16, Callout 12/15, Subheadline 11/14, Footnote 10/13, Caption 1 and 2 10/13. Our `--font-ratio: 1.333` is a modular scale. No colour impact; a typography decision for later.
- Apple publishes **tracking per point size**: SF Pro is -6/1000 em at 13 pt, 0 at 12 pt, +6 at 11 pt, -26 at 17 pt, and back to +8 at 26 pt. The macOS theme applies a flat `-0.015 em` to headings, which sits inside that range around 17-22 pt and outside it above.
- macOS does **not** support Dynamic Type; the other platforms do. Reveal's own text-size preference (`--font-text-size`) is the equivalent, and Apple's rule applies to it: when the text size grows, keep the hierarchy, and do not grow everything (tab titles should not).
- Apple names the system's fonts by role (`controlContentFont`, `labelFont`, `menuFont`, `titleBarFont`, `toolTipsFont`, `userFixedPitchFont`…): the type counterpart of the colour roles.

**Layout principles that bear on the tokens.**
- Group by whitespace, container shapes or separator lines; align and indent to show hierarchy.
- Differentiate controls from content with a material, **not a solid or semi-opaque background colour beneath controls**. Worth checking against Reveal's solid `.pane`.
- Size classes are two, *compact* and *regular*, per axis, and layout follows available space, not device or orientation. The web's equivalent is container and media queries, not user-agent sniffing.
- Respect safe areas; keep controls and critical information off the bottom edge of a macOS window.
- The numeric layout values on that page (tvOS 60/80 pt margins, visionOS grid and spacing) do not apply to a web or macOS framework.

### 13. References

- Apple — HIG *Materials*, *Layout* and *Typography* (read in full for sections 11 and 12).
- Atlassian — [Elevation](https://atlassian.design/foundations/elevation): four levels, Sunken, Default, Raised, Overlay, as `elevation.surface.*`.
- shadcn/ui — [Theming](https://ui-v4.shadcn.com/docs/theming): `background`, `card`, `popover`, `muted`, `border`, `input`, `ring`.
- GitHub Primer — [Token names](https://primer.style/foundations/primitives/token-names): `bgColor-inset`, `bgColor-muted`, `borderColor-default` / `-muted`, `fgColor-muted`.
- IBM Carbon — [Color](https://carbondesignsystem.com/elements/color/overview/): role-based tokens `$layer-01`, `$border-subtle`, `$border-strong`, `$text-secondary`.
- Apple — [Human Interface Guidelines: Color](https://developer.apple.com/design/human-interface-guidelines/color) (revision 2025-12-16): background hierarchy, label hierarchy, macOS dynamic system colours, light / dark / increased-contrast rule. Read in full for roles §10.
- Material Design 3 — [`ColorScheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme): seed-derived roles, `surfaceContainer*` ladder, `outline` / `outlineVariant`, `on-*` pairs.
- Radix — [Understanding the scale](https://radix-ui.com/colors/docs/palette-composition/understanding-the-scale): twelve steps, each with one use (backgrounds, interactive states, borders, solids, text).
- W3C Design Tokens Community Group — [Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/): exchange format, aliases, primitive → semantic → component layering.


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
