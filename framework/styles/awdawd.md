To organize your "Standard" framework logically, we should move away from a massive `elements` file and adopt a modular architecture (similar to ITCSS or the 7-1 pattern). This makes the framework maintainable, easier to debug, and scalable.

Based on the code you provided, here is the logical breakdown into **Resets**, **Base**, **Typography**, **UI/Components**, and **Layout**.

### 1. The Folder Structure
In your `src/css/` directory, I recommend splitting `standard-04-elements.scss` into these specific files:

```text
/src/css/
├── standard-00-variables.scss   (Existing)
├── standard-01-reset.scss       (New: Normalization)
├── standard-02-base.scss        (New: HTML root & defaults)
├── standard-03-typography.scss  (New: Headings, text, code)
├── standard-04-lists.scss       (New: UL, OL, Menu structures)
├── standard-05-tables.scss      (New: Table styles)
├── standard-06-forms.scss       (New: Inputs, Labels, Fieldsets)
├── standard-07-media.scss       (New: Images, Video, Figure)
├── standard-08-components.scss  (New: Buttons, Tags, Nav)
└── standard-09-layout.scss      (New: Sections, Containers)
```

### 2. The Modules

Here is how your existing code maps to these new files.

#### `standard-01-reset.scss`
*Pure normalization. No aesthetic choices, just making the browser neutral.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* RESET                       */
/* =========================== */

*,
::after,
::before,
::backdrop,
::file-selector-button {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid;
}

ol,
ul,
menu {
  list-style: none;
}

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle;
}

img,
video {
  max-width: 100%;
  height: auto;
}

[hidden]:where(:not([hidden="until-found"])) {
  display: none !important;
}
```

#### `standard-02-base.scss`
*The foundation of your visual language defined on the root.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* BASE (HTML ROOT)            */
/* =========================== */

html {
  background: var(--color-background);
  color: var(--color-foreground);

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  font-family: var(--font-text), system-ui, sans-serif;
  font-size: var(--scale);
  font-weight: var(--font-weight);
  letter-spacing: var(--font-letter-spacing);

  line-height: var(--line-height);

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  font-optical-sizing: auto;
  font-feature-settings: var(--font-feature);
  font-variation-settings: var(--font-variation);

  text-wrap: pretty;
  hyphens: none;
  widows: 2;
  orphans: 2;
}

/* Selection highlight */
::selection {
  background: color-mix(in srgb, var(--color-yellow) 25%, transparent);
  color: var(--color-foreground);
}

/* Horizontal rules */
hr {
  height: var(--stroke-width, 1px);
  background: var(--color-border);
  border: none;
  block-size: var(--stroke-width, 1px);
}
```

#### `standard-03-typography.scss`
*Headings, links, inline text elements, and code blocks.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* TYPOGRAPHY                  */
/* =========================== */

/* Bold normalization */
b,
strong,
.bold {
  font-weight: var(--font-weight-bold, 600);
}

:is(h1, h2, h3, h4, h5, h6) :is(b, strong, .bold) {
  font-weight: inherit;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-header), system-ui, sans-serif;
  color: var(--color-header);
  text-wrap: balance;
  font-variant-ligatures: normal;
  font-feature-settings: var(--font-header-feature);
  font-variation-settings: var(--font-header-variation);
  font-style: var(--font-header-style, normal);
  letter-spacing: var(--font-header-letter-spacing);
  white-space: normal;
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
  max-width: 100%;
  box-sizing: border-box;
}

h1 {
  font-weight: var(--font-weight-h1);
  font-size: clamp(var(--scale-3), 10vw, var(--scale-4));
  line-height: var(--font-header-line-height, 1);
}

h2 {
  font-weight: var(--font-weight-h2);
  font-size: clamp(var(--scale-2), 7vw, var(--scale-3));
  line-height: var(--font-header-line-height, 1);
}

h3 {
  font-weight: var(--font-weight-h3);
  font-size: clamp(var(--scale), 7vw, var(--scale-3));
  line-height: var(--font-header-line-height, 1);
}

