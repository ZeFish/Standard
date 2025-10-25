---
title: SCSS Variables & Mixins
layout: base
permalink: /docs/scss-variables-and-mixins/index.html
eleventyNavigation:
  key: SCSS Variables & Mixins
  parent: Foundation
  title: SCSS Variables & Mixins
category: Foundation
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-00-variables.scss
since: 0.1.0
---

# SCSS Variables & Mixins

Responsive breakpoints and rhythm application mixins for consistent vertical rhythm and spacing across all elements. These mixins ensure proper spacing application for rhythm-aware components.

```scss
// Using breakpoint variables
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `{variable} $mobile Mobile breakpoint (480px)` | `mixed` |  |
| `{variable} $small Small screen breakpoint (768px)` | `mixed` |  |
| `{variable} $large Large screen breakpoint (1024px)` | `mixed` |  |
| `{variable} $wide Wide screen breakpoint (1440px)` | `mixed` |  |

<details>
<summary><span class="button">Source Code</span></summary>

```scss
$mobile: 600px;
$small: 768px;
$large: 1024px;
$wide: 1440px;
```

</details>

### See Also

- standard-01-token.scss

