---
title: Utility Classes & Mixins
layout: component
permalink: /docs/utility-classes-&-mixins/index.html
eleventyNavigation:
  key: Utility Classes & Mixins
  parent: Utilities
  title: Utility Classes & Mixins
category: Utilities
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-07-utilities.scss
since: 0.1.0
---

Helper utilities for spacing, text styling, visibility, and common
patterns. Includes mixin for generating spacing utilities and responsive helpers.
All utilities respect the rhythm system and use logical properties for RTL support.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .m-0 through .m-3xl Margin utilities` | `mixed` |  |
| `{class} .p-0 through .p-3xl Padding utilities` | `mixed` |  |
| `{class} .mt-* through .mb-* Directional margins` | `mixed` |  |
| `{class} .pt-* through .pb-* Directional padding` | `mixed` |  |
| `{class} .text-left, .text-center, .text-right Text alignment` | `mixed` |  |
| `{class} .text-bold, .text-italic, .text-uppercase Text styling` | `mixed` |  |
| `{class} .hidden, .visually-hidden Visibility utilities` | `mixed` |  |
| `{class} .no-margin, .no-padding Reset utilities` | `mixed` |  |

## Examples

```scss
// Spacing utilities
<div class="m-l">Large margin bottom</div>
<div class="p-s">Small padding</div>
// Text utilities
<p class="text-center text-bold">Centered bold text</p>
// Visibility utilities
<div class="hidden">Hidden from view</div>
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-07-utilities.scss`
