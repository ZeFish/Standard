---
type: note
status: draft
publish: false
tags: [standard, design-tokens, audit]
---

# Colour token audit — `@stnd/styles`

> Evidence for [`GUIDE.md`](./GUIDE.md): what the framework defines, who actually reads it, what is
> dead, what is missing. Colour only (`--color-*`, plus `--border*` and `--shadow*` because they
> carry colour). Scan of 2026-10-07 over every tracked or untracked, non-ignored file in the
> monorepo, excluding `node_modules`, `dist`, `generated`, tests.
>
> **How to read the counts.** *Reads* = `var(--x)` occurrences plus quoted names (`'--x'`) in JS.
> "Outside" means outside `packages/styles` and `packages/themes`. Names built by string
> concatenation are invisible to the scan, so a zero is "very probably dead", not proof. Obsidian's
> own variables (`--background-*`, `--color-base-*`) are Obsidian's API and out of scope.
> Each decision below has a ☐ to tick, change or veto.

## 1. The picture

| | |
|---|---|
| Colour/shadow/border tokens defined by the framework | **108** |
| …of which per-scheme (`--color-light-*` / `--color-dark-*`) | 48 |
| …read by an app or package | 87 |
| …read only inside the framework (plumbing) | 15 |
| …read by nobody | **6** |
| Tokens apps **read but nobody defines** | **23** |
| Tokens defined by themes that nothing reads | ≥ 8 |
| Hard-coded colour literals in components, outside token definitions | **544** (616 with a third-party Obsidian plugin's CSS, which is not ours) |
| Themes | 27 |

**Five headline findings**

1. **Four tokens carry the framework.** Every one of the 27 themes sets the four seeds
   `light/dark-background` and `light/dark-foreground`; after that coverage collapses (accent 19,
   hues 6–13, everything else 1–5 themes). The seed layer is the real contract.
2. **The scheme switch is written six times.** Each hue mapping (`--color-red: var(--color-dark-red)`
   and the other nine) appears in three dark contexts and three light ones. The file's own comment
   admits a bug from exactly that: purple, pink and brown "now correctly switch" in all three.
3. **Apps keep inventing the roles we lack.** 23 names are read but defined nowhere, and they
   cluster: hover (2), danger/destructive (2), accent-hover/strong (2), sunken (1), backdrop (1),
   muted/text aliases (3), a lighter border (2), shadow sizes (3). That is the missing-role list.
4. **Component-private tokens leak into the public namespace.** `--color-callout`,
   `--color-alert`, `--color-loading`, `--color-loading-mix` are one component's internals named
   like framework API; `--color-grid` is a debug helper.
5. **Themes bypass the scheme layer.** Nineteen settings across 8 themes (calm, claude, contrast,
   editorial, international, venetian, dev, kernel) set a *role* directly (`color-border`,
   `color-muted`, `color-subtle`, `color-surface`, `color-blue`…) instead of a seed, so they have a
   single value for light and dark. (`color-accent` is set directly by 14 themes too; it is the
   most common case of the same thing.)

## 2. Dead — read by nobody (6)

| Token | Why it exists | Proposal |
|---|---|---|
| `--color-light-accent-analogous`, `--color-dark-accent-analogous` | Alternative auto-accent strategy | ☐ remove |
| `--color-light-accent-complementary`, `--color-dark-accent-complementary` | Alternative auto-accent strategy | ☐ remove |
| `--color-light-on-accent` | Per-scheme seed that the active `--color-on-accent` never reads (it is just `var(--color-background)`) | ☐ remove (and `dark-on-accent`, read only by a string) |
| `--shadow-ring-highlight` | Unindented draft next to `--shadow-ring` | ☐ remove |

Only `triadic` is ever selected as the auto-accent. Three strategies and a selector for a choice no
theme makes: keep one formula, or keep the strategies as documented options (☐ decide).

## 3. Plumbing — read only by the framework (15)

Needed today, but they exist *because* the scheme layer duplicates the role layer:
`dark-muted`, `light-subtle`, `dark-subtle`, `light-border`, `light-highlight`, `dark-highlight`,
`light-shadow-base`, `dark-shadow-base`, `light-brown`, `dark-brown`, `light/dark-accent-auto`,
`light/dark-accent-triadic`, `grid`.

**Proposal (☐):** compute them *once*, at the role layer, from the active seeds. `muted`, `subtle`,
`border`, `highlight`, `shadow` are formulas on `--color-foreground` / `--color-background`, which
are already scheme-aware, so they need no `light-` and `dark-` twins. The only genuine per-scheme
difference is an alpha (muted 0.60 vs 0.65), which a single formula can absorb. That removes about
fourteen tokens and the code that switches them.

## 4. Component-private and debug (5)

| Token | Reads outside | Proposal |
|---|---|---|
| `--color-callout` | 3 | ☐ rename to a component-local name (`--callout-color`) |
| `--color-alert` | 0 | ☐ same (`--alert-color`) |
| `--color-loading`, `--color-loading-mix` | 6, 2 (stnd.gd overrides them) | ☐ same; keep the override hook |
| `--color-grid` | 2 | ☐ move to the debug namespace (`--debug-grid`) |

## 5. Names that overlap or mislead

| Today | Problem | Proposal |
|---|---|---|
| `--color-surface-light-1/2/3`, `-dark-1/2/3` | *Direction* baked into the name; 221 reads outside, so the rename is a real migration. Light-mode steps clamp at 1 (GUIDE 7.2) | ☐ replace by role names (GUIDE 3.1), keep old names as aliases for one release |
| `--color-light` / `--color-dark`, `--color-darker` | Polarity aliases; 1 read outside, `darker` none | ☐ rename or drop (GUIDE 7.1); remove `darker` |
| `--color-pink`, `--color-brown` | 0 readers outside | ☐ remove from the core, theme-optional |
| `--color-magenta` vs `--color-purple` | Two neighbouring hues (reads 3 and 5) | ☐ keep one, or keep both with distinct jobs |
| `--border-hover`, `--border-accent`, `--border-transparent` | 0, 0 and 1 reads outside | ☐ remove the first two; keep `--border` |
| `--color-photo-frame` (+ seeds `photoFrame`, `elevated` in `macos` and `reveal`) | Defined in two themes, **read by nobody**; Reveal improvises `--canvas` instead | ☐ fold into `stage` (GUIDE 3.1) and delete |
| `--color-light/dark-surface`, `-surface-low` (documentation, federal) | One theme reads `dark-surface`; the rest unread | ☐ fold into the surface ladder |
| `--color-loading*` etc. | see section 4 | |

Hue usage outside the framework, for the record: red 41, green 37, orange 20, blue 17, yellow 13,
cyan 11, purple 5, magenta 3, **pink 0, brown 0**.

## 6. Missing — what apps ask for and cannot find

| They wrote (undefined) | Where | It is really… | Role in GUIDE |
|---|---|---|---|
| `--color-surface-hover` | stnd.gd | hover state | `hover` |
| `--color-accent-hover`, `--color-accent-strong` | stnd.gd, translate | accent states | `hover` / `pressed` on `accent` |
| `--color-danger`, `--color-destructive` | stnd.gd, reveal | error | `error` (alias or rename) |
| `--color-surface-sunken` | stnd.gd | recessed well | `surface-sunken` |
| `--color-surface-2` | stnd.gd | a surface step | the ladder |
| `--color-backdrop` | ui | modal scrim | **new:** `scrim` |
| `--color-foreground-muted`, `--color-text`, `--color-background-subtle` | launcher, art, views | aliases of `muted`, `foreground`, a ground tint | `muted`, `foreground`, `stripe` |
| `--color-border-subtle` | **inside the framework** (prose, utilities), always with a grey fallback | a fainter hairline | `edge` (and `edge-strong`) |
| `--color-signal` | stnd.gd | an app-specific emphasis | probably not framework |
| `--color-accent-hsl`, `--color-red-hsl`, `--color-success-rgb` | obsidian-chisel, standard-garden, modules | alpha composition | not needed: relative colour syntax (`oklch(from var(--x) l c h / .5)`) already does it |
| `--shadow-xs/sm/md`, `--shadow-stationary` | stnd.gd, standard-garden | a shadow scale with gaps | decide the scale once (section 8) |

The framework's own fallbacks (`var(--color-success, #22c55e)`, `var(--color-muted, #888)`) sit on
tokens that always exist: they never fire and only hide the day a token is renamed (☐ remove).

## 7. Structure

1. **Six copies of the scheme switch** (media query, `[data-color-mode]`, the two mixins). *Proposal
   (☐):* declare each role once with `light-dark(light, dark)` and set `color-scheme` from the
   system preference or `data-color-mode`. One declaration, no switch to forget. Needs a check
   against every target runtime (Obsidian's Electron, WKWebView, garden).
2. **Two attributes for one thing:** `[data-color-mode]` and `[data-theme-mode]` are both tested
   (`:not([data-color-mode="light"]):not([data-theme-mode="light"])`). ☐ keep one.
3. **High contrast is a hammer.** `_standard-30-contrast.scss` forces seeds to black and white with
   `!important` and flattens `muted` and `subtle` into the foreground. Apple asks for an increased
   -contrast variant of every colour, not one binary override (GUIDE 10.1). ☐ redesign as a variant.
4. **Forced colours maps five tokens** (`background`, `foreground`, `accent`, `border`, `muted`).
   `surface`, `subtle`, the edges and the status colours are left to whatever they resolve to. ☐ map
   every role.
5. **Theme seeds without readers:** `elevated`, `photoFrame`, `claude-opacity` (set, never read),
   `--border-footer`, `--border-light`, `--shadow-distance` in themes. ☐ delete with the themes' next pass.

## 8. Shadows and borders

Eleven shadow tokens, one of them dead (`ring-highlight`). Reads outside: `shadow` 38, `raised` 24,
`glow` 19, `inset` 16, `ring` 13, `lg` 12, `hover` 11, `lift` 6, `xl` 4, `ambient` 2. Apps ask for
`xs`, `sm`, `md`. ☐ settle one named scale (for example `xs sm md lg xl`) and express `raised`,
`inset`, `ring` as roles in the guide rather than as sizes.

## 9. Hard-coded colours — 544 literals

| Area | Literals | Worst file |
|---|---|---|
| `apps/stnd.gd` | 202 | `modules/core/routes/index.astro` (126) |
| `apps/reveal` | 78 | `RapidEngine.svelte` (17), `CropOverlay` (16), `CheckLayerOverlay` (14) |
| `apps/stnd.build` | 70 | `Studio.svelte` (70, deliberate demo data) |
| `apps/obsidian-standard-garden` | 47 | `features/panel/styles.css` (17) |
| `apps/design-labs` | 36 | `ColorEditor.svelte` (23, a colour editor) |
| `packages/views` | 30 | `SettingsView.svelte` (30) |
| `packages/styles` | 10 | the fallbacks above, two print and two code values |
| the rest | ~70 | translate, reveal.photos, plant-dashboard, art… |

Some are legitimate (a colour picker, scopes that must be pure black, SVG data URIs). Most are the
missing roles of section 6 written out by hand. ☐ After the vocabulary is settled, the conformance
check "no literal colour outside a token file" (GUIDE 8) becomes a lint, with an allow-list.

## 10. Target size

| Layer | Today | Target (GUIDE 3) |
|---|---|---|
| Per-scheme seeds | 48 (many computed) | ~20: `background`, `foreground`, `accent` and the seven hues, light and dark |
| Roles | ~60, with direction-named surfaces and private leaks | ~41: ground and surfaces 6, content 5 (+5 prose), edges 5, interaction 6, accent 3, status 4, hues 7 |
| Component-private | 5 in the public namespace | 0 |
| Dead | 6 + the theme-only seeds | 0 |

About 108 down to about 60 public names, the other half being computed rather than declared, and
every name answering "when do I use it?" in the guide.

## 11. Suggested order

1. Settle the vocabulary in the guide (names, light-mode elevation, `edge`).
2. Add the missing roles beside the old names, so nothing breaks (aliases).
3. Collapse the scheme switch (`light-dark()` or a single mixin) and move the computed palettes up to the role layer.
4. Delete the dead and private tokens.
5. Migrate readers app by app, starting with Reveal (it has `--canvas` ready).
6. Turn the conformance checks into tests and the literal rule into a lint.
