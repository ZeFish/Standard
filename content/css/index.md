---
title: CSS Framework
layout: article
eleventyNavigation:
  key: CSS Framework
  title: CSS Framework
permalink: /css/
---

# Standard Framework CSS

A fine-art typography framework implementing classical design principles, mathematical precision with the golden ratio, and micro-typography rules inspired by the masters of print design.

## Philosophy

Standard Framework is built on the belief that **typography should follow mathematical principles**, not arbitrary rules. Every spacing, font size, and line height is calculated based on the golden ratio (1.618) to create visual harmony that feels right to the human eye.

### Core Principles

- **Mathematical Precision** - All measurements derive from the golden ratio
- **Vertical Rhythm** - Content flows with consistent baseline grid
- **Fine-Art Typography** - Inspired by classical print design masters
- **Responsive** - Breakpoints at mobile, small, large, and wide screens
- **Accessibility** - WCAG AA compliant color contrasts
- **Dark Mode** - Seamless light/dark theme with system preference detection
- **Modern CSS** - Pure CSS variables, no JavaScript required

## Quick Start

### Installation

```bash
npm install @zefish/standard
```

### Include in Your Project

```html
<link rel="stylesheet" href="/path/to/standard.min.css">
<script src="/path/to/standard.min.js" type="module"></script>
```

Or use the CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard/css">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>
```

### With 11ty

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
- **[Reading Layout](/css/reading/)** - Optimal line lengths and content width

### Components

- **[Button Component](/css/buttons/)** - Accessible, themed buttons
- **Form Elements** - Inputs, selects, textareas with consistent styling
- **[Debug System](/css/debug/)** - Visual debugging tools

### Utilities & Helpers

- **[Utilities](/css/utilities/)** - Helper classes for common patterns
- **[Design Tokens](/css/tokens/)** - CSS variables and customization

## Key Features

### 🎨 Color System
Light/dark theme with semantic colors that automatically adapt to user preferences.

```html
<div class="bg-background text-foreground">
  Automatically uses system theme preference
</div>
```

### 📐 Typography
Carefully calibrated font scales based on mathematical ratios.

```html
<h1>Perfect typography</h1>
<p>Sizes that work together harmoniously</p>
```

### 🔲 Responsive Grid
Mobile-first grid system with intuitive breakpoints.

```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
  <!-- Responsive columns -->
</div>
```

### 📏 Vertical Rhythm
Consistent spacing throughout your entire design.

```html
<article class="rhythm-block">
  <h2>Everything aligns perfectly</h2>
  <p>Spacing maintains baseline grid</p>
</article>
```

### ♿ Accessible
WCAG AA compliant from the start.

- Semantic HTML recommended
- High contrast color combinations
- Keyboard navigation support
- Screen reader friendly

### 🌓 Dark Mode
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
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-accent: #0066cc;

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
| Mobile | 0 - 479px | Default styles |
| Small | 480px+ | Tablets, small screens |
| Large | 1024px+ | Desktops |
| Wide | 1440px+ | Large displays |

## Learning Path

### Beginner
1. **[Getting Started](/css/getting-started/)** - Installation and basics
2. **[Typography](/css/typography/)** - Understanding font scales
3. **[Colors](/css/colors/)** - Using the color system

### Intermediate
4. **[Grid Layout](/css/grid/)** - Building responsive layouts
5. **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm mastery
6. **[Components](/css/buttons/)** - Using styled components

### Advanced
7. **[Customization](/css/customization/)** - Overriding defaults
8. **[Debug System](/css/debug/)** - Finding layout issues
9. **[Performance](/css/performance/)** - Optimization tips

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Sizes

```
standard.min.css     ~12 KB gzipped
standard.min.js      ~2 KB gzipped
```

## Features by Version

**v0.10.52** includes:

- ✅ Complete typography system
- ✅ Semantic color system with themes
- ✅ Responsive grid layout
- ✅ Vertical rhythm system
- ✅ Button components
- ✅ Form styling
- ✅ Utility classes
- ✅ Debug mode
- ✅ Cloudflare Functions plugin (bonus!)
- ✅ 11ty integration

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

### Dark Mode Button

```html
<button class="btn btn-primary">
  Click me!
</button>

<!-- Automatically themed based on system preference -->
```

### Responsive Typography

```html
<h1>Responsive Headline</h1>
<!-- Scales appropriately on mobile, tablet, desktop -->

<p class="text-lg">Large paragraph text</p>
<p class="text-sm">Small caption text</p>
```

## Next Steps

- **[Getting Started](/css/getting-started/)** - Set up the framework
- **[Browse Components](/docs/)** - Auto-generated component docs
- **[View Examples](/css/examples/)** - Real-world usage
- **[Customize](/css/customization/)** - Make it your own

## Support

- 📖 [Full Documentation](/css/)
- 🐛 [Report Issues](https://github.com/ZeFish/Standard/issues)
- 💬 [Discussions](https://github.com/ZeFish/Standard/discussions)
- ⭐ [Star on GitHub](https://github.com/ZeFish/Standard)
