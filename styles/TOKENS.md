---
aliases: []
created: 2026-03-16 08:07
modified: 2026-09-16T18:33:41.605Z
mode: read
publish: true
tags: []
theme:
type: note
visibility: public
garden-url: https://standard.garden/@francis/tokens
permalink: tokens
garden-short: https://stnd.gd/jb29Tu
---

# Standard Design Tokens

> Canonical reference for all CSS custom properties exposed by `@stnd/styles`.
> Source files: `_standard-01-token.scss`, `_standard-02-color.scss`, `_standard-03-typography.scss`, `_standard-06-prose.scss`, `_standard-14-analog.scss`.

## Frontmatter Configuration

Standard Garden maps document-level frontmatter directly into CSS custom properties on the document root. The frontmatter key is the CSS property name without the `--` prefix.

For example, `foreground: "#1a1a1a"` becomes `--foreground: #1a1a1a`. See `packages/utils/theme-tokens.js` for the canonical token list.

---

## Ratios

| Token                 | Default | Description        |
| --------------------- | ------- | ------------------ |
| `--ratio-golden`      | `1.618` | Golden ratio (φ)   |
| `--ratio-silver`      | `1.414` | Silver ratio (√2)  |
| `--ratio-halfstep`    | `1.272` | Half-step ratio    |
| `--ratio-quarterstep` | `1.128` | Quarter-step ratio |
| `--ratio-eighthstep`  | `1.062` | Eighth-step ratio  |

## Base Measurements

| Token                | Default                               | Description                                |
| -------------------- | ------------------------------------- | ------------------------------------------ |
| `--font-size`        | `1rem`                                | Root font size                             |
| `--optical-ratio`    | `var(--ratio-silver)`                 | Ratio driving the modular scale            |
| `--line-height`      | `var(--optical-ratio)`                | Base line height                           |
| `--space`            | `1rlh`                                | Official rhythm unit                       |
| `--leading`          | `calc((line-height - 1) * font-size)` | Space between cap-height and next baseline |
| `--nl`               | `calc(leading * line-height)`         | Newline — full vertical unit               |
| `--trim`             | `calc(leading / 2)`                   | Half-leading trim                          |
| `--font-size-mobile` | `1.1rem`                              | Font size override on mobile               |

## Spacing Scale

Derived from `--baseline` (1rlh).

| Token                      | Value                    |
| -------------------------- | ------------------------ |
| `--space`                  | `var(--baseline)`        |
| `--space-1` … `--space-12` | `calc(var(--space) * N)` |
| `--space-d2`               | `calc(var(--space) / 2)` |
| `--space-d3`               | `calc(var(--space) / 3)` |
| `--space-d4`               | `calc(var(--space) / 4)` |

## Optical Harmony Scale

Powered by `pow(var(--optical-ratio), N)`.

| Token        | Exponent | Description            |
| ------------ | -------- | ---------------------- |
| `--scale-d5` | -2       | Smallest (floor: 9px)  |
| `--scale-d4` | -1.5     |                        |
| `--scale-d3` | -1       |                        |
| `--scale-d2` | -0.5     |                        |
| `--scale`    | 0        | Base (= `--font-size`) |
| `--scale-2`  | 1        |                        |
| `--scale-3`  | 2        |                        |
| `--scale-4`  | 3        |                        |
| `--scale-5`  | 4        |                        |
| `--scale-6`  | 5        |                        |
| `--scale-7`  | 6        |                        |
| `--scale-8`  | 7        | Largest                |

## Layout Widths

The page layout uses a two-tier containment model: `--page-max-width` defines the outer
viewport boundary for the page shell, header, and footer, while `--prose-width` defines the
optimal reading measure for readable text elements (60–75 characters). Breakout tracks
extend outwards from `--prose-width` in rhythm steps towards `--page-max-width`.

| Token              | Default   | Description                                                           |
| ------------------ | --------- | --------------------------------------------------------------------- |
| `--page-max-width` | `1400px`  | The whole page shell — header, footer, content, and breakout ceiling  |
| `--prose-width`    | `42rem`   | Active readable column measure (60–75 characters)                     |

