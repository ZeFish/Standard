---
type: note
status: draft
publish: false
tags: [standard, design-tokens, guide]
---

# Standard Color & Surface Guide

> **Status: draft — a playground.** Nothing here is implemented yet. This note is where we
> settle *roles*, *names* and *architecture* first; the code (`_standard-01-token.scss`,
> `_standard-02-color.scss`, the themes) follows once we are satisfied.
> Evidence for what follows: [`AUDIT-COLORS.md`](./AUDIT-COLORS.md) (what exists, who reads it, what is missing).
> Companion to [`TOKENS.md`](./TOKENS.md): that file says **what each token is**; this one
> says **which token to reach for, and when**.

## 1. Principles

1. **Name by role, never by value or by scheme.** A component asks for "the raised surface",
   not "a lighter background" and not "the dark-mode grey". (Apple, Material and Radix all do
   this; none of them lets the light/dark scheme leak into a name a component uses.)
2. **One job per token.** If two tokens are used for the same thing, one of them is wrong.
3. **Seeds in, roles out.** A theme supplies a handful of seeds. Every role is a deterministic
   function of those seeds (the Material 3 model), so a new theme cannot "forget" a role.
4. **Components never read seeds.** Only the semantic layer reads the scheme-specific seeds;
   everything downstream is scheme-blind and flips for free.
5. **A role is only real if it is testable.** Each role below carries a conformance check
   (section 8). A role we cannot check is a wish.
6. **Never repurpose a role.** Apple's rule, stated with its own examples: don't use the
   separator colour as text, or secondary label as a background. A token used outside its job
   is a bug in the usage, and a sign the right token is missing (section 10).

## 2. The four layers

| Layer | Who writes it | Who reads it | Example |
|---|---|---|---|
| **Seeds** | a theme (`tokens.yaml`) | the palette layer only | `--color-light-background`, `--color-dark-foreground` |
| **Palette** | the framework (formulas) | the semantic layer only | `--color-dark-border`, `--color-light-muted` |
| **Roles** | the framework (scheme switch) | components, apps, users | `--color-background`, `--color-surface`, `--color-muted` |
| **Component aliases** | a component or an app | itself | `--canvas`, `--pane-edge` |

Today the seed and palette layers share the `--color-light-*` / `--color-dark-*` names with the
role layer's polarity aliases (see 7.1). The guide treats that as the main thing to fix.

## 3. Role catalogue (proposed)

Current name → proposed name where they differ. **Bold = new role.**

### 3.1 Ground and surfaces

The surfaces form a *ladder relative to the ground*. Direction is fixed by meaning, not by
lightness: **raised** is toward the viewer, **sunken** is away from it.

| Role | Current | Job |
|---|---|---|
| `--color-background` | same | **The ground.** The main field of the app or page. Sidebars, rails and content all sit on it. |
| `--color-surface-sunken` | `surface-dark-1` | Inputs, wells, code blocks, table stripes, switch tracks. |
| `--color-surface` | `surface` = `surface-light-1` | Cards, panes, panels: anything that sits on the ground. |
| `--color-surface-overlay` | `surface-light-2/3` | Menus, popovers, dialogs, tooltips: anything that floats over a surface. |
| **`--color-stage`** | none (Reveal improvises `--canvas`) | The backdrop behind media (photos, video, a canvas). Neutral, darker than the ground in both schemes, so the picture carries the contrast, not the chrome. (AppKit has this exact role: `underPageBackgroundColor`, "the background behind a document's content".) |
| `--color-glass` | same | Translucent chrome over moving content. |

### 3.2 Content (text and icons)

