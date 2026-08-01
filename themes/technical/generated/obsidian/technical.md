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
theme: technical
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="technical"] {
    /* ─── Custom rules for Technical ───────────────────────────── */
    /* ─── Custom rules for Technical — NASA/EPA spec-sheet ───────────────── */
    background: var(--color-surface);

      body {
        max-width: calc(var(--line-width) + var(--space-4));
        margin-inline: auto;
        background: var(--color-background);
        box-shadow: var(--shadow-lg);
        padding-top: 0 !important;
      }

      main {
        padding-block: var(--space-10);
        margin-top: 0 !important;
        border: 0;
        padding-inline: 0;

        h1 {
          text-align: left;
        }

        h2 {
          border-bottom: var(--border);
          padding-block-end: var(--space);
        }
      }

      /* Spec-sheet numbering: 1.0, 2.0 … 2.1, 2.2 */
      .prose {
        counter-reset: spec;
      }
      .prose h2 {
        counter-increment: spec;
        counter-reset: subspec;
      }
      .prose h2::before {
        content: counter(spec) ".0\2002";
        color: var(--color-accent);
      }
      .prose h3 {
        counter-increment: subspec;
      }
      .prose h3::before {
        content: counter(spec) "." counter(subspec) "\2002";
        color: var(--color-accent);
      }

      /* Inline code as machined parts */
      .prose code:not(pre code) {
        border: 1px solid var(--color-border);
        padding-inline: 0.3em;
      }

      /* Data tables: labelled like a parts list */
      table th {
        font-size: var(--size-xs);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      table {
        font-variant-numeric: tabular-nums;
      }

      /* Callouts carry the safety stripe */
      .callout {
        border-left: 3px solid var(--color-accent);
      }

      footer {
        margin-top: 0 !important;
        border-top: 0;
      }
    }

    /* ─── Obsidian-specific hooks — carried over from the retired "paper" theme
       (feeds the vault-sync/Obsidian export pipeline) ───────────────────── */
    :root[data-theme="technical"],
    [data-theme="technical"] {
      &.theme-dark {
        --font-text: "JetBrains Mono";
        --font-monospace: "Voyager Mono";
        --font-interface: "Futura Now";
      }

      &.theme-light .markdown-reading-view a {
        text-decoration: underline !important;
        --shadow-color: color-mix(in oklab, currentcolor 20%, transparent);
        --shadow-distance: 0px;
        --shadow-depth: 0.5px;
        text-shadow:
          var(--shadow-depth) 0px var(--shadow-depth) var(--shadow-color),
          calc(var(--shadow-depth) * -1) 0px var(--shadow-depth) var(--shadow-color),
          0px var(--shadow-depth) var(--shadow-depth) var(--shadow-color);
      }

      .markdown-preview-view,
      .markdown-source-view {
        color: color-mix(in oklab, var(--text-normal) 90%, transparent);
        text-shadow: 0 0 0.5px var(--text-normal);

        --shadow-color: color-mix(in oklab, currentcolor 10%, transparent);
        --shadow-distance: 0px;
        --shadow-depth: 0.5px;
        text-shadow:
          var(--shadow-depth) 0px var(--shadow-depth) var(--shadow-color),
          calc(var(--shadow-depth) * -1) 0px var(--shadow-depth) var(--shadow-color),
          0px var(--shadow-depth) var(--shadow-depth) var(--shadow-color);
      }

      .inline-title,
      .markdown-reading-view :is(h1, h2, h3, h4, h5, h6) {
        text-align: left;
        color: color-mix(in oklab, currentcolor 90%, var(--background-primary));

        --shadow-color: color-mix(in oklab, currentcolor 30%, var(--background-primary));
        --shadow-distance: 0px;
        --shadow-depth: 0.5px;
        text-shadow:
          var(--shadow-depth) 0px var(--shadow-depth) var(--shadow-color),
          calc(var(--shadow-depth) * -1) 0px var(--shadow-depth) var(--shadow-color),
          0px var(--shadow-depth) var(--shadow-depth) var(--shadow-color);
      }
}
```
