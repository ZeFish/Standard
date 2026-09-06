---
title: "@stnd/themes"
aliases: []
created: 2026-07-04 23:28
modified: 2026-08-10T12:11:56.313Z
last_audited: 2026-07-14
audit_interval_days: 90
next_audit: 2026-10-12
audit_priority: 3
maturity: tree
mode: read
publish: true
status: active
tags:
  - package
  - stnd
theme: kernel
type: package
visibility: public
garden-url: https://francisfontaine.com/readme
garden-short: https://stnd.gd/sVwiaF
---

# @[stnd](../README)/themes

Temperaments and design variations for the Standard Ecosystem.

## ELI5

A theme is a personality you can put on a site: colors, fonts, mood. Each one lives in its own folder with one file that holds all its actual values (`tokens.yaml`) — edit that file, run one command, and every format that theme ships in (web CSS, the Obsidian vault note, Zed/VS Code editor themes, even Reveal’s Swift code) regenerates from it. You never hand-edit a generated file.

**Use an existing theme on your site:**

```javascript
// astro.config.mjs
standard({ moduleLoad: ["@stnd/themes/editorial"] });
```

**Make a new theme:** copy an existing theme folder, edit `tokens.yaml`, run `node packages/themes/tools/build-tokens.mjs <theme-name>`. See “Creating a Theme” below for the full 5-file recipe.

## Overview

`@stnd/themes` provides a collection of complete design systems, each with its own typographic context, color palette, and emotional register. These themes are built as Standard modules and can be swapped instantly to change the entire look and feel of an application.

## Features

- **Scoped Styling**: Themes use CSS custom properties scoped to a specific element or the entire page.
- **Typographic Context**: Each theme defines its own font pairings, line heights, and spacing rhythms.
- **Color Palettes**: Custom OKLCH color offsets for each temperament.
- **Module-Based**: Themes are easily loaded and managed via the `@stnd/core` integration.

## Available Themes

::widget ThemeBar

- **Academic**: Scholarly and traditional.
- **Editorial**: Clean lines and high contrast.
- **Humanist**: Warm type and organic feel.
- **Technical**: Code clarity and precision.
- **Gallery**: Minimalist with generous white space.
- **E-Ink**: Optimized for e-readers and high-contrast displays.
- **Federal**: 1970s standards manual identity (Helvetica, federal red seed).
- **And many more**: Blueprint, Forest, Frank, Occult, etc.

## Usage

In your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import standard from "@stnd/core";

export default defineConfig({
  integrations: [
    standard({
      moduleLoad: [
        "@stnd/themes/editorial"
      ]
    })
  ]
});
```

To apply a theme to a specific element:

```html
<div data-theme="garden">
  <!-- Content will use the Garden theme -->
</div>
```

## Creating a Theme

To add a new theme to the Standard Ecosystem, create a new directory under `packages/themes/<theme-name>` and follow these steps:

### 1. Structure of a Theme Folder

Every real, working theme has these **3 files** (verified against every shipped theme — none currently ship `register.js`/`actions.js` despite older drafts of this doc implying they're required; treat those two as an unbuilt extension point, not a checklist item):

```text
packages/themes/<theme-name>/
├── tokens.yaml              # Canonical design token values (Single Source of Truth)
├── index.module.js          # Module registration and dependencies
└── <theme-name>.scss        # Generated token block (spliced in by the build script)
                              #   + web-only layout overrides below it
```

### 2. File Specifications

#### `tokens.yaml`
Specifies metadata and token values. Web-only structural CSS must stay in the `.scss` file.

```yaml
meta:
  id: reveal
  label: Reveal
  selector: |-
    :root[data-theme="reveal"],
    [data-theme="reveal"]
  fonts:
    - "@stnd/fonts/din-condensed"
    - "@stnd/fonts/inter"
tokens:
  color-light-background: "#fdfdfc"
  color-light-foreground: "#212121"
  color-accent: "#d6202c"
  font-text: '"Inter", sans-serif'
  font-header: '"DIN Condensed", sans-serif'
  line-height: "1.2"