h4 {
  font-weight: var(--font-weight);
  font-size: var(--scale);
  line-height: var(--line-height);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

h5 { /* Overline usually */ }

h6 {
  display: inline;
  margin: 0;
  font-size: var(--scale);
  font-weight: 600;
}

h6 + p {
  display: inline;
}

.overline {
  font-variant-caps: small-caps;
  letter-spacing: 0.04em;
  font-size: var(--scale-d2);
  border-top: var(--rule-hairline) solid var(--color-border);
  padding-block-start: calc(var(--space) / 2);
  margin-block-end: var(--space);
}

/* Links */
a,
a:visited {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: var(--stroke-width);
  text-underline-offset: auto;
  text-decoration-color: var(--color-subtle);
  transition: color var(--transition), text-decoration-color var(--transition);
}

a:visited:hover,
a:hover,
a:focus {
  color: var(--color-accent);
  text-decoration-color: var(--color-accent);
}

a:focus-visible {
  outline: 1px solid color-mix(in srgb, var(--color-accent) 0%, transparent);
  border-radius: 2px;
}

a.external-link::after {
  content: "↗";
  text-decoration: none;
  font-size: var(--scale-d3);
  color: var(--color-subtle);
}

:is(h1, h2, h3, h4, h5, h6) a {
  text-decoration: none;
}

/* Code */
code,
pre,
tt,
.code,
.mono,
.monospace,
.font-mono {
  font-family: var(--font-monospace), Inconsolata, Menlo, monospace;
  font-feature-settings: var(--font-monospace-feature);
  font-variation-settings: var(--font-monospace-variation);
  font-weight: var(--font-monospace-weight, 400);
}

pre {
  position: relative;
  background: var(--color-surface);
  color: var(--color-foreground);
  border: var(--border);
  overflow-x: auto;
  box-shadow: inset var(--shadow);
  line-height: var(--line-height-compact);
  padding: var(--space-half);

  code {
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    opacity: 0.75;
    transition: opacity var(--transition);
  }

  &:hover code { opacity: 1; }

  .copy-button {
    position: absolute;
    top: var(--space-half);
    right: var(--space-half);
    opacity: 0;
    transition: opacity 0.5s;
    font-family: var(--font-interface);
  }

  &:hover .copy-button { opacity: 0.5; transition: opacity 0.5s; }
  .copy-button:hover { opacity: 1; }
}

/* Blockquotes */
blockquote {
  font-style: italic;
  color: var(--color-muted);
}

/* Utilities */
small { font-size: var(--scale-d2); }
sub, sup { font-size: var(--scale-d3); line-height: 0; }
sub { vertical-align: sub; }
sup { vertical-align: super; }
em { color: var(--color-italic); font-style: italic; }
mark {
  background: color-mix(in srgb, var(--color-yellow) 30%, transparent);
  color: color-mix(in srgb, var(--color-yellow) 30%, var(--color-foreground));
  padding: var(--trim);
  padding-top: 0.1em;
}

.font-interface {
  font-family: var(--font-interface), system-ui, sans-serif;
  font-variation-settings: var(--font-interface-variation);
  font-feature-settings: var(--font-interface-feature);
  font-size: 12px;
}
```

#### `standard-04-lists.scss`
*Complex logic for Lists (UL/OL).*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* LISTS                       */
/* =========================== */

ul,
ol {
  list-style: none;
  margin-block-start: 0;
  padding-inline: 1rlh;
  margin-block-end: var(--space);
}

/* Nested lists */
li > ul,
li > ol {
  padding-inline-start: 1rlh;
  margin-block-start: var(--space);
  margin-block-end: 0;
}

/* List items */
li {
  position: relative;
  margin: 0;
  padding-inline-start: 0;
  line-height: 1rlh;
  margin-block-end: var(--space-half);
}

li:last-child {
  margin-block-end: 0;
}

/* Spacing context */
p:has(+ :is(ul, ol)) {
  margin-block-end: var(--space);
}

/* Unordered list bullets */
ul > li::before {
  content: "•";
  position: absolute;
  top: 0;
  left: calc(1rlh * -1);
  width: var(--space);
  text-align: center;
  color: var(--color-subtle);
}

/* Ordered list numbers */
ol { counter-reset: ol-counter; }
ol > li { counter-increment: ol-counter; }
ol > li::before {
  content: counter(ol-counter) ".";
  position: absolute;
  top: var(--trim);
  left: calc((1rlh * -1) - var(--space-half));
  text-align: right;
  color: var(--color-subtle);
  font-variant-numeric: tabular-nums;
  width: 1rlh;
  font-size: var(--scale-d2);
}

/* Inline lists override */
ul:where(.display-flex, [style*="display: flex"], [style*="display:flex"]) li,
ol:where(.display-flex, [style*="display: flex"], [style*="display:flex"]) li {
  margin-block-end: 0;
}

/* Utilities */
.no-bullet {
  list-style: none;
  padding-inline-start: 0;
  li::before { display: none; }
}

.compact {
  --base-gap: var(--space-half);
  li { margin-block-end: var(--space-half); }
}

.tight {
  --base-gap: var(--trim);
  li { margin-block-end: var(--trim); }
}

.relaxed {
  --base-gap: var(--space-2);
  li { margin-block-end: var(--space-2); }
}
```

#### `standard-05-tables.scss`
*Data display tables.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* TABLES                      */
/* =========================== */

table {
  border-collapse: collapse;
  width: 100%;
}

tr {
  padding: 0;
  margin: 0;
}

th, td {
  text-align: left;
  border: var(--border);
  line-height: var(--line-height-compact);
  padding: var(--space-half);
  font-size: var(--scale-d2);
  min-height: var(--line-height);
}

th {
  font-weight: var(--font-weight-bold, 600);
  background: var(--color-surface);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

caption {
  font-weight: var(--font-weight-bold, bold);
  text-align: left;
  margin-block-end: calc(var(--space-d4) * var(--space));
}

/* Numeric alignment */
.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Zebra striping */
.striped tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
}
```

#### `standard-06-forms.scss`
*Interactive inputs and structure.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* FORMS                       */
/* =========================== */

/* Layout containers */
form:not(.grid *) {
  display: grid;
  gap: calc(var(--space) * var(--space-2));
}

.grid form {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * var(--space-2));
}

fieldset {
  padding-inline: var(--space);
  display: grid;
  gap: 0;
  border: var(--border);
  border-radius: var(--radius);
  padding: var(--trim) !important;
  background: color-mix(in srgb, var(--color-surface) 25%, var(--color-background));
}

fieldset div, fieldset p { margin: 0; padding: 0; }
fieldset + button { margin-block-start: var(--space); }
fieldset :last-child { margin-block-end: 0; }

legend {
  margin-block-end: var(--space);
  font-weight: var(--font-weight-bold, bold);
}

/* Inputs */
input,
textarea,
select {
  padding-inline: var(--space);
  margin-block-end: var(--space-2);
  width: 100%;
  font-family: var(--font-interface), system-ui, sans-serif;
  padding: var(--leading) var(--space-half) !important;
  border-radius: var(--radius);
  color: var(--color-foreground);
  background: var(--color-surface);
  border: var(--border);
  transition: background-color var(--transition), border-color var(--transition), outline-color var(--transition);
}

textarea {
  resize: vertical;
  min-height: var(--space-2);
}

input:focus, textarea:focus, select:focus {
  outline: 1px solid color-mix(in srgb, var(--color-accent) 0%, transparent);
  outline-offset: 0px;
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  background-color: color-mix(in srgb, var(--color-accent) 5%, var(--color-background));
}

/* Labels */
label {
  margin-inline: var(--space);
  margin-block-end: var(--space-2);
  display: inline-block !important;
  cursor: pointer;
  font-weight: var(--font-weight-bold, bold);
  padding-inline: 0 !important;
}

div:has(input + label) { margin-block-end: var(--space-2); }

/* Checkbox/Radio */
input[type="checkbox"],
input[type="radio"] {
  width: 1em;
  height: 1em;
  cursor: pointer;
  accent-color: var(--color-accent);
  padding: 0 !important;
  display: inline-block;
  margin-block-end: 0 !important; /* Contextual fix */
}

input[type="checkbox"] + label,
input[type="radio"] + label {
  margin-inline-start: var(--space-half);
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}
```

#### `standard-07-media.scss`
*Images, video, audio and figures.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* MEDIA                       */
/* =========================== */

img,
video,
audio,
iframe {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  border: var(--border);
  box-shadow: var(--shadow);
}

/* Reset padding for images specifically if needed */
img { padding: 0; }

figure {
  display: grid;
  gap: calc(var(--space-d4) * var(--space-2));
}

figcaption {
  font-size: var(--scale-d2);
  font-style: italic;
  text-align: center;
}
```

#### `standard-08-components.scss`
*UI specific elements: Buttons, Tags, Navigation.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* BUTTONS                     */
/* =========================== */

button,
a.btn {
  font-family: var(--font-interface), system-ui, sans-serif;
  font-size: var(--scale-d2);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-accent) 65%, var(--color-surface));
  color: color-mix(in srgb, var(--color-background) 85%, transparent);
  border: var(--border);
  border-color: var(--color-border);
  padding: var(--leading) var(--space-half);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: background-color var(--transition), border-color var(--transition), opacity var(--transition);
}

a.btn:visited,
a.btn {
  --stroke-width: 1px;
  display: inline-block;
  width: fit-content;
  user-select: none;
  margin: 0 auto;
  text-decoration: none;
  text-align: center;
}

button:hover,
a.btn:hover {
  background: color-mix(in srgb, var(--color-accent) 80%, var(--color-surface));
  color: var(--color-background);
}

button:active,
a.btn:active {
  background: color-mix(in srgb, var(--color-accent) 50%, var(--color-surface));
}

button:focus-visible,
a.btn:focus-visible {
  outline: 1px solid color-mix(in srgb, var(--color-accent) 0%, transparent);
  outline-offset: 2px;
  color: var(--color-background);
}

button:disabled,
a.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--color-background);
}

@media (prefers-color-scheme: dark) {
  button, a.btn, a.btn:visited {
    color: color-mix(in srgb, var(--color-foreground) 85%, transparent);
  }
}

.tag {
  color: var(--color-muted);
}
.tag:hover {
  color: var(--color-accent);
}

/* =========================== */
/* NAVIGATION                  */
/* =========================== */

nav li a { text-decoration: none; }
nav li.is-active a { text-decoration: underline; }

/* Vertical menu navigation */
nav.menu ul,
ul.menu {
  display: flex;
  flex-direction: column;
  padding-inline: 0;
  gap: 0;

  li {
    list-style: none;
    padding-inline-start: 0;
    margin-block-end: var(--space-half);
    &::before { display: none; }
  }
}

.tight nav.menu ul li { margin-block-end: var(--trim); }

/* Horizontal menu navigation */
nav.menu.horizontal ul,
ul.menu.horizontal {
  flex-direction: row;
  gap: var(--space);

  li {
    padding-inline-start: 0;
    margin-block: 0;
  }
}
```

#### `standard-09-layout.scss`
*Structural helpers.*

```scss
@use "standard-00-variables" as *;

/* =========================== */
/* LAYOUT                      */
/* =========================== */

section {
  margin-block-end: var(--space-6);
}

section.container-hero {
  padding-block: var(--space-2);
  border-top: var(--border);
  border-bottom: var(--border);
  box-shadow: var(--shadow);
  p {
    max-width: var(--line-width);
    margin-inline: auto !important;
  }
}
```
