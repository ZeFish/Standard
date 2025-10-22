---
layout: base.njk
title: Utilities
description: Self-documenting utility classes for spacing, sizing, typography, colors, and layout
---

# Utilities

Self-documenting utility classes for spacing, sizing, typography, colors, and layout following a consistent naming pattern.

## Quick Navigation

- **[Typography System](/css/typography/)** - Font scales, sizes, and weights
- **[Grid System](/css/grid/)** - Flexible layouts and responsive columns
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Prose System](/css/prose/)** - Readable article layouts
- **[Colors](/css/colors/)** - Text and background colors

## Naming Convention

Every utility follows an intuitive pattern **[property]-[side/variant]-[size]** that's easy to guess and remember:

```
.margin-top-base        // margin-top: var(--space)
.padding-right-l        // padding-right: var(--space-l)
.text-size-small        // font-size: var(--scale-s)
.text-color-accent      // color: var(--color-accent)
.display-hidden         // display: none
```

**Size tokens**: `0`, `3xs`, `2xs`, `xs`, `s`, `base` (default), `l`, `xl`, `2xl`, `3xl`

> ✨ **Design Principle**: You can guess the utility name by looking at other utilities on the page. Even after time away from the code, the naming is self-explanatory.

---

## Spacing Utilities

### Margin

Control spacing outside elements using margin utilities.

```html
<div class="margin-top-base padding-top-l border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <div class="margin-top-xs">Margin top extra small (.margin-top-xs)</div>
</div>

<div class="margin-top-s padding-top-l border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <div class="margin-top-s">Margin top small (.margin-top-s)</div>
</div>

<div class="margin-top-base padding-top-l border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <div class="margin-top-base">Margin top base (.margin-top-base)</div>
</div>

<div class="margin-top-l padding-top-xl border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <div class="margin-top-l">Margin top large (.margin-top-l)</div>
</div>
```

**Directional margin utilities:**
- `.margin-top-*` — Top margin
- `.margin-right-*` — Right margin (inline-end)
- `.margin-bottom-*` — Bottom margin
- `.margin-left-*` — Left margin (inline-start)
- `.margin-block-*` — Top and bottom
- `.margin-inline-*` — Left and right
- `.margin-*` — All sides
- `.margin-top-0`, `.margin-bottom-0`, etc. — Remove margin

**Special margin utilities:**
- `.margin-inline-auto` — Center horizontally
- `.margin-left-auto`, `.margin-right-auto` — Flex centering
- `.margin-top-auto`, `.margin-bottom-auto` — Flex spacing

### Padding

Control spacing inside elements using padding utilities.

```html
<div class="padding-base border-color-default" style="border: 1px solid; background: var(--color-background-secondary); border-radius: 0.5rem;">
  <p class="margin-0">Padding base (.padding-base)</p>
</div>

<div class="padding-l border-color-default" style="border: 1px solid; background: var(--color-background-secondary); border-radius: 0.5rem;">
  <p class="margin-0">Padding large (.padding-l)</p>
</div>

<div class="padding-xl border-color-default" style="border: 1px solid; background: var(--color-background-secondary); border-radius: 0.5rem;">
  <p class="margin-0">Padding extra large (.padding-xl)</p>
</div>
```

**Directional padding utilities:**
- `.padding-top-*` — Top padding
- `.padding-right-*` — Right padding
- `.padding-bottom-*` — Bottom padding
- `.padding-left-*` — Left padding
- `.padding-block-*` — Top and bottom
- `.padding-inline-*` — Left and right
- `.padding-*` — All sides

### Gap

Control spacing between flex and grid items.

```html
<div class="display-flex gap-xs" style="flex-wrap: wrap;">
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 1</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 2</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 3</div>
</div>

<div class="margin-top-base display-flex gap-base" style="flex-wrap: wrap;">
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 1</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 2</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 3</div>
</div>

<div class="margin-top-base display-flex gap-xl" style="flex-wrap: wrap;">
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 1</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 2</div>
  <div class="background-color-secondary padding-s" style="border-radius: 0.5rem;">Item 3</div>
</div>
```

---

## Sizing Utilities

### Width

Control element width and constrain content.

