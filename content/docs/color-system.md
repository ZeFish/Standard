---
title: Color System
layout: base
permalink: /docs/color-system/index.html
eleventyNavigation:
  key: Color System
  parent: Colors
  title: Color System
category: Colors
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-02-color.scss
since: 0.1.0
---

Complete light/dark color system with semantic color tokens.
Automatically respects user's system color scheme preference using CSS media queries.
Includes analog-inspired light theme and retro tech-inspired dark theme.
All colors designed for WCAG AA accessibility contrast ratios.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{color} --color-background Page background color` | `mixed` |  |
| `{color} --color-foreground Text foreground color` | `mixed` |  |
| `{color} --color-accent Primary accent color` | `mixed` |  |
| `{color} --color-success Success/positive state color` | `mixed` |  |
| `{color} --color-warning Warning/caution state color` | `mixed` |  |
| `{color} --color-error Error/negative state color` | `mixed` |  |
| `{color} --color-info Info/neutral state color` | `mixed` |  |

## Examples

```scss
// Light theme colors
:root {
--color-background: white;
--color-foreground: #262626;
--color-accent: #c8a840;
}
// Dark theme (auto-applied)
```

## See Also

- https://webaim.org/articles/contrast/


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-02-color.scss`
