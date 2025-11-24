# Standard Framework - Example Usage

This is a minimal example showing how to use `@zefish/standard` in your Astro project.

## Quick Start

### 1. Install the Package

```bash
npm install @zefish/standard
```

### 2. Configure Astro

Add to your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        locale: "en"
      },
      comments: {
        enabled: true
      }
    })
  ],
});
```

### 3. Use the Layout

```astro
---
import Base from "@zefish/standard/layouts/Base.astro";
---

<Base title="My Page">
  <h1>Welcome to My Site</h1>
  <p>This page automatically gets smart typography, grid system, and beautiful styling!</p>
</Base>
```

## What You Get

✅ **Smart Typography** - Automatic quotes, dashes, fractions, and widow prevention  
✅ **Swiss Grid System** - Responsive 12-column layouts  
✅ **Vertical Rhythm** - Perfect baseline alignment  
✅ **Color System** - Automatic light/dark theming  
✅ **Reading Layout** - Editorial-quality content styling  
✅ **Markdown Enhancements** - Callouts, syntax highlighting, footnotes  

## Key Features

### Typography Engine
Automatically enhances text with classical typography rules:
- Converts "straight quotes" to "curly quotes"
- Converts `--` to em-dashes (—)
- Converts `...` to ellipsis (…)
- Converts `1/2` to fractions (½)
- Prevents widows and orphans

### Grid System
```html
<div class="grid">
  <div class="col-6">Left column</div>
  <div class="col-6">Right column</div>
</div>
```

### Vertical Rhythm
```html
<div class="rhythm">
  <h1>Heading</h1>
  <p>Perfectly aligned to baseline grid</p>
  <p>Maintains consistent spacing</p>
</div>
```

## Available Components

```javascript
// Layouts
import Base from "@zefish/standard/layouts/Base.astro";
import Meta from "@zefish/standard/layouts/Meta.astro";

// Components
import Menu from "@zefish/standard/components/Menu.astro";
import Comments from "@zefish/standard/components/Comments.astro";
import Fonts from "@zefish/standard/components/Fonts.astro";
```

## CSS Framework

Import the CSS framework:

```javascript
import "@zefish/standard/css";
import "@zefish/standard/theme";
```

Then use utility classes:
- `.rhythm` - Vertical rhythm system
- `.prose` - Reading layout
- `.grid` - 12-column grid
- `.col-{1-12}` - Column sizing
- `.md:col-{1-12}` - Responsive columns

## Configuration

Customize in your `astro.config.mjs`:

```javascript
standard({
  // Typography features
  typography: {
    enableSmartQuotes: true,
    enablePunctuation: true,
    enableWidowPrevention: true,
    enableFractions: true,
    locale: "en" // en, fr, de, es, it
  },
  
  // Grid system
  grid: {
    columns: 12,
    gap: "1rem"
  },
  
  // Comments system
  comments: {
    enabled: true,
    apiEndpoint: "/api/comments"
  },
  
  // Route injection
  injectRoutes: true
})
```

## Design Principles

- **Mathematical Precision** - Golden ratio throughout (φ = 1.618)
- **Swiss International Style** - Clean, objective design
- **Classical Typography** - Rules from masters of print design
- **Progressive Enhancement** - Works without JavaScript
- **Zero Dependencies** - Pure CSS and vanilla JavaScript

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- JavaScript features are progressive enhancement

## Learn More

- [Full Documentation](https://github.com/ZeFish/Standard)
- [NPM Package](https://www.npmjs.com/package/@zefish/standard)
- [Live Examples](https://standard.ffp.co)

---

**Built with precision. Crafted with care. Designed for the long haul.**