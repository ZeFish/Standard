---
title: Backlinks Plugin
layout: component
permalink: /docs/backlinks-plugin/index.html
eleventyNavigation:
  key: Backlinks Plugin
  parent: 11ty Plugins
  title: Backlinks Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/backlinks.js
since: 0.1.0
---

Implements wiki-style bidirectional backlinks for knowledge graph
and content interconnection. Automatically discovers internal links and creates
a backlinks map showing which pages link to each page. Supports wiki-style link
syntax [[Page Name]] in addition to standard markdown links.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `_backlinksMap` | `collection` | Map of all backlinks in the site |
| `getBacklinks` | `function` | (url) Get backlinks for a specific URL |
| `{syntax} [[Page Name]] Wiki-style internal link syntax` | `mixed` |  |
| `{syntax} [Link Text](url) Standard markdown link syntax` | `mixed` |  |

## Examples

```js
// In template, show backlinks to current page
{% for backlink in backlinks %}
<a href="{{ backlink.url }}">{{ backlink.title }}</a>
{% endfor %}
// Wiki-style link (auto-discovered)
[[Related Article]]
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/backlinks.js`
