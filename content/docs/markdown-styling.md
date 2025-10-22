---
title: Markdown Styling
layout: component
permalink: /docs/markdown-styling/index.html
eleventyNavigation:
  key: Markdown Styling
  parent: Components
  title: Markdown Styling
category: Components
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-09-md.scss
since: 0.1.0
---

Beautiful styling for markdown-generated HTML. Includes support for
blockquotes, callouts, code blocks, tables, lists, and other common markdown elements.
Designed to work seamlessly with the rhythm and reading layout systems.
Automatically styles headings, paragraphs, links with proper typography.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .md Apply markdown styling to container` | `mixed` |  |
| `blockquote` | `element` | Styled blockquote with italic text |
| `{class} .callout Highlighted callout/admonition blocks` | `mixed` |  |
| `{class} .callout-title Title for callout blocks` | `mixed` |  |
| `pre` | `element` | Code block with syntax highlighting |
| `code` | `element` | Inline code styling |
| `table` | `element` | Responsive table styling |
| `a` | `element` | Link styling with underline |
| `h1` | `element` | -h6 Heading hierarchy with proper sizing |

## Examples

```scss
// Apply markdown styling to content
<article class="reading md">
<h1>Title</h1>
<p>Paragraph text...</p>
<blockquote>Quote</blockquote>
<pre><code>Code block</code></pre>
</article>
// Callout admonition block
<div class="callout">
<div class="callout-title">Note</div>
<div class="callout-content">Important information</div>
</div>
```

## See Also

- standard-09-md.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-09-md.scss`
