---
title: Markdown Preprocessor Plugin
layout: base
permalink: /docs/markdown-preprocessor-plugin/index.html
eleventyNavigation:
  key: Markdown Preprocessor Plugin
  parent: 11ty Plugins
  title: Markdown Preprocessor Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
since: 0.1.0
---

Preprocesses markdown content before rendering. Removes comments,
handles syntax highlighting markers, escapes code blocks, and fixes date formats.
Supports HTML comments (%% ... %%), highlighting syntax (== ... ==), and
configurable code block language escaping.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `comment` | `preprocessor` | Remove HTML comments (%% ... %%) |
| `commentCallouts` | `preprocessor` | Remove comment callout blocks |
| `highlight` | `preprocessor` | Convert highlight syntax == text == to <mark> |
| `escapeCodeBlock` | `preprocessor` | Escape specified language code blocks |
| `fixDates` | `preprocessor` | Convert date strings to Date objects |
| `escapeCodeBlocks` | `option` | Array of languages to escape (e.g., ["html", "xml"]) |

## Examples

```js
// In markdown, remove comments
%% This comment will be removed %%
// Highlight text
This text is == highlighted == with yellow background
// Code block escaping (configured in front matter)
escapeCodeBlocks: ["html"]
```html
<div>This block escapes backticks</div>
```
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js`
