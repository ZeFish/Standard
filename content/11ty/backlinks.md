---
title: Wiki-Style Backlinks

eleventyNavigation:
  key: Backlinks
  parent: 11ty Plugin
  title: Backlinks
permalink: /11ty/backlinks/
---

# Wiki-Style Backlinks

Create automatic bidirectional links between pages and build knowledge graphs with wiki-style backlinks.

## What Are Backlinks?

Backlinks are automatic references showing which pages link to the current page. They create a **knowledge graph** of connections between related content, similar to Wikipedia's "Linked in" feature.

### Two-Way Links

With backlinks, links become bidirectional:

- **Forward links**: Links you write pointing to other pages
- **Backlinks**: Automatically discovered links pointing to the current page

This enables:
- **Knowledge discovery** - See how pages relate to each other
- **Content navigation** - Find related articles quickly
- **Wiki functionality** - Create knowledge bases and documentation sites
- **SEO benefits** - Build internal link structure automatically
- **Reduced maintenance** - No manual "related posts" sections needed

---

## How It Works

The backlinks plugin automatically:

1. **Scans all internal links** in your site
2. **Builds a backlinks map** of which pages link where
3. **Provides template helpers** to display backlinks
4. **Supports wiki-style syntax** `[[Page Name]]` for easy linking

### Example

If these pages exist:

- `/blog/typescript-tips/` - Contains link to `/blog/javascript-tricks/`
- `/blog/es6-features/` - Contains link to `/blog/javascript-tricks/`
- `/reference/async-await/` - Contains link to `/blog/javascript-tricks/`

Then `/blog/javascript-tricks/` automatically gets backlinks from those three pages.

---

## Basic Usage

### Display Backlinks in Templates

Add backlinks to your article layout in `_includes/layouts/article.njk`:

```nunjucks
---
layout: layouts/base.njk
---

<article class="rhythm-block">
  <h1>{{ title }}</h1>
  <p class="text-lg text-foreground/80">{{ description }}</p>

  <main class="prose max-w-prose">
    {{ content | safe }}
  </main>

  <!-- Display backlinks section -->
  {% if backlinks %}
    <aside class="mt-8 p-4 bg-accent/10 border-l-4 border-accent rounded">
      <h3>Linked from</h3>
      <ul class="list-none p-0">
        {% for backlink in backlinks %}
          <li class="mb-2">
            <a href="{{ backlink.url }}" class="text-accent hover:underline">
              {{ backlink.data.title or backlink.fileSlug }}
            </a>
            {% if backlink.data.description %}
              <p class="text-sm text-foreground/70">{{ backlink.data.description }}</p>
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    </aside>
  {% endif %}
</article>
```

### Enable in eleventy.config.js

The backlinks plugin is included with Standard Framework and enabled by default:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  // Backlinks plugin is automatically included
  eleventyConfig.addPlugin(Standard);

  return {
    dir: { input: "content", output: "_site" }
  };
}
```

No additional configuration needed!

---

## Wiki-Style Linking

Use wiki-style `[[Page Name]]` syntax for automatic linking:

### In Markdown

```markdown
# My Article

This is about [[TypeScript]] and how it relates to [[JavaScript Tricks]].

Check out [[Related Topics]] for more information.
```

### How It Works

- `[[Page Name]]` automatically links to `/page-name/`
- Case-insensitive matching
- Spaces converted to hyphens for URL
- Creates backlinks automatically
- Falls back to search if exact match not found

### Advantages

- **Faster to write** - No need for full URLs
- **Automatic linking** - Type page name, get link
- **Backlinks created** - Forward and back links both established
- **Easier to rename** - Links adjust if page names change
- **Knowledge base friendly** - Perfect for interconnected content

### Examples

```markdown
# TypeScript Best Practices

Learn about [[Type Narrowing]] and [[Generic Types]] to write better code.

This builds on concepts from [[JavaScript Fundamentals]].

