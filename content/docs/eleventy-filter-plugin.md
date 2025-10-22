---
title: Eleventy Filter Plugin
layout: component
permalink: /docs/eleventy-filter-plugin/index.html
eleventyNavigation:
  key: Eleventy Filter Plugin
  parent: 11ty Plugins
  title: Eleventy Filter Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/filter.js
since: 0.1.0
---

Provides template filters for content processing including excerpt
generation, image extraction, HTML manipulation, date formatting, and data filtering.
All filters handle both Markdown and HTML input gracefully.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `excerpt` | `filter` | Extract content summary with customizable options |
| `extractFirstImage` | `filter` | Get first image URL from content |
| `firstParagraph` | `filter` | Extract first paragraph |
| `excerptWords` | `filter` | Limit excerpt to N words |
| `htmlDateString` | `filter` | Format date for HTML |
| `dateToXmlschema` | `filter` | ISO 8601 date format |
| `removeTags` | `filter` | Remove specific HTML tags |
| `filterTags` | `filter` | Keep only specific tags |
| `removeEmptyTags` | `filter` | Clean empty elements |
| `dotDate` | `filter` | Format date as YY.MM.DD |

## Examples

```js
// In template
{{ post.content | excerpt(maxWords: 50) }}
{{ post.content | extractFirstImage }}
{{ post.date | dateToXmlschema }}
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/filter.js`
