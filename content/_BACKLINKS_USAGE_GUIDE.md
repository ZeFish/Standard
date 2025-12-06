/**
 * STANDARD FRAMEWORK - Backlinks Usage Guide
 * 
 * A comprehensive guide for Astro websites using Standard Framework
 * to implement automatic bidirectional link tracking and display.
 */

# Backlinks Usage Guide

## What Are Backlinks?

Backlinks are **automatic bidirectional link tracking** for your content. When you link from one page to another, the system automatically:

1. **Tracks the link** in the source document
2. **Records it as inbound** on the target document
3. **Makes it available** in your templates for display

This creates a knowledge graph of your content without any manual configuration.

## Quick Start

### 1. Set Up Your Content Config

In `src/content/config.ts`:

```typescript
import { createDocsCollection } from "@zefish/standard/content-config";
import config from "virtual:standard/config";

export const collections = {
  docs: createDocsCollection({ 
    contentDir: config.content?.dir || "./content"
  }),
};
```

### 2. Write Content with Links

In your markdown files, just write normal links:

```markdown
# My Article

This article links to [another page](./other-page.md) and [external site](https://example.com).

I can also use [[wikilinks]] for internal references.
```

### 3. Display Backlinks in Your Layout

In your layout component:

```astro
---
import { getCollection } from "astro:content";

const { entry } = Astro.props;
const { inbound = [], outbound = [] } = entry.data.backlinks || {};
---

<article>
  <h1>{entry.data.title}</h1>
  <slot />

  {inbound.length > 0 && (
    <section class="backlinks">
      <h2>Pages Linking to This</h2>
      <ul>
        {inbound.map((link) => (
          <li><a href={`/${link}/`}>{link}</a></li>
        ))}
      </ul>
    </section>
  )}

  {outbound.length > 0 && (
    <section class="outbound-links">
      <h2>Pages This Links To</h2>
      <ul>
        {outbound.map((link) => (
          <li><a href={`/${link}/`}>{link}</a></li>
        ))}
      </ul>
    </section>
  )}
</article>
```

That's it! Backlinks are now working. 🎉

## How It Works

### The Pipeline

1. **Frontmatter Defaults Plugin**
   - Generates `permalink` if missing
   - Example: `blog/my-post.md` → `/blog/my-post/`

2. **Backlinks Plugin**
   - Scans each document for links
   - Tracks inbound and outbound relationships
   - Injects backlinks data into frontmatter

3. **Content Config Transform**
   - Uses `permalink` as the page URL
   - Makes backlinks available in templates

4. **Your Template**
   - Accesses backlinks via `entry.data.backlinks`
   - Displays them however you want

### Link Detection

The backlinks plugin automatically detects:

**Markdown Links:**
```markdown
[Link text](./other-page.md)
[Link text](/other-page/)
```

**Wikilinks:**
```markdown
[[Other Page]]
[[Other Page|Custom text]]
```

**External Links (ignored):**
```markdown
[External](https://example.com)  ← Not tracked
[Email](mailto:user@example.com) ← Not tracked
[Anchor](#section)               ← Not tracked
```

## Configuration

### Content Directory

Set the content directory in your Astro config:

```javascript
// astro.config.mjs
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [standard({
    content: {
      dir: "./src/content/docs"  // ← Your content directory
    }
  })],
});
```

Then use it in your content config:

```typescript
import config from "virtual:standard/config";

export const collections = {
  docs: createDocsCollection({ 
    contentDir: config.content?.dir || "./content"
  }),
};
```

### Backlinks Plugin Options

In `astro.config.mjs`:

```javascript
export default defineConfig({
  integrations: [standard({
    backlinks: {
      enabled: true,      // Enable/disable backlinks
      verbose: false,     // Debug logging
    }
  })],
});
```

## Frontmatter Fields

Each document automatically gets backlinks data:

