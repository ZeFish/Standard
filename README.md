# Standard Framework

Standard is built on the belief that design systems should be rooted in centuries of typographic tradition, mathematical precision, and the timeless principles of Swiss International Style.

- [Example](/example/)
- [Fonts](/fonts/)
- [Mardown](/markdown/)
- [Égalitarisme](/egalitarisme/)
- [Réciprocite](/reciprocite/)
- [Componnent](/compo/)
- [Unified Plugin](index-unified-plugin/)
- [CSS Framework](content/css/index.md)
- [Conard](/conard/)
- [Test](/test/)
- [11ty Plugin](content/11ty/index.md)
- [Cloudflare Fonction](content/cloudflare/index.md)

::center
Typography is the voice · Grid is the structure · Rhythm is the flow · Color is the emotion
::end

![npm](https://img.shields.io/npm/v/@zefish/standard)





> "Typography is the craft of endowing human language with a durable visual form."
> — Robert Bringhurst

## Mathematical Precision
Every measurement derives from the golden ratio (φ = 1.618)

::note Hola

## Fine-Art Typography Engine
Classical typography rules that CSS cannot handle. Automatic enhancement of text with smart quotes, proper punctuation, em-dashes, fraction formatting, and widow prevention.

## Swiss Grid System
12-column responsive grid inspired by Josef Müller-Brockmann with asymmetric layouts and free column positioning.

## Vertical Rhythm
Bulletproof spacing system where all elements align to a baseline grid using `1rlh` units

## Color System
Automatic light/dark theming with semantic colors and high-contrast support.

## Reading Layout
Editorial-quality layouts optimized for long-form content with multiple width variants.

## 11ty Ready
Complete 11ty plugin with Markdown enhancements, backlinks, encryption, and filters.

> A fine-art design framework implementing classical typography, Swiss grid systems, and vertical rhythm with mathematical precision.

## Getting Started


```bash
npm init -y
npm install --save-dev @11ty/eleventy
npm install @zefish/standard
```

Create `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  return {
    dir: { input: "content", output: "_site" }
  };
}
```

Create `_includes/layouts/base.njk`:

```nunjucks
<!DOCTYPE html>
<html lang="en" data-theme="default">
<head>
  {% standardMeta %}
  <title>{{ title or "My Site" }}</title>
  {% standardAssets %}
</head>
<body>
  <header>
    <h1>My Website</h1>
    {% standardMenu 1 %}
  </header>

  <main class="prose md">
    {{ content | safe }}
  </main>

  <footer>
    <p>&copy; {% year %}</p>
  </footer>
</body>
</html>
```

Create `content/index.md`:

```markdown
---
layout: layouts/base.njk
title: Home
---

# Welcome

Beautiful website. Beautiful typography. No CSS to write.
```

Build and view:

```bash
npx @11ty/eleventy --serve
```

**Done.** Your website is live at `http://localhost:8080` 🚀

---

## What You Get

- **Professional Typography** — Golden ratio proportions, perfect spacing
- **Responsive Design** — Mobile, tablet, desktop — all handled
- **Dark Mode** — Automatic system preference detection
- **Accessibility** — WCAG AA compliant from the start
- **No Configuration** — Works out of the box
- **Small & Fast** — 15KB CSS, 2KB JS (gzipped)
- **11ty Integration** — Enhanced markdown, backlinks, encryption

---

## Documentation

Comprehensive guides and API reference:

## User Guides
- **[CSS Framework](content/css/index.md)** - Typography, grid, spacing, colors
- **[11ty Plugin](content/11ty/index.md)** - Setup, markdown, filters, backlinks
- **[Quick Start](content/11ty/quick-start.md)** - Build your first site in 5 minutes
- **[Getting Started](content/11ty/getting-started.md)** - Complete setup guide

## 11ty Features
- **[Markdown Enhancements](content/11ty/markdown.md)** - Extended markdown syntax
- **[Filters & Helpers](content/11ty/filters.md)** - Data transformation
- **[Backlinks](content/11ty/backlinks.md)** - Wiki-style linking
- **[Encryption](content/11ty/encryption.md)** - Password protection
- **[Advanced Features](content/11ty/advanced.md)** - Power user techniques

## CSS Features
- **[Typography System](content/css/typography.md)** - Font scales and sizing
- **[Grid System](content/css/grid.md)** - Responsive layouts
- **[Color System](content/css/colors.md)** - Light/dark theming
- **[Spacing & Rhythm](content/css/spacing.md)** - Vertical rhythm

## API Reference
- **[Full API Docs](content/docs/index.md)** - Auto-generated from source code

---

## Examples

## Basic HTML

```html
<!DOCTYPE html>
<html>
<head>

</head>
<body>
  <h1>Hello World</h1>
  <p>Beautiful typography, automatically.</p>
</body>
</html>
```

## Responsive Grid

```html
<div class="grid">
  <div class="col-sm-row col-6 col-lg-4">
    Full width on mobile, half on tablet, third on desktop
  </div>
  <div class="col-sm-row col-6 col-lg-4">...</div>
  <div class="col-sm-row col-12 col-lg-4">...</div>
</div>
```

## 11ty with Backlinks

```markdown
---
layout: layouts/article.njk
title: My Article
---

# {{ title }}

Learn about [[TypeScript]] and [[Web Development]].

Backlinks automatically appear on those pages!
```

## Protected Content

```markdown
---
layout: layouts/article.njk
title: Premium Content
password: members-only
---

# Exclusive Article

Password protected, decrypts in the browser.
```
---

## Customization

Override CSS variables:

```css
:root {
  --color-accent: #0066cc;
  --font-family-serif: "Georgia", serif;
  --line-width: 60rem; /* Optimal reading width */
}
```
---

Inspired by:
- Robert Bringhurst — *The Elements of Typographic Style*
- Josef Müller-Brockmann — Swiss grid systems
- The web typography community

---

## Links

- **Homepage**: [standard.ffp.com](https://standard.ffp.com)
- **GitHub**: [github.com/ZeFish/Standard](https://github.com/ZeFish/Standard)
- **npm**: [@zefish/standard](https://www.npmjs.com/package/@zefish/standard)

---

**Standard Framework** — Stop configuring. Start creating. ✨
