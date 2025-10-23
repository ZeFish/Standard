---
layout: base.njk
title: Utilities Cheat Sheet
description: Quick reference for all Standard Framework utility classes
permalink: /cheat-sheet/
---

# Utilities Cheat Sheet

Quick reference for all self-documenting utility classes. Pattern: `[property]-[side]-[size]`

**Size tokens**: `0`, `3xs`, `2xs`, `xs`, `s`, `base`, `l`, `xl`, `2xl`, `3xl`



---

## Spacing Utilities

### Margin

```html
<!-- Top margin -->
.margin-top-xs        .margin-top-s        .margin-top-base
.margin-top-l         .margin-top-xl       .margin-top-0

<!-- Right margin -->
.margin-right-xs      .margin-right-base   .margin-right-l

<!-- Bottom margin -->
.margin-bottom-xs     .margin-bottom-base  .margin-bottom-l

<!-- Left margin -->
.margin-left-xs       .margin-left-base    .margin-left-l

<!-- Block (top + bottom) -->
.margin-block-xs      .margin-block-base   .margin-block-l

<!-- Inline (left + right) -->
.margin-inline-xs     .margin-inline-base  .margin-inline-l
.margin-inline-auto   <!-- Centers horizontally -->

<!-- All sides -->
.margin-base          .margin-l            .margin-xl
.margin-0             <!-- Remove all margin -->
```

### Padding

```html
<!-- Top padding -->
.padding-top-xs       .padding-top-base    .padding-top-l

<!-- Right padding -->
.padding-right-xs     .padding-right-base  .padding-right-l

<!-- Bottom padding -->
.padding-bottom-xs    .padding-bottom-base .padding-bottom-l

<!-- Left padding -->
.padding-left-xs      .padding-left-base   .padding-left-l

<!-- Block (top + bottom) -->
.padding-block-xs     .padding-block-base  .padding-block-l

<!-- Inline (left + right) -->
.padding-inline-xs    .padding-inline-base .padding-inline-l

<!-- All sides -->
.padding-base         .padding-l           .padding-xl
.padding-0            <!-- Remove all padding -->
```

### Gap (Flexbox/Grid)

```html
.gap-xs               .gap-base            .gap-l
.gap-xl               .gap-2xl             .gap-3xl
.gap-0

.row-gap-base         .row-gap-l
.column-gap-base      .column-gap-l
```

---

## Sizing Utilities

### Width

```html
<!-- Scale-based -->
.width-xs             .width-base          .width-l
.width-xl             .width-2xl           .width-3xl

<!-- Special -->
.width-0              .width-auto          .width-full
.width-screen         .width-min           .width-max
.width-fit

<!-- Min width -->
.min-width-0          .min-width-full      .min-width-screen
.min-width-base       .min-width-l

<!-- Max width -->
.max-width-none       .max-width-full      .max-width-screen
.max-width-base       .max-width-l

<!-- Reading width (optimal line length) -->
.width-line-extra-small    .width-line-small      .width-line-base
.width-line-large          .width-line-extra-large
```

### Height

```html
<!-- Scale-based -->
.height-xs            .height-base         .height-l
.height-xl            .height-2xl          .height-3xl

<!-- Special -->
.height-0             .height-auto         .height-full
.height-screen        .height-min          .height-max
.height-fit

<!-- Min height -->
.min-height-0         .min-height-full     .min-height-screen
.min-height-base      .min-height-l

<!-- Max height -->
.max-height-none      .max-height-full     .max-height-screen
.max-height-base      .max-height-l
```

---

## Typography Utilities

### Text Size

```html
.text-size-micro           <!-- Extra small -->
.text-size-small           <!-- Small -->
.text-size-smaller         <!-- Smaller -->
.text-size-display         <!-- Large display heading -->
.text-size-poster          <!-- Extra large poster -->
.text-size-label           <!-- Uppercase label -->
.text-size-compact         <!-- Reduced line-height -->
```

### Font Weight

```html
.text-weight-normal        <!-- Regular weight -->
.text-weight-bold          <!-- Bold weight -->
```

### Font Family

```html
.font-family-mono          <!-- Monospace -->
.font-family-monospace     <!-- Alias for mono -->
.font-family-code          <!-- Alias for mono -->
.font-family-ui            <!-- Interface font -->
.font-family-interface     <!-- Alias for UI -->
```

### Line Height

```html
.line-height-tight         <!-- 0.85 -->
.line-height-snug          <!-- Compact -->
.line-height-normal        <!-- Standard -->
.line-height-relaxed       <!-- 1.6 - spacious -->
.line-height-none          <!-- 1 - single line -->
```

### Text Alignment

```html
.text-align-left
.text-align-center
.text-align-right
.text-align-justify
```

### Text Transform

```html
.text-transform-uppercase
.text-transform-lowercase
.text-transform-capitalize
.text-transform-normal     <!-- Remove transform -->
```

### Text Utilities

