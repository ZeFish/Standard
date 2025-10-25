---
title: Comment Removal
layout: base
permalink: /docs/comment-removal/index.html
eleventyNavigation:
  key: Comment Removal
  parent: API
  title: Comment Removal
category: Utilities
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
---

# Comment Removal

Comment Removal - Author's Internal Monologue Stripping

 Writers have always needed thinking space. In printed books, editors would mark marginal notes with daggers (†) and asterisks (*)—private thoughts alongside the public text. In the digital age, you need the same freedom to write your internal notes without them bleeding into the final output.

This preprocessor removes any content wrapped in %\% delimiters, treating them as your thinking space. You can write reminders, questions, revision notes, or anything you need to remember while drafting—they vanish before publication. It's a simple but powerful form of cognitive freedom: write for yourself first, the audience second.

### Future Improvementss 
 - Support nested comment delimiters
 - Option to preserve comments in draft mode

```js
markdown - Using author's notes
This is published text.
%\% TODO: expand this section with more examples %\%
This continues the published thought.
Here the %\% are escaped for demonstration.
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `Object` | - Front matter data |
| `content` | `String` | - Raw markdown content |

### Returns

**Type:** `String`

Content with %% %% comments removed

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
eleventyConfig.addPreprocessor("comment", "md", (data, content) => {
    return content.replaceAll(/%%[\s\S]*?%%/g, "");
  });
```

</details>

### See Also

- {preprocessor} commentCallouts - Removes structured comment blocks

