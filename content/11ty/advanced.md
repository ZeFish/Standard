# Advanced Features & Optimization

Master advanced techniques for building sophisticated sites with 11ty and Standard Framework.

## Performance Optimization

### Build Speed Optimization

Reduce build times for large sites:

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  // Incremental builds during development
  eleventyConfig.setIncrementalWatch(true);

  // Cache bust for long build times
  eleventyConfig.setIncrementalWatch(["./content/**/*"]);

  // Passthrough copy only needed files
  eleventyConfig.addPassthroughCopy({
    "./src/images/": "/images/",
    "./src/fonts/": "/fonts/"
  });

  // Ignore node_modules and other large dirs
  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setIncludesDirectory("_includes");
  eleventyConfig.setOutputDirectory("_site");

  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "_includes"
    }
  };
}
```

### Bundle Size Optimization

```javascript
// Use production CSS only when needed
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    // Minify CSS/JS in production
    minify: process.env.NODE_ENV === "production",

    // Use CDN for production
    useCDN: process.env.NODE_ENV === "production",

    // Disable unused features
    features: {
      backlinks: true,
      encryption: true,
      filters: true,
      markdown: true
    }
  });

  return { /* ... */ };
}
```

### Lazy Loading Images

```html
<!-- In templates -->
<img
  src=""
  alt=""
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
>
```

### CSS Critical Path

Load critical CSS inline:

```html
<!-- In base layout -->
<head>
  {% set criticalCSS %}
    {% include "css/critical.css" %}
  
  <style></style>

  <!-- Load rest asynchronously -->
  <link rel="preload" href="/css/standard.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/standard.min.css"></noscript>
</head>
```


## Custom Layouts & Templates

### Nested Layout Inheritance

Create flexible layout hierarchies:

```html
<!-- _includes/layouts/base.njk -->
<!DOCTYPE html>
<html>
<head>
  
</head>
<body>
  
</body>
</html>
```

```html
<!-- _includes/layouts/main.njk -->
<main class="max-w-4xl mx-auto px-4">
  
</main>
```

```html
<!-- _includes/layouts/blog-post.njk -->
<article class="rhythm-block">
  <header>
    <h1></h1>
    <time datetime=""></time>
  </header>

  

  <footer>
    {% if previousPost %}
      <a href="">← Previous</a>
    
    {% if nextPost %}
      <a href="">Next →</a>
    
  </footer>
</article>
```

Use in markdown:

```markdown

/blog-post.njk
title: My Article
date: 2024-10-21

# Content here
```

### Parametric Layouts

Reuse layouts with different parameters:

```javascript
// eleventy.config.js
eleventyConfig.addNunjucksFilter("applyLayout", (content, layoutName, data) => {
  // Apply layout dynamically
});
```

```html
<!-- _includes/layouts/card.njk -->
<div class="card ">
  <div class="card-header">
    {% if cardIcon %}
      <span class="icon"></span>
    
    <h3></h3>
  </div>
  <div class="card-body">
    
  </div>
  {% if cardFooter %}
    <div class="card-footer"></div>
  
</div>
```

Use with variables:

```markdown

cardTitle: "Feature Highlight"
cardIcon: "⭐"
cardClass: "featured"

Content inside card.
```


## Global Data & Configuration

### Shared Data Structure

Create global data accessible everywhere:

```javascript
// eleventy.config.js
export default function (eleventyConfig) {
  // Single data object
  eleventyConfig.addGlobalData("site", {
    name: "My Site",
    url: "https://example.com",
    description: "Amazing site built with Standard",
    author: "Your Name",
    socialLinks: {
      twitter: "https://twitter.com/yourname",
      github: "https://github.com/yourname"
    }
  });

  // Version data
  const packageJson = require("./package.json");
  eleventyConfig.addGlobalData("version", packageJson.version);

  // Build time
  eleventyConfig.addGlobalData("buildTime", new Date());

  return { /* ... */ };
}
```

Access in templates:

```html
<footer>
  <p>&copy;  - v</p>
  <a href="">Twitter</a>
  <a href="">GitHub</a>
  <p>Built </p>
</footer>
```

### Dynamic Data Files

Load data from external sources:

```javascript
// _data/posts.js
export default async function() {
  // Fetch from API
  const response = await fetch("https://api.example.com/posts");
  const posts = await response.json();
  return posts;
}

// Or load from filesystem
import fs from "fs";
import yaml from "js-yaml";

