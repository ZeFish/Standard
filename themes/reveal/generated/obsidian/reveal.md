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
theme: reveal
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="reveal"] {
    /* ─── Custom rules for Reveal ───────────────────────────── */
    :root[data-theme="reveal"],
      [data-theme="reveal"] {
        --color-photo-frame: var(--color-surface-high);
      }
    }

    // reveal theme — token VALUES live in tokens.yaml (single source of truth).
    // This file keeps only web-only structural CSS.


    :root[data-theme="reveal"],
    [data-theme="reveal"] {
    /* ─── Foreground & Background ────────────────────────────── */
    --color-light-background: #fdfdfc;
    --color-light-foreground: #212121;
    --color-light-border: rgba(33, 33, 33, 0.14);
    --color-dark-background: #1f1f1e;
    --color-dark-foreground: #ebebeb;
    --color-dark-border: rgba(235, 235, 235, 0.14);

    /* ─── Accent ────────────────────────────────────────────── */
    --color-light-accent: #d6202c;
    --color-dark-accent: #d6202c;
    --color-accent: #d6202c;

    /* ─── Typography ────────────────────────────────────────── */
    --font-text: "Inter", system-ui, sans-serif;
    --font-header: "DIN Condensed", Impact, "Arial Narrow", sans-serif;
    --font-monospace: "IBM Plex Mono", "SF Mono", monospace;
    --font-interface: "IBM Plex Mono";
    --font-serif: "Newsreader", Georgia, serif;
    --font-density: 1.2;

    /* ─── Custom rules for Reveal ───────────────────────────── */
    :is(:is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title), :is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3), :is(.markdown-reading-view h4, .HyperMD-header-4), :is(.markdown-reading-view h5, .HyperMD-header-5), :is(.markdown-reading-view h6, .HyperMD-header-6)) {
        font-family: var(--font-header) !important;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
    }

    :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        font-size: var(--size-2xl);
        letter-spacing: 0.12em;

        padding-block-end: var(--space-2);
    }

    :is(.markdown-reading-view h2, .HyperMD-header-2) {
        font-size: var(--size-xl);
        border-bottom: var(--border);
        padding-block-end: var(--space);
    }

    :is(.markdown-reading-view h3, .HyperMD-header-3) {
        font-size: var(--size-lg);
    }

    /* Leica safety styling */
    .callout {
        border-left: 3px solid var(--color-accent) !important;
        background: var(--color-surface-low) !important;
    }

    /* Technical tables */
    :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table)) th {
        font-family: var(--font-header);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: var(--size-xs);
    }

    :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table)) {
        font-variant-numeric: tabular-nums;
    }

    /* Code tags as camera engravings */
    :is(code, .cm-inline-code):not(:is(.markdown-reading-view pre, .markdown-rendered pre, .markdown-preview-view pre, .cm-embed-block:has(pre)) :is(code, .cm-inline-code)) {
        background: var(--color-surface) !important;
        color: var(--color-foreground) !important;
        border: var(--border) !important;
        padding-inline: 0.3em !important;
        border-radius: var(--radius) !important;
        font-size: var(--size-xs) !important;
    }
}
```
