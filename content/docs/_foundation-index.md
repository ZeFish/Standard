---
title: Foundation
layout: base
permalink: /docs/foundation/index.html
eleventyNavigation:
  key: Foundation
  title: Foundation
---

# Foundation

Documentation for foundation components and utilities.

## Components

- [HTML Elements](/docs/html-elements/) - Styling for bare HTML elements (h1-h6, p, a, form, button, etc).
Applies typography rules and colors to semantic HTML elements.
Combines typography scales with color system for complete element styling.
All elements respect rhythm and typography system constraints.
This layer bridges the typography system and color system with concrete element styling.
- [Design Tokens](/docs/design-tokens/) - Primitive design tokens forming the foundation of the design system.
Includes mathematical ratios, modular scales, spacing system, and animation curves.
All tokens use CSS custom properties for runtime customization.
- [SCSS Variables & Mixins](/docs/scss-variables-and-mixins/) - Responsive breakpoints and rhythm application mixins for consistent
vertical rhythm and spacing across all elements. These mixins ensure proper
spacing application for rhythm-aware components.
- [Rhythm Application Mixin](/docs/rhythm-application-mixin/) - Applies rhythm spacing rules to semantic HTML elements
and common layout components. Ensures consistent vertical rhythm.
- [Rhythm Block Mixin](/docs/rhythm-block-mixin/) - Applies enhanced spacing to block-level elements that require
extra visual separation such as callouts, blockquotes, code blocks, and tables.

