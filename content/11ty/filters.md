---
title: Filters & Template Helpers

eleventyNavigation:
  key: Filters
  parent: 11ty Plugin
  title: Filters
permalink: /11ty/filters/
---

# Template Filters & Helpers

Transform and manipulate data in your 11ty templates with filters.

## Built-in Filters

Standard Framework includes many useful filters.

### String Filters

```nunjucks
{{ "hello world" | uppercase }}        <!-- HELLO WORLD -->
{{ "HELLO WORLD" | lowercase }}        <!-- hello world -->
{{ "hello world" | capitalize }}       <!-- Hello world -->
{{ "hello world" | reverse }}          <!-- dlrow olleh -->

{{ "hello" | concat(" world") }}       <!-- hello world -->
{{ "hello world" | split(" ") }}       <!-- ['hello', 'world'] -->
```

See [Filter Plugin API](/docs/eleventy-filter-plugin/) for complete reference.

### Date Filters

```nunjucks
{{ date | dateFilter }}                <!-- Short date -->
{{ date | dateFilter('long') }}        <!-- Long date -->
{{ date | dateFilter('iso') }}         <!-- ISO format -->
{{ date | readableDate }}              <!-- Human readable -->
{{ date | w3cDate }}                   <!-- W3C format -->
```

### URL Filters

```nunjucks
{{ "/page/" | url }}                   <!-- Handle base URLs -->
{{ page.url | htmlBaseUrl }}           <!-- Add base URL -->
{{ url | slugify }}                    <!-- URL-safe slug -->
```

### Array Filters

```nunjucks
{{ collection | head(3) }}             <!-- First 3 items -->
{{ collection | tail(3) }}             <!-- Last 3 items -->
{{ collection | reverse }}             <!-- Reverse order -->
{{ collection | sort }}                <!-- Sort items -->
```

### JSON Filter

```nunjucks
{{ data | dump }}                      <!-- Pretty JSON -->
{{ data | dumpStrict }}                <!-- Strict JSON -->
```

## Custom Filters

Create your own filters in `eleventy.config.js`:

```javascript
// Simple filter
eleventyConfig.addFilter("shout", (value) => {
  return value.toUpperCase() + "!!!";
});

// Async filter
eleventyConfig.addNunjucksAsyncFilter("random", async (n) => {
  return Math.random() * n;
});

// Filter with arguments
eleventyConfig.addFilter("multiply", (value, factor) => {
  return value * factor;
});
```

Use in templates:

```nunjucks
{{ "hello" | shout }}                  <!-- HELLO!!! -->
{{ 10 | multiply(5) }}                 <!-- 50 -->
{{ content | random }}
```

## Common Patterns

### Format Date

```javascript
eleventyConfig.addFilter("formatDate", (date, format = "short") => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: format === "long" ? "long" : "2-digit",
    day: "2-digit",
    ...(format === "long" && { weekday: "long" })
  });
});
```

### Excerpt from Content

```javascript
eleventyConfig.addFilter("excerpt", (content, words = 50) => {
  const plainText = content
    .replace(/<[^>]*>/g, "")
    .split(" ")
    .slice(0, words)
    .join(" ");
  return plainText + "...";
});
```

### Read Time

```javascript
eleventyConfig.addFilter("readTime", (content) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
});
```

### Category Count

```javascript
eleventyConfig.addFilter("categoryCount", (collection, category) => {
  return collection.filter(item => item.data.category === category).length;
});
```

### Markdown to HTML (inline)

```javascript
import markdownIt from "markdown-it";
const md = markdownIt();

eleventyConfig.addFilter("markdown", (content) => {
  return md.render(content);
});
```

## Global Filters

Available in all templates:

```nunjucks
<!-- Default 11ty filters -->
{{ string | trim }}
{{ string | striptags }}
{{ array | first }}
{{ array | last }}
```

## Chaining Filters

Combine multiple filters:

```nunjucks
{{ title | lowercase | slugify }}
{{ content | markdown | striptags | excerpt(20) }}
{{ date | formatDate('long') | uppercase }}
```

## See Also

- [Filter Plugin API](/docs/eleventy-filter-plugin/) - Complete API
- [Markdown](/11ty/markdown/) - Markdown enhancements
- [Shortcodes](/docs/eleventy-shortcode-plugin/) - Template tags
- [11ty Filters Docs](https://www.11ty.dev/docs/filters/) - All 11ty filters

---

Master filters to transform content. [Learn about backlinks](/11ty/backlinks/)