```typescript
interface BacklinksData {
  inbound: string[];      // Pages linking to this page
  outbound: string[];     // Pages this page links to
  meta: {
    title?: string;       // Page title
    slug: string;         // Page slug
    id: string;          // Page ID
  }
}
```

Access it in templates:

```astro
---
const { inbound, outbound, meta } = entry.data.backlinks;
---

<p>This page has {inbound.length} inbound links</p>
```

## Advanced Usage

### Custom Backlinks Component

Create a reusable backlinks component:

```astro
---
// components/BacklinksSection.astro
interface Props {
  inbound?: string[];
  outbound?: string[];
  title?: string;
}

const { 
  inbound = [], 
  outbound = [],
  title = "Related Pages"
} = Astro.props;
---

{(inbound.length > 0 || outbound.length > 0) && (
  <aside class="backlinks">
    <h3>{title}</h3>
    
    {inbound.length > 0 && (
      <div class="inbound">
        <h4>Pages Linking Here</h4>
        <ul>
          {inbound.map((link) => (
            <li><a href={`/${link}/`}>{link}</a></li>
          ))}
        </ul>
      </div>
    )}
    
    {outbound.length > 0 && (
      <div class="outbound">
        <h4>Links on This Page</h4>
        <ul>
          {outbound.map((link) => (
            <li><a href={`/${link}/`}>{link}</a></li>
          ))}
        </ul>
      </div>
    )}
  </aside>
)}

<style>
  .backlinks {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f9f9f9;
    border-left: 4px solid #0066cc;
    border-radius: 4px;
  }

  .backlinks h3 {
    margin-top: 0;
  }

  .inbound, .outbound {
    margin: 1rem 0;
  }

  .backlinks ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
  }

  .backlinks li {
    padding: 0.25rem 0;
  }

  .backlinks a {
    color: #0066cc;
    text-decoration: none;
  }

  .backlinks a:hover {
    text-decoration: underline;
  }
</style>
```

Use it in your layout:

```astro
---
import BacklinksSection from "../components/BacklinksSection.astro";

const { entry } = Astro.props;
const backlinks = entry.data.backlinks;
---

<article>
  <h1>{entry.data.title}</h1>
  <slot />
  
  <BacklinksSection 
    inbound={backlinks?.inbound}
    outbound={backlinks?.outbound}
    title="Related Content"
  />
</article>
```

### Knowledge Graph Visualization

Create a graph of all backlinks:

```astro
---
// pages/graph.astro
import { getCollection } from "astro:content";

const docs = await getCollection("docs");

// Build graph data
const nodes = docs.map((doc) => ({
  id: doc.data.permalink,
  label: doc.data.title,
  size: (doc.data.backlinks?.inbound.length || 0) + 1,
}));

const edges = [];
docs.forEach((doc) => {
  doc.data.backlinks?.outbound.forEach((target) => {
    edges.push({
      source: doc.data.permalink,
      target: `/${target}/`,
    });
  });
});

const graphData = JSON.stringify({ nodes, edges });
---

<html>
  <head>
    <title>Knowledge Graph</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
  </head>
  <body>
    <div id="graph" style="width: 100%; height: 100vh;"></div>
    
    <script define:vars={{ graphData }}>
      // Render graph with D3.js
      const data = JSON.parse(graphData);
      // ... D3 visualization code ...
    </script>
  </body>
</html>
```

### Backlinks Statistics

Show backlinks stats in your collection:

```astro
---
import { getCollection } from "astro:content";

const docs = await getCollection("docs");

// Find most linked pages
const mostLinked = docs
  .sort((a, b) => 
    (b.data.backlinks?.inbound.length || 0) - 
    (a.data.backlinks?.inbound.length || 0)
  )
  .slice(0, 10);
---

<h2>Most Linked Pages</h2>
<ol>
  {mostLinked.map((doc) => (
    <li>
      <a href={doc.data.permalink}>{doc.data.title}</a>
      <span class="count">
        {doc.data.backlinks?.inbound.length || 0} links
      </span>
    </li>
  ))}
</ol>
```