See also [[Advanced TypeScript Patterns]].
```

---

## Configuration

Configure backlinks in `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    backlinks: {
      // Enable/disable backlinks
      enabled: true,

      // Exclude certain pages from backlinks
      exclude: [
        "404",
        "search",
        "admin/*"
      ],

      // Minimum link count to display backlinks section
      minBacklinks: 1,

      // Custom backlinks class
      backlinkClass: "backlinks-section",

      // Wiki-style link syntax
      wikiLinks: {
        enabled: true,
        // Auto-create missing links
        autoCreate: false
      }
    }
  });

  return {
    dir: { input: "content", output: "_site" }
  };
}
```

### Options Explained

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable backlinks feature |
| `exclude` | array | `[]` | Patterns to exclude from backlinks |
| `minBacklinks` | number | `1` | Minimum backlinks to show section |
| `wikiLinks.enabled` | boolean | `true` | Enable `[[Page Name]]` syntax |
| `wikiLinks.autoCreate` | boolean | `false` | Auto-create pages for missing links |

---

## Advanced Patterns

### Knowledge Base Structure

Create an interconnected knowledge base:

```
content/
├── topics/
│   ├── typescript.md
│   ├── javascript.md
│   └── web-development.md
├── guides/
│   ├── ts-setup.md
│   ├── ts-tips.md
│   └── ts-gotchas.md
└── reference/
    ├── type-system.md
    └── generics.md
```

Each guide uses `[[Topic Name]]` to link to related topics:

```markdown
---
title: TypeScript Setup Guide
---

# Getting Started with [[TypeScript]]

This guide covers setting up [[TypeScript]] for [[JavaScript]] projects.

Related: [[Web Development]]
```

### Documentation Site

Auto-generate related content sections:

```nunjucks
<!-- In _includes/layouts/doc.njk -->

<article>
  <h1>{{ title }}</h1>
  {{ content | safe }}

  <!-- Auto-discovered related content -->
  <aside class="related-docs">
    <h3>Referenced by</h3>
    <ul>
      {% for backlink in backlinks %}
        <li><a href="{{ backlink.url }}">{{ backlink.data.title }}</a></li>
      {% endfor %}
    </ul>

    <!-- Also show external references this doc mentions -->
    <h3>References</h3>
    <ul>
      {% for link in page.links %}
        <li><a href="{{ link }}">{{ link }}</a></li>
      {% endfor %}
    </ul>
  </aside>
</article>
```

### Blog with Topic Tags

Create topic indexes automatically:

```nunjucks
<!-- In _includes/layouts/topic.njk -->

<h1>Topic: {{ title }}</h1>

<p>{{ description }}</p>

<h2>Articles about {{ title }}</h2>
<ul>
  {% for backlink in backlinks %}
    <li>
      <a href="{{ backlink.url }}">{{ backlink.data.title }}</a>
      <time>{{ backlink.date | dateFilter('short') }}</time>
    </li>
  {% endfor %}
</ul>

<p>{{ backlinks.length }} article(s) about this topic</p>
```

### Research Paper Citation Graph

Link research papers and show citations:

```markdown
---
title: "Machine Learning: A Probabilistic Perspective"
description: Foundational ML research
tags:
  - research
  - machine-learning
---

# {{ title }}

This paper introduces key concepts in [[Probabilistic Models]].

Cited by:
- [[Deep Learning Applications]]
- [[Bayesian Methods Guide]]
- [[Neural Network Theory]]
```

---

## Template Helpers

The Standard Framework provides these template helpers for working with backlinks:

### Get Backlinks for Current Page

```nunjucks
<!-- In any template -->
{% for backlink in backlinks %}
  {{ backlink.url }} - {{ backlink.data.title }}
{% endfor %}
```

### Get Backlinks for Specific Page

```nunjucks
<!-- In eleventy.config.js -->
eleventyConfig.addFilter("getBacklinksFor", (url) => {
  // Returns backlinks for given URL
  return std.backlinks.getBacklinks(url);
});
```

Use in templates:

```nunjucks
{% set relatedBacklinks = "/blog/javascript/" | getBacklinksFor %}
{% for link in relatedBacklinks %}
  <a href="{{ link.url }}">{{ link.data.title }}</a>
{% endfor %}
```

### Count Backlinks

```nunjucks
<!-- Simple count -->
<span>Referenced by {{ backlinks.length }} page(s)</span>