export default function() {
  const file = fs.readFileSync("./data/config.yml", "utf8");
  return yaml.load(file);
}
```

Use in templates:

```html
<!-- Use data from _data/posts.js -->
{% for post in posts %}
  <a href=""></a>

```


## Advanced Collections

### Multi-Dimensional Collections

```javascript
// Create nested collections
eleventyConfig.addCollection("postsByYear", (collection) => {
  const posts = collection.getFilteredByGlob("content/posts/**/*.md");

  // Group by year
  const grouped = {};
  posts.forEach(post => {
    const year = post.date.getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  return grouped;
});

// Create tag index
eleventyConfig.addCollection("tagIndex", (collection) => {
  const tags = new Set();
  collection.getAll().forEach(item => {
    (item.data.tags || []).forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});
```

Use in templates:

```html
<!-- Posts organized by year -->
{% for year, posts in postsByYear %}
  <h2></h2>
  <ul>
    {% for post in posts %}
      <li><a href=""></a></li>
    
  </ul>


<!-- Tag index -->
<div class="tags">
  {% for tag in tagIndex %}
    <a href="/tags//"></a>
  
</div>
```

### Computed Collections

```javascript
// Create virtual collections
eleventyConfig.addCollection("popular", (collection) => {
  return collection
    .getFilteredByGlob("content/**/*.md")
    .filter(item => item.data.featured === true)
    .sort((a, b) => b.data.views - a.data.views)
    .slice(0, 10);
});

eleventyConfig.addCollection("recent", (collection) => {
  return collection
    .getFilteredByGlob("content/**/*.md")
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);
});
```


## Custom Shortcodes

### Reusable Components

```javascript
// eleventy.config.js

// Simple shortcode
eleventyConfig.addNunjucksShortcode("highlight", (text) => {
  return `<mark class="highlight">${text}</mark>`;
});

// Shortcode with attributes
eleventyConfig.addNunjucksShortcode("callout", (content, type = "info") => {
  return `<div class="callout callout-${type}">${content}</div>`;
});

// Async shortcode
eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt) => {
  const imageSize = await getImageDimensions(src);
  return `
    <figure>
      <img src="${src}" alt="${alt}" width="${imageSize.width}" height="${imageSize.height}" loading="lazy">
      <figcaption>${alt}</figcaption>
    </figure>
  `;
});

// Paired shortcode
eleventyConfig.addPairedNunjucksShortcode("card", (content, title) => {
  return `
    <div class="card">
      <h3 class="card-title">${title}</h3>
      <div class="card-content">${content}</div>
    </div>
  `;
});
```

Use in templates:

```html
<!-- Simple shortcode -->
This is {% highlight "important" %}

<!-- With attributes -->
{% callout "Warning message", "warning" %}

<!-- Async shortcode -->
{% image "/images/photo.jpg", "My photo" %}

<!-- Paired shortcode -->
{% card "Card Title" %}
  Card content goes here

```


## Extending with Plugins

### Create Custom Plugins

```javascript
// my-plugin.js
export default function(eleventyConfig, options = {}) {
  const defaults = {
    features: ["feature1", "feature2"],
    debug: false
  };

  const config = { ...defaults, ...options };

  if (config.debug) {
    console.log("Custom plugin loaded with:", config);
  }

  // Add filters
  eleventyConfig.addFilter("myCustomFilter", (value) => {
    return value.toUpperCase();
  });

  // Add shortcodes
  eleventyConfig.addNunjucksShortcode("myShortcode", (text) => {
    return `<custom>${text}</custom>`;
  });

  // Add collections
  eleventyConfig.addCollection("myCollection", (collection) => {
    return collection.getAll().slice(0, 5);
  });

  // Add passthrough copy
  eleventyConfig.addPassthroughCopy("./src/custom-assets/");
}
```

Use the plugin:

```javascript
// eleventy.config.js
import MyPlugin from "./my-plugin.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(MyPlugin, {
    features: ["feature1"],
    debug: true
  });

  return { /* ... */ };
}
```


## Content Preprocessing

### Transform Content

```javascript
// eleventy.config.js

// Add transform to add reading time
eleventyConfig.addTransform("readingTime", (content, outputPath) => {
  if (outputPath?.endsWith(".html")) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Inject reading time meta tag
    return content.replace(
      "</head>",
      `<meta name="reading-time" content="${readingTime} min">\n</head>`
    );
  }
  return content;
});