## Line Heights

| Token                   | Default                | Description         |
| ----------------------- | ---------------------- | ------------------- |
| `--line-height`         | `var(--optical-ratio)` | Base line height    |
| `--line-height-compact` | `calc(1 + (lh-1)/2)`   | Tight line height   |
| `--line-height-relaxed` | `calc(1 + (lh-1)*1.5)` | Relaxed line height |

## Letter Spacing

| Token                | Default   | Description      |
| -------------------- | --------- | ---------------- |
| `--tracking-tight`   | `-0.01em` | Tight tracking   |
| `--tracking-neutral` | `0em`     | Neutral tracking |
| `--tracking-open`    | `0.01em`  | Open tracking    |

## Stroke, Radius & Interactive States

| Token               | Default                         | Description                              |
| ------------------- | ------------------------------- | ---------------------------------------- |
| `--stroke-width`    | `max(1px, 0.06rem)`             | Hairline stroke                          |
| `--stroke-width-lg` | `calc(var(--stroke-width) * 2)` | Heavy stroke                             |
| `--radius`          | `var(--leading)`                | Macro border radius (cards, panels)      |
| `--radius-sm`       | `var(--trim)`                   | Micro border radius (buttons, tags, inputs)|
| `--border`          | `var(--stroke-width) solid var(--color-border)` | Active border state      |
| `--shadow`          | Layered elevation               | Resting shadow                           |
| `--shadow-hover`    | Layered elevation + glow        | Active hover shadow                      |
| `--filter-blur`     | `blur(8px)`                     | Standard blur filter                     |

## Layout Padding & Vertical Rhythm

| Token                  | Default                       | Description                                                     |
| ---------------------- | ----------------------------- | --------------------------------------------------------------- |
| `--page-padding`       | `clamp(1rem, 3vw, 2.5rem)`    | Fluid horizontal page gutter (desktop and mobile)               |
| `--rhythm-block-scale` | `2`                           | Vertical rhythm multiplier for non-text block elements          |
| `--space`              | `1rlh`                        | Fundamental vertical rhythm unit                                |
| `--space-half`         | `calc(var(--space) / 2)`      | Half-step vertical rhythm unit                                  |
| `--gap`                | `calc(var(--space))`          | Rhythm layout gap                                               |
| `--gap-compact`        | `var(--trim)`                 | Compact micro-gap for inline groups and chips                   |
| `--gap-grid`           | `0.25lh`                      | Grid gutter                                                     |

## Z-Index

| Token            | Value  | Use case            |
| ---------------- | ------ | ------------------- |
| `--z-base`       | `1`    | Above flow          |
| `--z-dropdown`   | `1000` | Dropdowns, popovers |
| `--z-modal`      | `1060` | Modals, dialogs     |
| `--z-toast`      | `1090` | Toast notifications |
| `--z-image-zoom` | `9999` | Image lightbox      |

## Animation

| Token             | Default                        | Description           |
| ----------------- | ------------------------------ | --------------------- |
| `--duration-fast` | `0.2s`                         | Quick interactions    |
| `--duration`      | `0.5s`                         | Standard duration     |
| `--ease`          | `cubic-bezier(0.5, 0, 0.5, 1)` | Standard easing curve |
| `--transition`    | `var(--duration) var(--ease)`  | Shorthand transition  |

## Breakpoints

| Token                 | Default  | Description       |
| --------------------- | -------- | ----------------- |
| `--breakpoint-mobile` | `600px`  | Mobile breakpoint |
| `--breakpoint-sm`     | `768px`  | Small screen      |
| `--breakpoint-lg`     | `1024px` | Large screen      |
| `--breakpoint-wide`   | `1440px` | Wide screen       |

---

## Colors — OKLCH Spectrum

Generated from `--color-accent` seed via OKLCH hue rotation.

| Token              | Hue  | Description   |
| ------------------ | ---- | ------------- |
| `--pigment-red`    | 25°  | Error red     |
| `--pigment-yellow` | 85°  | Warning amber |
| `--pigment-green`  | 145° | Success green |
| `--pigment-cyan`   | 190° | Info cyan     |
| `--pigment-blue`   | 240° | Link blue     |
| `--pigment-purple` | 300° | Magic purple  |