<!-- With conditional display -->
{% if backlinks.length > 0 %}
  <aside>
    <h3>{{ backlinks.length }} References</h3>
    <!-- ... list backlinks -->
  </aside>
{% endif %}
```

---

## Styling Backlinks

Add custom styling for backlinks sections:

### CSS Classes

```css
/* Backlinks container */
.backlinks-section {
  border-left: 4px solid var(--color-accent);
  padding: 1rem;
  margin-top: 2rem;
  background-color: var(--color-accent-bg);
  border-radius: 4px;
}

/* Backlinks list */
.backlinks-section ul {
  list-style: none;
  padding: 0;
}

.backlinks-section li {
  margin-bottom: 1rem;
}

/* Backlinks heading */
.backlinks-section h3 {
  margin-top: 0;
  color: var(--color-accent);
}

/* Backlinks link */
.backlinks-section a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.backlinks-section a:hover {
  text-decoration: underline;
}

/* Description under each backlink */
.backlinks-section .description {
  font-size: 0.875rem;
  color: var(--color-foreground-muted);
  margin-top: 0.25rem;
}
```

### Tailwind Classes

If using Tailwind CSS:

```html
<aside class="mt-8 p-4 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded">
  <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
    Linked from
  </h3>
  <ul class="space-y-3">
    {% for backlink in backlinks %}
      <li>
        <a href="{{ backlink.url }}" class="text-blue-600 hover:text-blue-700 hover:underline">
          {{ backlink.data.title }}
        </a>
        {% if backlink.data.description %}
          <p class="text-sm text-gray-600 mt-1">{{ backlink.data.description }}</p>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</aside>
```

---

## Common Patterns

### Show Backlinks Only for Certain Pages

```nunjucks
<!-- In article layout -->

{% if tags and tags.includes("featured") %}
  <!-- Show backlinks for featured articles -->
  {% if backlinks %}
    <aside class="backlinks-section">
      <h3>Read Next</h3>
      <ul>
        {% for backlink in backlinks %}
          <li><a href="{{ backlink.url }}">{{ backlink.data.title }}</a></li>
        {% endfor %}
      </ul>
    </aside>
  {% endif %}
{% endif %}
```

### Filter Backlinks by Category

```javascript
// In eleventy.config.js
eleventyConfig.addFilter("backlinksByCategory", (backlinks, category) => {
  return backlinks.filter(link => link.data.category === category);
});
```

Use:

```nunjucks
{% set blogBacklinks = backlinks | backlinksByCategory("blog") %}
{% for link in blogBacklinks %}
  <a href="{{ link.url }}">{{ link.data.title }}</a>
{% endfor %}
```

### Create Related Posts Section

```nunjucks
<aside>
  <h3>Related Reading</h3>
  {% set relatedCount = 0 %}
  {% for backlink in backlinks %}
    {% if relatedCount < 5 %}
      <a href="{{ backlink.url }}" class="related-link">
        {{ backlink.data.title }}
      </a>
      {% set relatedCount = relatedCount + 1 %}
    {% endif %}
  {% endfor %}
</aside>
```

---

## Troubleshooting

### Backlinks Not Appearing

**Problem**: Backlinks section empty or not showing

**Solutions**:
1. Verify backlinks plugin is enabled in `eleventy.config.js`
2. Check that pages have proper `title` in front matter
3. Ensure links use correct page paths
4. Run `npx @11ty/eleventy` to rebuild

### Wiki Links Not Working

**Problem**: `[[Page Name]]` not converting to links

**Solutions**:
1. Verify `wikiLinks.enabled: true` in config
2. Check page names match exactly (case-insensitive)
3. Ensure pages have `title` in front matter
4. Review console for errors

### Performance Issues

**Problem**: Build is slow with many pages

**Solutions**:
1. Exclude unnecessary directories with `exclude` option
2. Reduce page count during development (use `--incremental` flag)
3. Monitor build time: `npx @11ty/eleventy --profile`

---

## API Reference

For complete API details, see [Backlinks Plugin Documentation](/docs/backlinks-plugin/)

---

## See Also

- [Markdown Enhancements](/11ty/markdown/) - Writing enhanced markdown
- [Filters](/11ty/filters/) - Transform and display data
- [Advanced Features](/11ty/advanced/) - Power user tips
- [Backlinks Plugin API](/docs/backlinks-plugin/) - Technical reference

---

Master bidirectional linking and build knowledge graphs. [Learn about content encryption](/11ty/encryption/)
