---
title: Markdown Enhancements

eleventyNavigation:
  key: Markdown
  parent: 11ty Plugin
  title: Markdown
permalink: /11ty/markdown/
---

# Enhanced Markdown

The Standard Framework adds powerful markdown extensions for richer content.

## Extended Syntax

### Footnotes

Add footnotes to your markdown:

```markdown
This is a statement[^1] with a footnote.

[^1]: This is the footnote content.
```

Renders with automatic footnote links and backlinks.

### Callouts

Create styled callout boxes:

```markdown
> [!NOTE]
> This is an important note that stands out visually

> [!WARNING]
> This requires your attention

> [!TIP]
> Here's a helpful tip

> [!DANGER]
> This is dangerous - be careful!

> [!INFO]
> Additional information
```

Callout types:
- `[!NOTE]` - Blue info box
- `[!WARNING]` - Orange warning box
- `[!TIP]` - Green tip box
- `[!DANGER]` - Red danger box
- `[!INFO]` - Light blue info box

### Code Block Escaping

Prevent code in markdown from being processed:

```javascript
// Configure in eleventy.config.js
eleventyConfig.addPlugin(Standard, {
  escapeCodeBlocks: ['liquid', 'nunjucks']
});
```

In markdown:

~~~markdown
```liquid
{% for item in items %}
  Item: {{ item }}
{% endfor %}
```
~~~

The code block won't be processed as a template.

## Standard Markdown Features

### Headings

```markdown
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading
```

### Emphasis

```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic***
~~strikethrough~~
```

### Lists

```markdown
# Unordered
- Item 1
- Item 2
  - Nested item
  - Another nested

# Ordered
1. First
2. Second
3. Third

# Mixed
- Main
  1. Sub-ordered
  2. Another sub
- Another main
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")
<https://example.com>
```

### Images

```markdown
![Alt text](image.jpg)
![Alt text](image.jpg "Image title")
```

### Blockquotes

```markdown
> This is a blockquote
> that can span multiple lines
>
> > And can be nested
```

### Code

```markdown
Inline `code` like this
Or a code block:

```javascript
function hello() {
  console.log("Hello World");
}
```
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Horizontal Rule

```markdown
---
```

## Markdown Configuration

### In eleventy.config.js

```javascript
import Standard from "@zefish/standard";

eleventyConfig.addPlugin(Standard, {
  // Escape code blocks for these languages
  escapeCodeBlocks: ["liquid", "nunjucks"],

  // Standard Framework automatically enables:
  // - Footnotes (via markdown-it-footnote)
  // - Obsidian callouts (via markdown-it-obsidian-callouts)
  // - Syntax highlighting (via @11ty/eleventy-plugin-syntaxhighlight)
});
```

## Front Matter in Markdown

Control rendering with front matter:

```markdown
---
layout: layouts/article.njk
title: Article Title
description: Short description
tags:
  - featured
  - important
---

# Article content here
```

## Liquid/Nunjucks in Markdown

Use template syntax in markdown:

```markdown
---
layout: layouts/base.njk
---

# {{ title }}

Hello {{ author }}, welcome to {{ site.name }}.

{% for item in items %}
- {{ item }}
{% endfor %}
```

Disable with escapeCodeBlocks for code examples.

## Markdown Best Practices

### ✓ Do

- Use headings for structure
- Write in short paragraphs
- Link to related content
- Use callouts for emphasis
- Include descriptive image alt text
- Use tables for data
- Break complex content into sections

### ✗ Don't

- Skip the H1 heading
- Write overly long paragraphs
- Nest lists too deeply
- Use ONLY emphasis for structure
- Forget alt text on images
- Use HTML when markdown works
- Mix markdown and HTML

## Common Patterns

### Article with Callout

```markdown
---
layout: layouts/article.njk
title: Advanced Guide
---

# Advanced Guide

> [!WARNING]
> This guide is for experienced users

## Introduction

Here's the content...

> [!TIP]
> Remember to backup before proceeding
```

### Post with Footnotes

```markdown
---
layout: layouts/article.njk
---

# Research Article

This finding[^1] is significant[^2].

[^1]: First reference
[^2]: Second reference provides more context
```

### Code Examples with Multiple Languages

~~~markdown
```javascript
// JavaScript example
const greeting = "Hello";
```

```python
# Python example
greeting = "Hello"
```

```bash
# Bash example
echo "Hello"
```
~~~

## Rendering Options

### Output with Syntax Highlighting

Code blocks automatically get syntax highlighting based on language:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

### Highlighted Lines

Configure in 11ty for highlighted line numbers:

~~~markdown
```javascript
// highlight-line
const important = true;
```
~~~

## See Also

- [Markdown Plugin API](/docs/markdown-plugin/) - Complete reference
- [Markdown Styling](/docs/markdown-styling/) - CSS for markdown
- [Filters](/11ty/filters/) - Transform markdown output
- [Markdown Preprocessor](/docs/markdown-preprocessor-plugin/) - Advanced processing

---

Master markdown syntax and create rich content. [Learn filters](/11ty/filters/)
