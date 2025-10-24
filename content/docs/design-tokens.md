---
title: Design Tokens
layout: base
permalink: /docs/design-tokens/index.html
eleventyNavigation:
  key: Design Tokens
  parent: Foundation
  title: Design Tokens
category: Foundation
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-01-token.scss
since: 0.1.0
---

Primitive design tokens forming the foundation of the design system.
Includes mathematical ratios, modular scales, spacing system, and animation curves.
All tokens use CSS custom properties for runtime customization.

## Examples

```scss
:root {
--font-ratio: var(--ratio-silver);
--space: 1rlh;
--scale-l: calc(1rem * 1.414);
}
```

## See Also

- standard-00-variables.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-01-token.scss`
