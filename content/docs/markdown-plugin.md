---
title: Markdown Plugin
layout: component
permalink: /docs/markdown-plugin/index.html
eleventyNavigation:
  key: Markdown Plugin
  parent: 11ty Plugins
  title: Markdown Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/markdown.js
since: 0.1.0
---

Configures markdown-it parser with plugins for syntax highlighting,
callout blocks (admonitions), and footnotes. Enables typographer for smart quotes,
dashes, and proper punctuation. HTML output from markdown is preserved.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `syntaxHighlight` | `plugin` | Code syntax highlighting for fenced code blocks |
| `markdown_it_obsidian_callouts` | `plugin` | Callout/admonition blocks support |
| `markdownItFootnote` | `plugin` | Footnote support with references |
| `html` | `option` | Allow HTML in markdown content |
| `breaks` | `option` | Treat newlines as breaks (soft line breaks) |
| `linkify` | `option` | Auto-detect and linkify URLs |
| `typographer` | `option` | Enable smart typography (quotes, dashes, etc.) |

## Examples

```js
// Markdown features available:
// Callout block (Obsidian syntax)
> [!NOTE]
> This is a note callout
// Footnote
This text has a footnote[^1].
[^1]: This is the footnote content
// Code block with syntax highlighting
```javascript
const code = "highlighted";
```
// Smart typography
"Quotes" become "curly"
... becomes …
-- becomes –
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/markdown.js`
