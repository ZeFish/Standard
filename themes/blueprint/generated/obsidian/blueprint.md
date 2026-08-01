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
theme: blueprint
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="blueprint"] {
    /* ─── Custom rules for Blueprint ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: #1a4d7a;
    --color-light-foreground: #f0f4f8;
    --color-dark-foreground: var(--color-light-foreground);
    --color-dark-background: var(--color-light-background);
    --color-light-red: rgba(255, 28, 0, 0.493);
    --color-light-orange: rgba(188, 82, 21, 0.574);
    --color-light-yellow: rgba(173, 131, 1, 0.794);
    --color-light-green: rgba(102, 128, 11, 0.576);
    --color-light-cyan: rgba(36, 131, 123, 0.641);
    --color-light-blue: rgba(32, 94, 166, 0.614);
    --color-light-purple: #5e409d;
    --color-light-pink: #a02f6f;
    --color-accent: var(--color-orange);
    --color-code: var(--color-foreground);
    --color-bold: var(--color-red);
    --color-italic: var(--color-green);
    --color-dark-accent: var(--color-magenta);
    --color-dark-bold: var(--color-magenta);
    --font-monospace: "MonoLisa";
    --font-monospace-feature: "liga", "zero", "calt", "ss02", "ss03", "ss07", "ss10", "ss15";
    --optical-ratio: 1.425;
    --blueprint-opacity: 20%;

    /* ─── Custom rules for Blueprint ───────────────────────────── */
    /* Accent system */
      /* warning, highlight */
      /* attention blocks */
      /* vintage punchcard yellow */
      /* success, approval */
      /* teal-y terminal feel */
      /* link, info */
      /* utility, label tags */
      /* softer technical touch */

      /* Accent system
        --color-dark-red: #d14d41;
        --color-dark-orange: #da702c;
        --color-dark-yellow: #ad8301;
        --color-dark-green: #879a39;
        --color-dark-cyan: #24837b;
        --color-dark-blue: #4385be;
        --color-dark-purple: #8b7ec8;
        --color-dark-pink: #ce5d97;
        */

      /* Code and UI extras */
      /*--color-header: color-mix(in srgb, var(--color-foreground) 75%, var(--color-background));*/

      .dark {
        --color-accent: var(--color-magenta);
        --color-bold: var(--color-magenta);
      }

      :is(h1, h2, h3, h4, h5, h6) {
        position: relative;
        border: none;
      }

      :is(h1, h2, h3, h4, h5, h6)::before {
        content: "";
        opacity: var(--blueprint-opacity);
        font-size: var(--size-sm);
        color: var(--color-foreground);
        font-style: italic;
        font-weight: 400;
        font-family: var(--font-monospace);
        position: absolute;
        top: 0;
        left: calc(var(--space) * -1);
        transform: translateX(-100%);
      }

      h1::before {
        content: "h1";
      }

      h2::before {
        content: "h2";
      }

      h3::before {
        content: "h3";
      }

      h4::before {
        content: "h4";
      }

      h5::before {
        content: "h5";
      }

      h6::before {
        content: "h6";
      }

      :is(pre) {
        position: relative;
        border: none;
      }

      :is(pre)::before {
        content: "pre";
        opacity: var(--blueprint-opacity);
        font-size: var(--size-sm);
        color: var(--color-foreground);
        font-style: italic;
        font-weight: 400;
        font-family: var(--font-monospace);
        position: absolute;
        top: calc(var(--space) * -1);
        left: calc(var(--space) * -3);
        transform: translateX(-100%);
      }

      :is(p) {
        position: relative;
        border: none;
      }

      :is(p)::before {
        content: "p";
        opacity: var(--blueprint-opacity);
        font-size: var(--size-sm);
        color: var(--color-foreground);
        font-style: italic;
        font-weight: 400;
        font-family: var(--font-monospace);
        position: absolute;
        top: calc(var(--space) * -1);
        left: calc(var(--space) * -3);
        transform: translateX(-100%);
      }

      :is(p:has(img))::before {
        content: "Medias" !important;
      }

      .grid-debug-overlay {
        position: absolute !important;
        inset: 0;
        display: grid;
        grid-template-columns: inherit;
        pointer-events: none;
        z-index: 9999;
        grid-column: hero;

        span:nth-child(1) {
          grid-column: hero-start / feature-start;
        }

        span:nth-child(2) {
          grid-column: feature-start / accent-start;
          border-inline-start: 1px dashed
            color-mix(in srgb, var(--color-foreground) 15%, transparent);
        }

        span:nth-child(3) {
          grid-column: accent-start / content-start;
          border-inline-start: 1px dashed
            color-mix(in srgb, var(--color-foreground) 15%, transparent);
        }

        span:nth-child(4) {
          grid-column: content;
          outline: 1px dashed
            color-mix(in srgb, var(--color-foreground) 15%, transparent);
        }

        span:nth-child(5) {
          grid-column: content-end / accent-end;
          border-inline-end: 1px dashed
            color-mix(in srgb, var(--color-foreground) 15%, transparent);
        }

        span:nth-child(6) {
          grid-column: accent-end / feature-end;
          border-inline-end: 1px dashed
            color-mix(in srgb, var(--color-foreground) 15%, transparent);
        }

        span:nth-child(7) {
          grid-column: feature-end / hero-end;
        }
      }

      body::before {
        --color-grid: var(--color-foreground);
        --percent-grid: 5%;
        --grid-unit: var(--space);
        --dot-size: 1px;
        content: "";
        position: fixed;
        inset: 0;
        mix-blend-mode: normal;
        opacity: 1;
        background-image: radial-gradient(
          circle,
          color-mix(in srgb, var(--color-grid) var(--percent-grid), transparent)
            var(--dot-size),
          transparent var(--dot-size)
        );
        background-size: var(--grid-unit) var(--grid-unit);
        background-position: 0 0;
        pointer-events: none;
        z-index: 10000;
      }
}
```
