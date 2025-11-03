---
title: Typography System

eleventyNavigation:
  key: Typography
  parent: CSS Framework
  title: Typography
permalink: /css/typography/
comment: true
---

# Typography System

Master font scales, sizes, weights, and line heights based on the golden ratio for perfect readability and visual harmony.

## Quick Navigation

- **[Grid System](/css/grid/)** - Flexible layouts and responsive columns
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Prose System](/css/prose/)** - Readable article layouts
- **[Colors](/css/colors/)** - Text and background colors
- **[Utilities](/css/utilities/)** - Helper classes for common patterns

## Font Families

Standard Framework uses system fonts for maximum performance and compatibility.

### Serif Font (Default for body text)

```css
--font-family-serif: Georgia, 'Times New Roman', serif;
```

Used for:
- Paragraph text
- Body content
- Long-form reading

```html
<p>This uses the serif font family for comfortable reading</p>
```

### Sans-serif Font (For headings and UI)

```css
--font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Used for:
- Headings
- Navigation
- UI elements
- User interface

```html
<h1>Heading in sans-serif</h1>
<nav>Navigation here</nav>
```

## Font Sizes

Sizes scale using the golden ratio, creating perfect proportions:

| Size | Usage | CSS Variable | Pixels (base 16) |
|------|-------|--------------|------------------|
| Base | Default body text | `--font-size-base` | 16px |
| Small | Captions, fine print | `--font-size-sm` | 14px |
| Large | Emphasis, larger text | `--font-size-lg` | 18px |
| XL | Important content | `--font-size-xl` | 20px |
| 2XL | Subheadings | `--font-size-2xl` | 26px |
| 3XL | Large headings | `--font-size-3xl` | 42px |
| 4XL | Hero text | `--font-size-4xl` | 68px |

### HTML Usage

```html
<!-- Using semantic tags -->
<h1>Main Heading</h1>        <!-- 4XL = 68px -->
<h2>Section Heading</h2>     <!-- 3XL = 42px -->
<h3>Subsection</h3>          <!-- 2XL = 26px -->
<p>Body text</p>             <!-- Base = 16px -->
<small>Fine print</small>    <!-- Small = 14px -->
```

### CSS Classes

```html
<!-- Using text size classes -->
<p class="text-sm">Small text</p>
<p class="text-base">Base text</p>
<p class="text-lg">Large text</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">2X large</p>
<p class="text-3xl">3X large</p>
<p class="text-4xl">4X large</p>
```

## Line Height

Optimal line heights for different contexts, designed for readability:

```css
--lh-lrh-base: 1.618;        /* Body text */
--lh-lrh-headings: 1.2;      /* Headings are compacter */relaxed
--lh-lrh-compact: 1.4;         /* Dense content */
--lh-lrh-relaxed: 1.875;       /* Comfortable reading */
```

### Examples

```html
<!-- Default line height (1.618 for body) -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>

<!-- relaxed line height for accessibility -->
<p class="leading-relaxed">Text with more breathing room</p>

<!-- compact line height for headlines -->
<h1 class="leading-compact">Headline with less space between lines</h1>
```

## Font Weights

Professional weight hierarchy for visual distinction:

| Weight | Name | Usage | CSS |
|--------|------|-------|-----|
| 400 | Regular | Body text, default | `font-weight: 400` |
| 500 | Medium | Emphasis | `font-weight: 500` |
| 600 | Semibold | Strong emphasis | `font-weight: 600` |
| 700 | Bold | Headings, important | `font-weight: 700` |
| 800 | Extra Bold | Headlines | `font-weight: 800` |

### Examples

```html
<p class="font-normal">Regular weight text</p>
<p class="font-medium">Medium weight emphasis</p>
<p class="font-semibold">Semibold for stronger emphasis</p>
<p class="font-bold">Bold for important text</p>
<p class="font-extrabold">Extra bold for headlines</p>

<!-- Semantic HTML -->
<strong>Strong emphasis (bold)</strong>
<em>Emphasis (italic)</em>
```

## Letter Spacing

Refined letter spacing for different contexts:

```css
--letter-spacing-compact: -0.02em;   /* Condensed headlines */
--letter-spacing-normal: 0;         /* Default */
--letter-spacing-wide: 0.05em;      /* Spaced text */
--letter-spacing-wider: 0.1em;      /* Very spaced */
```

### Examples

```html
<!-- compact spacing for headlines -->
<h1 class="tracking-compact">Condensed Headline</h1>

<!-- Wide spacing for emphasis -->
<p class="tracking-wide">SPACED OUT TEXT</p>

