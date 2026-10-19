---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-18 22:55
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: academic
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="academic"] {
    /* ─── Custom rules for Academic ───────────────────────────── */
    /* ─── Custom rules for Academic ───────────────────────────── */
    .prose :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title, .reveal h1, .slides h1) {
        margin-inline: auto;
        text-align: center;
        text-wrap: balance;
      }

      /* Numbered sections — 1. / 1.1 — the journal convention */
      .prose {
        counter-reset: sec;
      }
      .prose :is(.markdown-reading-view h2, .HyperMD-header-2, .reveal h2, .slides h2) {
        counter-increment: sec;
        counter-reset: subsec;
      }
      .prose :is(.markdown-reading-view h2, .HyperMD-header-2, .reveal h2, .slides h2)::before {
        content: counter(sec) ".\2002";
        color: var(--color-accent);
        font-variant-numeric: lining-nums;
      }
      .prose :is(.markdown-reading-view h3, .HyperMD-header-3, .reveal h3, .slides h3) {
        counter-increment: subsec;
      }
      .prose :is(.markdown-reading-view h3, .HyperMD-header-3, .reveal h3, .slides h3)::before {
        content: counter(sec) "." counter(subsec) "\2002";
        color: var(--color-accent);
        font-variant-numeric: lining-nums;
      }

      p {
        text-align: left;
        text-align-last: left;
        hyphens: auto;
        -webkit-hyphens: auto;
        text-wrap: pretty;
      }

      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote, .reveal blockquote, .slides blockquote) {
        border-left: var(--stroke-width-lg) solid var(--color-accent);
        padding-block: var(--space-2);
        margin-block: var(--space-3) var(--space-2);
        margin-inline: var(--space);
        font-size: var(--scale);
        font-family: var(--font-serif);
      }

      /* The abstract: an opening :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote, .reveal blockquote, .slides blockquote) reads as the epigraph/abstract */
      .prose > :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote, .reveal blockquote, .slides blockquote):first-of-type {
        border: 0;
        font-style: italic;
        font-size: var(--scale-d2);
        padding-inline: var(--space-4);
      }

      /* Sidenote voice for asides */
      aside {
        font-size: var(--scale-d2);
        line-height: 1.4;
        border-left: 2px solid var(--color-accent);
        background: none;
      }

      /* Footnote references in accent, lining figures */
      sup {
        color: var(--color-accent);
        font-variant-numeric: lining-nums;
      }

      figcaption {
        font-size: var(--scale-d3);
        text-align: center;
        font-style: italic;
      }

      /* Tables read as data, captions above per journal style */
      :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table), .reveal table, .slides table) {
        font-variant-numeric: lining-nums tabular-nums;
      }
}
```
