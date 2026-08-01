# Standard

> A meta-framework for building content sites on Astro — where design decisions live in one place and travel everywhere.

Standard is the framework layer under [stnd.build](https://stnd.build) and [standard.garden](https://standard.garden). It exists because most content sites re-solve the same problems badly: typography drifts between surfaces, features get tangled across folders, and the design system stops matching the site the week after it ships.

This repository mirrors three packages from a larger private monorepo. It is published so the architecture can be read, not because it is a turnkey product.

## What's here

| Folder | Package | What it does |
| --- | --- | --- |
| `core/` | `@stnd/core` | The Astro integration: module discovery, route injection, and the build-time glue that makes vertical slices work. |
| `styles/` | `@stnd/styles` | The design system itself — golden-ratio scale, vertical rhythm, micro-typography — compiled to CSS once and consumed everywhere. |
| `themes/` | `@stnd/themes` | Token-driven themes, authored once and compiled to every target: web, Obsidian, VS Code, Zed. |

## The two ideas worth stealing

**Vertical slice modules.** A feature is a folder. A blog, a menu, a shop — each one holds its own server code, client code, routes, and styles, and registers itself. Adding a feature means adding a folder; removing one means deleting it. There is no central registry to update and no import graph to untangle, which is what keeps the complexity flat as the number of features grows.

**One design system, four layers.** Design decisions are only allowed in two of them:

```
Layer 3: User overrides (per-note frontmatter tokens)   ← applies last, always wins
Layer 2: Themes (tokens.yaml + theme.scss per theme)    ← authored once, compiled to every target
Layer 1: Adapter (app-specific DOM mapping)             ← mapping only: no colors, no sizes, no spacing
Layer 0: Framework (the scale, the rhythm, the rules)   ← the same compiled CSS everywhere
```

The discipline is in Layer 1. An adapter is allowed to say *"this app's DOM is shaped strangely, here is how Standard maps onto it"* — and nothing else. The moment a colour or a font size appears in an adapter, the system has forked and the drift begins. Keeping that rule is what lets the same typography render identically in a browser, in Obsidian, and in an editor's UI.

## Typography as the point, not the polish

The scale is built on the golden ratio, the vertical rhythm is enforced rather than suggested, and the micro-typography rules — optical margins, hanging punctuation, proper quotes and dashes — are applied automatically. The premise is that professional typesetting should be the default state of a document, not a manual pass someone does at the end and nobody maintains.

## Status

Pre-release, and honest about it: no backward-compatibility guarantees, no shims, no legacy aliases. Interfaces change when a better shape is found. The packages run in production behind several sites, plugins, and native apps; the `@stnd` scope on npm is where they land, and not every package there is current yet.

The full ecosystem — apps, plugins, a Tauri/Rust photo tool, and the rest of the `@stnd/*` family — lives in a private monorepo. This mirror is updated automatically on every push to it.

## License

MIT — see [LICENSE](./LICENSE).

---

Built by [Francis Fontaine](https://francisfontaine.com) · [github.com/ZeFish](https://github.com/ZeFish)