```html
<div class="margin-bottom-base">
  <div class="width-full padding-s border-color-default" style="border: 1px solid; background: var(--color-background-secondary);">
    .width-full (100%)
  </div>
</div>

<div class="margin-bottom-base">
  <div class="width-max padding-s border-color-default" style="border: 1px solid; background: var(--color-background-secondary);">
    .width-max (max-content)
  </div>
</div>

<div class="margin-bottom-base">
  <div class="width-min padding-s border-color-default" style="border: 1px solid; background: var(--color-background-secondary);">
    .width-min (min-content)
  </div>
</div>

<div class="margin-bottom-base">
  <div class="width-auto padding-s border-color-default" style="border: 1px solid; background: var(--color-background-secondary);">
    .width-auto
  </div>
</div>
```

**Width utilities:**
- `.width-0`, `.width-auto`, `.width-full`, `.width-screen`
- `.width-min`, `.width-max`, `.width-fit`
- `.width-*` (spacing scale: base, s, l, xl, etc.)
- `.min-width-*`, `.max-width-*` — Min/max constraints

### Height

Control element height.

```html
<div class="display-flex gap-base" style="border: 1px solid var(--color-subtle); border-radius: 0.5rem; padding: var(--space); background: var(--color-background-secondary);">
  <div class="height-full padding-s" style="border: 1px solid var(--color-accent); border-radius: 0.25rem;">
    .height-full
  </div>
  <div class="height-auto padding-s" style="border: 1px solid var(--color-accent); border-radius: 0.25rem;">
    .height-auto
  </div>
</div>
```

**Height utilities:**
- `.height-0`, `.height-auto`, `.height-full`, `.height-screen`
- `.height-min`, `.height-max`, `.height-fit`
- `.height-*` (spacing scale)
- `.min-height-*`, `.max-height-*` — Min/max constraints

---

## Typography Utilities

### Text Size

Control font size for different scales.

```html
<p class="text-size-micro">Micro text (.text-size-micro)</p>
<p class="text-size-small">Small text (.text-size-small)</p>
<p class="text-size-smaller">Smaller text (.text-size-smaller)</p>
<p>Normal text (no utility)</p>
<p class="text-size-display">Display text (.text-size-display)</p>
<p class="text-size-poster">Poster text (.text-size-poster)</p>
<p class="text-size-label">Label text (.text-size-label)</p>
```

**Text size utilities:**
- `.text-size-micro` — Extra small (scale-micro)
- `.text-size-small` — Small (scale-s)
- `.text-size-smaller` — Smaller (scale-xs)
- `.text-size-display` — Large display with responsive sizing
- `.text-size-poster` — Extra large poster with responsive sizing
- `.text-size-label` — Uppercase label style

### Font Weight

Control text weight.

```html
<p class="text-weight-normal">Normal weight text (.text-weight-normal)</p>
<p class="text-weight-bold">Bold weight text (.text-weight-bold)</p>
```

### Line Height

Control spacing between lines of text.

```html
<div class="line-height-tight border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <strong>Tight line height</strong>
  <p class="margin-0">The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
</div>

<div class="line-height-snug border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <strong>Snug line height</strong>
  <p class="margin-0">The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
</div>

<div class="line-height-normal border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <strong>Normal line height</strong>
  <p class="margin-0">The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
</div>

<div class="line-height-relaxed border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem;">
  <strong>Relaxed line height</strong>
  <p class="margin-0">The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
</div>
```

**Line height utilities:**
- `.line-height-tight` (0.85)
- `.line-height-snug` (var(--font-density-s))
- `.line-height-normal` (var(--font-density))
- `.line-height-relaxed` (1.6)

### Text Alignment

Control text horizontal alignment.

```html
<p class="text-align-left border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <strong>Left aligned text</strong> (.text-align-left)
</p>

<p class="text-align-center border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <strong>Center aligned text</strong> (.text-align-center)
</p>

<p class="text-align-right border-color-default padding-s" style="border: 1px solid; border-radius: 0.5rem;">
  <strong>Right aligned text</strong> (.text-align-right)
</p>
```

### Text Transformation

Transform and style text.

