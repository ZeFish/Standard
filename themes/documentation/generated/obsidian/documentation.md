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
theme: documentation
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="documentation"] {
    /* ─── Custom rules for Documentation ───────────────────────────── */
    /* ── Headings — IBM Plex Serif, blue page title, ruled sections ── */
      h1 {
        color: var(--color-accent);
      }

      h2 {
        padding-bottom: 0.3em;
        border-bottom: 1px solid
          color-mix(in srgb, var(--color-accent) 12%, transparent);
      }

      /* ── Links — accent with translucent underline ── */
      a:not(.btn) {
        color: var(--color-link, var(--color-accent));
        text-decoration: underline;
        text-decoration-color: color-mix(in srgb, currentColor 25%, transparent);
        text-underline-offset: 3px;

        &:hover {
          text-decoration-color: color-mix(in srgb, currentColor 55%, transparent);
        }
      }

      /* ── Inline code — blue-tinted chip, warm ink ── */
      :not(pre) > code {
        background: color-mix(in srgb, var(--color-accent) 10%, transparent);
        color: var(--color-code);
        border-radius: 4px;
        padding: 0.1em 0.35em;
        font-size: 0.875em;
      }

      /* ── Keybinding chips — flat, bordered, no raised effect ── */
      kbd {
        background: var(--color-surface);
        background-image: none;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        box-shadow: none;
        padding: 0.1em 0.4em;
        font-size: 0.8em;
      }

      /* ── Code blocks — elevated panel, accent-tinted border + soft shadow ── */
      pre {
        background: var(--color-surface-high);
        border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
        border-radius: 8px;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--color-accent) 7%, transparent);
      }

      /* ── Tables — tinted header, hairline borders, zebra rows ── */
      table {
        th {
          background: color-mix(in srgb, var(--color-accent) 10%, transparent);
        }

        th,
        td {
          border: 1px solid color-mix(in srgb, var(--color-accent) 15%, transparent);
        }

        tbody tr:nth-child(even) {
          background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
        }
      }

      /* ── Blockquotes — boxed cyan-tinted note, Zed style ── */
      blockquote {
        background: color-mix(in srgb, var(--color-cyan) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-cyan) 30%, transparent);
        border-radius: 6px;
        padding: var(--space-d2) var(--space);
      }

      /* ── Rules — the faint blue divider ── */
      hr {
        border: 0;
        border-top: 1px solid
          color-mix(in srgb, var(--color-accent) 10%, transparent);
        background: transparent;
      }

      .doc-card {
        margin-top: 0px !important;
      }
}
```