| Role | Current | Job |
|---|---|---|
| `--color-foreground` | same | Primary text. |
| `--color-muted` | same | Secondary text, captions. |
| `--color-subtle` | same | Tertiary text, placeholders, decorative icons. |
| **`--color-disabled`** | none | Quaternary level: disabled controls (Apple's `quaternaryLabel`, `disabledControlTextColor`). |
| **`--color-placeholder`** | `subtle` (overloaded) | Placeholder text in fields. Apple keeps it separate from tertiary text; today `subtle` also does decorative icons. |
| `--color-header` | same | Headings, when a theme wants them to differ. |

### 3.3 Edges

Two weights, as in Radix (6 vs 7–8) and Material (`outline-variant` vs `outline`).

| Role | Current | Job |
|---|---|---|
| `--color-edge` | `--color-border` | Hairlines: separators, card and pane outlines. Decorative, not a boundary a user must see. |
| **`--color-edge-strong`** | none | Boundaries a user must perceive: input borders, unselected controls. Must meet 3:1 against its surface. |
| **`--color-edge-opaque`** | none | A hairline that must not let the surface behind show through, where two translucent `edge` lines would overlap and double up (Apple's `opaqueSeparator`). |
| `--color-highlight` | same | **Specular** top light on raised things (`--shadow-raised`). Not an outline colour. |
| `--color-shadow` | same | Shadow seed. |

> `--pane-edge` (the ring around panes and the window) should be built on `--color-edge`, not on
> `--color-highlight`: highlight is derived from the *foreground*, so its brightness depends on the
> text colour rather than on the surface it is drawn on. See 7.3.

### 3.4 Interaction

All three are translucent overlays on whatever surface they sit on, so they work on every level
of the ladder without being recomputed.

| Role | Job |
|---|---|
| **`--color-hover`** | Row, button or item under the pointer. |
| **`--color-pressed`** | Active press. |
| **`--color-selected`** | Selected row or current item. (Today `.item` uses `surface-dark-1/2` for these, which couples interaction to the surface ladder.) |
| **`--color-selected-inactive`** | The same selection when the window or pane is not focused. macOS dims it (`unemphasizedSelectedContentBackgroundColor`); a desktop app should too. |
| **`--color-focus-ring`** | Keyboard focus indicator (`keyboardFocusIndicatorColor`). Defaults to `accent`, but is its own role so it can be thickened for increased contrast. |
| **`--color-stripe`** | Alternating row or column background (`alternatingContentBackgroundColors`). A hair above or below `background`; not `sunken`. |

### 3.5 Accent, links, status

| Role | Job |
|---|---|
| `--color-accent` | The single brand/interactive colour. |
| `--color-on-accent` | Text drawn on an accent fill. |
| `--color-link` | Links (defaults to blue). |
| `--color-success` `--color-warning` `--color-error` `--color-info` | Status. Each should get an `on-` partner when used as a fill. |
| `--color-red` … `--color-brown` | The hue palette. Not roles: use them through the status or accent roles when meaning exists. |

## 4. "I am building…" — which token?

| Building | Use |
|---|---|
| App window, page | `background` |
| Sidebar that belongs to the app | `background`, separated by `edge` |
| Sidebar that should read as recessed (Claude's look) | `surface-sunken` |
| Floating pane (inspector, side panel) | `surface` + `--pane-edge` |
| Card, grouped list | `surface` |
| Menu, popover, dialog | `surface-overlay` |
| Text field, code block, well | `surface-sunken` + `edge-strong` for fields |
| Photo or video backdrop | `stage` |
| Divider, outline of a card | `edge` |
| Hovered / selected row | `hover` / `selected` |
| Placeholder, helper text | `subtle` |
| Disabled label | `disabled` |
| Focus ring | `accent` |
| Primary button | `accent` fill, `on-accent` text |

## 5. Elevation in light and dark

- **Dark schemes:** raised surfaces are *lighter* than the ground (Material 3, Apple). Works with
  a lightness step today.
- **Light schemes:** raised surfaces are *white-er*, but the ground is already near white
  (`#faf9f5` has an OKLCH lightness of 0.982), so there is almost no room above it. The
  options:
  - **A. Tint the ground.** Light grounds sit at ≤ 0.96 so raised can reach 1.0 (Apple's grouped
    background is grey with white cells).
  - **B. Separate by edge and shadow, not lightness.** Keep the ground, give `surface` an `edge`
    and `surface-overlay` a shadow.
  - **C. Both:** A for apps, B for documents.

  *Decision pending (see 9).*

## 6. Case study — Reveal

Reveal made `--color-background` darker so photos would contrast with the chrome. That put two
jobs on one token: the *ground* (where sidebars sit) and the *stage* (behind a picture). Every
other app wants a normal ground, so Reveal's theme choice leaked into shared themes.

Resolution: the macOS theme keeps an ordinary ground; Reveal's `--canvas` becomes the **`stage`**
role, derived darker than the ground. Same effect in the app, no distortion in the theme.

**Calibration data.** Claude desktop, dark, measured from a screenshot (hex are approximate):

| Region | Hex | OKLCH L | Step |
|---|---|---|---|
| Sidebar | `#111111` | 0.178 | |
| Panels, bubbles | `#1a1a1a` | 0.218 | +0.040 |
| Content | `#222222` | 0.252 | +0.034 |
| Hairline | `#2a2a2a` | 0.285 | +0.033 |

Our formula's ±0.03 step is already in the right range; the gap is the missing `sunken`/`stage`
levels below the ground.

## 7. Known problems in the current tokens

### 7.1 "light" and "dark" mean three things

| Where | Meaning |
|---|---|
| `--color-light-background`, `--color-dark-border` | the **scheme** (seed / palette layer) |
| `--color-light`, `--color-dark` | the **polarity** of the active scheme: lighter / darker end |
| `--color-surface-light-1` | a **direction**: lighter than the background |

Proposed: schemes keep the `light-` / `dark-` prefix but only in the seed and palette layers;
polarity becomes `--color-pole-high` / `--color-pole-low` (or similar); direction disappears into
the role names of 3.1.

### 7.2 Surface hierarchy collapses in light schemes

`surface-light-N = min(1, L + 0.03·N)`. With a ground at L = 0.982 all three steps clamp to 1, so
a card, a menu and a dialog are the same colour in every light theme.

### 7.3 Two tokens that look like borders but are not

- `--color-dark-border` is derived from the *background* at 25 % opacity — it is a shadow tone,
  not a light edge. The macOS theme overrides it with `rgba(255,255,255,.12)`.
- `--color-highlight` is derived from the *foreground* (dark: 11 % opacity), so its brightness
  follows the text colour. Right for a specular highlight, wrong for a pane outline.

### 7.4 One border weight, no interactive states, no stage

See 3.3, 3.4 and 3.1.

## 8. Conformance checks (to be written as tests)

Run against every theme, in both schemes:

1. **Ladder is monotonic:** `sunken`, `background`, `surface`, `surface-overlay` differ by at least
   0.02 L, in the right direction.
2. **Text contrast:** `foreground` ≥ 7:1 and `muted` ≥ 4.5:1 on `background`, `surface` and `overlay`.
3. **Edge contrast:** `edge-strong` ≥ 3:1 on `surface`; `edge` visible but < 3:1.
4. **Stage is neutral:** chroma of `stage` ≈ 0 and its L is below `background`'s.
5. **Interaction overlays** stay legible on every rung: `selected` text contrast ≥ 4.5:1.
6. **Four variants, not two:** every role resolves in light, dark, and increased-contrast for each
   (Apple asks for all four, even for an app that ships one appearance). The framework already has
   `_standard-30-contrast.scss`; the checks above must pass on all four.
7. **No scheme names in consumers:** no component reads a `--color-light-*` or `--color-dark-*` token.

## 9. Open questions

1. **Names:** numeric ladder (Radix: `surface-1…3`) or named (Material/this draft: `sunken`,
   `surface`, `overlay`)? Named reads better in a component; numeric extends further.
2. **Light elevation:** A, B or C from section 5?
3. **`border` vs `edge`:** `border` is the CSS word and matches `--border`; `edge` avoids the
   confusion with the `border` property and pairs with `--pane-edge`. Worth a rename?
4. **Polarity names:** `pole-high/low`, `on-ground/…`, or drop them (are they used)?
5. **DTCG:** should `tokens.yaml` become (or export to) the W3C Design Tokens JSON format so
   Figma and other tools can consume it?
6. **Scope of `stage`:** neutral in both schemes, or tinted by the theme?
7. **System colours at runtime:** could the macOS theme *resolve* the system's colours instead of
   copying hex values? Apple warns that documented values "may fluctuate from release to release".
   WebKit exposes `-apple-system-*` colour keywords (control background, separator, label, …) —
   not documented by Apple; to verify inside Reveal's webview before relying on it. If it works,
   the macOS theme becomes a mapping (section 10.2), not a palette.
8. **Increased contrast:** where does that variant live (a fourth seed set per theme, or a
   formula that stretches the ladder and edges)?
9. **Wide colour:** our OKLCH formulas can leave sRGB. Apple asks to test both sRGB and P3 and to
   avoid gradients that clip; do we gamut-map explicitly?
10. **Migration:** every old name stays as an alias for one release so themes, Obsidian and
   standard.garden keep working while we rename.

## 10. What Apple's guidelines add

Source: the HIG *Color* page (revision of 16 December 2025), as exported to PDF by Francis.

### 10.1 Rules worth adopting

- **Don't redefine a role** — separator-as-text, secondary-label-as-background are the examples.
  `--color-highlight` used as an outline is the same mistake (AppKit calls `highlightColor` "the
  virtual light source onscreen" and `shadowColor` "the virtual shadow cast by a raised object":
  two *lighting* seeds, not edges).
- **Don't use one colour for two meanings** (e.g. the brand colour for both interactive and
  non-interactive text).
- **Don't hard-code system values.** They "may fluctuate from release to release".
- **Light, dark and increased contrast, for every colour.**
- **Never rely on colour alone** for state or meaning.

### 10.2 Our roles against AppKit

| Our role (draft) | AppKit | Apple's description |
|---|---|---|
| `background` | `windowBackgroundColor` | The background of a window. |
| `surface` | `controlBackgroundColor` | The background of a large interface element, such as a browser or table. |
| `stage` | `underPageBackgroundColor` | The background behind a document's content. |
| `surface-sunken` | `textBackgroundColor` | The background behind text. |
| `stripe` | `alternatingContentBackgroundColors` | Backgrounds of alternating rows or columns. |
| `foreground` `muted` `subtle` `disabled` | `labelColor` … `quaternaryLabelColor`, `disabledControlTextColor` | Four label levels, plus unavailable control text. |
| `placeholder` | `placeholderTextColor` | A placeholder string in a control or text view. |
| `edge` / `edge-opaque` | `separatorColor` / `opaqueSeparator` (iOS) | A separator that lets underlying content show / one that doesn't. |
| `selected` / `selected-inactive` | `selectedContentBackgroundColor` / `unemphasizedSelectedContentBackgroundColor` | Selected content in a key / non-key window. |
| `focus-ring` | `keyboardFocusIndicatorColor` | The ring around the focused control during keyboard navigation. |
| `accent` | `controlAccentColor` | The accent the person picked in System Settings. |
| `highlight` / `shadow` | `highlightColor` / `shadowColor` | Virtual light and virtual shadow. |
| `link` | `linkColor` | A link to other content. |

### 10.3 What it changes in the draft

- **The ladder is containment depth, not just elevation.** iOS names its backgrounds *primary*
  (the overall view), *secondary* (grouping inside it) and *tertiary* (grouping inside a
  secondary). So `surface` means "one level in", and the ladder should keep going when panes nest
  inside panes. Two sets exist — *system* and *grouped* — with the same three ranks: a hint for
  section 5 that a ground can be chosen per context.
- **Naming precedent.** Apple uses ordinal words for hierarchy (primary / secondary / tertiary,
  four label levels) and numerals only for the raw neutral ramp (`systemGray` … `systemGray6`).
  A reasonable answer to question 1: ordinal or named roles; a numbered ramp only for raw neutrals.
- **`subtle` is overloaded.** Apple separates tertiary label, quaternary label, placeholder and
  disabled text. We fold all four into `subtle` and one missing level.
- **Selection has two states** (key and non-key window). Reveal has several panels in one window,
  so `selected-inactive` is not hypothetical.
- **Accent can belong to the user.** On macOS 11+ the system accent replaces an app's accent
  unless it is "multicolor". A macOS-flavoured theme should defer to it rather than fix `#007aff`.
- **Liquid Glass has no colour of its own**; it takes the colour of what is behind it. `--color-glass`
  should therefore stay a tint-free translucent seed, not a theme colour.

### 10.4 Direction (decided, not yet scheduled)

- **The `macos` theme becomes 100 % system:** no palette of its own, only the mapping of 10.2 onto
  the platform's colours (question 7 decides how: runtime keywords or a generated mapping).
- **The `claude` theme is redone from the Claude app's own colours**, measured from the app (see the
  calibration table in section 6), replacing today's hand-picked seeds. The interesting part will
  be the difference between the two themes: same roles, one resolved by the OS, one by a palette.
  The current `claude` dark ground is a neutral `oklch(0.27 0 106)`; the app's real ladder starts
  lower (sidebar L 0.178) and has the `sunken` / `stage` rungs the theme cannot express yet.

## 11. References

- Apple — [Human Interface Guidelines: Color](https://developer.apple.com/design/human-interface-guidelines/color)
  (revision 2025-12-16): background hierarchy, label hierarchy, macOS dynamic system colours,
  light / dark / increased-contrast rule. Read in full for section 10.
- Material Design 3 — [`ColorScheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme):
  seed-derived roles, `surfaceContainer*` ladder, `outline` / `outlineVariant`, `on-*` pairs.
- Radix — [Understanding the scale](https://radix-ui.com/colors/docs/palette-composition/understanding-the-scale):
  twelve steps, each with one use (backgrounds, interactive states, borders, solids, text).
- W3C Design Tokens Community Group — [Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/):
  exchange format, aliases, primitive → semantic → component layering.