```

After creating/updating this file, run the real build script (from `packages/themes/`, not `tools/build-tokens.mjs` — that path doesn't exist):

```bash
node _scripts/build.js <theme-name>
```

This does two things: it splices a generated `--token: value;` block straight into `<theme-name>.scss` (between `/* TOKENS.YAML ADAPTER BEGIN/END */` markers — there is no separate `_tokens.generated.scss` file, no `@use` needed), and it writes cross-tool exports to `<theme-name>/generated/` (Obsidian note, VS Code theme, Zed theme, Reveal Swift, Home Assistant YAML).

#### `<theme-name>.scss`
Start the file with just the empty marker pair — the build script fills it in. Everything *after* the `END` marker is yours: layout overrides, theme-specific aesthetics, component-level rules scoped to the theme's own selector.

```scss
/* TOKENS.YAML ADAPTER BEGIN */
/* TOKENS.YAML ADAPTER END */

[data-theme="reveal"] {
  background: var(--color-background);
  h1 {
    font-family: var(--font-header);
    text-transform: uppercase;
  }
}
```

#### `index.module.js`
The module declaration. Defines styles and registers the font packages as dependencies so the loader loads them automatically.

```javascript
export default {
  id: "theme-<theme-name>",
  name: "Stnd :: Theme :: <Label>",
  description: "Registers the <Label> theme.",
  meta: { type: "theme", themeId: "<theme-name>", label: "<Label>" },
  styles: ["./<theme-name>.scss"],
  dependencies: [
    "@stnd/fonts/<font-package-name>"
  ],
};
```

#### `register.js` *(optional — not yet used by any shipped theme)*
Exposes metadata used by the editor/UI theme dropdowns.

```javascript
export default () => ({
  id: "<theme-name>",
  name: "<Label>",
  description: "<Short description of the theme's mood>",
});
```

#### `actions.js` *(optional — not yet used by any shipped theme)*
Registers a command palette action to apply and persist the theme (e.g. trigger `::theme-<theme-name>`).

```javascript
import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassTheme<Label>" });

export default [{
  trigger: "::theme-<theme-name>",
  meta: {
    title: "<Label> Theme",
    desc: "<Description>",
    icon: "palette",
  },
  action: async () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "<theme-name>");
    }
    await saveVisitorPreferences({ theme: "<theme-name>" });
    window.toast("Theme applied", "success");
  },
}];
```

### 3. Registering the Theme in the Ecosystem

To make the theme available in the loader and workspace, you **must** add it to the `dependencies` list of the central themes module in [packages/modules/themes/index.module.js](../modules/themes/index.module.js):

```javascript
  dependencies: [
    ...
    "@stnd/themes/<theme-name>",
  ]