```html
<p class="text-transform-uppercase">Uppercase text (.text-transform-uppercase)</p>
<p class="text-transform-lowercase">LOWERCASE TEXT (.text-transform-lowercase)</p>
<p class="text-transform-capitalize">capitalize this text (.text-transform-capitalize)</p>
<p class="text-ellipsis" style="max-width: 200px; border: 1px solid var(--color-subtle); padding: 0.5rem; border-radius: 0.5rem;">This text will be truncated with ellipsis (.text-ellipsis)</p>
<p class="text-no-wrap" style="width: 200px; border: 1px solid var(--color-subtle); padding: 0.5rem; border-radius: 0.5rem;">This text will not wrap (.text-no-wrap)</p>
```

---

## Color Utilities

### Text Color

Control text color with semantic utilities.

```html
<p class="text-color-muted">Muted text (.text-color-muted)</p>
<p class="text-color-subtle">Subtle text (.text-color-subtle)</p>
<p class="text-color-accent">Accent text (.text-color-accent)</p>
```

### Background Color

Control background color.

```html
<div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  Secondary background (.background-color-secondary)
</div>
```

### Border Color

Control border color.

```html
<div class="border-color-default padding-base" style="border-radius: 0.5rem; margin-bottom: var(--space-base);">
  Default border (.border-color-default)
</div>

<div class="border-color-accent padding-base" style="border-radius: 0.5rem;">
  Accent border (.border-color-accent)
</div>
```

---

## Display & Visibility

### Display

Control element visibility and display type.

```html
<div class="display-flex gap-base padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <div class="background-color-secondary padding-s">Flex item 1</div>
  <div class="background-color-secondary padding-s">Flex item 2</div>
</div>

<div class="display-grid" style="gap: var(--space-base); grid-template-columns: repeat(2, 1fr); padding: var(--space-base); border: 1px solid var(--color-subtle); border-radius: 0.5rem;">
  <div class="background-color-secondary padding-s">Grid item 1</div>
  <div class="background-color-secondary padding-s">Grid item 2</div>
</div>

<p class="display-hidden">This element is hidden (.display-hidden)</p>
<p class="display-visible">This element is visible (.display-visible)</p>
```

**Display utilities:**
- `.display-hidden` — display: none
- `.display-visible` — display: block
- `.display-inline` — display: inline
- `.display-inline-block` — display: inline-block
- `.display-flex` — display: flex
- `.display-grid` — display: grid

### Accessibility

Hide content visually but keep it available to screen readers.

```html
<button>
  Download
  <span class="visibility-screen-reader-only">(PDF, 2.5 MB)</span>
</button>
```

---

## Layout Utilities

### Centering

Center content horizontally and/or vertically.

```html
<div class="center-content" style="height: 200px; border: 1px solid var(--color-subtle); border-radius: 0.5rem; background: var(--color-background-secondary);">
  <p class="margin-0">Centered content (.center-content)</p>
</div>

<div class="center-horizontally margin-top-base border-color-default padding-base" style="border: 1px solid; border-radius: 0.5rem; max-width: 400px;">
  Centered horizontally (.center-horizontally)
</div>
```

### Reading Width

Constrain content to optimal reading width.

```html
<article class="width-line-base center-horizontally margin-top-base padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <h3>Optimal Reading Width</h3>
  <p>This content is constrained to an optimal reading width (.width-line-base) for better readability. Line length is typically 50-75 characters per line.</p>
  <p class="text-color-subtle">.width-line-base is perfect for articles, blog posts, and long-form content.</p>
</article>
```

**Reading width utilities:**
- `.width-line-extra-small` — Extra narrow (24rem)
- `.width-line-small` — Small (32rem)
- `.width-line-base` — Optimal reading width (42rem)
- `.width-line-large` — Large (50rem)
- `.width-line-extra-large` — Extra large (60rem)
- `.width-line-full` — Responsive full width

---

## List Utilities

Remove bullets and list styling when needed, especially for navigation menus and custom lists.

**Without .no-bullet (default):**
<div class="margin-bottom-base" style="padding: 1.5rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <ul style="margin: 0; padding-left: 2rem;">
    <li>List item with bullet</li>
    <li>Another item with bullet</li>
    <li>Third item with bullet</li>
  </ul>
</div>

**With .no-bullet utility:**
<div style="padding: 1.5rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <ul class="no-bullet" style="margin: 0; padding: 0; display: flex; gap: 1.5rem;">
    <li><a href="#">Navigation Item 1</a></li>
    <li><a href="#">Navigation Item 2</a></li>
    <li><a href="#">Navigation Item 3</a></li>
  </ul>