<!-- Default spacing -->
<p class="tracking-normal">Normal spacing here</p>
```

## Text Styles

### Headings

```html
<h1>H1 - Main page heading (68px)</h1>
<h2>H2 - Section heading (42px)</h2>
<h3>H3 - Subsection (26px)</h3>
<h4>H4 - Minor heading (20px)</h4>
<h5>H5 - Sub-minor heading (18px)</h5>
<h6>H6 - Small heading (16px)</h6>
```

### Paragraphs

```html
<!-- Default body text -->
<p>Standard paragraph with optimal line height and spacing</p>

<!-- Larger paragraph -->
<p class="text-lg">
  Larger paragraph for emphasis or introduction
</p>

<!-- Small text / captions -->
<p class="text-sm">Small caption or fine print</p>
```

### Lists

```html
<!-- Unordered list -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<!-- Description list -->
<dl>
  <dt>Term</dt>
  <dd>Definition of the term</dd>
</dl>
```

### Links

```html
<!-- Default link styling -->
<a href="/page">Link text</a>

<!-- Visited link -->
<a href="/visited-page">Visited link</a>

<!-- Hover effect -->
<!-- Automatically enhanced with hover states -->
```

## Emphasis & Special Text

```html
<!-- Strong emphasis (bold) -->
<strong>This is important</strong>

<!-- Regular emphasis (italic) -->
<em>This is emphasized</em>

<!-- Code / monospace -->
<code>variable_name</code>

<!-- Keyboard input -->
<kbd>Ctrl+S</kbd>

<!-- Variable -->
<var>x</var> = 10

<!-- Subscript -->
H<sub>2</sub>O

<!-- Superscript -->
E = mc<sup>2</sup>

<!-- Deleted text -->
<del>Old text</del>

<!-- Inserted text -->
<ins>New text</ins>

<!-- Mark / highlight -->
<mark>Highlighted text</mark>
```

## Responsive Typography

Font sizes automatically scale on different breakpoints:

```html
<!-- Base: 16px on mobile -->
<!-- md: 18px on tablets (480px+) -->
<!-- lg: 20px on desktop (1024px+) -->
<p>Text scales automatically for readability</p>

<!-- Explicit responsive sizes -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
  Responsive heading
</h1>
```

## Text Alignment

```html
<!-- Left aligned (default) -->
<p class="text-left">Left aligned text</p>

<!-- Center aligned -->
<p class="text-center">Center aligned text</p>

<!-- Right aligned -->
<p class="text-right">Right aligned text</p>

<!-- Justified -->
<p class="text-justify">Justified text spans full width</p>
```

## Text Transformation

```html
<!-- Uppercase -->
<p class="uppercase">this text becomes uppercase</p>

<!-- Lowercase -->
<p class="lowercase">THIS TEXT BECOMES LOWERCASE</p>

<!-- Capitalize -->
<p class="capitalize">this text is capitalized</p>

<!-- Normal case -->
<p class="normal-case">NoRmAl CaSe</p>
```

## Truncation

```html
<!-- Single line truncation -->
<p class="truncate">This long text will be truncated with ellipsis...</p>

<!-- Multi-line truncation -->
<p class="line-clamp-2">Multiple lines can be clamped...</p>
<p class="line-clamp-3">Up to 3 lines for this paragraph...</p>
```

## Customization

Override typography defaults with CSS variables:

```css
:root {
  /* Change base font size */
  --font-size-base: 18px;

  /* Change line height */
  --lh-lrh-base: 1.8;

  /* Change font family */
  --font-family-serif: 'Garamond', Georgia, serif;
  --font-family-sans: 'Helvetica Neue', Arial, sans-serif;

  /* Change letter spacing */
  --letter-spacing-compact: -0.03em;
}
```

## Best Practices

### ✓ Do

- Use semantic HTML tags (`<h1>`, `<p>`, `<strong>`)
- Start with `<h1>` on each page
- Follow heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- Keep line lengths between 45-75 characters for readability
- Use sufficient contrast between text and background
- Test typography on mobile devices

### ✗ Don't

- Skip heading levels (don't jump from `<h1>` to `<h3>`)
- Use headings for styling (use classes instead)
- Make text too small (`< 14px`)
- Use excessive font styles
- Violate color contrast requirements

## Learn More

- **[API Reference](/docs/typography-system/)** - Detailed SCSS documentation
- **[Color System](/css/colors/)** - Text colors and contrast
- **[Spacing & Rhythm](/css/spacing/)** - Spacing around text
- **[Responsive Design](/css/grid/)** - Typography at different sizes

---

Perfect typography is mathematical precision. [Master the spacing system](/css/spacing/)
