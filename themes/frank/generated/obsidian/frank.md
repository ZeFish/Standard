---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-25 00:54
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: frank
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="frank"] {
    /* ─── Custom rules for Frank ───────────────────────────── */
    /* Dark */
    --color-dark-foreground: oklch(0.7721 0.0228 96.47);
    --color-dark-background: oklch(0.2308 0.0023 67.73);
    --color-dark-accent: var(--color-yellow);

    --color-dark-red: oklch(48.37% 0.1896 27.22);
    --color-dark-orange: oklch(68.30% 0.1638 52.74);
    --color-dark-yellow: oklch(77.36% 0.1572 70.09);
    --color-dark-green: oklch(48.45% 0.0792 169.07);
    --color-dark-cyan: oklch(55.79% 0.0866 200.53);
    --color-dark-blue: oklch(51.36% 0.0974 225.11);
    --color-dark-purple: oklch(52.98% 0.1621 332.34);
    --color-dark-pink: oklch(54.70% 0.1628 360);

    --color-dark-accent: var(--color-yellow);
    --color-dark-bold: var(--color-orange);
    --color-dark-italic: var(--color-blue);
    }

    [data-theme="frank"] {
      .callout[data-callout="caption"] {
        margin: -1rlh 33% 0 0 !important;
        padding: 0;
        border-radius: 0;
        text-wrap: balance;

        .callout-content {
          text-align: left;
          padding: 0;
          color: var(--color-foreground);
          border-radius: 0;
        }
      }

      .vertical-rhythm :is(hr, .HyperMD-hr) {
        display: none !important;
      }

      :is(:is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote), :is(.markdown-reading-view pre, .markdown-rendered pre, .markdown-preview-view pre, .cm-embed-block:has(pre)), figure, .callout, p:has(img)) {
        margin-inline: 0 !important;
        box-shadow: 0 !important;
      }

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        text-align: left;
        color: var(--color-foreground);
      }
}
```
