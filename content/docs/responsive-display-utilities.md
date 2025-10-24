---
title: Responsive Display Utilities
layout: base
permalink: /docs/responsive-display-utilities/index.html
eleventyNavigation:
  key: Responsive Display Utilities
  parent: Utilities
  title: Responsive Display Utilities
category: Utilities
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-98-utilities.scss
since: 0.10.53
---

Show/hide elements at different screen sizes.
Uses SCSS breakpoint variables for consistent responsive behavior.
Classes:
- .sm-hidden: Hidden on small screens (≤768px)
- .sm-only: Visible only on small screens (≤768px)
- .md-hidden: Hidden on medium screens (769px-1024px)
- .md-only: Visible only on medium screens (769px-1024px)
- .lg-hidden: Hidden on large screens (≥1024px)
- .lg-only: Visible only on large screens (≥1024px)

## Examples

```scss
<!-- Show on mobile, hide on desktop -->
<div class="sm-only">Mobile content</div>
<!-- Hide on mobile, show on desktop -->
<div class="sm-hidden">Desktop content</div>
<!-- Show only on tablets -->
<div class="md-only">Tablet content</div>
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-98-utilities.scss`
