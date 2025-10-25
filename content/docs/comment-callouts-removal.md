---
title: Comment Callouts Removal
layout: base
permalink: /docs/comment-callouts-removal/index.html
eleventyNavigation:
  key: Comment Callouts Removal
  parent: API
  title: Comment Callouts Removal
category: Utilities
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
---

# Comment Callouts Removal

Comment Callouts Removal - Structured Annotation Filtering

 Markdown's callout syntax—those `> [!NOTE]` and `> [!WARNING]` blocks—is powerful for reader guidance. But sometimes you need a callout syntax just for yourself: editorial notes, fact-checking markers, revision suggestions. The `[!comments]` and `[!comment]` callouts serve exactly this purpose.

This preprocessor strips these self-directed callouts before rendering, leaving all other callouts intact. It's like having a digital margin of your manuscript where you can annotate, question, and refine—then hand off a clean copy to readers.

## 🚀 Future Improvements 
 - [ ] Add callout preservation for draft/preview modes
 - [ ] Support custom callout types for different annotation purposes

## 🔗 Related

```js
markdown - Using comment callouts
> [!comments]
> This section needs verification
> before publishing
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `Object` | - Front matter data |
| `content` | `String` | - Raw markdown content |

### Returns

**Type:** `String`

Content with [!comment(s)] callout blocks removed

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
eleventyConfig.addPreprocessor("commentCallouts", "md", (data, content) => {
    return content.replace(/(^> \[!comments?\][^\n]*\n(?:^>.*\n?)*)/gm, "");
  });
```

</details>

### See Also

- {preprocessor} comment - Simple comment delimiter removal