```

## Source of truth & the sync tools (Resolved)

**`<theme>/tokens.yaml` is the ONE source of token values.** `tools/build-tokens.mjs` regenerates each `_tokens.generated.scss` from it. Both consumers are downstream: the **web** uses `@stnd/themes` directly, and the **Obsidian plugin** bundles `themes.generated.js` (built from these same `_tokens.generated.scss` by `apps/stnd-obsidian/build.js`). Edit `tokens.yaml`, never a `.generated.scss`.

### 🔄 Bidirectional Synchronization Tools

The historical design drift between Francis’s hand-maintained vault notes at `Kernel/Themes/*` and the package’s canonical codebase has been resolved. Two powerful automation scripts have been added under `packages/themes/tools/` to enable seamless bidirectional syncing:

#### 1. Export package themes to your vault
To populate your vault’s `Kernel/Themes/` folder with themes from the package (without overwriting any of your existing custom vault themes):

```bash
node packages/themes/tools/convert-themes-to-vault.js
```

This parses each package’s `tokens.yaml` and `.scss` overrides, generates clean Obsidian-friendly theme notes with frontmatter metadata, embeds, and nesting, and writes them into your vault.

#### 2. Import vault modifications back to the package
If you edited design tokens or custom styling rules directly inside your Obsidian vault and want to merge those changes back into the package (centralizing them in git):

```bash
node packages/themes/tools/sync-vault-to-packages.js
```

This tool:
- Scans `Kernel/Themes/*.md` files in your vault that match a package theme name.
- Parses the CSS code block, separating the CSS variables (design tokens) from custom rule selectors.
- Merges the updated design tokens back into the package’s `tokens.yaml`.
- Un-indents and updates the package’s `<theme>.scss` with the custom layout rules.

### The `scripts/` pipeline — multi-target theme codegen

Separate from `tools/build-tokens.mjs` above (web/SCSS/Obsidian only): `scripts/build.js` turns every theme’s `tokens.yaml` into **non-web** target formats too, via a small adapter-per-target system. Same rule as everywhere else in this package — **`tokens.yaml` is the one source of truth; every file under a theme’s `generated/` folder is overwritten on the next run, never hand-edited.**

```bash
node packages/themes/_scripts/build.js            # every theme, every adapter
node packages/themes/_scripts/build.js reveal      # just one theme (all its adapters)
```

For each theme, this writes into `<theme>/generated/<adapter-name>/`:

| Adapter | Output | Consumer |
|---|---|---|
| `reveal` | `Theme.swift` (`Palette`/`Typo`/`Rhythm`) | `apps/reveal` — see below |
| `zed` | a Zed editor theme JSON | Zed’s theme picker |
| `vscode` | a VS Code theme extension | VS Code’s theme picker |
| `obsidian` | an Obsidian-flavoured theme note | the vault |
| `homeassistant` | a Home Assistant theme YAML | Home Assistant |

Adding a target = adding one file to `scripts/adapters/<name>.js` exporting a `build(config, options)` function — `build.js` discovers and runs every adapter against every theme automatically, no registration step.

**Reveal actually consumes its generated output** — `apps/reveal/Sources/Reveal/ Theme.swift` is a **symlink** to `packages/themes/reveal/generated/reveal/Theme.swift`, so `swift build` compiles straight through it. Tune Reveal’s palette by editing `packages/themes/reveal/tokens.yaml` and re-running the command above; never edit the Swift file directly (a hand edit is a symlink target, so it’d edit the generated file in place and get overwritten by the next regenerate anyway). `color-accent` (and any other colour) can be a single scheme-agnostic value — Reveal’s Leica-red accent is deliberately the same in both light and dark — or split as `color-light-*`/`color-dark-*`; the build falls back to the unprefixed key when the scheme-specific one is missing. Reveal-only tokens (`color-{light,dark}-elevated`, `color-{light,dark}-photoFrame` — a photo-culling app needs a couple of extras a note theme doesn’t) are read straight from `tokens.yaml` when present, and only approximated (lighten/darken off the background) for themes that don’t define them.

After running either tool, simply rebuild the Obsidian plugin to package the latest themes:

```bash
# In apps/stnd-obsidian
pnpm run build
```

## Notes / Observations

- `federal` (stnd.build's own 1970s-standards-manual identity, added
  2026-07-07) is a clean, current example of the real 3-file pattern above —   a good one to copy when starting a new theme. It also proves the base   engine's `--color-red/yellow/green` derivation: the theme sets only   `foreground`/`background`/`accent`/`border`/`surface`/`subtle`/`muted`, and   `@stnd/styles` derives the semantic states from the foreground's hue —   no need to hand-write `oklch(from ...)` formulas per theme.

## Todo

- [ ] **Themes product decision (to discuss)** — Francis creates a lot of them (10+), and loves doing so. Do we let users create their own (feature)? Do we ship all themes but only document ~6 of them? How do we manage curation vs. infinity? [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
- [ ] **Terminology** — Keep *“theme”* (like the frontmatter `theme:`) rather than *“temperament”*. Align the documentation once confirmed. [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
- [ ] **Theme creation/editing UX** (the next fun project) — a visual tool to [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
      author/tweak `tokens.yaml` live instead of hand-editing YAML. Ties directly       into `@stnd/lab`‘s live token inspector — that’s probably the starting point.
