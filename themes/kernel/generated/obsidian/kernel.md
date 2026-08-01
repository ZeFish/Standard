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
theme: kernel
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="kernel"] {
    /* ─── Custom rules for Kernel ───────────────────────────── */
    /* Accent system */
    --color-light-red: #df453a; /* warning, highlight */
    --color-light-orange: #e08e1f; /* attention blocks */
    --color-light-yellow: #d69a00; /* vintage punchcard yellow */
    --color-light-green: #4ca06b; /* success, approval */
    --color-light-cyan: #2aa198; /* teal-y terminal feel */
    --color-light-blue: #2882c3; /* link, info */
    --color-light-purple: #d16d92; /* utility, label tags */
    --color-light-pink: #ea76cb; /* softer */

    --color-dark-background: #231e1a; /* dark terminal feel */
    --color-dark-foreground: #e6cfb3;

    /* Accent system */
    --color-dark-red: #d0483e;
    --color-dark-orange: #da702c;
    --color-dark-yellow: #d69a00;
    --color-dark-green: #27a06c;
    --color-dark-cyan: #81c8be;
    --color-dark-blue: #8caaee;
    --color-dark-purple: #8b7ec8;
    --color-dark-pink: #f4b8e4;

    /* Code and UI extras */
    --color-light-accent: var(--color-blue);
    --color-dark-accent: var(--color-purple);

    --color-bold-default: var(--color-red);
    --color-italic-default: var(--color-blue);

    --font-density: 1.5;
    --font-ratio: 1.5;
    --font-line-width: 55ch;

    --font-text: "MonoLisa";
    --font-weight: 400;
    --bold-weight: 500;
    --font-feature: "";
    --font-variation: "";

    --font-header: "Fraunces";
    --font-header-weight: 400;
      --font-header-feature: "";
      --font-header-variation: "SOFT" 100, "WONK" 1;
      --font-header-letter-spacing: -0.065em;

    --font-monospace: "MonoLisa";
    --font-mono-feature: "";
    --font-mono-variation: "";

    --font-interface: "MonoLisa";

    --code-function: var(--color-pink);


    }
    body.theme-dark {
    		--color-accent: var(--color-purple);
    		--color-bold: var(--color-pink);
    }
    .inline-title {
    		text-align: left;
    }


    .token.comment {
    		color: color-mix(
    				in oklab,
    				var(--color-base-100) 40%,
    				var(--color-base-00)
    		);
    		font-style: italic;
}
```
