---
title: "@stnd/core"
aliases: []
created: 2026-06-20 13:56
modified: 2026-07-15 10:20
last_audited: 2026-07-14
audit_interval_days: 90
next_audit: 2026-10-12
audit_priority: 3
maturity: tree
mode: read
publish: false
status: active
tags:
  - package
  - stnd
theme: kernel
type: package
visibility: private
---

# @[stnd](../README)/core

The **Standard** core integration is the technological foundation of the **Utopie** ecosystem. It provides a coherent framework for design, content rendering, module management, and server utilities.

This document serves as a technical reference for developers and AI agents working on the project.

## ELI5

This is the one line you put in every Standard site’s `astro.config.mjs`. It does the heavy lifting so nothing else has to: finds your feature folders (`modules/`), wires up styles/fonts/SEO automatically (the *“Gold Standard”*), and makes every other `@stnd/*` package available without extra setup. Think of it as the light socket every appliance plugs into.

**Install:** `pnpm add @stnd/core` (or use `stnd new` — see `packages/cli`).

**Use it:**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import standard from "@stnd/core";

export default defineConfig({
  integrations: [standard({ title: "My Site" })],
});
```

That’s the whole setup. Styling, fonts, SEO basics, and the command palette are already on. Add your own feature folders under `modules/` and they’re picked up automatically.

---

## Architecture

The concept relies on a strict separation between the **Core** (static, tested) and **Modules/Spores** (dynamic, project-specific).

- **Standard Integration (`standard.js`)**: The orchestrator. It manages the auto-discovery of modules, injects routes and styles, and configures virtual modules.
- **Core Helpers (`core/`)**: Libraries of pure functions for authentication, formatting, logging, and data manipulation.
- **Press Engine (`@stnd/press`)**: High-end Markdown rendering engine (based on `markdown-it`) with support for runes, Obsidian callouts, and fine typography.
- **Design System (`@stnd/styles`)**: Mathematical design tokens, typographic scales, and the OKLCH color system.

---

## 🔌 Module System (Spores)

Modules are auto-discovered and orchestrate both logic and interface via a **Unified Hooks** system.

### Anatomy of a module (`index.module.js`):

```javascript
export default {
  id: "module-name",

  // Hooks: The brain of the module
  // - .js, .ts -> LOGIC (e.g., astro hooks, app events)
  // - .astro, .svelte, .md -> INTERFACE (e.g., header, footer)
  hooks: {
    "astro:config:setup": "./hooks/setup.js", // Astro logic
    "header:top": "./components/Banner.astro", // UI injection point
    "app:init": ["./init.ts", "./Widget.astro"], // Mixed is possible
  },

  routes: [{ path: "/my-route", entrypoint: "./routes/index.astro" }],
  styles: ["./styles.scss"],
  scripts: ["./client-side.js"],
  middleware: "./middleware.js",
};
```

### Virtual Modules & Rendering:

- `virtual:stnd/hooks`: To execute **logic hooks** — `.js`/`.ts` entries not prefixed `launcher:` and not suffixed `:action` (those two patterns always classify as UI/action zone contributions instead — see `virtual:stnd/components` below — mismatched classification of the same hook name across registrations is a build-time fatal error). Two calling conventions over the same `hooks:` registrations: `runHook(name, ...args)` fans a call out to every registered handler and collects their results into an array (e.g. `astro:build:done`, `stnd:rss:register`); `runPipeline(name, initialValue, ...args)` threads one value through every registered handler in sequence, each required to explicitly return the (possibly transformed) value — for "let each interested module inspect and optionally override the same thing" (e.g. `apps/stnd.gd`'s `note:render`, where password-gate overrides how a locked note renders without the route naming it). Both isolate handler failures — a throwing handler is logged and skipped, not left to abort the rest. Handlers registered with `server: true` are excluded from the client build of this virtual module — required for any handler touching server-only data (DB calls, secrets), since client-bundled consumers like `packages/launcher/launcher.ts` import from the same module; setting `server: true` on a `launcher:`/`:action`-classified entry is a fatal error rather than a silent no-op, since that pool has no SSR/client split.
- `virtual:stnd/components`: Used by the `<Hook />` component for UI rendering, and read directly (`extensions[zone]`) by client code that needs callable functions, not just components — e.g. `launcher:action`/`graft:action` entries.

**UI Consumption:**

```astro
import Hook from "@stnd/core/Hook.astro";
<Hook id="header:top" />
```

---

## 🛠 Helpers Reference (Core & Server)

Importable via `@stnd/server/[filename]` or `@stnd/utils/[filename]`.

### Authentication (`@stnd/server/auth.js`)

| Function | Signature | Description |
| :--- | :--- | :--- |
| `signJWT` | `signJWT(payload, secret)` | Signs a JWT token via the Web Crypto API. |
| `verifyJWT` | `verifyJWT(token, secret)` | Verifies and decodes a JWT. |
| `getSession` | `getSession(request, secret)` | Extracts the session from cookies. |
| `createSession` | `createSession(payload, secret)` | Generates the `Set-Cookie` header. |

### Browser & Client (`@stnd/client`)

| Function | Signature | Description |
| :--- | :--- | :--- |
| `copyToClipboard` | `copyToClipboard(text)` | Copies to clipboard (with fallback). |
| `emit` | `emit(name, detail)` | Global event bus (`window.dispatchEvent`). |
| `on` | `on(name, callback)` | Global event listener. |
| `standardGateView` | `standardGateView(view)` | Opens a specific view in the Gate. |
| `standardGatePrompt` | `standardGatePrompt(text)` | Opens the Gate with pre-filled text. |

### Document Converter (`@stnd/ingest`)

| Function | Signature | Description |
| :--- | :--- | :--- |
| `convertDocumentToMarkdown` | `convertDocumentToMarkdown(file)` | Converts DOCX, PDF, HTML, or RTF into Markdown. |
| `isSupportedDocument` | `isSupportedDocument(file)` | Checks if the file is convertible. |

### E-Ink Optimization (`@stnd/client/eink.js`)

| Function | Signature | Description |
| :--- | :--- | :--- |
| `initEInk` | `initEInk(options)` | Initializes E-Ink detection and styles. |
| `toggleEInkMode` | `toggleEInkMode()` | Manually toggles E-Ink mode. |

### Utils & Data (`@stnd/utils/index.js` & `@stnd/utils/slugify.js`)

| Function | Signature | Description |
| :--- | :--- | :--- |
| `slugify` | `slugify(text)` | Robust and universal slugifier. |
| `deepMerge` | `deepMerge(target, source)` | Deeply merges objects. |
| `getExcerpt` | `getExcerpt(content, opts)` | Extracts a summary (HTML/MD). |
| `formatDate` | `formatDate(date, format)` | Multilingual date formatting. |
| `getReadingTime` | `getReadingTime(text)` | Estimated reading time. |
| `validateEmail` | `validateEmail(email)` | Simplified email validation. |

### Other Helpers:

- `@stnd/server/cors.js`: `getCorsHeaders`, `handleCorsPreflight`.
- `@stnd/server/errors.js`: Standardized error classes (`StandardError`, `AuthError`, etc.).
- `@stnd/server/filename.js`: `sanitizeFilename`, `makeUniqueFilename`.
- `@stnd/log`: Scoped color logging system (`log.info`, `log.success`, `log.banner`).
- `@stnd/core/src/collections.js`: `defineStandardCollection` (Astro Content Layer helper).

---

## 🎨 Design Tokens (CSS Variables)

The system uses CSS variables (`--stnd-*` or root variables `:root`) for consistency.

### 📐 Geometry & Rhythm (`packages/styles/_standard-01-token.scss`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `--ratio-golden` | `1.618` | Golden Ratio for layouts. |
| `--ratio-silver` | `1.414` | Silver Ratio for scales. |
| `--baseline` | `1rlh` | Base unit of vertical rhythm. |
| `--space` | `var(--baseline)` | Base spacing. |
| `--space-[1-12]` | `var(--space) * n` | Modular spacing scale. |
| `--scale-[2-8]` | `modular scale` | Exponential typographic scale. |
| `--line-width` | `~42rem` | Optimal reading width (measure). |
| `--radius` | `--leading` | Border radius consistent with rhythm. |

### 🎨 Colors (`packages/styles/_standard-02-color.scss`)

OKLCH-based system generating harmony from `--color-accent`.

| Semantic Token | Description |
| :--- | :--- |
| `--color-background` | Canvas background (paper in light, retro black in dark). |
| `--color-foreground` | Primary text color. |
| `--color-accent` | Brand/action color (generates all other colors). |
| `--color-surface` | Card/container background. |
| `--color-border` | Subtle borders. |
| `--color-[green\|red\|yellow\|blue]` | Pigment colors derived from accent. |
| `--color-success\|error\|warning` | Semantic states. |

### 🛠 SCSS Breakpoints

- `$mobile`: 600px
- `$small`: 768px
- `$large`: 1024px
- `$wide`: 1440px

---

## 💡 Notes for AI

- **Module Integration**: Standardized on *“Module”* terminology (formerly Folios/Spores).
- **Actions**: Core actions are now fully decanted into their respective modules and aggregated via `virtual:stnd/actions`.
- **Data Model**: Business logic belongs in models (`model/`) or `core/` helpers. Astro components are reserved for rendering.
- **Typography**: Respect vertical rhythm by using `var(--space-*)` for margins and `var(--scale-*)` for font sizes.

## Notes / Observations

*(jot down anything noticed here — quirks, gotchas, ideas)*

---

## Todo <!-- was "What's next — open" -->

Part of the [Road to Public Release](../README.md#-road-to-public-release) (Phases 1–2). These roll up into [the project board](../../README.md#the-project-board).

- [ ] **Purge dead dependencies** — `astro-icon`, `pdfjs-dist`, `html-to-md`, [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
      `dotenv`, `unist-util-visit`, `toposort`, `modern-normalize`, `dompurify`,       `linkedom`, `markdown-it*` are declared in `package.json` but not referenced       by core’s own code (press owns its own copies). Run `pnpm audit:depedencies`.
- [ ] **`wrangler` is declared here, in press, and in bin** — one owner. [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
- [ ] **Silent no-op** — `prefetch` and `experimental.clientPrerender` set on the [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
      integration object at [standard.js:63](standard.js:63) do nothing (Astro       only reads `name` + `hooks` on an integration). Route through `updateConfig`       or remove.
- [x] **Alias list is now dynamic** — derived from core’s declared `@stnd/*`
      deps in `standard.js`, so it can never drift. `@stnd/icon` added to deps.
- [x] **Delete `src/___collections.___js`** — done (disabled dead file removed).
- [x] **Layering paradox resolved** — core is documented as the sanctioned
      meta-package (its code imports only log + utils; it declares the rest). See       the Import Hierarchy note in [packages/README](../README.md#-import-hierarchy-strict).
- [ ] **`adeSsrDeps` → `@stnd/cloudflare`** (not core) — decided during Phase 2: [priority:: 3] [token_scale:: 3] [created:: 2026-07-14] [area:: framework]
      the SSR/workerd optimizeDeps fix belongs with the Cloudflare package, split       from the app-specific deps that stay in the app.

## 🔗 Liens & Normes

Ce paquet implémente les principes directeurs de l’écosystème Standard. Pour plus de détails sur le fonctionnement global, consultez les documents suivants :
- **Architecture Système** : [4.1 Architecture](../../apps/stnd.build/modules/manual/content/4-system/4.1-architecture.md)
- **Principes de Code** : [4.2 Code Standards](../../apps/stnd.build/modules/manual/content/4-system/4.2-code-standards.md)
- **Normes de Documentation** : [4.9 Normes README](../../apps/stnd.build/modules/manual/content/4-system/4.9-readme-standard.md)
- **Le Standard** : [packages/README.md](../README.md)
- **Entrée Monorepo** : [README.md](../../README.md)
