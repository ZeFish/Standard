---
layout: base.njk
title: Getting Started
description: Quick start guide for Standard Framework - from setup to your first website
permalink: /getting-started/
comments: true
---

# Getting Started with Standard Framework

Welcome! Choose your path: use Standard CSS with any project, or use it as a complete 11ty plugin for content-heavy sites.

## Quick Navigation

- **[CSS Framework Overview](/css/)** - Typography, grid, colors, spacing, and utilities
- **[11ty Plugin Documentation](/11ty/)** - Complete integration and setup
- **[Cheat Sheet](/cheat-sheet/)** - Quick reference for common patterns

---

## Choose Your Path

### Path 1: Standalone CSS Only

Use Standard's CSS framework with any HTML or JavaScript framework (React, Vue, Svelte, etc.).

**Perfect for**: Static HTML, web apps, or any project needing beautiful styling.

### Path 2: 11ty + Standard Plugin

Use Standard as a complete 11ty plugin for blogs, documentation, and content sites.

**One plugin. Everything included:**
- Typography system with smart quotes and widow prevention
- Complete CSS framework (grid, spacing, colors)
- Enhanced markdown with syntax highlighting
- Template filters and shortcodes
- Wiki-style backlinks
- Cloudflare Functions (optional)
- GitHub Comments System (optional)

**Perfect for**: Blogs, documentation, knowledge bases, portfolios, marketing sites.

---

## Path 1: Standalone CSS Only

### Installation

#### Via npm

```bash
npm install @zefish/standard
```

#### Via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard@0.10.52/dist/standard.min.css">
<script src="https://unpkg.com/@zefish/standard@0.10.52/dist/standard.min.js" type="module"></script>
```

### Basic HTML Setup

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>

  <!-- Standard Framework CSS -->
  <link rel="stylesheet" href="https://unpkg.com/@zefish/standard/dist/standard.min.css">
</head>
<body class="bg-background text-foreground">
  <header class="rhythm-block padding-base">
    <h1>Welcome to Standard Framework</h1>
    <p class="text-color-subtle">Beautiful typography. Responsive layout. Automatic dark mode.</p>
  </header>

  <main class="width-line-base center-horizontally padding-base rhythm-block">
    <h2>Getting Started</h2>
    <p>
      Standard Framework provides everything you need for beautiful, accessible websites.
      No CSS to write. No design decisions to make. Just semantic HTML.
    </p>

    <h3>What You Get</h3>
    <ul>
      <li>Mathematical typography system based on golden ratio</li>
      <li>Responsive 12-column grid</li>
      <li>Semantic color system with automatic dark mode</li>
      <li>Vertical rhythm and spacing system</li>
      <li>Beautiful components and utilities</li>
      <li>100% accessible</li>
      <li>Zero JavaScript required</li>
    </ul>

    <h3>Your First Page</h3>
    <p>You're looking at it! This page uses nothing but semantic HTML and the Standard Framework CSS.</p>
  </main>

  <footer class="rhythm-block padding-base border-color-default" style="border-top: 1px solid;">
    <p class="text-color-subtle">&copy; 2024. Built with Standard Framework.</p>
  </footer>

  <!-- Standard Framework JS (optional) -->
  <script src="https://unpkg.com/@zefish/standard/dist/standard.min.js" type="module"></script>
</body>
</html>
```

### That's It!

You now have a beautiful, responsive, accessible website with:
- ✅ Perfect typography
- ✅ Dark mode support
- ✅ Mobile-friendly layout
- ✅ Semantic HTML
- ✅ Professional styling

Open in browser. No build process. No configuration.

---

## Path 2: 11ty + Standard (Complete Setup)

Perfect for blogs, documentation, and content-heavy sites.

### Step 1: Create Project

```bash
mkdir my-website
cd my-website
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install --save-dev @11ty/eleventy
npm install @zefish/standard
```

### Step 3: Create Config

Create `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  // Add Standard Framework plugin
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    useCDN: false
  });

  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "_includes"
    }
  };
}
```

### Step 4: Create Base Layout

Create `_includes/layouts/base.njk`:

```nunjucks
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or "My Website" }}</title>
  {% standardAssets %}
</head>
<body class="bg-background text-foreground">
  <header class="rhythm-block padding-base">
    <h1>My Website</h1>
    <nav class="display-flex gap-base">
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/blog/">Blog</a>
    </nav>
  </header>

  <main class="width-line-base center-horizontally padding-base rhythm-block">
    {{ content | safe }}
  </main>

  <footer class="rhythm-block padding-base border-color-default" style="border-top: 1px solid;">
    <p class="text-color-subtle">&copy; 2024. Built with Standard Framework.</p>
  </footer>
</body>
</html>
```

### Step 5: Create Content

Create `content/index.md`:

```markdown
---
layout: layouts/base.njk
title: Home
---

# Welcome

This is your homepage. Edit `content/index.md` to change the content.

Standard Framework handles all the styling automatically. Just write markdown.
```

Create `content/about.md`:

```markdown
---
layout: layouts/base.njk
title: About
---

# About Me

Tell people about yourself here.

This page automatically gets the same beautiful styling as your homepage.
```

### Step 6: Build & Preview

```bash
npx @11ty/eleventy --serve
```

Visit `http://localhost:8080`

Your website is live with:
- ✅ Beautiful typography
- ✅ Responsive layout
- ✅ Dark mode
- ✅ Professional styling
- ✅ Zero configuration

---

## Common First Steps

### Add Blog Posts

```bash
mkdir content/blog
```

Create `content/blog/first-post.md`:

```markdown
---
layout: layouts/base.njk
title: My First Post
date: 2024-10-22
---

# {{ title }}

<time>{{ date | dateFilter('long') }}</time>

Your post content here.
```