Supporting tokens: `--dna-l`, `--dna-c`, `--dna-h`, `--safe-c`, `--safe-l`.

## Colors — Light Palette

| Token                      | Default                   | Description       |
| -------------------------- | ------------------------- | ----------------- |
| `--color-light-background` | `white`                   | Page background   |
| `--color-light-foreground` | `#262626`                 | Text color        |
| `--color-light-accent`     | `var(--color-foreground)` | Accent color      |
| `--color-light-red`        | `#b14c42`                 | Dusty red clay    |
| `--color-light-orange`     | `#d78a5a`                 | Trail-worn orange |
| `--color-light-yellow`     | `#c8a840`                 | Parchment mustard |
| `--color-light-green`      | `#5e9d80`                 | Sage green        |
| `--color-light-cyan`       | `#6ba4b6`                 | Glacier teal      |
| `--color-light-blue`       | `#4f81a4`                 | Faded blueprint   |
| `--color-light-magenta`    | `#7a6c91`                 | Dusk lavender     |
| `--color-light-link`       | `#4f81a4`                 | Link color        |

## Colors — Dark Palette (auto-generated)

Auto-derived from light palette via `color-mix(in oklch, light 80%, white)`.
Themes can override individual values.

| Token                     | Default                        | Description       |
| ------------------------- | ------------------------------ | ----------------- |
| `--color-dark-background` | `#0f0f0f`                      | Page background   |
| `--color-dark-foreground` | `#dbdbdb`                      | Text color        |
| `--color-dark-accent`     | `var(--color-light-accent)`    | Accent color      |
| `--color-dark-red`        | auto                           | Lightened red     |
| `--color-dark-orange`     | auto                           | Lightened orange  |
| `--color-dark-yellow`     | auto                           | Lightened yellow  |
| `--color-dark-green`      | auto                           | Lightened green   |
| `--color-dark-cyan`       | auto                           | Lightened cyan    |
| `--color-dark-blue`       | auto                           | Lightened blue    |
| `--color-dark-magenta`    | auto                           | Lightened magenta |
| `--color-dark-link`       | auto                           | Lightened link    |

## Colors — Auto-Accent

When a theme does not set an accent, Standard derives one from the foreground hue: a third of the
way around the colour wheel (triadic, +120°), a balanced contrast that stays natural. Set
`--color-light-accent` and `--color-dark-accent` to use your own.

| Token | Description |
| --- | --- |
| `--color-[light/dark]-accent-triadic` | The derived accent (+120° from the foreground hue). |

## Colors — Semantic

Active tokens that resolve to the light or dark palette. Each is declared **once**, as
`light-dark(<light seed>, <dark seed>)`, so which palette applies is decided by the element's
`color-scheme`: the system preference by default, or pinned with `[data-color-mode="light|dark"]`,
`.theme-light`, `.theme-dark`, or `.inverse` (the opposite of the surrounding scheme). A themed
container (`[data-theme]`) re-declares them, so it sees its own seeds. Requires `light-dark()`
(Chrome 123, Safari 17.5, Firefox 120); older browsers get the light scheme.

| Token                | Description                          |
| -------------------- | ------------------------------------ |
| `--color-background` | Page background                      |
| `--color-foreground` | Primary text                         |
| `--color-accent`     | Primary accent                       |
| `--color-header`     | Heading color (fallback: foreground) |
| `--color-red`        | Red hue                              |
| `--color-orange`     | Orange hue                           |
| `--color-yellow`     | Yellow hue                           |
| `--color-green`      | Green hue                            |
| `--color-cyan`       | Cyan hue                             |
| `--color-blue`       | Blue hue                             |
| `--color-magenta`    | Magenta hue                          |
| `--color-success`    | = `--color-green`                    |
| `--color-warning`    | = `--color-orange`                   |
| `--color-error`      | = `--color-red`                      |
| `--color-danger`     | = `--color-error`                    |
| `--color-destructive`| = `--color-error`                    |
| `--color-info`       | = `--color-blue`                     |
| `--color-link`       | Link color                           |
| `--color-italic`     | Italic text color                    |
| `--color-bold`       | Bold text color                      |
| `--color-on-accent`  | Text on accent background            |

