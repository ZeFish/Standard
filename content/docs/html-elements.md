---
title: HTML Elements
layout: base
permalink: /docs/html-elements/index.html
eleventyNavigation:
  key: HTML Elements
  parent: Foundation
  title: HTML Elements
category: Foundation
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-04-elements.scss
since: 0.1.0
---

Styling for bare HTML elements (h1-h6, p, a, form, button, etc).
Applies typography rules and colors to semantic HTML elements.
Combines typography scales with color system for complete element styling.
All elements respect rhythm and typography system constraints.
This layer bridges the typography system and color system with concrete element styling.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `h1` | `element` | -h6 Heading hierarchy with proper sizing and weights |
| `p` | `element` | Paragraph text styling |
| `a` | `element` | Link styling with underline and hover states |
| `button` | `element` | Native button element styling |
| `{class} .button Apply button styling to any element` | `mixed` |  |
| `input` | `element` | Text input styling |
| `textarea` | `element` | Textarea styling |
| `select` | `element` | Select dropdown styling |
| `label` | `element` | Label styling |
| `strong` | `element` | Bold text styling |
| `code` | `element` | Inline code styling |
| `pre` | `element` | Code block styling |

## Examples

```scss
// Headings automatically styled with typography + colors
<h1>Page Title</h1>
<h2>Section Heading</h2>
// Links with hover states
<a href="/page">Link text</a>
// Buttons - native and custom
<button>Click me</button>
<a href="/page" class="button">Link button</a>
// Form elements with focus states
<input type="text" placeholder="Name">
<textarea>Message</textarea>
<select><option>Choose...</option></select>
```

## See Also

- standard-02-color.scss
- standard-03-typography.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-04-elements.scss`
