# Template Filters & Helpers

Transform and manipulate data in your 11ty templates with filters.

## Built-in Filters

Standard Framework includes many useful filters.

### String Filters

```html
        <!-- HELLO WORLD -->
        <!-- hello world -->
       <!-- Hello world -->
          <!-- dlrow olleh -->

       <!-- hello world -->
       <!-- ['hello', 'world'] -->
```

See [Filter Plugin API](/docs/eleventy-filter-plugin/) for complete reference.

### Date Filters

```html
                <!-- Short date -->
        <!-- Long date -->
         <!-- ISO format -->
              <!-- Human readable -->
                   <!-- W3C format -->
```

### URL Filters

```html
                   <!-- Handle base URLs -->
           <!-- Add base URL -->
                    <!-- URL-safe slug -->
```

### Array Filters

```html
             <!-- First 3 items -->
             <!-- Last 3 items -->
             <!-- Reverse order -->
                <!-- Sort items -->
```

### JSON Filter

```html
                      <!-- Pretty JSON -->
                <!-- Strict JSON -->
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

```html
                  <!-- HELLO!!! -->
                 <!-- 50 -->

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

```html
<!-- Default 11ty filters -->




```

## Chaining Filters

Combine multiple filters:

```html



```

## See Also

- [Filter Plugin API](/docs/eleventy-filter-plugin/) - Complete API
- [Markdown](/11ty/markdown/) - Markdown enhancements
- [Shortcodes](/docs/eleventy-shortcode-plugin/) - Template tags
- [11ty Filters Docs](https://www.11ty.dev/docs/filters/) - All 11ty filters


Master filters to transform content. [Learn about backlinks](/11ty/backlinks/)