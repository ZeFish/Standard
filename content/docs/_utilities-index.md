---
title: Utilities
layout: base
permalink: /docs/utilities/index.html
eleventyNavigation:
  key: Utilities
  title: Utilities
---

# Utilities

Documentation for utilities components and utilities.

## Components

- [Utility Classes](/docs/utility-classes/) - Self-documenting utility classes following a consistent naming pattern.
All utilities use the format: [property]-[side/variant]-[size].
Size tokens: xs, s, base (default), l, xl, 2xl, 3xl
All utilities use logical properties for RTL support and !important for override capability.
- [Responsive Display Utilities](/docs/responsive-display-utilities/) - Show/hide elements at different screen sizes.
Uses SCSS breakpoint variables for consistent responsive behavior.

Classes:
- .sm-hidden: Hidden on small screens (≤768px)
- .sm-only: Visible only on small screens (≤768px)
- .md-hidden: Hidden on medium screens (769px-1024px)
- .md-only: Visible only on medium screens (769px-1024px)
- .lg-hidden: Hidden on large screens (≥1024px)
- .lg-only: Visible only on large screens (≥1024px)
- [Multi-Column Flow Utilities](/docs/multi-column-flow-utilities/) - CSS multi-column layout utilities for flowing text across columns.
Useful for magazine-style layouts, masonry grids, and dense text content.
Automatically stacks to single column on mobile for readability.

Classes:
- .flow-2, .flow-3, .flow-4: Fixed column count
- .flow-auto: Automatic columns based on optimal width
- .flow-gap-tight, .flow-gap-wide: Column gap variants
- .flow-keep: Prevent breaks inside elements
- .flow-rule, .flow-rule-accent: Vertical lines between columns
- [Standard](/docs/standard/) - Toggle zoom on an image
- [Comment Removal](/docs/comment-removal/) - Comment Removal - Author's Internal Monologue Stripping


Writers have always needed thinking space. In printed books, editors would
mark marginal notes with daggers (†) and asterisks (*)—private thoughts
alongside the public text. In the digital age, you need the same freedom
to write your internal notes without them bleeding into the final output.

This preprocessor removes any content wrapped in %\% delimiters, treating
them as your thinking space. You can write reminders, questions, revision
notes, or anything you need to remember while drafting—they vanish before
publication. It's a simple but powerful form of cognitive freedom: write
for yourself first, the audience second.

### Future Improvementss

- Support nested comment delimiters
- Option to preserve comments in draft mode
- [Comment Callouts Removal](/docs/comment-callouts-removal/) - Comment Callouts Removal - Structured Annotation Filtering


Markdown's callout syntax—those `> [!NOTE]` and `> [!WARNING]` blocks—is
powerful for reader guidance. But sometimes you need a callout syntax just
for yourself: editorial notes, fact-checking markers, revision suggestions.
The `[!comments]` and `[!comment]` callouts serve exactly this purpose.

This preprocessor strips these self-directed callouts before rendering,
leaving all other callouts intact. It's like having a digital margin of
your manuscript where you can annotate, question, and refine—then hand off
a clean copy to readers.

## 🚀 Future Improvements

- [ ] Add callout preservation for draft/preview modes
- [ ] Support custom callout types for different annotation purposes

## 🔗 Related
- [Highlight Syntax Conversion](/docs/highlight-syntax-conversion/) - Highlight Syntax Conversion - Semantic Emphasis Transformation


Before digital highlighters existed, readers used actual markers: fluorescent
yellows and pinks to flag important passages. The tradition runs deep—back
to medieval monks rubricating manuscripts in red ochre, marking the sacred
passages for reference.

The `== text ==` syntax brings this tactile, visual practice into markdown.
It's more semantic than bold or italic: you're not emphasizing tone or voice,
you're marking *importance*. This preprocessor converts that syntax into
proper `<mark>` elements—the HTML5 way of saying "this is highlighted by
the author." Readers see the yellow background, but developers see semantic HTML.

## 🚀 Future Improvements

- [ ] Support multiple highlight colors with syntax variants
- [ ] Add highlight removal option for alternate stylesheets
- [ ] Create highlight analytics tracking

## 🔗 Related
- [Code Block Escaping](/docs/code-block-escaping/) - Code Block Escaping - Fragile Syntax Protection Protocol


Some languages live dangerously close to markdown syntax. HTML with its angle
brackets, XML with its declarative nature—both can confuse a preprocessor
if treated carelessly. When you write about code *in* code blocks, the
preprocessor might interpret the markdown and corrupt your examples.

This preprocessor protects fragile code blocks by removing their markdown
code fence markers (the backticks), rendering them as raw text. This prevents
accidental transformations. The language is configured per-document via front
matter (`escapeCodeBlocks: ["html", "xml"]`), or globally when the plugin loads.
Document settings take precedence—you can override global behavior on a
per-file basis for maximum control.

Think of it as creating a protected zone: "this code is fragile, don't touch it."

## 🚀 Future Improvements

- [ ] Add whitespace preservation options
- [ ] Support inline code escaping
- [ ] Create escape level control (partial vs. full)

## 🔗 Related
- [Date Format Normalization](/docs/date-format-normalization/) - Date Format Normalization - Temporal Metadata Standardization


Front matter in markdown is notoriously finicky about dates. Write them one
way in YAML and they're strings; write them another and they're parsed as
JavaScript Date objects. This inconsistency breaks templating, sorting, and
filtering—the three pillars of content management.

The YAML 1.1 specification (which Jekyll popularized) tries to be helpful by
auto-parsing timestamps. But it's unreliable across systems and configurations.
This preprocessor takes the author's intent—a readable timestamp like
"2024-10-25 14:30"—and guarantees it becomes a proper JavaScript Date object
before any templating runs.

It's defensive programming for content: assume strings, validate carefully,
transform only when safe, and preserve originals if anything seems wrong.
Your dates become predictable, sortable, and reliable throughout the pipeline.

## 🚀 Future Improvements

- [ ] Support timezone specification in timestamps
- [ ] Add date range parsing for duration fields
- [ ] Create ISO 8601 validation strictness option

## 🔗 Related
- [Doc Parser](/docs/doc-parser/) - JSDoc-style documentation parser for SCSS and JavaScript files
Extracts structured documentation from code comments

Expected format:
/**
* @component ComponentName
* @description Short description
* @category Category Name
* @example
*   Code example here
* @param {type} name Description
* @prop {type} name Description
* @return {type} Description
* @deprecated Reason if deprecated
* @see Related files
* @since 0.10.0
* /

