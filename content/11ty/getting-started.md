---
title: Getting Started with 11ty Plugin

eleventyNavigation:
  key: Getting Started
  parent: 11ty Plugin
  title: Getting Started
permalink: /11ty/getting-started/
---

# Getting Started with 11ty Plugin

Complete setup guide for using Standard Framework with Eleventy.

## Prerequisites

- Node.js 14+ installed
- Basic knowledge of 11ty
- Text editor

## Installation

### Step 1: Install 11ty and Standard Framework

```bash
npm init -y
npm install --save-dev @11ty/eleventy
npm install @zefish/standard
```

### Step 2: Create eleventy.config.js

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  // Add Standard Framework plugin
  eleventyConfig.addPlugin(Standard);

  return {
    dir: {
      input: "content",
      output: "_site"
    }
  };
}
```

### Step 3: Create Content Directory

```bash
mkdir content
echo "# Hello World" > content/index.md
```

### Step 4: Create Base Layout

Create `_includes/layouts/base.njk`:

```nunjucks
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or "My Site" }}</title>
  {% standardAssets %}
</head>
<body class="bg-background text-foreground">
  <header class="rhythm-block p-4">
    <h1>Welcome</h1>
  </header>

  <main class="rhythm-block p-4">
    {{ content | safe }}
  </main>

  <footer class="rhythm-block p-4">
    <p>&copy; 2024</p>
  </footer>
</body>
</html>
```

### Step 5: Build Your Site

```bash
npx @11ty/eleventy
```

Visit `_site/index.html` in your browser!

## Project Structure

Organize your content logically:

```
my-site/
├── eleventy.config.js      # 11ty configuration
├── package.json            # Project metadata
├── content/
│  ├── index.md            # Homepage
│  ├── about.md            # About page
│  ├─ blog/
│  │  ├─ post-1.md
│  │  └─ post-2.md
│  └─ docs/
│     ├─ guide.md
│     └─ tutorial.md
├── _includes/
│  └── layouts/
│     ├── base.njk          # Default layout
│     ├── article.njk       # Article layout
│     └── blog-post.njk     # Blog post layout
├── _site/                  # Build output (auto-generated)
└── assets/
   └── custom.css          # Custom styles (optional)
```

## Basic Page

Create `content/about.md`:

```markdown
---
layout: layouts/base.njk
title: About Me
---

# About Me

Welcome to my website! This page demonstrates:

- **Beautiful typography** - Optimized for reading
- **Responsive design** - Works on all devices
- **Dark mode support** - Automatic theme switching
- **Semantic HTML** - Accessible and clean

The Standard Framework provides all the styling automatically.
```

## Front Matter

Control page behavior with front matter:

```yaml
---
layout: layouts/base.njk      # Which layout to use
title: Page Title             # Page title
description: Meta description # SEO meta description
tags:                         # Page tags
  - important
  - featured
eleventyNavigation:           # Navigation menu
  key: About
  parent: Home
  title: About
  order: 1
---
```

## Layouts

Create multiple layouts for different content types.

### Article Layout

Create `_includes/layouts/article.njk`:

```nunjucks
---
layout: layouts/base.njk
---

<article class="rhythm-block">
  <h1>{{ title }}</h1>
  <p class="text-lg text-foreground/80">{{ description }}</p>

  <div class="mb-4">
    {% if tags %}
      {% for tag in tags %}
        <span class="badge">{{ tag }}</span>
      {% endfor %}
    {% endif %}
  </div>

  <main class="prose max-w-prose">
    {{ content | safe }}
  </main>
</article>
```

### Blog Post Layout

Create `_includes/layouts/blog-post.njk`:

```nunjucks
---
layout: layouts/base.njk
---

<article class="rhythm-block">
  <h1>{{ title }}</h1>

  <div class="text-sm text-foreground/60">
    Published: <time datetime="{{ date | dateFilter }}">
      {{ date | dateFilter('long') }}
    </time>
  </div>

  <hr class="my-4">

  <main class="prose max-w-prose">
    {{ content | safe }}
  </main>

  <hr class="my-6">

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {% if previousPost %}
      <a href="{{ previousPost.url }}" class="btn btn-secondary">
        ← {{ previousPost.data.title }}
      </a>
    {% endif %}

    {% if nextPost %}
      <a href="{{ nextPost.url }}" class="btn btn-secondary">
        {{ nextPost.data.title }} →
      </a>
    {% endif %}
  </div>
