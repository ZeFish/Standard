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
theme: gallery
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="gallery"] {
    /* ─── Custom rules for Gallery ───────────────────────────── */
    display: block;
      }

      body {
        max-width: 100%;
      }

      /* The work gets the wall */
      .prose img {
        display: block;
        margin-inline: auto;
        margin-block: var(--space-8);
        max-width: min(100%, 72rem);
      }

      /* The placard: narrow, quiet, beside the work in spirit */
      .prose :is(p, ul, ol, blockquote) {
        max-width: 26rem;
        margin-inline: auto;
      }

      /* Captions recede like wall labels */
      figcaption,
      .prose img + em {
        display: block;
        text-align: center;
        font-size: var(--size-xs);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.55;
        margin-block-start: calc(var(--space-8) * -0.6);
        margin-block-end: var(--space-8);
      }

      /* Exhibition titles: present, never loud */
      h1,
      h2,
      h3 {
        text-align: center;
        font-weight: 500;
        text-wrap: balance;
      }
      h2,
      h3 {
        margin-block-start: var(--space-10);
      }

      /* A horizontal rule is a walk to the next room */
      hr {
        border: 0;
        background: none;
        height: 0;
        margin-block: var(--space-12);
      }

      footer {
        max-width: 100% !important;
      }
}
```
