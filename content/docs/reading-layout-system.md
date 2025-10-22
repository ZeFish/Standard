---
title: Reading Layout System
layout: component
permalink: /docs/reading-layout-system/index.html
eleventyNavigation:
  key: Reading Layout System
  parent: Layout
  title: Reading Layout System
category: Layout
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-06-reading.scss
since: 0.1.0
---

Prose-focused layout system for optimal reading experience with proper
line lengths based on typography research (60-75 characters). Uses CSS Grid with
responsive content columns for sidebars, accents, and featured content.
Inspired by fine-art typography and classical book design principles.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .reading Main article/content container` | `mixed` |  |
| `{class} .small Narrow sidebar width container` | `mixed` |  |
| `{class} .accent Accent container with background color` | `mixed` |  |
| `{class} .feature Featured content with larger spacing` | `mixed` |  |
| `{class} .full Full-width container` | `mixed` |  |
| `{variable} --line-width-xs Extra small (24rem / 384px)` | `mixed` |  |
| `{variable} --line-width-s Small (32rem / 512px)` | `mixed` |  |
| `{variable} --line-width-m Medium (42rem / 672px) - default` | `mixed` |  |
| `{variable} --line-width-l Large (50rem / 800px)` | `mixed` |  |
| `{variable} --line-width-xl Extra large (60rem / 960px)` | `mixed` |  |

## Examples

```scss
// Standard article with proper reading width
<article class="reading">
<h1>Article Title</h1>
<p>Content here stays within optimal reading width...</p>
</article>
// Narrow sidebar content
<div class="reading small">
<p>Short form content</p>
</div>
// Featured content with emphasis
<section class="reading feature">
<blockquote>Important quote with extra space</blockquote>
</section>
```

## See Also

- https://www.rsub.com/blog/how-long-should-a-line-of-text-be/


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-06-reading.scss`
