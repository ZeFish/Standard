---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-27 17:54
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: book
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="book"] {
    /* ─── Custom rules for Book ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */



    /* ─── Custom rules for Book ───────────────────────────── */
    /* Light Mode Accent Colors */ /* like aged brick or red clay */ /* terra cotta */ /* mustard parchment */ /* sage green */ /* antique blue-grey */ /* faded denim */ /* dusk lavender */ /* soft mauve rose */

      /* Dark Mode Accent Colors */ /* warm ember glow */ /* baked clay at dusk */ /* candlelight gold */ /* moonlit sage */ /* cool teal mist */ /* twilight lake */ /* smoky lilac */ /* fading rose light */

      p {
        text-align: justify;
        text-align-last: left;
        /* Don't justify the last line */
        /* Enable hyphenation */
        hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        /* Improve word spacing */
        word-spacing: -0.05em;
        text-box-edge: cap ex;
      }
      /*
      p:not(:has(img)) + p {
        text-indent: var(--space);
      }

      p + p {
        margin-block-start: var(--space-d2);
      }

      :is(:is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3)) + p::first-letter {
        --drop-cap-size: 3.25;
        float: inline-start;
        line-height: 1;
        margin-block-start: 0.05lh;
        margin-inline-end: 0.05lh;
        font-size: calc((var(--font-size) * var(--drop-cap-size)) + var(--leading));
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
        font-family: "Fern";
        font-weight: 200;

        display: flex;
        align-self: flex-start;
      }
       */

      .prose {
        margin-left: 10vw;
        transition: margin-left var(--transition);
      }

      .prose {
        display: block;
      }

      .prose > * {
        max-width: var(--prose-width);
        margin-inline: 0;
      }

      .token {
        color: var(--color-subtle) !important;
      }

      a:hover {
        color: var(--color-foreground);
      }

      :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) {
        font-family: "Fern";
        font-weight: 450;
        letter-spacing: -0.01em;
        color: var(--color-muted);
        border-left: var(--stroke-width-lg) solid var(--color-accent);
        padding-block: var(--space-2);
        margin-block: var(--space-3) var(--space-2) var(--space-4) var(--space-2);
        margin-inline: var(--space);
        font-size: var(--scale);
      }

      :is(.markdown-reading-view pre, .markdown-rendered pre, .markdown-preview-view pre, .cm-embed-block:has(pre)) {
        padding: var(--trim) var(--leading);
        border: 0;
        border-left: 1px solid var(--color-subtle);
        background: transparent;
        color: var(--color-muted);

        .copy-button {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      :is(hr, .HyperMD-hr),
      :is(hr, .HyperMD-hr):not(:first-child) {
        font-size: var(--scale);
        line-height: var(--space);
        padding: 0;
        border: 0;
        background: transparent;
      }

      :is(hr, .HyperMD-hr)::after {
        content: "\2619 \2015 \2767";
        text-align: center;
        display: block;
        font-family: "Graveur";
        position: relative;
        top: var(--space);
        color: var(--color-border);
      }

      aside.note {
        display: inline;
        position: relative;
        top: calc(var(--space) * -1);
        left: calc(var(--space) + var(--prose-width));
        margin-top: calc(var(--space) * -1);
        margin-bottom: calc(var(--space) * -2);
        font-size: var(--scale-d2);
        color: var(--color-muted);
        line-height: var(--line-height-s);
        max-width: 33%;
        border-left: var(--border);
        padding-left: var(--leading);
        padding-block: var(--leading);
      }

      .prose > :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title):first-child {
        text-align: left;
        grid-column: feature;
        margin-block-end: var(--space-6);
        font-size: calc(var(--font-size) * pow(var(--optical-ratio), 3));
      }

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        text-align: left;
        letter-spacing: 0.15em;
        /* /*text-transform: uppercase;* */
        font-feature-settings: "liga", "onum", "kern", "smcp";
      }

      @media (max-width: 768px) {
        p {
          text-align: left;
        }
      }

      @media (min-width: 1200px) {
        .prose {
          margin-left: 15vw;
        }
      }

      @media (max-width: 1000px) {
        .prose {
          margin-left: 0;
          max-width: 100%;
          display: grid;
        }

        aside.note {
          display: block;
          position: relative;
          top: 0;
          left: 0;
          margin-block: var(--space);
          border: 0;
          background: transparent;
          border-left: 1px solid var(--color-subtle);
        }
      }
}
```
