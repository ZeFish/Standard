---
aliases: []
created: 2026-07-24 09:35
modified: 2026-07-24 09:35
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
    h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        text-transform: uppercase;
        font-weight: var(--font-header-weight);
        letter-spacing: var(--font-header-letter-spacing);
      }

      /* Barcode rule under the title — thick/thin like a tag scan line */
      h1 {
        padding-bottom: var(--space-half);
        border-bottom: 4px solid var(--color-foreground);
        box-shadow: 0 6px 0 -3px var(--color-foreground);
        margin-block-end: var(--space-4);
      }

      h2::before,
      h3::before {
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
      blockquote {
        border: 1px dashed var(--color-foreground);
        padding: var(--space) var(--space-2);
        position: relative;
      }
      blockquote::before {
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

      table,
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

      code {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }

      .markdown-reading-view img {
        filter: none !important;
        mix-blend-mode: normal !important;
      }
}
```