// Add transform to optimize images
eleventyConfig.addTransform("optimizeImages", (content, outputPath) => {
  if (outputPath?.endsWith(".html")) {
    // Add lazy loading to images
    return content.replace(
      /<img /g,
      '<img loading="lazy" decoding="async" '
    );
  }
  return content;
});

// Add transform to minify HTML in production
eleventyConfig.addTransform("htmlMinifier", (content, outputPath) => {
  if (process.env.NODE_ENV === "production" && outputPath?.endsWith(".html")) {
    const htmlmin = require("html-minifier");
    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
  }
  return content;
});
```


## Common Patterns

### Breadcrumb Navigation

```javascript
// eleventy.config.js
eleventyConfig.addFilter("breadcrumbs", function(page) {
  const path = page.url.split("/").filter(Boolean);
  const crumbs = [];

  let url = "/";
  crumbs.push({ title: "Home", url: "/" });

  path.forEach(segment => {
    url += segment + "/";
    crumbs.push({
      title: segment.charAt(0).toUpperCase() + segment.slice(1),
      url: url
    });
  });

  return crumbs;
});
```

Use:

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumbs">
    {% for crumb in page | breadcrumbs %}
      <li>
        {% if loop.last %}
          <span></span>
        
          <a href=""></a>
        
      </li>
    
  </ol>
</nav>
```

### Table of Contents

```javascript
// eleventy.config.js
const markdownIt = require("markdown-it");

eleventyConfig.addFilter("tableOfContents", (content) => {
  const headings = [];
  const regex = /<h([2-3]) id="([^"]+)">([^<]+)<\/h[2-3]>/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3]
    });
  }

  return headings;
});
```

Generate TOC:

```html
<!-- In markdown with front matter -->
{% set toc = content | tableOfContents %}

<aside class="toc">
  <h3>Table of Contents</h3>
  <ul>
    {% for heading in toc %}
      <li class="level-">
        <a href="#"></a>
      </li>
    
  </ul>
</aside>


```

### Related Content

```javascript
// eleventy.config.js
eleventyConfig.addFilter("relatedPosts", function(currentPage, collection, maxCount = 3) {
  return collection
    .getFilteredByGlob("content/posts/**/*.md")
    .filter(post => post.url !== currentPage.url)
    .filter(post => {
      const currentTags = currentPage.data.tags || [];
      const postTags = post.data.tags || [];
      return currentTags.some(tag => postTags.includes(tag));
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, maxCount);
});
```


## Deployment Optimization

### Environment-Specific Configuration

```javascript
// eleventy.config.js
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    // Disable features in dev to speed up builds
    backlinks: isProd,
    encryption: isProd,

    // Use CDN in production only
    useCDN: isProd,

    // Minify in production
    minify: isProd
  });

  // Dev-only debugging
  if (isDev) {
    eleventyConfig.addFilter("debug", (value) => {
      console.log(value);
      return value;
    });
  }

  return { /* ... */ };
}
```

### Build Scripts

```json
{
  "scripts": {
    "start": "NODE_ENV=development npx @11ty/eleventy --serve",
    "build": "NODE_ENV=production npx @11ty/eleventy",
    "debug": "NODE_ENV=development npx @11ty/eleventy --profile",
    "clean": "rm -rf _site",
    "prebuild": "npm run clean"
  }
}
```


## Troubleshooting Advanced Issues

### Build Performance Issues

```bash
# Profile build to find bottlenecks
npx @11ty/eleventy --profile

# Check which plugins are slowest
npx @11ty/eleventy --dryrun
```

### Collection Errors

```javascript
// Debug collections
eleventyConfig.addCollection("debug", (collection) => {
  console.log("Total items:", collection.getAll().length);
  console.log("Markdown items:", collection.getFilteredByGlob("content/**/*.md").length);
  return [];
});
```

### Template Errors

```html
<!-- Debug variables -->


<!-- Safe property access -->


<!-- Conditional debugging -->
{% if debug %}
  <pre></pre>

```


## See Also

- [Getting Started](/11ty/getting-started/) - 11ty basics
- [Markdown](/11ty/markdown/) - Content writing
- [Filters](/11ty/filters/) - Data transformation
- [Backlinks](/11ty/backlinks/) - Content linking
- [Encryption](/11ty/encryption/) - Content protection
- [11ty Official Docs](https://www.11ty.dev/docs/) - Complete 11ty reference


Build powerful, optimized sites with advanced 11ty techniques. You've mastered the Standard Framework! 🚀