</div>

```html
<!-- Regular list with bullets -->
<ul>
  <li>Item with bullet</li>
  <li>Item with bullet</li>
</ul>

<!-- Navigation list without bullets -->
<ul class="no-bullet">
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>

<!-- Ordered list without numbers -->
<ol class="no-bullet">
  <li>Step one without numbers</li>
  <li>Step two without numbers</li>
  <li>Step three without numbers</li>
</ol>

<!-- Combined with other utilities -->
<ul class="no-bullet display-flex gap-base">
  <li class="flex-1"><a href="#">Item 1</a></li>
  <li class="flex-1"><a href="#">Item 2</a></li>
  <li class="flex-1"><a href="#">Item 3</a></li>
</ul>
```

### List Utility Classes

- `.no-bullet` — Removes bullets from `<ul>` and numbers from `<ol>`. Removes left padding and margin.

**Automatic Inline List Spacing:**
When a list uses `.display-flex` or has `display: flex` inline style, list items automatically have `margin-block-end: 0` applied. This prevents extra spacing between horizontally-aligned list items.

**Perfect for:**
- Navigation menus
- Breadcrumb trails
- Custom list layouts with flexbox or grid
- Any list where bullets/numbers aren't needed

**Inline list example (no extra margin):**
```html
<!-- Automatic: li margin-bottom is 0 when list is flex -->
<ul class="no-bullet display-flex gap-base">
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>

<!-- Also works with inline styles -->
<ul class="no-bullet" style="display: flex; gap: 1rem;">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

---

## Body Padding Negation Utilities

Remove body padding from specific elements to create full-width layouts. Useful for footers, headers, or full-bleed sections that should extend to the viewport edges.

The framework applies default padding to `<body>` via `--body-padding-multiplier` and `--body-mobile-padding-multiplier` tokens. These utilities negate that padding while maintaining responsive breakpoint handling.

### `.negate-body-padding`

Negates **horizontal body padding only** (left and right), allowing full-width backgrounds while keeping top/bottom padding intact.

```html
<!-- Full-width header with content inside -->
<header class="negate-body-padding" style="background-color: #f0f0f0; margin-bottom: var(--space);">
  <nav class="padding-base">
    <ul class="no-bullet display-flex gap-base">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
```

**Use cases:**
- Full-width navigation bars
- Section dividers with background color
- Decorative header/footer bars
- Any element needing full-width background with content padding

### `.negate-body-padding-bottom`

Negates **bottom body padding only** (the extra 1.5× multiplier). Removes the generous bottom padding to make footers sit flush at the bottom of the viewport.

```html
<!-- Footer sitting flush at bottom -->
<footer class="negate-body-padding-bottom" style="background-color: #f0f0f0; border-top: 1px solid #ddd; margin-top: var(--space-xl);">
  <p class="padding-base margin-0">© 2024 Your Company. All rights reserved.</p>
</footer>
```

**Use cases:**
- Sticky footers at page bottom
- Removing extra spacing before footer
- Creating balanced page layouts
- Fixed or absolute positioned footers

### `.negate-body-padding-full`

Negates **all body padding** (horizontal + bottom). Creates full-width elements that extend to viewport edges on all sides except the top. Combines both `.negate-body-padding` and `.negate-body-padding-bottom`.

```html
<!-- Full-width sticky footer -->
<footer class="negate-body-padding-full" style="background-color: #1a1a1a; color: white;">
  <div class="padding-base">
    <div class="display-flex gap-xl justify-content-space-between">
      <div>
        <h4>Footer</h4>
        <ul class="no-bullet">
          <li><a href="/" style="color: inherit;">Link 1</a></li>
          <li><a href="/" style="color: inherit;">Link 2</a></li>
        </ul>
      </div>
      <div class="text-align-right">
        <p class="text-size-small text-color-muted" style="color: rgba(255,255,255,0.6);">© 2024</p>
      </div>
    </div>
  </div>
</footer>
```

**Use cases:**
- Full-width sticky footers
- Full-bleed footer sections
- Page bottom navigation
- Elements that should reach viewport edges
- Creating visual separation with full-width backgrounds

### Examples

**Default spacing (no utility):**
```html
<footer>
  <p>Footer content respects body padding</p>
