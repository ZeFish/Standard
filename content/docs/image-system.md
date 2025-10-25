---
title: Image System
layout: base
permalink: /docs/image-system/index.html
eleventyNavigation:
  key: Image System
  parent: Components
  title: Image System
category: Components
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-08-img.scss
since: 0.1.0
---

# Image System

Responsive image handling with interactive zoom functionality. Images automatically scale to 100% width, support smooth zoom on click, and include keyboard navigation for dismissing zoomed images. Works seamlessly with rhythm and reading layouts.

```scss
// Basic responsive image
<img src="image.jpg" alt="Description">

// Image with border and effects
<img src="image.jpg" class="fx" alt="Description">

// Click to zoom, click again to close
// ESC key also closes zoomed image
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `img` | `element` | Default responsive image |
| `{class} .fx Images with border and effects` | `mixed` |  |
| `{class} .nofx Images without border/effects` | `mixed` |  |
| `img` | `state` | :hover Prepare for zoom interaction |
| `img` | `state` | :active Active zoom state |
| `{class} .zoomed Zoomed image state` | `mixed` |  |

<details>
<summary><span class="button">Source Code</span></summary>

```scss
img {
    max-inline-size: 100%;
}

:where(html:not(.no-rhythm), .rhythm) {
    /* Basic image styling */
    * + img,
    img,
    img:first-child,
    img:last-child {
        margin: 0;
        max-inline-size: 100%;
        block-size: auto;
    }

    img {
        max-width: 100%;
        cursor: zoom-in;

        transition:
            mix-blend-mode 0.2s,
            opacity 0.2s,
            filter 0.2s;
    }
    img.fx {
        border-radius: var(--border-radius);
        border: var(--border);
    }
    img.nofx {
        border-radius: unset;
        border: unset;
        box-shadow: unset;
    }

    img:hover,
    img.zoomed {
        mix-blend-mode: normal;
        filter: none;
    }

    img:active,
    img.zoomed {
        cursor: zoom-out;
        display: block;
        z-index: var(--z-image-zoom);
        position: fixed;
        max-height: 88vh;
        max-width: 88vw;
        max-height: calc(100vh - (var(--space) * 2));
        max-width: calc(100vw - (var(--space) * 2));
        object-fit: contain;
        margin: 0 auto;
        text-align: center;
        padding: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
    }
}

/* Zoom overlay backgrounds */
html:not(.no-rhythm) :has(img:active)::before,
html:not(.no-rhythm) :has(img.zoomed)::before,
.prose :has(img:active)::before,
.prose :has(img.zoomed)::before,
.rhythm :has(img:active)::before,
.rhythm :has(img.zoomed)::before {
    content: "";
    position: fixed;
    inset: 0;
    background: var(--color-background);
    z-index: calc(var(--z-image-zoom) - 1);

    z-index: unset;
}
```

</details>

