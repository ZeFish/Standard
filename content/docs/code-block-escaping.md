---
title: Code Block Escaping
layout: base
permalink: /docs/code-block-escaping/index.html
eleventyNavigation:
  key: Code Block Escaping
  parent: API
  title: Code Block Escaping
category: Utilities
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
---

# Code Block Escaping

Code Block Escaping - Fragile Syntax Protection Protocol

 Some languages live dangerously close to markdown syntax. HTML with its angle brackets, XML with its declarative nature—both can confuse a preprocessor if treated carelessly. When you write about code *in* code blocks, the preprocessor might interpret the markdown and corrupt your examples.

This preprocessor protects fragile code blocks by removing their markdown code fence markers (the backticks), rendering them as raw text. This prevents accidental transformations. The language is configured per-document via front matter (`escapeCodeBlocks: ["html", "xml"]`), or globally when the plugin loads. Document settings take precedence—you can override global behavior on a per-file basis for maximum control.

Think of it as creating a protected zone: "this code is fragile, don't touch it."

## 🚀 Future Improvements 
 - [ ] Add whitespace preservation options
 - [ ] Support inline code escaping
 - [ ] Create escape level control (partial vs. full)

## 🔗 Related

```js
markdown - Front matter configuration
---
escapeCodeBlocks: ["html", "xml"]
---
```

```js
markdown - Protected HTML block
```html
<div class="protected">This won't be preprocessed</div>
```
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `Object` | - Front matter data (checked for escapeCodeBlocks array) |
| `content` | `String` | - Raw markdown content |

### Returns

**Type:** `String`

Content with specified language code blocks unescaped

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
eleventyConfig.addPreprocessor("escapeCodeBlock", "md", (data, content) => {
    // Get escape languages from front matter or use global setting
    // Front matter takes precedence: escapeCodeBlocks: ["html", "xml"]
    const escapeLanguages = data.escapeCodeBlocks || globalEscapeCodeBlocks;

    if (!escapeLanguages || escapeLanguages.length === 0) {
      return content;
    }

    // Create a regex pattern for each language to match code blocks
    escapeLanguages.forEach((lang) => {
      // Match ```language\n content \n``` and remove backticks
      // The 's' flag makes '.' match newlines, allowing multiline content
      const pattern = new RegExp(`^\`\`\`${lang}\n(.*?)\n\`\`\`$`, "gms");
      content = content.replace(pattern, "$1");
    });

    return content;
  });
```

</details>

### See Also

- {preprocessor} highlight - Works alongside code protection