## Styling Backlinks

### Basic CSS

```css
.backlinks {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f0f7ff;
  border: 1px solid #0066cc;
  border-radius: 8px;
}

.backlinks h2 {
  margin-top: 0;
  color: #0066cc;
  font-size: 1.1rem;
}

.backlinks ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.backlinks li {
  padding: 0.5rem 0;
}

.backlinks a {
  color: #0066cc;
  text-decoration: none;
  border-bottom: 1px dotted #0066cc;
}

.backlinks a:hover {
  border-bottom-style: solid;
}
```

### With Icons

```css
.backlinks-inbound::before {
  content: "← ";
  color: #0066cc;
  font-weight: bold;
}

.backlinks-outbound::before {
  content: "→ ";
  color: #0066cc;
  font-weight: bold;
}
```

## Troubleshooting

### Backlinks Not Showing

1. **Check content directory**: Ensure it's set correctly in config
2. **Verify links**: Make sure you're using proper markdown link syntax
3. **Check permalinks**: Ensure frontmatter defaults plugin is enabled
4. **Rebuild**: Run `npm run build` to regenerate backlinks

### Links Not Being Detected

**Make sure you're using:**
- `[text](./file.md)` - Relative markdown links
- `[[Page Name]]` - Wikilinks

**Avoid:**
- `[text](https://example.com)` - External links (ignored)
- `[text](#anchor)` - Anchor links (ignored)
- `[text](mailto:user@example.com)` - Email links (ignored)

### Performance Issues

If you have many documents:

1. **Disable verbose logging**: Set `verbose: false` in config
2. **Check file sizes**: Large markdown files may slow processing
3. **Optimize links**: Reduce number of links per document

## Best Practices

### 1. Use Consistent Link Syntax

Choose one style and stick with it:

```markdown
# Good - Consistent markdown links
[Other Page](./other-page.md)
[Another](./another.md)

# Mixed - Avoid mixing styles
[Other Page](./other-page.md)
[[Another]]
```

### 2. Meaningful Link Text

```markdown
# Good
[Learn about authentication](./auth.md)

# Avoid
[Click here](./auth.md)
```

### 3. Organize Related Content

Group related pages and link them together:

```markdown
# Getting Started

See also:
- [Installation](./installation.md)
- [Configuration](./configuration.md)
- [Troubleshooting](./troubleshooting.md)
```

### 4. Use Frontmatter Permalinks

For custom URLs, set the permalink explicitly:

```markdown
---
title: My Article
permalink: /blog/custom-url/
---
```

### 5. Display Backlinks Prominently

Make backlinks visible to readers:

```astro
<article>
  <h1>{title}</h1>
  <slot />
  
  <!-- Backlinks at the bottom -->
  <BacklinksSection backlinks={entry.data.backlinks} />
</article>
```

## Examples

### Documentation Site

Perfect for documentation with cross-references:

```markdown
# API Reference

See also:
- [Installation Guide](./installation.md)
- [Examples](./examples.md)
- [Troubleshooting](./troubleshooting.md)
```

### Blog with Related Posts

Show related articles:

```astro
{outbound.length > 0 && (
  <section class="related-posts">
    <h3>Related Articles</h3>
    <ul>
      {outbound.map((slug) => (
        <li><a href={`/${slug}/`}>{slug}</a></li>
      ))}
    </ul>
  </section>
)}
```

### Knowledge Base

Create a interconnected knowledge base:

```markdown
# Topic A

Related topics:
- [[Topic B]]
- [[Topic C]]
- [[Topic D]]
```

## See Also

- [[Content Configuration]] - Setting up content collections
- [[Frontmatter Defaults]] - Auto-generating permalinks
- [[Wikilinks]] - Using wikilink syntax
