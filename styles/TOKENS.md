---
aliases: []
created: 2026-03-16 08:07
modified: 2026-07-03 16:26
mode: read
publish: false
tags: []
theme: 
type: note
visibility: private
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

## T-Shirt Size Aliases

| Token         | Maps to      |
| ------------- | ------------ |
| `--size-3xs`  | `--scale-d5` |
| `--size-2xs`  | `--scale-d4` |
| `--size-xs`   | `--scale-d3` |
| `--size-sm`   | `--scale-d2` |
| `--size-base` | `--scale`    |
| `--size-lg`   | `--scale-2`  |
| `--size-xl`   | `--scale-3`  |
| `--size-2xl`  | `--scale-4`  |
| `--size-3xl`  | `--scale-5`  |
| `--size-4xl`  | `--scale-6`  |
| `--size-5xl`  | `--scale-7`  |
| `--size-6xl`  | `--scale-8`  |

## Layout Widths

Two independent scopes. `.prose`'s own box reads `--body-max-width`
directly, so `.hero`/`.full` breakout elements grow all the way to the page
shell. `.feature` and tables/`.editorial` don't reference either width
token — they break out by a fixed rhythm increment off `--line-width`
(`--space-2` / `--space-4` each side).

| Token               | Default                           | Description                                   |
| ------------------- | --------------------------------- | --------------------------------------------- |
| `--body-max-width`  | `900px`                           | The whole page shell — header, footer, content, and the ceiling `.hero`/`.full` grow into |
| `--line-width-xs`   | `24rem`                           | Extra small                                   |
| `--line-width-sm`   | `32rem`                           | Small                                         |
| `--line-width-md`   | `42rem`                           | Medium (default reading width)                |
| `--line-width-lg`   | `50rem`                           | Large                                         |
| `--line-width-xl`   | `60rem`                           | Extra large                                   |
| `--line-width-full` | `calc(100vw - space*2)`           | Full viewport minus gutters                   |
| `--line-width`      | `var(--measure, --line-width-md)` | Active line width (themeable via `--measure`) |

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

## Stroke & Radius

| Token               | Default                         | Description                              |
| ------------------- | ------------------------------- | ---------------------------------------- |
| `--stroke-width`    | `max(1px, 0.06rem)`             | Hairline stroke                          |
| `--stroke-width-lg` | `calc(stroke-width * 2)`        | Heavy stroke                             |
| `--radius`          | `var(--corner, var(--leading))` | Border radius (themeable via `--corner`) |
| `--filter-blur`     | `blur(8px)`                     | Standard blur filter                     |

## Gaps

| Token               | Default                               | Description           |
| ------------------- | ------------------------------------- | --------------------- |
| `--gap-body`        | `clamp(space, 0.5vi+0.5rlh, space-3)` | Body gutter           |
| `--gap-grid`        | `0.25lh`                              | Grid gutter           |
| `--gap-body-mobile` | `var(--space)`                        | Body gutter on mobile |
| `--gap-mobile`      | `1rlh`                                | General gap on mobile |

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
| `--color-dark-on-accent`  | `var(--color-dark-background)` | Text on accent    |

## Colors — Auto-Accent Strategies

Standard provides three automatic strategies to generate an accent color from your foreground text hue. By default, the system uses the `triadic` strategy for a balanced contrast. You can explicitly override `--color-[light/dark]-accent` in your theme using any of these strategies:

| Token | Description |
| --- | --- |
| `--color-[light/dark]-accent-complementary` | Opposite side of the color wheel (+180°). Provides maximum, aggressive contrast. |
| `--color-[light/dark]-accent-triadic` | A third of the way around (+120°). Balanced, strong but natural contrast (Default). |
| `--color-[light/dark]-accent-analogous` | Next to the seed color (+30°). Harmonious, subtle, camaïeu effect. |

## Colors — Semantic

Active tokens that resolve to light or dark palette.

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
| `--color-warning`    | = `--color-yellow`                   |
| `--color-error`      | = `--color-red`                      |
| `--color-info`       | = `--color-blue`                     |
| `--color-link`       | Link color                           |
| `--color-italic`     | Italic text color                    |
| `--color-bold`       | Bold text color                      |
| `--color-on-accent`  | Text on accent background            |

## Colors — Computed

| Token                  | Value                       | Description              |
| ---------------------- | --------------------------- | ------------------------ |
| `--color-muted`        | `foreground 60%`            | Muted text               |
| `--color-subtle`       | `foreground 40%`            | Subtle text / decoration |
| `--color-border`       | `foreground 10%`            | Default border           |
| `--color-surface-low`  | `foreground 3%` opaque      | Slight surface tint      |
| `--color-surface`      | `foreground 3%` opaque      | Secondary background     |
| `--color-surface-high` | `foreground 5%` transparent | Hover state              |
| `--color-darker`       | `dark 15%` transparent      | Shadow helper            |
| `--color-light`        | light background            | Pole light               |
| `--color-dark`         | light foreground            | Pole dark                |
| `--color-shadow`       | `dark 5%` transparent       | Shadow color base        |

## Surface Elevation

Progressive foreground tinting for depth. Pairs with shadow presets.

| Token                     | Tint            | Shadow        | Use case                |
| ------------------------- | --------------- | ------------- | ----------------------- |
| `--color-surface-lowest`  | 14% (background) | none          | Page background         |
| `--color-surface-low`     | 7%              | `--shadow`    | Cards, inputs           |
| `--color-surface`         | 3%              | `--shadow-lg` | Raised panels, popovers |
| `--color-surface-high`    | 7%              | `--shadow-xl` | Overlays, drawers       |
| `--color-surface-highest` | 14%             | `--shadow-xl` | Modals, toasts          |

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

### Composed Presets

| Token         | Composition           | Description                     |
| ------------- | --------------------- | ------------------------------- |
| `--shadow`    | ambient               | Default subtle shadow           |
| `--shadow-lg` | ambient + lift        | Medium elevation                |
| `--shadow-xl` | ambient + lift + glow | High elevation with accent glow |

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
| `--tooltip-background` | `#1a1a1a`                       | Tooltip background |
| `--tooltip-text`       | `#ffffff`                       | Tooltip text       |
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
| `--font-header-weight` | `700`                       | Heading weight |
| `--font-weight-h1`     | `var(--font-header-weight)` | H1 weight      |
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

| Token                       | Default                       | Description              |
| --------------------------- | ----------------------------- | ------------------------ |
| `--content-width`           | `min(--line-width, 100%)`     | Content column width     |
| `--content-width-sm`        | `max(space-2 - space, space)` | Sidebar margin inset     |
| `--content-width-editorial` | `minmax(0, --space-2)`        | Editorial column         |
| `--content-width-feature`   | `minmax(0, --space-4)`        | Feature column           |
| `--content-width-hero`      | `minmax(0, 1fr)`              | Hero (full bleed) column |

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
