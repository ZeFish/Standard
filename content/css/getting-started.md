---
title: Getting Started with CSS Framework
layout: article
eleventyNavigation:
  key: Getting Started
  parent: CSS Framework
  title: Getting Started
permalink: /css/getting-started/
---

# Getting Started

Install and set up the Standard Framework CSS in your project.

## Installation

### Via npm

```bash
npm install @zefish/standard
```

### Via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard@0.10.52/dist/standard.min.css">
<script src="https://unpkg.com/@zefish/standard@0.10.52/dist/standard.min.js" type="module"></script>
```

## Basic Setup

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>
  
  <!-- Standard Framework CSS -->
  <link rel="stylesheet" href="/css/standard.min.css">
</head>
<body>
  <h1>Welcome to Standard Framework</h1>
  
  <!-- Standard Framework JS -->
  <script src="/js/standard.min.js" type="module"></script>
</body>
</html>
```

### With npm

If installed via npm:

```html
<!-- Import CSS -->
<link rel="stylesheet" href="node_modules/@zefish/standard/dist/standard.min.css">

<!-- Import JS -->
<script src="node_modules/@zefish/standard/dist/standard.min.js" type="module"></script>
```

## With 11ty (Eleventy)

### Step 1: Install

```bash
npm install @zefish/standard
```

### Step 2: Configure eleventy.config.js

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    useCDN: false,
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
}
```

### Step 3: Use in Templates

In your base layout:

```nunjucks
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  
  <!-- This includes CSS and JS automatically -->
  {% standardAssets %}
</head>
<body>
  {{ content | safe }}
</body>
</html>
```

### Step 4: Build

```bash
npm run build
```

## Your First Page

### Basic HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
  <link rel="stylesheet" href="/css/standard.min.css">
</head>
<body>
  <header class="rhythm-block">
    <h1>Welcome</h1>
    <p class="text-lg">Build beautiful sites with mathematical precision</p>
  </header>

  <main class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Main content -->
    <article class="rhythm-block lg:col-span-2">
      <h2>Getting Started</h2>
      <p>
        Standard Framework provides a complete CSS system based on the golden ratio
        for perfect typography and spacing.
      </p>
      
      <h3>What You Get</h3>
      <ul>
        <li>Mathematical typography system</li>
        <li>Semantic color system with themes</li>
        <li>Responsive grid layout</li>
        <li>Vertical rhythm spacing</li>
        <li>Beautiful components</li>
      </ul>
    </article>

    <!-- Sidebar -->
    <aside class="rhythm-block">
      <h3>Quick Links</h3>
      <nav>
        <ul>
          <li><a href="/css/typography/">Typography</a></li>
          <li><a href="/css/colors/">Colors</a></li>
          <li><a href="/css/grid/">Grid</a></li>
          <li><a href="/css/spacing/">Spacing</a></li>
        </ul>
      </nav>
    </aside>
  </main>

  <footer class="rhythm-block">
    <p>&copy; 2024. Built with Standard Framework.</p>
  </footer>

  <script src="/js/standard.min.js" type="module"></script>
</body>
</html>
```

## Understanding the Basics

### Semantic HTML

Standard Framework works best with semantic HTML:

```html
<!-- ✓ Good - semantic -->
<article>
  <h1>Title</h1>
  <p>Content</p>
</article>

<!-- ✗ Avoid - non-semantic -->
<div class="article">
  <div class="heading">Title</div>
  <div class="text">Content</div>
</div>
```

### CSS Variables (Design Tokens)

Customize the framework by setting CSS variables:

```css
:root {
  /* Override typography */
  --font-size-base: 18px;
  --line-height-base: 1.8;

  /* Override colors */
  --color-accent: #ff6b35;

  /* Override spacing */
  --rhythm-unit: 1.5rem;
}
```

### Responsive Design

Mobile-first approach:

```html
<!-- Base: mobile style -->
<div class="grid grid-cols-1">
  <!-- 1 column on mobile -->
</div>

<!-- Add md: prefix for tablets (480px+) -->
<div class="grid grid-cols-1 md:grid-cols-2">
  <!-- 1 column mobile, 2 columns tablet+ -->
</div>

<!-- Add lg: prefix for desktop (1024px+) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 mobile, 2 tablet, 3 desktop -->
</div>
```

### Dark Mode

Automatic theme switching based on system preference:

```html
<body class="bg-background text-foreground">
  <!-- Automatically light or dark based on system preference -->
</body>
```

Users can also override with system settings or browser dev tools.

## Common Patterns

### Hero Section

```html
<header class="rhythm-block bg-background text-foreground">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-4xl">Build Beautiful Sites</h1>
    <p class="text-lg">With mathematical precision and fine typography</p>
    <button class="btn btn-primary">Get Started</button>
  </div>
</header>
```

### Card Layout

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <article class="card rhythm-block">
    <h3>Card Title</h3>
    <p>Card content goes here</p>
    <a href="#">Learn more →</a>
  </article>
  
  <!-- More cards -->
</div>
```

### Two-Column Layout

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <main class="lg:col-span-2 rhythm-block">
    <h1>Main Content</h1>
    <!-- Your content -->
  </main>

  <aside class="rhythm-block">
    <h3>Sidebar</h3>
    <!-- Sidebar content -->
  </aside>
</div>
```

## File Structure

Recommended project structure:

```
my-project/
├── css/
│   └── custom.css          # Your custom styles
├── js/
│   └── main.js             # Your scripts
├── images/
├── index.html
└── about.html
```

Or with 11ty:

```
my-project/
├── src/
│   ├── _layouts/           # Page templates
│   ├── css/                # Custom styles
│   ├── js/                 # Custom scripts
│   ├── index.md
│   └── about.md
├── eleventy.config.js
├── package.json
└── _site/                  # Build output
```

## Common Issues

### CSS Not Loading

Check the path is correct:

```html
<!-- Check if path matches your setup -->
<link rel="stylesheet" href="/css/standard.min.css">
```

Verify file exists:

```bash
# If using npm
ls node_modules/@zefish/standard/dist/standard.min.css

# If copying files
ls css/standard.min.css
```

### Styles Not Applying

Make sure CSS is loaded before content:

```html
<head>
  <!-- CSS first -->
  <link rel="stylesheet" href="/css/standard.min.css">
</head>
<body>
  <!-- Then HTML content -->
</body>
```

### Color Theme Not Respecting System Preference

The framework automatically detects system theme. To test:

**On macOS:**
- System Preferences → General → Appearance → Dark/Light

**On Windows:**
- Settings → Personalization → Colors → Dark/Light

**In Browser DevTools:**
- Chrome: DevTools → Rendering → Emulate CSS media feature prefers-color-scheme

## Next Steps

Now that you're set up, explore:

1. **[Typography](/css/typography/)** - Master font scales and readability
2. **[Colors](/css/colors/)** - Understand the semantic color system
3. **[Grid System](/css/grid/)** - Build responsive layouts
4. **[Spacing & Rhythm](/css/spacing/)** - Create visual harmony
5. **[Components](/css/buttons/)** - Use styled components

## Reference

- **[CSS Variables](/css/tokens/)** - All customizable design tokens
- **[Utilities](/css/utilities/)** - Helper classes
- **[API Reference](/docs/)** - Auto-generated component documentation

---

Ready to dive deeper? [Learn about Typography](/css/typography/)
