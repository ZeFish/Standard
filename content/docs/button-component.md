---
title: Button Component
layout: component
permalink: /docs/button-component/index.html
eleventyNavigation:
  key: Button Component
  parent: Components
  title: Button Component
category: Components
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-10-button.scss
since: 0.1.0
---

Minimalist button styling that works on both native button elements
and anchor/link elements. Uses the framework's accent color with smooth opacity
transitions. Supports keyboard focus states for accessibility.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `button` | `element` | Default button element styling |
| `{class} .button Apply button styling to elements` | `mixed` |  |
| `button` | `state` | :hover Reduced opacity on hover |
| `button` | `state` | :active Reduced opacity on active/click |
| `button` | `state` | :focus-visible Keyboard focus outline |
| `button` | `state` | :disabled Disabled button styling |

## Examples

```scss
// Native button element
<button>Click me</button>
// Link styled as button
<a href="/page" class="button">Go to page</a>
// With icon or content
<button>
<svg>...</svg>
Button text
</button>
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-10-button.scss`