## Colors — Computed

Computed once from the active seeds, at the role layer: there is no separate light and dark copy
of the formula. A theme that wants its own value for one scheme sets the matching **optional
override** (`--color-light-muted`, `--color-dark-border`, …); an unset override falls back to the
formula.

| Override (optional)                                   | Role it replaces        |
| ----------------------------------------------------- | ----------------------- |
| `--color-light-muted`, `--color-dark-muted`           | `--color-muted`         |
| `--color-light-subtle`, `--color-dark-subtle`         | `--color-subtle`        |
| `--color-light-border`, `--color-dark-border`         | `--color-border`        |
| `--color-light-shadow-base`, `--color-dark-shadow-base` | `--color-shadow`      |
| `--color-light-highlight`, `--color-dark-highlight`   | `--color-highlight`     |

A theme sets **seeds** (`--color-light-*`, `--color-dark-*`), never a role directly: a role set
directly has one value for both schemes.

| Token                  | Value                       | Description              |
| ---------------------- | --------------------------- | ------------------------ |
| `--color-muted`        | `foreground 60%`            | Muted text               |
| `--color-subtle`       | `foreground 40%`            | Subtle text / decoration |
| `--color-border`       | `foreground 10%`            | Default border           |
| `--color-surface-sunken` | `oklch(from bg max(0, calc(l - 0.03)) c h)` | Recessed: wells, code blocks, input fields |
| `--color-surface-raised` | `oklch(from bg min(1, calc(l + 0.03)) c h)` | Raised: cards, panes, panels |
| `--color-surface`        | `var(--color-surface-raised)` | Short alias of `raised`; a theme may override it |
| `--color-surface-overlay`| `oklch(from bg min(1, calc(l + 0.06)) c h)` | Floating: menus, popovers, dialogs |
| `--color-stage`          | `oklch(from bg max(0, calc(l - 0.09)) 0 h)` | Backdrop behind media (photos, video): neutral, darker than the ground in both schemes. Not an elevation level. Themes may set `--color-light-stage` / `--color-dark-stage`. |
| `--color-fill`           | foreground at 9.8 % | Thin shapes: a slider track (macOS `systemFill`) |
| `--color-fill-secondary` | foreground at 7.8 % | Small shapes: a progress bar's backing |
| `--color-fill-tertiary`  | foreground at 4.7 % | Medium shapes: a switch's backing |
| `--color-fill-quaternary`| foreground at 2.7 % | Large areas: a group box |
| `--color-fill-quinary`   | foreground at 0.8 % | Large areas needing subtle emphasis: form content |
| `--color-hover`          | `var(--color-fill-secondary)` | Pointer over an item (macOS has no hover colour; it borrows a fill) |
| `--color-active`         | `var(--color-fill)` | Pressed (`:active`) |
| `--color-selected`       | foreground at 14 % (light) / 18 % (dark) | Selected item (macOS `unemphasizedSelectedContentBackgroundColor`) |
| `--color-placeholder`    | foreground at 50 % (light) / 55 % (dark) | Placeholder text (macOS `placeholderTextColor`) |
| `--color-ring`           | accent at 50 % | Keyboard focus ring (macOS `keyboardFocusIndicatorColor`) |
| `--color-scrim`          | `rgb(0 0 0 / 0.35)` | Veil behind a modal surface (Apple's dimming layer) |
| `--color-surface-light-3`, `--color-surface-dark-2` | numeric steps | **Deprecated**: nothing reads them; the roles above replace their uses |
| `--color-surface-dark-3` | `oklch(from bg max(0, calc(l - 0.09)) c h)` | Numeric step -3; superseded by `--color-stage`, nothing reads it |
| `--color-surface-light-1`, `-light-2`, `-dark-1` | aliases | Legacy names of `raised`, `overlay`, `sunken`; kept until nothing reads them |
| `--color-light`          | light background                    | Pole light               |
| `--color-dark`           | light foreground                    | Pole dark                |
| `--color-shadow`         | `dark 5%` transparent               | Shadow color base        |

## Elevation: a surface and its shadow

| Level | Surface | Shadow |
| --- | --- | --- |
| Sunken | `--color-surface-sunken` | `--shadow-inset` |
| Ground | `--color-background` | none |
| Raised | `--color-surface-raised` | `--shadow-raised` |
| Overlay | `--color-surface-overlay` | `--shadow-overlay` (alias of `--shadow-lg`) |

A colour stops at white, so in a light scheme `raised` and `overlay` are often the same colour and
the shadow tells them apart. Dark schemes also lighten each level. Neighbouring levels must differ in
colour or in shadow (`tests/styles/elevation.test.mjs`).

## Surface levels
Named after Atlassian's elevation ladder (sunken, default, raised, overlay). Each level is the
background shifted in OKLCH lightness, so it follows any theme and both schemes.
- **Sunken** (`--color-surface-sunken`, -0.03): recessed areas, away from the viewer.
- **Raised** (`--color-surface-raised`, +0.03): anything that sits on the ground. `--color-surface` is its short alias.
- **Overlay** (`--color-surface-overlay`, +0.06): anything that floats over a surface.
- The old numeric steps (`-light-3`, `-dark-2`, `-dark-3`) were never elevation levels. They served hover and selection states, control tracks and Reveal's photo backdrop; `--color-hover` / `--color-selected`, the `--color-fill*` family and `--color-stage` replace them.

## Shadows (Layered System)

Composable shadow primitives. Combine freely with comma-separated values.

### Building Blocks

| Token              | Description                  |
| ------------------ | ---------------------------- |
| `--shadow-ambient` | Subtle ground-contact shadow |
| `--shadow-lift`    | Directional elevation shadow |
| `--shadow-glow`    | Accent-tinted halo           |
| `--shadow-inset`   | Pressed/recessed effect      |
| `--shadow-ring`    | Border-like inset ring       |

### Dimensional Scale

| Token         | Composition           | Description                     |
| ------------- | --------------------- | ------------------------------- |
| `--shadow-xs` | ambient               | Extra-small contact shadow      |
| `--shadow-sm` | 1px layered           | Small card/well shadow          |
| `--shadow-md` | lift                  | Medium elevation shadow         |
| `--shadow-lg` | ambient + lift        | Large dialog/card shadow        |
| `--shadow-xl` | ambient + lift + glow | High elevation with accent glow |

### Semantic Presets & Roles

| Token            | Composition           | Description                           |
| ---------------- | --------------------- | ------------------------------------- |
| `--shadow`       | raised (default)      | Default surface card shadow           |
| `--shadow-hover` | raised + lg           | Hover state elevation                 |

### Usage

```css
/* Use presets */
box-shadow: var(--shadow-lg);

/* Or compose custom combinations */
box-shadow: var(--shadow-ring), var(--shadow-lift);
box-shadow: var(--shadow-inset), var(--shadow-ambient);
```

## Borders

| Token                  | Value                             | Description                           |
| ---------------------- | --------------------------------- | ------------------------------------- |
| `--border`             | `stroke-width solid border-color` | Default border                        |
| `--border-transparent` | `stroke-width solid transparent`  | Transparent border (layout stability) |
| `--border-accent`      | `stroke-width solid accent 7%`    | Accent-tinted border                  |

## Tooltip

| Token                  | Default                         | Description        |
| ---------------------- | ------------------------------- | ------------------ |
| `--tooltip-background` | `var(--color-dark)`             | Tooltip background |
| `--tooltip-text`       | `var(--color-light)`            | Tooltip text       |
| `--tooltip-ease`       | `cubic-bezier(0.25, 1, 0.5, 1)` | Tooltip animation  |

---

## Typography — Font Stacks

| Token              | Default                      | Description      |
| ------------------ | ---------------------------- | ---------------- |
| `--font-sans`      | Instrument Sans, system-ui   | Sans-serif stack |
| `--font-serif`     | Newsreader, Instrument Serif | Serif stack      |
| `--font-monospace` | IBM Plex Mono, ui-monospace  | Monospace stack  |

## Typography — Semantic Roles

| Token              | Default            | Description |
| ------------------ | ------------------ | ----------- |
| `--font-text`      | `var(--font-sans)` | Body text   |
| `--font-header`    | `"Inter"` | Headings    |
| `--font-interface` | `var(--font-sans)` | UI elements |

## Typography — Weights

| Token                  | Default                     | Description    |
| ---------------------- | --------------------------- | -------------- |
| `--font-weight`        | `400`                       | Body weight    |
| `--font-weight-bold`   | `600`                       | Bold weight    |
| `--font-weight-header` | `700`                       | Heading weight |
| `--font-weight-h1`     | `var(--font-weight-header)` | H1 weight      |
| `--font-weight-h2`     | `max(header*0.85, body)`    | H2 weight      |
| `--font-weight-h3`     | `max(header*0.85, body)`    | H3 weight      |
| `--font-weight-h4`     | `var(--font-weight)`        | H4 weight      |
| `--font-weight-h5`     | `var(--font-weight)`        | H5 weight      |
| `--font-weight-h6`     | `var(--font-weight)`        | H6 weight      |

## Typography — OpenType Features

| Token                        | Default                          | Description              |
| ---------------------------- | -------------------------------- | ------------------------ |
| `--font-inter-feature`       | `"calt", "cv05", "cv11", "ss03"` | Inter-specific features  |
| `--font-instrument-feature`  | `"figa", "ss01", "ss02", "ss05"` | Instrument Sans features |
| `--font-feature`             | `""`                             | Body text features       |
| `--font-variation`           | `"wdth" 95`                      | Body text variation axes |
| `--font-header-feature`      | `""`                             | Header features          |
| `--font-header-variation`    | `""`                             | Header variation axes    |
| `--font-monospace-feature`   | `""`                             | Monospace features       |
| `--font-monospace-variation` | `""`                             | Monospace variation axes |
| `--font-interface-feature`   | `"dlig", "zero"`                 | Interface features       |
| `--font-interface-variation` | `""`                             | Interface variation axes |
| `--font-list-feature`        | `"dlig", "tnum", "zero"`         | List features            |
| `--font-list-variation`      | `""`                             | List variation axes      |

## Typography — Other

| Token                          | Default        | Description           |
| ------------------------------ | -------------- | --------------------- |
| `--font-letter-spacing`        | `normal`       | Body letter spacing   |
| `--font-header-letter-spacing` | `normal`       | Header letter spacing |
| `--font-header-line-height`    | `1`            | Header line height    |
| `--list-indent`                | `var(--space)` | List indentation      |

---

## Layout — Prose Grid

| Token                  | Default                                      | Description                 |
| ---------------------- | -------------------------------------------- | --------------------------- |
| `--prose-width`        | `42rem`                                      | Optimal reading line length |
| `--prose-inset`        | `max(calc(var(--space-2) - var(--space)), var(--space))` | Narrow elements margin inset |
| `--prose-wide`     | `minmax(0, var(--space))`                    | Wide breakout column track  |
| `--prose-full`   | `minmax(0, 1fr)`                             | Full page breakout track    |

## Analog (Noise Overlay)

| Token                     | Default      | Description     |
| ------------------------- | ------------ | --------------- |
| `--noise-overlay`         | SVG data URI | Noise texture   |
| `--noise-overlay-opacity` | `0.08`       | Overlay opacity |
| `--noise-overlay-blend`   | `multiply`   | Blend mode      |

---

## Forced Colors (High Contrast)

Under `@media (forced-colors: active)`:

| Token                | Maps to      |
| -------------------- | ------------ |
| `--color-background` | `Canvas`     |
| `--color-foreground` | `CanvasText` |
| `--color-accent`     | `Highlight`  |
| `--color-border`     | `CanvasText` |
| `--color-muted`      | `GrayText`   |