</footer>
```

**With `.negate-body-padding-full`:**
```html
<footer class="negate-body-padding-full" style="background-color: #f5f5f5;">
  <div class="padding-base">
    <p>Footer extends edge-to-edge with content padding inside</p>
  </div>
</footer>
```

### Responsive Behavior

All three utilities automatically adjust for mobile breakpoints using `--body-mobile-padding-multiplier` instead of `--body-padding-multiplier` on screens smaller than 768px. No additional media queries needed.

```scss
// Automatically switches at mobile breakpoint
.negate-body-padding {
    margin-inline: calc(var(--space) * var(--body-padding-multiplier) * -1);
    
    @media (max-width: 768px) {
        margin-inline: calc(var(--space) * var(--body-mobile-padding-multiplier) * -1);
    }
}
```

### Technical Details

These utilities work by:
1. Using negative margins to negate body padding
2. Re-applying padding-inline to keep content centered
3. Preserving responsive breakpoint logic
4. Using logical properties for RTL language support

**CSS Variables Used:**
- `--space` — Base rhythm unit (1rlh)
- `--body-padding-multiplier` — Desktop padding multiplier (default: 1)
- `--body-mobile-padding-multiplier` — Mobile padding multiplier (default: 1)

You can customize body padding by adjusting these variables in your CSS:

```css
:root {
    --body-padding-multiplier: 1.5;        /* Increase desktop padding */
    --body-mobile-padding-multiplier: 0.5; /* Decrease mobile padding */
}
```

---

## Rhythm Utilities

Control rhythm multiplier for consistent spacing.

```html
<div class="rhythm rhythm-tight padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <h4 class="margin-top-0">Tight Rhythm</h4>
  <p>Reduced spacing between elements (.rhythm-tight)</p>
  <p>Elements are spaced at 50% of normal rhythm</p>
</div>

<div class="rhythm padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; margin-bottom: var(--space-base);">
  <h4 class="margin-top-0">Normal Rhythm</h4>
  <p>Standard spacing between elements (default rhythm)</p>
  <p>Elements follow the vertical rhythm system</p>
</div>

<div class="rhythm rhythm-loose padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <h4 class="margin-top-0">Loose Rhythm</h4>
  <p>Increased spacing between elements (.rhythm-loose)</p>
  <p>Elements are spaced at 150% of normal rhythm</p>
</div>
```

---

## Combining Utilities

The real power of utilities comes from combining them:

```html
<!-- Centered container with reading width -->
<div class="width-line-base center-horizontally padding-l gap-base">
  <h2 class="text-align-center text-size-display">Centered heading</h2>
  <p class="text-color-subtle text-align-center">Subtitle with muted color</p>
</div>

<!-- Flex layout with spacing -->
<div class="display-flex gap-base margin-top-xl padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
  <div class="background-color-secondary padding-base text-align-center">Item 1</div>
  <div class="background-color-secondary padding-base text-align-center">Item 2</div>
  <div class="background-color-secondary padding-base text-align-center">Item 3</div>
</div>

<!-- Text styling -->
<p class="text-size-small text-color-muted text-transform-uppercase">Small muted uppercase text</p>
```

---

## Size Scale Reference

All spacing utilities use the same size tokens defined in the design system:

| Token | Value |
|-------|-------|
| `3xs` | var(--space-3xs) |
| `2xs` | var(--space-2xs) |
| `xs` | var(--space-xs) |
| `s` | var(--space-s) |
| `base` | var(--space) |
| `l` | var(--space-l) |
| `xl` | var(--space-xl) |
| `2xl` | var(--space-2xl) |
| `3xl` | var(--space-3xl) |

---

## Best Practices

✅ **Do use utilities** for spacing, alignment, and sizing
✅ **Do combine utilities** to avoid writing custom CSS
✅ **Do use semantic utilities** for colors and roles
✅ **Do refer to the naming pattern** to guess utility names

❌ **Avoid creating new CSS** when a utility exists
❌ **Don't abuse !important** by fighting utilities
❌ **Don't use non-semantic utilities** for important page structure

---

## See Also

- [[CSS Framework]] - Core CSS architecture
- [[Layout Systems]] - Grid and rhythm systems
- [[Typography]] - Font and text styling
