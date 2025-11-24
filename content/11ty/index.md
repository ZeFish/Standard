# Standard Framework 11ty Plugin

Complete integration of the Standard Framework CSS system with Eleventy. Includes automatic asset management, enhanced markdown, template filters, backlinks, content encryption, and zero-configuration setup.

## Quick Start

### 1. Install

```bash
npm install @zefish/standard
```

### 2. Add to eleventy.config.js

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);
  return {
    dir: { input: "content", output: "_site" }
  };
}
```

### 3. Use in Templates

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
</head>
<body>
  
</body>
</html>
```

### 4. Build

```bash
npx @11ty/eleventy
```

Done! Your 11ty site now has Standard Framework styling.

## What's Included

### 🎨 CSS Framework
- Typography system with golden ratio
- Semantic color system with light/dark themes
- Responsive grid layout system
- Vertical rhythm spacing
- Beautiful components (buttons, forms, cards)
- Complete utility class system

See [CSS Framework](/css/) documentation

### 📝 Markdown Enhancements
- Automatic table of contents
- Footnotes
- Obsidian-style callouts
- Code block escaping
- Enhanced syntax highlighting

See [Markdown Guide](/11ty/markdown/)

### 🔧 Template Filters
- String transformations
- Date formatting
- URL manipulation
- Content processing
- Custom helpers

See [Filters Guide](/11ty/filters/)

### 🔗 Wiki Features
- Automatic backlinks
- Bidirectional linking
- Reference detection
- Link suggestions

See [Backlinks Guide](/11ty/backlinks/)

### 🔐 Encryption
- Inline content encryption
- Password-protected content
- Client-side decryption
- No server required

See [Encryption Guide](/11ty/encryption/)

### 🎯 Shortcodes
- `` - Include CSS and JS
- `` - Include experimental features
- Plus more custom shortcodes

See [Shortcodes Reference](/docs/)

## Configuration Options

```javascript
eleventyConfig.addPlugin(Standard, {
  // Directory where CSS/JS files are copied to
  outputDir: "assets/standard",

  // Copy files from node_modules to output directory
  copyFiles: true,

  // Use CDN instead of local files (faster for production)
  useCDN: false,

  // Languages to escape in code blocks
  escapeCodeBlocks: []
});
```

## Asset Inclusion

### Local Files (Default)

```html

```

Outputs:
```html
<link rel="stylesheet" href="/assets/standard/standard.min.css">
<script src="/assets/standard/standard.min.js" type="module"></script>
```

### From CDN

```javascript
eleventyConfig.addPlugin(Standard, {
  useCDN: true
});
```

Then `` uses unpkg CDN:
```html
<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>
```

### Experimental Lab

```html

```

Includes experimental JavaScript features.

## Global Data

Access framework data in templates:

```html

```

## Learning Path

### Beginner
1. [Getting Started](/11ty/getting-started/) - Set up and basics
2. [CSS Framework](/css/) - Style your content
3. [Markdown](/11ty/markdown/) - Write with enhancements

### Intermediate
4. [Filters](/11ty/filters/) - Transform content
5. [Backlinks](/11ty/backlinks/) - Connect pages
6. [Layouts](/11ty/layouts/) - Page templates

### Advanced
7. [Encryption](/11ty/encryption/) - Protect content
8. [Advanced Features](/11ty/advanced/) - Power user tips
9. [Performance](/11ty/performance/) - Optimization

## Common Use Cases

### Blog with Standard Styling

```html

title: My Blog Post

# 

Your blog post content with beautiful Standard Framework styling.
```

### Documentation Site

```html
# Documentation

Automatically get wiki-style backlinks and beautiful typography.
```

### Portfolio

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Your portfolio items -->
</div>
```

### Knowledge Base

```html
# Topic

Your knowledge base entry with automatic backlinks to related pages.
```

## File Structure

Recommended project structure:

```
my-site/
├── eleventy.config.js
├── package.json
├── content/
│   ├── index.md
│   ├─ posts/
│   │  ├─ post-1.md
│   │  └─ post-2.md
│   └─ docs/
│      ├─ guide-1.md
│      └─ guide-2.md
├── _includes/
│   └─ layouts/
│      ├─ base.njk
│      └─ article.njk
└── _site/
    ├─ index.html
    ├─ posts/
    ├─ docs/
    └─ assets/standard/
       ├─ standard.min.css
       ├─ standard.min.js
       └─ standard.lab.js
```

## Features by Category

### Content Creation
- ✅ Enhanced markdown
- ✅ Automatic table of contents
- ✅ Footnotes
- ✅ Callouts
- ✅ Code highlighting

### Styling
- ✅ Complete CSS framework
- ✅ Light/dark themes
- ✅ Responsive layouts
- ✅ Typography scales
- ✅ Components

### Functionality
- ✅ Template filters
- ✅ Shortcodes
- ✅ Backlinks
- ✅ Content encryption
- ✅ Global data

### Performance
- ✅ Minified CSS/JS
- ✅ CDN option
- ✅ Small file sizes (14KB CSS, 2KB JS gzipped)
- ✅ Minimal dependencies

## Comparison with Similar Tools

| Feature | Standard | Eleventy | Jekyll |
|---|----|----|--|
| CSS Framework | ✅ Included | ❌ Not included | ❌ Minimal |
| Markdown Enhancement | ✅ Full | ⚠️ Limited | ⚠️ Limited |
| Backlinks | ✅ Automatic | ❌ No | ❌ No |
| Dark Mode | ✅ Built-in | ❌ No | ❌ No |
| Encryption | ✅ Included | ❌ No | ❌ No |
| Performance | ✅ Excellent | ✅ Excellent | ✅ Good |

## API Reference

- [Standard Framework Plugin](/docs/standard-framework-11ty-plugin/) - Auto-generated API
- [Markdown Plugin](/docs/markdown-plugin/) - Markdown enhancements
- [Filter Plugin](/docs/eleventy-filter-plugin/) - Template filters
- [Shortcode Plugin](/docs/eleventy-shortcode-plugin/) - Custom shortcodes
- [Backlinks Plugin](/docs/backlinks-plugin/) - Wiki features
- [Encryption Plugin](/docs/content-encryption-plugin/) - Content encryption

## Getting Help

- 📖 [Documentation](/11ty/) - Comprehensive guides
- 🐛 [Report Issues](https://github.com/ZeFish/Standard/issues)
- 💬 [Discussions](https://github.com/ZeFish/Standard/discussions)
- ⭐ [Star on GitHub](https://github.com/ZeFish/Standard)

## Next Steps

Ready to build? Start here:

1. **[Getting Started](/11ty/getting-started/)** - Installation and setup
2. **[CSS Framework](/css/)** - Learn the styling system
3. **[Markdown](/11ty/markdown/)** - Master markdown features
4. **[Filters](/11ty/filters/)** - Transform your content
5. **[Backlinks](/11ty/backlinks/)** - Connect your pages


**Version 0.10.52** | [Eleventy](https://www.11ty.dev/) | [MIT License](https://github.com/ZeFish/Standard/blob/main/LICENSE)