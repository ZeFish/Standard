---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-14 21:02
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: international
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="international"] {
    /* ─── Custom rules for International ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-red: #e03030;
    --color-dark-red: #db6057;
    --color-green: var(--color-red);
    --color-blue: #2b5aa0;
    --color-yellow: var(--color-red);
    --color-magenta: var(--color-red);
    --color-orange: var(--color-red);
    --color-accent: var(--color-red);
    --color-link: var(--color-red);
    --shadow: none;
    --radius: 0;
    --color-border: none;
    --color-muted: var(--color-foreground);
    --color-dark-foreground: #ccc;
    --optical-ratio: var(--ratio-golden);
    --mobile-font-ratio: var(--ratio-golden);
    --font-monospace: "Sohne Mono", monospace;
    --font-text: "Cargo Diatype";
    --font-header-weight: 900;
    --font-header-letter-spacing: -0.065em;
    --line-height: 1.2;
    --body-padding: var(--space);
    --color-surface: var(--color-background);
    --font-header: Inter;
    --font-interface: Inter;
    --line-width: var(--line-width-xs);

    /* ─── Custom rules for International ───────────────────────────── */
    :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        letter-spacing: -0.065em;
        font-weight: 900;
        line-height: 0.965;
        text-align: left;
        margin-block-end: var(--space-6);
      }
      :is(.markdown-reading-view h2, .HyperMD-header-2),
      :is(.markdown-reading-view h3, .HyperMD-header-3) {
        font-size: var(--size-2xl);
        margin-block-start: var(--space-8);
        margin-block-end: var(--space-4);
        font-weight: 800;
        letter-spacing: -0.065em;
      }
      :is(.markdown-reading-view h4, .HyperMD-header-4),
      :is(.markdown-reading-view h5, .HyperMD-header-5),
      :is(.markdown-reading-view h6, .HyperMD-header-6) {
        margin-block-end: var(--space);
      }

      .font-interface {
        font-size: 12px;
      }

      :is(hr, .HyperMD-hr) {
        background: var(--color-foreground);
      }

      .callout-content {
        background: none;
      }
      strong {
        color: var(--color-accent);
        font-weight: normal;
      }

      em {
        background-color: var(--color-accent);
        color: var(--color-background);
      }

      .callout {
        background: none;
        border: 0;
        font-size: var(--size-sm);
        padding-inline: var(--space);
      }
      :is(.callout-title, .callout-title-inner) {
        color: var(--color-foreground);
        border: none;
        margin-block-start: var(--leading);
        padding: 0;
      }
      .callout-content {
        padding: 0;
      }
      code,
      .token {
        color: var(--color-foreground) !important;
      }
      .prose {
        display: block;
      }

      img {
        border: 0;
      }
      .prose :is(p, pre, details, li, :is(hr, .HyperMD-hr), .scroll, .callout, aside) {
        max-width: 30rem;
        margin-inline: 0;
      }
      .prose :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) p {
        max-width: none !important;
        margin-block: var(--space);
        color: var(--color-foreground);
        border-left: var(--border);
        padding: var(--space) var(--space);
        font-size: var(--size-lg);
      }

      aside {
        background: none;
        border: 0;
      }

      body {
        background-color: var(--color-background);
        color: var(--color-foreground);
        max-width: 1400px;
      }

      header {
        display: block;
      }

      pre {
        padding: 0;
        padding-block: var(--leading);
        margin-block: var(--leading);
        border: 0;
        background-color: var(--color-background);
        code {
          opacity: 1;
        }
      }

      footer {
        max-width: 100% !important;
      }

      .comment {
        opacity: 0.2;
      }

      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) {
        border: 0;
        padding-block: var(--space);
        padding-inline: 0;
        font-size: var(--size-xl);
        font-family: var(--font-header);
        font-weight: var(--font-header-weight);
        letter-spacing: var(--font-header-letter-spacing);
        font-style: normal;
      }

      table {
        grid-column: content;
      }
      table,
      table th,
      table td,
      table td code {
        font-size: var(--size-xs);
        font-family: var(--font-monospace);
        word-break: keep-all;
      }
}
```
