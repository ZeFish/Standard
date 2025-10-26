---
title: CSS Framework

eleventyNavigation:
  key: CSS Framework
  title: CSS Framework
permalink: /css/
---

# Standard Framework CSS

Professional typography framework with responsive layouts, semantic colors, dark mode support, and mathematical precision based on the golden ratio. Build beautiful, accessible interfaces with pre-calculated font scales, spacing systems, and components.

## Quick Start

### Installation

```html
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard/css">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>
```

#### With 11ty

```bash
npm install @zefish/standard
```

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);
}
```

Then in your templates:

```nunjucks
{% standardAssets %}
```

## What's Included

### Foundation Systems

- **[Typography System](/css/typography/)** - Font scales, sizes, weights, line heights
- **[Color System](/css/colors/)** - Semantic colors, light/dark themes, accessibility
- **[Grid System](/css/grid/)** - Flexible layout system with breakpoints
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm, margins, padding
- **[Prose Layout](/css/prose/)** - Optimal line lengths and content width

### Components

- **[Button Component](/css/buttons/)** - Accessible, themed buttons
- **Form Elements** - Inputs, selects, textareas with consistent styling
- **[Debug System](/css/debug/)** - Visual debugging tools

### Utilities & Helpers

- **[Utilities](/css/utilities/)** - Helper classes for common patterns
- **[Design Tokens](/css/tokens/)** - CSS variables and customization

## Key Features

### Color System
Light/dark theme with semantic colors that automatically adapt to user preferences.

```html
<div class="bg-background text-foreground">
  Automatically uses system theme preference
</div>
```

### Responsive Grid
Mobile-first grid system with intuitive breakpoints.

```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
  <!-- Responsive columns -->
</div>
```

### Vertical Rhythm
Consistent spacing throughout your entire design.

```html
<article class="rhythm-block">
  <h2>Everything aligns perfectly</h2>
  <p>Spacing maintains baseline grid</p>
</article>
```

### Dark Mode
Automatic theme switching respects user preferences.

```css
@media (prefers-color-scheme: dark) {
  /* Dark theme automatically applied */
}
```

## CSS Variables (Design Tokens)

Customize the framework by overriding CSS variables.

```css
:root {
  /* Typography */
  --font-family-serif: Georgia, serif;
  --font-family-sans: -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.618;

  /* Colors */
  --color-light-background: #ffffff;
  --color-light-foreground: #000000;
  --color-light-accent: #0066cc;

  /* Spacing */
  --rhythm-unit: 1rem;
  --breakpoint-mobile: 480px;
  --breakpoint-small: 768px;
  --breakpoint-large: 1024px;
  --breakpoint-wide: 1440px;
}
```

## Breakpoints

Mobile-first responsive design with four tiers:

| Name | Width | Usage |
|------|-------|-------|
| Mobile | 0 - 600px | Default styles |
| Small | 768px+ | Tablets, small screens |
| Large | 1024px+ | Desktops |
| Wide | 1440px+ | Large displays |

## File Sizes

```
standard.min.css     ~12 KB gzipped
standard.min.js      ~2 KB gzipped
```


## Examples

### Basic Layout

```html
<body class="bg-background text-foreground">
  <header>
    <h1>Welcome</h1>
  </header>

  <main class="grid grid-cols-1 lg:grid-cols-3">
    <article class="rhythm-block">
      <h2>Content</h2>
      <p>Your article here</p>
    </article>

    <aside>
      <h3>Sidebar</h3>
      <p>Supporting content</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</body>
```