### Customize Colors

Create `_data/site.js`:

```javascript
export default {
  name: "My Website",
  url: "https://example.com"
};
```

Override colors in CSS:

```css
:root {
  --color-accent: #0066cc;
  --color-background: #ffffff;
  --color-foreground: #000000;
}
```

### Add Navigation Menu

Add to front matter:

```markdown
---
layout: layouts/base.njk
eleventyNavigation:
  key: About
  title: About
  order: 2
---
```

11ty automatically builds the navigation.

### Protect Content with Password

```markdown
---
layout: layouts/base.njk
title: Premium Content
encrypted: true
password: my-secret
---

# Members Only

This content is password protected.
```

---

## Understanding the Basics

### Semantic HTML

Standard Framework works best with semantic HTML:

```html
<!-- Good - semantic elements -->
<article>
  <h1>Title</h1>
  <p>Content</p>
</article>

<!-- Also good -->
<section>
  <h2>Section title</h2>
  <p>Content</p>
</section>

<aside>
  <h3>Sidebar</h3>
  <p>Side content</p>
</aside>
```

### CSS Variables (Design Tokens)

All colors, spacing, and typography use CSS variables:

```css
:root {
  /* Spacing - standard scale */
  --base-d3: 0.25rem;
  --base-d2: 0.5rem;
  --base: 1rem;           /* base/default */
  --base-2: 2rem;
  --base-3: 4rem;

  /* Colors */
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-accent: #0066cc;

  /* Typography */
  --font-text: InterVariable, system-ui, sans-serif;
  --font-header: InterVariable, system-ui, sans-serif;
  --scale: 1rem;           /* base font size */
  --line-height: 1.5;
}
```

Customize by overriding:

```css
:root {
  --color-accent: #ff6b35;
  --font-header: "Georgia", serif;
}
```

### Responsive Design

Mobile-first approach using utility classes:

```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="display-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Dark Mode

Automatic based on system preference. No configuration needed.

Test in browser:
- **macOS**: System Preferences → General → Appearance → Dark
- **Windows**: Settings → Personalization → Colors → Dark
- **Browser DevTools**: Emulate CSS media feature `prefers-color-scheme`

---

## Project Structure

### Standalone

```
my-project/
├── index.html          # Your page
├── css/
│   └── custom.css      # Optional custom styles
└── images/
    └── logo.png
```

### 11ty + Standard

```
my-website/
├── eleventy.config.js  # 11ty config
├── package.json        # Dependencies
├── content/
│   ├── index.md        # Homepage
│   ├── about.md        # About page
│   └── blog/
│       └── post-1.md   # Blog post
├── _includes/
│   └── layouts/
│       └── base.njk    # Main layout
└── _site/              # Built output (auto-generated)
```

---

## Utilities

Standard Framework includes extensive utility classes for spacing, sizing, typography, and layout.

See the complete [Utilities Reference](/css/utilities/) for:
- **Margin utilities** — `.margin-top-base`, `.margin-left-l`, etc.
- **Padding utilities** — `.padding-base`, `.padding-xl`, etc.
- **Sizing utilities** — `.width-full`, `.height-auto`, etc.
- **Typography utilities** — `.text-size-small`, `.text-weight-bold`, etc.
- **Color utilities** — `.text-color-muted`, `.background-color-secondary`, etc.
- **Layout utilities** — `.display-flex`, `.center-content`, etc.

**Quick tip**: All utilities follow the pattern `[property]-[side]-[size]` making them easy to guess.

---

## Next Steps

### Learn More

- **[CSS Framework](/css/)** — Typography, colors, grid, spacing
- **[Utilities Reference](/css/utilities/)** — All helper classes
- **[Utilities Cheat Sheet](/cheat-sheet/)** — Quick reference
- **[11ty Plugin](/11ty/)** — Collections, filters, markdown

### For Content Sites

- **[Markdown Features](/11ty/markdown/)** — Enhanced markdown support
- **[Backlinks](/11ty/backlinks/)** — Connect related pages
- **[Encryption](/11ty/encryption/)** — Password-protect content
- **[Filters](/11ty/filters/)** — Transform data

### For Designers

- **[Typography](/css/typography/)** — Font system and scales
- **[Colors](/css/colors/)** — Semantic color system
- **[Layout Systems](/css/grid/)** — Grid and spacing

---

## Common Issues

### CSS Not Loading (Standalone)

Check the path:

```html
<!-- Correct for npm -->
<link rel="stylesheet" href="node_modules/@zefish/standard/dist/standard.min.css">

<!-- Correct for CDN -->
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard/dist/standard.min.css">
```

### Styles Not Applying (11ty)

Ensure `{% standardAssets %}` is in your layout `<head>`:

```nunjucks
<head>
  {% standardAssets %}
</head>
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf _site node_modules/.cache
npm run build
```

### Changes Not Showing

When using `npm start` with 11ty:

```bash
# Restart the dev server
Ctrl+C
npm start
```

---

## Get Help

- **[Utilities Cheat Sheet](/cheat-sheet/)** — Quick reference card
- **[Full API Reference](/docs/)** — Auto-generated documentation
- **[Examples](/examples/)** — Code examples
- **[GitHub Issues](https://github.com/zefish/standard)** — Report bugs

---

## You're Ready!

You now have everything needed to build beautiful, professional websites.

**Standalone**: Your first page is already live above.

**11ty + Standard**: Run `npm start` and visit `http://localhost:8080`.

**That's it. Start building.** ✨

---

## What's Next?

- Add more content
- Customize colors and fonts
- Add images and media
- Create collections and filters
- Deploy your site
- Share your creation!

Remember: **Stop configuring. Start creating.**

The boring stuff is handled. Focus on your content.
