---
title: Typography System
layout: base
permalink: /docs/typography-system/index.html
eleventyNavigation:
  key: Typography System
  parent: Typography
  title: Typography System
category: Typography
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-03-typography.scss
since: 0.1.0
---

Fine-art typography system using variable fonts, OpenType features,
and mathematical scaling. Implements classical typography rules with modern web capabilities.
Supports multiple font families, optical sizing, and locale-specific rules.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{string} --font-text Font family for body text (default: InterVariable)` | `mixed` |  |
| `{string} --font-header Font family for headings (default: InterVariable)` | `mixed` |  |
| `{string} --font-monospace Monospace font for code (default: IBM Plex Mono)` | `mixed` |  |
| `{number} --font-weight Body text weight (default: 400)` | `mixed` |  |
| `{number} --bold-weight Bold text weight (default: 600)` | `mixed` |  |
| `{string} --font-feature OpenType features to enable` | `mixed` |  |
| `{string} --font-variation Variable font axis settings` | `mixed` |  |

## Examples

```scss
html {
font-family: var(--font-text);
font-size: var(--scale);
font-feature-settings: var(--font-feature);
line-height: var(--line-height);
text-wrap: pretty;
}
```

## See Also

- standard-01-token.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-03-typography.scss`
