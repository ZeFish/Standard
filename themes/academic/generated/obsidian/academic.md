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
theme: academic
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="academic"] {
    /* ─── Custom rules for Academic ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: #f7f6f4;
    --color-light-foreground: #292827;
    --color-accent: #0f5a7d;
    --font-text: "Source Serif 4", "Georgia", "Times New Roman", serif;
    --font-header: "Source Serif 4", "Georgia", "Times New Roman", serif;
    --font-monospace: "IBM Plex Mono", "Menlo", monospace;
    --sidenote-width: 18rem;
    --color-light-accent: #0f5a7d;
    --color-dark-background: #211f1d;
    --color-dark-foreground: #e6e2db;
    --color-dark-accent: #7fb4cc;
    --optical-ratio: 1.225;
    --font-header-weight: 600;
    --font-feature: "onum", "pnum";
    --line-height: 1.55;
    --line-width: 30rlh;

    /* ─── Custom rules for Academic ───────────────────────────── */
    h1 {
        margin-inline: auto;
        text-align: center;
        text-wrap: balance;
      }

      /* Numbered sections — 1. / 1.1 — the journal convention */
      .prose {
        counter-reset: sec;
      }
      .prose h2 {
        counter-increment: sec;
        counter-reset: subsec;
      }
      .prose h2::before {
        content: counter(sec) ".\2002";
        color: var(--color-accent);
        font-variant-numeric: lining-nums;
      }
      .prose h3 {
        counter-increment: subsec;
      }
      .prose h3::before {
        content: counter(sec) "." counter(subsec) "\2002";
        color: var(--color-accent);
        font-variant-numeric: lining-nums;
      }

      p {
        text-align: justify;
        text-align-last: left;
        hyphens: auto;
        -webkit-hyphens: auto;
        text-wrap: pretty;
      }

      /* The abstract: an opening blockquote reads as the epigraph/abstract */
      .prose > blockquote:first-of-type {
        border: 0;
        font-style: italic;
        font-size: var(--size-sm);
        padding-inline: var(--space-4);
      }

      /* Sidenote voice for asides */
      aside {
        font-size: var(--size-sm);
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
        font-size: var(--size-xs);
        text-align: center;
        font-style: italic;
      }

      /* Tables read as data, captions above per journal style */
      table {
        font-variant-numeric: lining-nums tabular-nums;
      }
}
```
