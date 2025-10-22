---
title: Spacing & Vertical Rhythm

eleventyNavigation:
  key: Spacing
  parent: CSS Framework
  title: Spacing & Rhythm
permalink: /css/spacing/
---

# Spacing & Vertical Rhythm

Master consistent spacing and vertical rhythm throughout your layouts using the golden ratio.

## Quick Navigation

- **[Typography System](/css/typography/)** - Font scales, sizes, and weights
- **[Grid System](/css/grid/)** - Flexible layouts and responsive columns
- **[Prose System](/css/prose/)** - Readable article layouts
- **[Colors](/css/colors/)** - Text and background colors
- **[Utilities](/css/utilities/)** - Helper classes for common patterns

## The Rhythm Class

The `.rhythm` class is the foundation of the spacing system. It's applied globally to the `<html>` root element by default, ensuring vertical rhythm cascades throughout your entire page:

```html
<html class="rhythm">
  <body>
    <!-- All content automatically gets rhythm spacing -->
  </body>
</html>
```

### How Rhythm Works

When `.rhythm` is active:
- **Global cascade** — Applied to `<html>` for true root-level styling
- **Margin collapse prevention** — Uses `display: flow-root`
- **Consistent spacing** — All direct children get rhythm-based margins
- **Body padding** — `<body>` gets rhythm-based padding (desktop & mobile responsive)
- **Opt-out capability** — Use `.no-rhythm` on specific sections to disable

### Rhythm on Custom Containers

You can apply `.rhythm` to any container for local rhythm control:

```html
<!-- Global rhythm on <html> -->
<html class="rhythm">
  <body>
    <main>
      <!-- Main content gets rhythm -->
    </main>

    <!-- But you can disable it -->
    <aside class="no-rhythm">
      <!-- No rhythm spacing here -->
    </aside>

    <!-- Or create a new rhythm context -->
    <section class="rhythm">
      <!-- New rhythm context with fresh spacing -->
    </section>
  </body>
</html>
```

### Body Padding

When rhythm is active on `<html>`, the `<body>` element automatically gets rhythm-based padding:

| Breakpoint | Padding | Variable |
|------------|---------|----------|
| Desktop | `calc(--space × --body-padding-multiplier)` | `--body-padding-multiplier` |
| Mobile | `calc(--space × --body-mobile-padding-multiplier)` | `--body-mobile-padding-multiplier` |

**Note**: Direct `.rhythm` containers (like `<div class="rhythm">`) do NOT receive body padding — only `<body>` does.

## Rhythm Unit

The base unit for all spacing:

```css
--rhythm-unit: 1rem;  /* Default: 16px at base font size */
```

All spacing is calculated in multiples of this unit using the golden ratio.

## Spacing Scale

Based on the golden ratio, creating a harmonious scale:

| Multiplier | Size | CSS Variable | Usage |
|-----------|------|--------------|-------|
| 0.5x | 0.5rem | `gap-1` | Tight spacing |
| 1x | 1rem | `gap-2` | Default spacing |
| 1.618x | 1.618rem | `gap-3` | More space |
| 2.618x | 2.618rem | `gap-4` | Generous space |
| 4.236x | 4.236rem | `gap-5` | Large gap |
| 6.854x | 6.854rem | `gap-6` | Very large gap |

## Margin Classes

Apply margins using the rhythm scale:

```html
<!-- All sides -->
<div class="m-2">All margins 1rem</div>
<div class="m-4">All margins 2.618rem</div>

<!-- Vertical (top/bottom) -->
<div class="my-2">Top & bottom 1rem</div>
<div class="my-4">Top & bottom 2.618rem</div>

<!-- Horizontal (left/right) -->
<div class="mx-2">Left & right 1rem</div>
<div class="mx-4">Left & right 2.618rem</div>

<!-- Individual sides -->
<div class="mt-2">Top margin 1rem</div>
<div class="mb-4">Bottom margin 2.618rem</div>
<div class="ml-3">Left margin 1.618rem</div>
<div class="mr-2">Right margin 1rem</div>
```

## Padding Classes

Add internal spacing:

```html
<!-- Padding all sides -->
<div class="p-2">Padding 1rem all sides</div>
<div class="p-4">Padding 2.618rem all sides</div>

<!-- Vertical padding -->
<div class="py-2">Padding 1rem top/bottom</div>
<div class="px-4">Padding 2.618rem left/right</div>

<!-- Individual sides -->
<div class="pt-2">Top padding</div>
<div class="pb-4">Bottom padding</div>
<div class="pl-3">Left padding</div>
<div class="pr-2">Right padding</div>
```

## Vertical Rhythm

Every element's height is a multiple of the rhythm unit for perfect alignment:

```html
<!-- Rhythm block maintains baseline alignment -->
<div class="rhythm-block">
  <h2>Section Heading</h2>
  <p>Paragraph with rhythm spacing</p>
  <p>Another paragraph</p>
</div>

<!-- Multiple rhythm blocks stay aligned -->
<article class="rhythm-block">
  <h1>Article</h1>
  <p>Content</p>
</article>

<aside class="rhythm-block">
  <h3>Sidebar</h3>
  <p>Related content</p>
</aside>
```

## Line Height and Spacing Relationship

Perfect vertical rhythm requires understanding line heights:

```css
:root {
  --font-size-base: 16px;
  --line-height-base: 1.618;     /* 25.8px */
  --rhythm-unit: 1rem;            /* 16px */
}
```

### Calculation

```
Line height = font-size × line-height multiplier
           = 16px × 1.618
           = 25.8px (approximately 26px)

Rhythm spacing = 16px (matches baseline increment)
```

This means every line of text takes up roughly one rhythm unit vertically.

## Spacing Between Elements

