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
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-98-utilities.scss
since: 0.10.53
---

# Responsive Display Utilities

Show/hide elements at different screen sizes. Uses SCSS breakpoint variables for consistent responsive behavior.

Classes:
 - .sm-hidden: Hidden on small screens (≤768px)
 - .sm-only: Visible only on small screens (≤768px)
 - .md-hidden: Hidden on medium screens (769px-1024px)
 - .md-only: Visible only on medium screens (769px-1024px)
 - .lg-hidden: Hidden on large screens (≥1024px)
 - .lg-only: Visible only on large screens (≥1024px)

```scss
<!-- Show on mobile, hide on desktop -->
<div class="sm-only">Mobile content</div>

<!-- Hide on mobile, show on desktop -->
<div class="sm-hidden">Desktop content</div>

<!-- Show only on tablets -->
<div class="md-only">Tablet content</div>
```

<details>
<summary><span class="button">Source Code</span></summary>

```scss
@media (max-width: $small) {
    .sm-hidden {
        display: none !important;
    }
    .sm-only {
        display: inherit !important;
    }
    .md-only {
        display: none !important;
    }
    .lg-only {
        display: none !important;
    }
}

/* Medium screens (tablet): 769px-1024px */
@media (min-width: calc($small + 1px)) and (max-width: $large) {
    .md-hidden {
        display: none !important;
    }
    .sm-only {
        display: none !important;
    }
    .md-only {
        display: inherit !important;
    }
    .lg-only {
        display: none !important;
    }
}

/* Large screens (desktop): ≥1024px */
@media (min-width: calc($large + 1px)) {
    .lg-hidden {
        display: none !important;
    }
    .sm-only {
        display: none !important;
    }
    .md-only {
        display: none !important;
    }
    .lg-only {
        display: inherit !important;
    }
}

/* =========================== */
/* MULTI-COLUMN FLOW UTILITIES */
/* =========================== */
```

</details>

