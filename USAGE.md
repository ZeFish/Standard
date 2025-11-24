# Standard Framework - Astro Integration

A comprehensive design system and typography framework for Astro projects. Built on centuries of typographic tradition, mathematical precision, and Swiss International Style principles.

## Quick Start

### 1. Install

```bash
npm install @zefish/standard
```

### 2. Basic Setup

Add to your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [standard()],
});
```

That's it! Your Astro project now has:

- ✅ **Typography Engine** - Smart quotes, dashes, fractions, widow prevention
- ✅ **Swiss Grid System** - 12-column responsive layout
- ✅ **Vertical Rhythm** - Baseline grid alignment
- ✅ **Color System** - Automatic light/dark theming
- ✅ **Reading Layout** - Editorial-quality content styling
- ✅ **Markdown Enhancements** - Callouts, syntax highlighting, footnotes

## Features Overview

### Typography Engine
Automatically enhances text with classical typography rules:
- Smart quotes (curly quotes)
- Proper dashes (em-dash, en-dash)
- Ellipsis (…) instead of three dots
- Fraction formatting (½, ¼, ¾)
- Widow/orphan prevention
- Locale-aware rules (EN, FR, DE, ES, IT)

### CSS Framework
- **Golden Ratio** - All measurements derive from φ = 1.618
- **12-Layer ITCSS** - Organized, scalable architecture
- **Utility Classes** - `.rhythm`, `.prose`, `.grid`, `.col-6`
- **Responsive Grid** - Mobile-first 12-column system
- **Design Tokens** - CSS custom properties for theming

### Components & Layouts
- `Base.astro` - Main layout with navigation and footer
- `Meta.astro` - SEO meta tags component
- `Menu.astro` - Navigation menu component
- `Fonts.astro` - Typography loading component
- `Comments.astro` - GitHub-backed comments system

## Configuration

### Basic Configuration

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Typography features
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        enableFractions: true,
        locale: "en"
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
  ],
});
```

### Advanced Configuration

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Custom config file path
      configPath: "./my-site-config.yml",
      
      // Disable automatic route injection
      injectRoutes: false,
      
      // Markdown plugins
      tags: {
        enabled: true
      },
      syntax: {
        enabled: true,
        theme: "prism"
      },
      escapeCode: {
        languages: ["html", "css", "javascript"]
      },
      
      // Typography customization
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        enableFractions: true,
        enableArrowsAndSymbols: true,
        enableNumberFormatting: true,
        enableSpacing: true,
        locale: "fr", // French rules
        observeDOM: true,
        autoProcess: true
      }
    })
  ],
});
```

## Usage Examples

### Using Layouts

```astro
---
import Base from "@zefish/standard/layouts/Base.astro";
---

<Base title="My Page" description="Page description">
  <h1>Welcome to My Site</h1>
  <p>This page uses the Standard Framework layout.</p>
</Base>
```

### Using Components

```astro
---
import Menu from "@zefish/standard/components/Menu.astro";
---

<nav>
  <Menu 
    items={[
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ]} 
  />
</nav>
```

### Importing CSS Directly

```javascript
// In your main layout or component
import "@zefish/standard/css";
import "@zefish/standard/theme";
```

### Using Typography Features

The typography engine automatically processes text. Enable it in your layout:

```astro
---
// This will automatically enhance text with smart quotes, dashes, etc.
---

<div class="prose">
  <h1>The Art of Typography</h1>
  <p>"Typography is the craft of endowing human language with a durable visual form."</p>
  <p>It converts -- to em-dashes, three dots to ellipsis…, and 1/2 to fractions.</p>
</div>
```

### Grid System

```html
<div class="grid">
  <div class="col-6">
    <h2>Left Column</h2>
    <p>Content here spans 6 columns on desktop.</p>
  </div>
  <div class="col-6">
    <h2>Right Column</h2>
    <p>Content here spans 6 columns on desktop.</p>
  </div>
</div>

<!-- Responsive columns -->
<div class="grid">
  <div class="col-12 md:col-6 lg:col-4">
    <p>Responsive: 12 cols mobile, 6 tablet, 4 desktop</p>
  </div>
