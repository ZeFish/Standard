---
title: Highlight Syntax Conversion
layout: base
permalink: /docs/highlight-syntax-conversion/index.html
eleventyNavigation:
  key: Highlight Syntax Conversion
  parent: API
  title: Highlight Syntax Conversion
category: Utilities
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
---

# Highlight Syntax Conversion

Highlight Syntax Conversion - Semantic Emphasis Transformation

 Before digital highlighters existed, readers used actual markers: fluorescent yellows and pinks to flag important passages. The tradition runs deep—back to medieval monks rubricating manuscripts in red ochre, marking the sacred passages for reference.

The `== text ==` syntax brings this tactile, visual practice into markdown. It's more semantic than bold or italic: you're not emphasizing tone or voice, you're marking *importance*. This preprocessor converts that syntax into proper `<mark>` elements—the HTML5 way of saying "this is highlighted by the author." Readers see the yellow background, but developers see semantic HTML.

## 🚀 Future Improvements 
 - [ ] Support multiple highlight colors with syntax variants
 - [ ] Add highlight removal option for alternate stylesheets
 - [ ] Create highlight analytics tracking

## 🔗 Related

```js
markdown - Marking important content
The baseline grid is ==the foundation of readable typography==.
Every element should sit on this invisible framework.
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `Object` | - Front matter data |
| `content` | `String` | - Raw markdown content |

### Returns

**Type:** `String`

Content with == text == converted to <mark> elements

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
eleventyConfig.addPreprocessor("highlight", "md", (data, content) => {
    return content.replace(/==(.+?)==/g, "<mark>$1</mark>");
  });
```

</details>

### See Also

- {preprocessor} escapeCodeBlock - Code protection in highlights

