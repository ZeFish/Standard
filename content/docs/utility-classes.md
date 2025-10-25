---
title: Utility Classes
layout: base
permalink: /docs/utility-classes/index.html
eleventyNavigation:
  key: Utility Classes
  parent: Utilities
  title: Utility Classes
category: Utilities
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-98-utilities.scss
since: 0.1.0
---

# Utility Classes

Self-documenting utility classes following a consistent naming pattern. All utilities use the format: [property]-[side/variant]-[size]. Size tokens: xs, s, base (default), l, xl, 2xl, 3xl All utilities use logical properties for RTL support and !important for override capability.

```scss
// Spacing
<div class="margin-top-base padding-right-l">Spaced content</div>
<div class="margin-bottom-xs gap-s">Flex container</div>

// Typography
<p class="text-size-small text-color-muted">Small muted text</p>
<h2 class="text-size-display text-align-center">Display heading</h2>

// Layout
<div class="width-full height-auto display-hidden">Hidden element</div>
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .margin-* Margin utilities (top, right, bottom, left, block, inline)` | `mixed` |  |
| `{class} .padding-* Padding utilities (top, right, bottom, left, block, inline)` | `mixed` |  |
| `{class} .gap-* Gap utilities for flexbox/grid` | `mixed` |  |
| `{class} .width-* Width utilities` | `mixed` |  |
| `{class} .height-* Height utilities` | `mixed` |  |
| `{class} .text-size-* Typography size utilities` | `mixed` |  |
| `{class} .text-weight-* Font weight utilities` | `mixed` |  |
| `{class} .text-align-* Text alignment utilities` | `mixed` |  |
| `{class} .text-transform-* Text transformation utilities` | `mixed` |  |
| `{class} .line-height-* Line height utilities` | `mixed` |  |
| `{class} .text-color-* Text color utilities` | `mixed` |  |
| `{class} .background-color-* Background color utilities` | `mixed` |  |
| `{class} .border-color-* Border color utilities` | `mixed` |  |
| `{class} .display-* Visibility utilities` | `mixed` |  |