### Between Headings and Paragraphs

```html
<h2 class="mb-4">Heading</h2>
<p>Paragraph starts after rhythm spacing</p>

<h3 class="mt-4 mb-2">Subheading</h3>
<p>Content</p>
```

### Between Sections

```html
<section class="rhythm-block mb-6">
  <h2>Section 1</h2>
  <p>Content</p>
</section>

<section class="rhythm-block">
  <h2>Section 2</h2>
  <p>Content</p>
</section>
```

### Between List Items

```html
<ul class="space-y-2">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Each item has 1rem bottom margin -->
```

## Horizontal Spacing

### Text Width / Reading Length

Optimal reading line length is 45-75 characters:

```html
<!-- Constrain text to readable width -->
<article class="max-w-prose">
  <p>Text stays between 45-75 characters for comfortable reading</p>
</article>

<!-- Prose container: approximately 65 characters at base size -->
<section class="max-w-prose">
  <h1>Article Title</h1>
  <p>Long-form content is most readable at this width</p>
</section>
```

### Column Spacing

```html
<div class="grid grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Gap inherits from rhythm system -->
<!-- gap-4 = 2.618rem between columns -->
```

## Container Padding

Apply rhythm-based padding to containers:

```html
<!-- Standard container with breathing room -->
<main class="p-4">
  <h1>Page Content</h1>
  <p>Container padding maintains rhythm</p>
</main>

<!-- Responsive padding -->
<div class="p-2 lg:p-6">
  Mobile: 1rem padding
  Desktop: 6.854rem padding
</div>
```

## Responsive Spacing

Spacing adjusts at breakpoints:

```html
<!-- Mobile: small gaps, Desktop: large gaps -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive margins -->
<section class="mb-2 lg:mb-6">
  Section with mobile/desktop margins
</section>
```

## Negative Margins

Pull elements closer together:

```html
<div class="mt-neg-2">Element pulled up by 1rem</div>
<div class="ml-neg-4">Element pulled left by 2.618rem</div>
```

Note: Use sparingly to maintain rhythm.

## Utility Classes Reference

### Margin Utilities

```
m-{value}    - margin all sides
mt-{value}   - margin-top
mb-{value}   - margin-bottom
ml-{value}   - margin-left
mr-{value}   - margin-right
mx-{value}   - margin horizontal
my-{value}   - margin vertical
```

### Padding Utilities

```
p-{value}    - padding all sides
pt-{value}   - padding-top
pb-{value}   - padding-bottom
pl-{value}   - padding-left
pr-{value}   - padding-right
px-{value}   - padding horizontal
py-{value}   - padding vertical
```

### Gap Utilities

```
gap-{value}  - grid/flex gap
space-y-{value}  - vertical spacing between children
space-x-{value}  - horizontal spacing between children
```

## Common Patterns

### Card with Padding

```html
<div class="card p-4">
  <h3 class="mt-0">Card Title</h3>
  <p class="mb-0">Card content</p>
</div>
```

### Article with Sections

```html
<article>
  <h1>Article Title</h1>

  <section class="my-6">
    <h2>Section 1</h2>
    <p>Content maintains rhythm throughout</p>
  </section>

  <section class="my-6">
    <h2>Section 2</h2>
    <p>Consistent spacing between sections</p>
  </section>
</article>
```

### List Items with Spacing

```html
<ul class="space-y-3">
  <li>
    <h4>Item</h4>
    <p>Description</p>
  </li>
  <li>
    <h4>Item</h4>
    <p>Description</p>
  </li>
</ul>
```

### Hero Section

```html
<header class="p-6 text-center">
  <h1 class="mb-2">Welcome</h1>
  <p class="text-lg mb-4">Tagline</p>
  <button class="btn btn-primary">Action</button>
</header>
```

## Advanced: Understanding Rhythm Blocks

```html
<!-- Rhythm block: all children maintain baseline grid -->
<article class="rhythm-block">
  <!-- This H1 is sized so it takes 2 rhythm units -->
  <h1>Heading</h1>

  <!-- This paragraph is sized so it takes 1 rhythm unit per line -->
  <p>Paragraph text</p>

  <!-- Spacing between elements also uses rhythm units -->
  <p>Another paragraph</p>

  <!-- Result: everything aligns perfectly -->
</article>
```

## Customization

Override rhythm unit for different base:

```css
:root {
  /* Increase rhythm for more generous spacing */
  --rhythm-unit: 1.25rem;

  /* Or decrease for tighter layouts */
  --rhythm-unit: 0.75rem;
}
```

## Best Practices

### ✓ Do

- Use rhythm classes for consistency
- Respect the spacing scale
- Maintain baseline alignment within sections
- Test on multiple screen sizes
- Use `rhythm-block` for major sections
- Follow the golden ratio principle

### ✗ Don't

- Mix different spacing systems
- Use arbitrary pixel values
- Forget responsive spacing
- Violate baseline alignment
- Ignore visual hierarchy
- Over-space small elements

## Debugging

Use the debug system to visualize rhythm:

```html
<div class="debug-grid">
  <article class="rhythm-block">
    <!-- Grid lines show baseline -->
    <h1>Heading</h1>
    <p>Text aligns to grid</p>
  </article>
</div>
```

See [Debug System](/css/debug/) for more tools.

## Learn More

- **[API Reference](/docs/vertical-rhythm-system/)** - Complete rhythm documentation
- **[Prose Layout](/docs/prose-layout-system/)** - Optimal content width
- **[Rhythm Application](/docs/rhythm-application-mixin/)** - Advanced rhythm techniques
- **[Grid System](/css/grid/)** - Grid spacing (gap)

---

Perfect spacing creates invisible order. [Learn about components](/css/buttons/)