</div>
```

### Vertical Rhythm

```html
<div class="rhythm">
  <h1>Heading</h1>
  <p>First paragraph sits on the baseline grid.</p>
  <p>Second paragraph maintains rhythm.</p>
  <h2>Subheading</h2>
  <p>Still aligned to the baseline grid.</p>
</div>
```

## Available Exports

### Main Integration
```javascript
import standard from "@zefish/standard";
```

### CSS & JavaScript
```javascript
import "@zefish/standard/css";      // Main CSS framework
import "@zefish/standard/theme";    // Theme variations
import "@zefish/standard/js";       // Typography engine
import "@zefish/standard/lab";      // Experimental features
```

### Components
```javascript
import Base from "@zefish/standard/layouts/Base.astro";
import Meta from "@zefish/standard/layouts/Meta.astro";
import Menu from "@zefish/standard/components/Menu.astro";
import Fonts from "@zefish/standard/components/Fonts.astro";
import Comments from "@zefish/standard/components/Comments.astro";
```

### Markdown Plugins
```javascript
import remarkTags from "@zefish/standard/remark/tags";
import remarkStandard from "@zefish/standard/remark/standard";
import remarkEscapeCode from "@zefish/standard/remark/escape-code";
import remarkFixDates from "@zefish/standard/remark/fix-dates";
import remarkSyntax from "@zefish/standard/remark/syntax";
import rehypeStandard from "@zefish/standard/rehype/standard";
import rehypeTypography from "@zefish/standard/rehype/typography";
```

### Routes
```javascript
import robots from "@zefish/standard/routes/robots.js";
import manifest from "@zefish/standard/routes/manifest.js";
import headers from "@zefish/standard/routes/headers.js";
```

### Utilities
```javascript
import content from "@zefish/standard/utils/content.js";
import typography from "@zefish/standard/utils/typography.js";
```

## Configuration File

You can use a `site.config.yml` file for configuration:

```yaml
title: "My Site"
description: "A site built with Standard Framework"
author:
  name: "Your Name"

# Typography settings
typography:
  enableSmartQuotes: true
  enablePunctuation: true
  enableWidowPrevention: true
  locale: "en"

# Grid settings
grid:
  columns: 12
  gap: "1rem"

# Comments system
comments:
  enabled: true
  apiEndpoint: "/api/comments"
  commentsPath: "data/comments"

# Navigation
nav:
  header:
    - href: "/"
      label: "Home"
    - href: "/about"
      label: "About"
```

## Design Principles

### Mathematical Precision
Every measurement derives from the golden ratio (φ = 1.618):
- Base spacing: 1.5rem (24px)
- Scale multipliers: 1.5, 2.25, 3.375, 5.063
- Typography: 1.618 ratio between heading levels

### Swiss International Style
- Clean, objective design
- 12-column grid system
- Mathematical grid-based layouts
- Hierarchy through scale and weight

### Classical Typography
- Rules from masters of print design
- Locale-aware smart quotes
- Proper punctuation and spacing
- Widow/orphan prevention

### Progressive Enhancement
- Core experience without JavaScript
- JavaScript enhances, doesn't require
- Features degrade gracefully
- Mobile-first responsive design

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- JavaScript features are progressive enhancement

## Troubleshooting

### Typography not working
Ensure JavaScript is enabled and the standard.js script is loaded:
```html
<script type="module">
  import "/assets/js/standard.js";
</script>
```

### Grid not responsive
Make sure you're using the correct class names:
```html
<!-- Correct -->
<div class="grid">
  <div class="col-6 md:col-4 lg:col-3">
</div>

<!-- Incorrect -->
<div class="grid">
  <div class="col-6 medium-col-4 large-col-3">
</div>
```

### Styles not applying
Import the CSS framework:
```javascript
import "@zefish/standard/css";
```

## Examples

See the [Standard Framework repository](https://github.com/ZeFish/Standard) for complete examples and documentation.

## License

MIT License - see [LICENSE](https://github.com/ZeFish/Standard/blob/main/LICENSE) file.

## Support

- [GitHub Issues](https://github.com/ZeFish/Standard/issues)
- [Documentation](https://standard.ffp.co)
- [NPM Package](https://www.npmjs.com/package/@zefish/standard)