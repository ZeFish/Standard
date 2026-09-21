---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-20 22:04
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: mono
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="mono"] {
    /* ─── Custom rules for Mono ───────────────────────────── */
    :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title),
      :is(.markdown-reading-view h2, .HyperMD-header-2),
      :is(.markdown-reading-view h3, .HyperMD-header-3),
      :is(.markdown-reading-view h4, .HyperMD-header-4),
      :is(.markdown-reading-view h5, .HyperMD-header-5),
      :is(.markdown-reading-view h6, .HyperMD-header-6) {
        text-transform: uppercase;
        font-weight: var(--font-header-weight);
        letter-spacing: var(--font-header-letter-spacing);
      }

      /* Barcode rule under the title — thick/thin like a tag scan line */
      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        padding-bottom: var(--space-half);
        border-bottom: 4px solid var(--color-foreground);
        box-shadow: 0 6px 0 -3px var(--color-foreground);
        margin-block-end: var(--space-4);
      }

      :is(.markdown-reading-view h2, .HyperMD-header-2)::before,
      :is(.markdown-reading-view h3, .HyperMD-header-3)::before {
        content: "// ";
        color: var(--color-accent);
      }

      strong {
        color: var(--color-accent);
        font-weight: var(--bold-weight);
      }

      /* Off-White-style quotation marks around emphasis */
      em {
        font-style: normal;
        color: var(--color-foreground);
      }
      em::before {
        content: "\201C";
      }
      em::after {
        content: "\201D";
      }

      a {
        color: var(--color-foreground);
        text-decoration-color: var(--color-accent);
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }

      /* Care-label block quote */
      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) {
        border: 1px dashed var(--color-foreground);
        padding: var(--space) var(--space-2);
        position: relative;
      }
      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote)::before {
        content: "SIZE / NOTE";
        position: absolute;
        top: -0.6em;
        left: var(--space);
        background: var(--color-background);
        padding-inline: var(--space-d4);
        font-size: var(--size-3xs);
        letter-spacing: 0.15em;
        color: var(--color-accent);
      }

      :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table)),
      th,
      td {
        font-family: var(--font-monospace);
        border-color: var(--color-foreground);
      }
      th {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-accent);
      }

      :is(code, .cm-inline-code) {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }

      img {
        filter: none !important;
        mix-blend-mode: normal !important;
      }
}
```