</article>
```

## Collections

Group related content.

### Blog Posts Collection

Add to `eleventy.config.js`:

```javascript
eleventyConfig.addCollection("blog", function (collection) {
  return collection
    .getFilteredByGlob("content/blog/**/*.md")
    .sort((a, b) => b.date - a.date);
});
```

Use in template:

```nunjucks
<h2>Recent Posts</h2>
<ul>
  {% for post in collections.blog %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      <time>{{ post.date | dateFilter }}</time>
    </li>
  {% endfor %}
</ul>
```

## Filters

Add custom filters to transform data.

```javascript
eleventyConfig.addFilter("uppercase", (value) => {
  return value.toUpperCase();
});

eleventyConfig.addFilter("dateFilter", (date, format = "short") => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: format === "long" ? "long" : "2-digit",
    day: "2-digit"
  });
});
```

Use in templates:

```nunjucks
{{ "hello" | uppercase }}           <!-- HELLO -->
{{ date | dateFilter('long') }}     <!-- January 21, 2025 -->
```

## Includes

Reusable template snippets.

Create `_includes/card.njk`:

```nunjucks
<div class="card p-4">
  <h3>{{ title }}</h3>
  <p>{{ description }}</p>
  {% if link %}
    <a href="{{ link }}" class="btn btn-primary btn-sm">Learn more</a>
  {% endif %}
</div>
```

Use in templates:

```nunjucks
{% include "card.njk" %}
{% include "card.njk", title="First", description="First card" %}
{% include "card.njk", title="Second", description="Second card" %}
```

## Navigation

Create automatic navigation menu.

Add to `eleventy.config.js`:

```javascript
import { EleventyHierarchyPlugin } from "@11ty/eleventy";

eleventyConfig.addPlugin(EleventyHierarchyPlugin);
```

Use in layout:

```nunjucks
{% for entry in navigation %}
  <a href="{{ entry.url }}"
     {% if entry.url == page.url %}class="active"{% endif %}>
    {{ entry.title }}
  </a>
{% endfor %}
```

## Passthrough Copy

Copy static files to output:

```javascript
// Copy images
eleventyConfig.addPassthroughCopy("src/images/");

// Copy styles
eleventyConfig.addPassthroughCopy("src/css/");

// Copy custom JavaScript
eleventyConfig.addPassthroughCopy("src/js/");
```

## Watch & Serve

Automatic rebuilding during development:

```bash
# Watch for changes and rebuild
npx @11ty/eleventy --serve

# Or configure in eleventy.config.js
export default function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./content/**/*");

  return {
    dir: { input: "content" }
  };
}
```

## Build for Production

```bash
# Build optimized output
npx @11ty/eleventy

# Output goes to _site/
# Ready to deploy!
```

## Package.json Scripts

Add helpful npm scripts:

```json
{
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy",
    "clean": "rm -rf _site"
  }
}
```

Then use:

```bash
npm start       # Start dev server
npm run build   # Build for production
npm run clean   # Remove output
```

## Configuration Reference

### Full eleventy.config.js Example

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  // Add Standard Framework
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    useCDN: false
  });

  // Copy static files
  eleventyConfig.addPassthroughCopy("src/images/");
  eleventyConfig.addPassthroughCopy("src/styles/");

  // Collections
  eleventyConfig.addCollection("blog", (collection) => {
    return collection
      .getFilteredByGlob("content/blog/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk"
  };
}
```

## Troubleshooting

### Templates Not Found

Make sure `_includes` is in your input directory or configured:

```javascript
return {
  dir: {
    input: "content",
    includes: "_includes"  // relative to input
  }
};
```

### Styles Not Loading

Ensure `{% standardAssets %}` is in your base layout:

```nunjucks
<head>
  {% standardAssets %}
</head>
```

### File Not Building

Check that the file:
1. Is in the `content` directory
2. Has proper front matter
3. Uses a supported format (.md, .njk, .html)

### Changes Not Reflecting

When using `npm start`:

```bash
# Stop the server
Ctrl+C

# Restart
npm start
```

## Next Steps

- [CSS Framework](/css/) - Style your content
- [Markdown Features](/11ty/markdown/) - Enhanced markdown
- [Filters](/11ty/filters/) - Transform data
- [Backlinks](/11ty/backlinks/) - Connect pages

---

Ready to build amazing sites? Let's create some content! [Learn Markdown](/11ty/markdown/)
