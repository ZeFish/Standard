---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-01 13:40
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
    /* ─── Custom rules for Gallery ───────────────────────────── */
        .prose {
        display: block;
      }

      body {
        max-width: 100%;
      }

      --img-padding: var(--space);


        .stnd-toc {
            display:none !important;
        }

      .prose p:has(img) {
        grid-column: full;
        margin-inline: 0 !important;
        margin-block: var(--img-padding);
      }

      /* The placard: narrow, quiet, beside the work in spirit */
      .prose :not(p:has(img)) {
        max-width: var(--prose-width);
      }

      /* Captions recede like wall labels */
      .callout[data-callout="caption"] {
        display: block;
        text-align: center;
        font-size: var(--scale-d3);
        letter-spacing: 0.08em;
        text-transform: uppercase;

        margin-block-start: calc(var(--img-padding) * -1);
        margin-block-end: var(--img-padding);
        margin-inline:auto;
      }

      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) {
          margin: var(--space-6) auto;
          font-size: var(--scale-2);
          padding:var(--space-2);
      }

      /* Exhibition titles: present, never loud */
      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title),
      :is(.markdown-reading-view h2, .HyperMD-header-2),
      :is(.markdown-reading-view h3, .HyperMD-header-3) {
        text-align: left;
        font-weight: 500;
        text-wrap: balance;
      }
      :is(.markdown-reading-view h2, .HyperMD-header-2),
      :is(.markdown-reading-view h3, .HyperMD-header-3) {
        margin-block-start: var(--space-10);
      }
      :is(:is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3)) + p {
          margin-top:var(--space);
      }

      /* A horizontal rule is a walk to the next room */
      :is(hr, .HyperMD-hr) {
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