```html
.text-no-wrap              <!-- Prevent wrapping -->
.text-ellipsis             <!-- Truncate with ... -->
```

---

## Color Utilities

### Text Color

```html
.text-color-muted          <!-- Muted/disabled -->
.text-color-subtle         <!-- Subtle secondary -->
.text-color-accent         <!-- Accent color -->
```

### Background Color

```html
.background-color-secondary   <!-- Secondary background -->
```

### Border Color

```html
.border-color-default      <!-- Default border -->
.border-color-accent       <!-- Accent border -->
```

---

## Display & Visibility

### Display Type

```html
.display-hidden            <!-- display: none -->
.display-visible           <!-- display: block -->
.display-inline            <!-- display: inline -->
.display-inline-block      <!-- display: inline-block -->
.display-flex              <!-- display: flex -->
.display-grid              <!-- display: grid -->
```

### Accessibility

```html
.visibility-screen-reader-only   <!-- Hidden visually, visible to screen readers -->
.visually-hidden                 <!-- Alias for screen-reader-only -->
```

---

## Layout Utilities

### Centering

```html
.center-content            <!-- Flex center (both axes) -->
.center-horizontally       <!-- Margin-based horizontal center -->
.center-vertically         <!-- Flex vertical center -->
```

---

## Rhythm Utilities

```html
.rhythm-tight              <!-- --rhythm-multiplier: 0.5 -->
.rhythm-loose              <!-- --rhythm-multiplier: 1.5 -->
```

---

## Quick Combinations

### Hero Section

```html
<header class="padding-xl text-align-center">
  <h1 class="text-size-display">Welcome</h1>
  <p class="text-color-subtle">Subtitle here</p>
</header>
```

### Card Layout

```html
<div class="display-grid" style="grid-template-columns: repeat(3, 1fr);">
  <article class="padding-base border-color-default">
    <h3>Card Title</h3>
    <p>Content</p>
  </article>
  <!-- More cards -->
</div>
```

### Centered Container

```html
<div class="width-line-base center-horizontally padding-base">
  <h1>Optimal Reading Width</h1>
  <p>Content here...</p>
</div>
```

### Flex Layout

```html
<div class="display-flex gap-base padding-base">
  <div class="width-full">Item 1</div>
  <div class="width-full">Item 2</div>
  <div class="width-full">Item 3</div>
</div>
```

### Text with Utilities

```html
<p class="text-size-small text-color-muted text-transform-uppercase">
  Small muted uppercase text
</p>
```

---

## Size Scale Reference

| Token | Value |
|-------|-------|
| `3xs` | var(--space-3xs) ~0.125rem |
| `2xs` | var(--space-2xs) ~0.25rem |
| `xs`  | var(--space-xs)  ~0.5rem |
| `s`   | var(--space-s)   ~0.75rem |
| `base`| var(--space)     ~1rem |
| `l`   | var(--space-l)   ~2rem |
| `xl`  | var(--space-xl)  ~4rem |
| `2xl` | var(--space-2xl) ~8rem |
| `3xl` | var(--space-3xl) ~12rem |

---

## Naming Pattern

All utilities follow: **[property]-[side/variant]-[size]**

```
.margin-top-base
  ↓      ↓   ↓
  property side size
```

**This makes names guessable!** If you forget a name, look at nearby utilities to remember the pattern.

---

## Pro Tips

✅ **Combine utilities** — Use multiple classes together
```html
<div class="padding-base margin-bottom-l text-align-center">
```

✅ **Use semantic values** — `base`, `s`, `l` are clearer than arbitrary numbers
```html
.padding-base          ← Clear
.padding-16px          ← What was 16px again?
```

✅ **Reference the sizes** — Use the consistent scale across margin, padding, gap, width, height
```html
.margin-l              .padding-l              .gap-l              .width-l
<!-- All use the same --space-l value -->
```

❌ **Don't fight utilities** — Use them instead of writing custom CSS
```html
<!-- Good -->
<div class="padding-base margin-bottom-l">

<!-- Don't do this -->
<div style="padding: 1rem; margin-bottom: 2rem;">
```

---

## Common Sizes

| Use Case | Classes |
|----------|---------|
| Tiny spacing | `.margin-xs`, `.padding-xs`, `.gap-xs` |
| Small spacing | `.margin-s`, `.padding-s`, `.gap-s` |
| Regular spacing | `.margin-base`, `.padding-base`, `.gap-base` |
| Large spacing | `.margin-l`, `.padding-l`, `.gap-l` |
| Extra large | `.margin-xl`, `.padding-xl`, `.gap-xl` |

---

## See Also

- **[Full Utilities Guide](/css/utilities/)** — Comprehensive reference with examples
- **[Getting Started](/getting-started/)** — Setup guide
- **[CSS Framework](/css/)** — Design system overview

---

## Print This

**Tip**: Print this page (Cmd+P or Ctrl+P) to have a physical reference card while coding!

---

**Remember**: If you can't remember the exact utility name, the pattern tells you what it should be. 🎯
