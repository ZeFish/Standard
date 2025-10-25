---
title: Date Format Normalization
layout: base
permalink: /docs/date-format-normalization/index.html
eleventyNavigation:
  key: Date Format Normalization
  parent: API
  title: Date Format Normalization
category: Utilities
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/preprocessor.js
---

# Date Format Normalization

Date Format Normalization - Temporal Metadata Standardization

 Front matter in markdown is notoriously finicky about dates. Write them one way in YAML and they're strings; write them another and they're parsed as JavaScript Date objects. This inconsistency breaks templating, sorting, and filtering—the three pillars of content management.

The YAML 1.1 specification (which Jekyll popularized) tries to be helpful by auto-parsing timestamps. But it's unreliable across systems and configurations. This preprocessor takes the author's intent—a readable timestamp like "2024-10-25 14:30"—and guarantees it becomes a proper JavaScript Date object before any templating runs.

It's defensive programming for content: assume strings, validate carefully, transform only when safe, and preserve originals if anything seems wrong. Your dates become predictable, sortable, and reliable throughout the pipeline.

## 🚀 Future Improvements 
 - [ ] Support timezone specification in timestamps
 - [ ] Add date range parsing for duration fields
 - [ ] Create ISO 8601 validation strictness option

## 🔗 Related

```js
markdown - Front matter dates
---
created: 2024-10-25 14:30
modified: 2024-10-25 15:45
---
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `Object` | - Front matter data with optional `created` and `modified` fields |
| `content` | `String` | - Raw markdown content (unchanged by this preprocessor) |

### Returns

**Type:** `String`

Content unchanged; modifies data.created and data.modified in place

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
eleventyConfig.addPreprocessor("fixDates", "md", (data, content) => {
    const fixDateString = (value) => {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ) {
        const date = new Date(value.replace(" ", "T"));
        // If the date is invalid, return the original value to prevent errors
        return isNaN(date.getTime()) ? value : date;
      }
      return value;
    };

    // Fix only known fields
    if (data.created) data.created = fixDateString(data.created);
    if (data.modified) data.modified = fixDateString(data.modified);

    return content;
  });
}
```

</details>

### See Also

- {preprocessor} comment - Other metadata transformations

