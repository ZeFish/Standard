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

## Progress (2026-10-07)

Done and verified against a before/after snapshot of every token, in 28 themes × 11 contexts
(system light/dark, forced modes, nested `[data-theme]`, `.theme-*`, `.inverse`):

- ✅ **Scheme switch collapsed** (section 7.1): six copies → one `light-dark()` declaration per role,
  scheme chosen by `color-scheme`. `_standard-02-color.scss` 836 → 670 lines; `standard.css` −4 %;
  the Obsidian build −17 %.
- ✅ **Computed palettes at the role layer** (section 3): `muted`, `subtle`, `border`, `shadow`,
  `highlight` are formulas on the active seeds. The 16 per-scheme twins are no longer declared; the
  same names remain as **optional overrides** (`var(--color-dark-border, <formula>)`).
- ✅ **Dead removed:** `light/dark-on-accent`, `--color-photo-frame`, `elevated` and `photoFrame` seeds.
- ✅ **Themes minimised:** 134 colour declarations that duplicated the generated block removed from
  15 theme `.scss`; 36 role-level overrides moved to light seeds (so dark is unchanged).
- ✅ **Accent strategies:** `analogous` and `complementary` removed (never read); `triadic` is the only derivation. `dark-on-accent` removed with them.
- ✅ **Component-private tokens:** `--color-callout`, `--color-alert`, `--color-loading(-mix)` and `--color-grid` are now `--_callout`, `--_alert`, `--_loading(-mix)`, `--_grid` (the `--_` private convention; `--callout-color` is taken by Obsidian). stnd.gd's two Loaders, blueprint and Obsidian's callouts follow. Compiled CSS is identical for all 28 themes.
- ✅ **Surface names (step 3):** `--color-surface-sunken`, `-raised`, `-overlay` (Atlassian's ladder, see GUIDE 11) are the canonical names; `--color-surface` stays as the short alias of `raised`. 159 readers in 49 files migrated (Reveal included) and the utilities gained `.bg-surface-sunken/-raised/-overlay`. The old `-light-1`, `-light-2`, `-dark-1` remain as aliases, now read by nothing in the repo. The numeric steps `-light-3`, `-dark-2`, `-dark-3` (15 readers) are not elevation levels at all: they are hover/active/selected states (13), control tracks (6, Apple's `fill`) and Reveal's photo backdrop (`stage`). They go once those roles exist (GUIDE 11). Verified: every pre-existing token identical on 39,732 comparisons; the new names equal the old ones in all 1,232 alias checks (the only gap is `international`, which overrides `--color-surface` on purpose).
- ✅ **`--color-stage`** added (GUIDE 3.1): neutral, 0.09 darker than the ground in both schemes; Reveal's `GrainBackground` reads it instead of `surface-dark-3`. Checked on 28 themes × 2 schemes: chroma 0 everywhere, always darker than the ground (a pure-black ground, as in `contrast`, cannot go darker). `--color-surface-dark-3` is now read by nobody.
- ✅ **Fills, states, placeholder, ring, scrim (Apple's values, read from macOS 27):** the `--color-fill*` ladder (foreground at 9.8 / 7.8 / 4.7 / 2.7 / 0.8 %, named by shape size per AppKit), `--color-hover` (the secondary fill), `--color-active`, `--color-selected` (14 % / 18 %), `--color-placeholder` (50 % / 55 %), `--color-ring` (the accent at 50 %) and `--color-scrim` (black 35 %). They replace the last numeric readers (switch/progress/slider tracks, hover and focus highlights, a selected launcher item, a keycap, two tiles); the forms' placeholder, two focus outlines and `Dialog`'s veil now read them. Alphas checked against the system's on 28 themes × 2 schemes (560/560). Reveal's `--canvas` reads `--color-stage`. `--color-surface-light-3`, `-dark-2` and `-dark-3` are read by nobody and deprecated.
- ↩️ **Retracted:** `--color-border-strong`. It was chosen to reach WCAG's 3:1; the goal is Apple's subtlety, macOS has no strong border (a field is drawn with the separator, 9.8 %, which is our `--color-border`), and `contrast` is the WCAG theme. Likewise iOS's fill values (20 / 16 / 12 / 8 %) were replaced by macOS's lighter ones once the system was read.
- ✅ **Dead and fallbacks cleaned:** `--shadow-ring-highlight` removed; `--color-darker` removed; framework-level fallbacks (`var(--color-success, #22c55e)`, `var(--color-error, #ef4444)`, `var(--color-muted, #888)`, tooltip fallbacks, and `--color-border-subtle` in `stnd-screen-break`) cleaned to use canonical tokens without disguising fallbacks.
- ✅ **Error aliases added:** `--color-danger` and `--color-destructive` defined as aliases to `--color-error` (read by `stnd.gd` and `reveal`).
- ✅ **Shadow scale formalized (section 8):** `--shadow-xs` (ambient), `--shadow-sm` (1px layered), `--shadow-md` (lift), `--shadow-lg` and `--shadow-xl` establish the dimensional scale; `.shadow-xs`, `.shadow-sm`, `.shadow-md` added to utilities; semantic presets (`raised`, `inset`, `ring`, `hover`) preserved.
- ✅ **Literals cleaned in packages/views (section 9):** `SettingsView.svelte` (30 literals) fully migrated to standard tokens (`--color-surface-sunken`, `--color-fill-tertiary`, `--color-fill-quaternary`, `--color-hover`, `--color-error`, `--border`, `--shadow-xs`).
- ✅ **Automated conformance suite & dead token guards:** `tests/styles/conformance.test.mjs` verifies monotonic ladder, stage neutrality ($c < 0.005, L(stage) \le L(bg)$), WCAG AAA text contrast ($\ge 7:1$, observed $\ge 13.7:1$ across all 27 themes), zero scheme token leaks in consumer components, zero occurrences of removed dead tokens, and zero remaining usages of deprecated numeric surface utilities (`bg-surface-dark-2` migrated in `stnd.gd`). Automated in `pnpm test:styles` and guarded by `node scripts/check-dead-references.mjs`.
- ✅ **Dead theme keys purged:** `--border-hover` removed (0 readers); dead theme tokens removed from `tokens.yaml`. (The same commit claimed the mode selector was unified on `[data-color-mode]` "across framework and themes": it was not, five `data-theme-mode` selectors remained in `kernel`, `apex` and `forest`. Finished 2026-10-07, see *Audit* below, and guarded by a test.)
- ✅ **Color literal linter and index.astro purge (section 9):** `scripts/lint-colors.mjs` created with documented allow-list and integrated via `pnpm lint:colors`. `index.astro` temperament cards refactored to standard tokens (126 literals eliminated, 219 lines removed). Total unlisted literals monorepo-wide dropped from 544 to 250.
- ✅ **Secondary views cleaned (section 9):** `AccountSettingsView` (17 literals), `translate` (19 literals), `plant-dashboard` (14 literals), `LoginView` (3), `ModeratorView` (5), `MyNotesView` (3), `ConnectApp` (1), `UserAvatar` (6), `password-gate` (1), `pro.astro` (1), `CheckoutView` (1), `Dialog` (1), `ArtButton` (1), `Avatar` (2), `404.astro` (1), `maintenance` (2) fully migrated to canonical tokens (`--color-surface-sunken`, `--color-fill*`, `--color-success`, `--color-warning`, `--color-error`, `--color-scrim`, `--color-shadow`). Total unlisted literals dropped from 250 to 142 across 30 files.
- ✅ **Recalibration of `claude` theme (GUIDE.md §10.4):** dark ground calibrated to real desktop app content ground ($L = 0.252$, `#222222`), recessed sidebar / sunken stage to $L = 0.178$ (`#111111`), dark foreground to $L = 0.90$ (`#ececec`), and light ground to warm parchment ($L = 0.982$, `#faf9f5`), with terracotta accent preserved. All adapters (VSCode, Zed, Obsidian, Reveal, HomeAssistant) regenerated.
- ✅ **macOS theme resolved by the system (reworked 2026-10-07):** `packages/themes/macos/macos-dynamic.scss` binds the roles WebKit can express to `-apple-system-*` keywords. The first version never applied: WKWebView on macOS 27 rejects `-apple-system-window-background`, `-apple-system-under-page-background` and `-apple-system-cyan`, so its `@supports` guard was false and the theme rendered its palette, while this file said "completed". Now: only keywords the engine accepts (control-background for the ground, the three labels and the placeholder, separator, control-accent, the unemphasized selection, eight hues); the surface ladder, `stage`, link and cyan stay with the palette. Checked in a real WKWebView against AppKit's own values (7 bound roles, light and dark) and for consistency across forced modes, nested containers, `.theme-*` and `.inverse`; guarded by `tests/styles/webkit.test.mjs`.
- ✅ **Consistency:** a forced mode now gives exactly what the system mode gives (before, the three
  dark contexts disagreed for 19 themes).

Visible effects, all intended: `link` now follows `accent` in the 7 themes that overrode the accent
at role level (blueprint, calm, chalky, dev, dyslexia, gallery, kernel); `international`'s surface is
flat in dark as its light scheme; `.theme-dark` / `.inverse` now switch the hues too (they did not);
`--shadow-xl` expresses "glow only in dark" as a transparent colour; `apps/obsidian-standard-garden/src/themes.generated.js` regenerated and deployed to vault.


- ✅ **Elevation in light, decided: the shadow carries it (GUIDE 5).** Measured first: of 28 light themes, 17 have `raised` = `overlay` (both white), 6 a partial step, 5 a full ladder; 24 have a ground above 0.94. Elevation is now documented as a pair (surface + shadow), `--shadow-overlay` pairs with `--color-surface-overlay`, the Studio has an *Elevation* mockup, and `tests/styles/elevation.test.mjs` requires neighbouring levels to differ in colour or in shadow (all 28 themes pass; `calm` is flat by design and named). Checked the test fails when a theme loses its shadows.
- ✅ **Guards wired into `pnpm check`** (which the pre-push hook and the CI both run): `test:styles` (conformance, consistency, shadows, elevation, WebKit on macOS) and a colour-literal **ratchet** (`lint-colors --ratchet`, baseline `scripts/lint-colors.baseline.json`, 172 literals: a file may not gain one). In CI a missing Chrome fails the test instead of skipping it.

### Reveal, combed (2026-10-07)

198 source files in `apps/reveal/modules` and `src`. Clean on reads: no colour token read that is not
defined, one colour token declared locally (the develop zones' accent), 11 `!important` (the import
HUD's transparent window, and one export animation). Found and fixed:

- **16 hover backgrounds were a surface** (`var(--color-surface)`: sidebar rows, section headers, the
  "+" buttons, accordion headers, two rules in `app.scss`) or a hand-written 8 %. With the macOS theme
  now really resolved by the system, the light ground is white and so is `--color-surface`, so those
  hovers vanished in light. All read `--color-hover` (macOS's secondary fill, 7.8 %: over the white
  ground it is `#ebebeb`; over the dark ground `#303030`, where the raised surface it replaces was only
  about three points lighter).
- **A regression of mine:** the focus outline reads `--color-ring`, which is computed on `:root`, so the
  develop zones' local accent no longer reached it. The zones re-declare the ring (GUIDE 2.1).
- **Hand-written translucent fills** (3, 4, 5, 8 % of the foreground) now read the fill ladder, and the
  three hairline borders the border role; 3 fallbacks for tokens that exist were dropped.
- The ratchet went from 172 to 166 literals and the baseline was lowered.
- **The check layer had three palettes** (the canvas painter, the toolbar dots, the legend and photo
  marks). The painter's are the real ones, so `CHECK_COLORS` in `developAnalysis.js` is now the only
  place they are written; the dots, the legend (false-colour bands included) and the photo marks read
  it, and a test paints a pixel per band and compares.
- **Border → shadow.** `--shadow-border` and its four sides (`-top`, `-bottom`, `-left`, `-right`) draw
  the stroke as an inset shadow, so it takes no layout space and a hover or focus colour change moves
  nothing. 39 of Reveal's 51 `border` declarations migrated (dividers, cards, fields, tabs, focus
  rings); the invisible `transparent` borders that only reserved space were deleted. Kept as borders,
  on purpose: the crop overlay's corner brackets and frame, the loupe ring, the spinner arcs, the
  dashed empty state. The Scopes frame is a `::after` ring, because its canvas would cover an inset
  shadow. Not looked at in a running window: the web preview has no panels, so check the Tauri app.
- The ratchet went from 166 to 155 literals.

Left as findings: the check layer's legend colours exist in three places and disagree (the toolbar's
clipping dots are `#ff3b30` and `#007aff`, the photo marks and the legend use `#ef4444`); photo
overlays (drop shadows over thumbnails, the loupe) are black or white by nature; the import HUD is a
dark panel on purpose; 51 `border` declarations in 28 files are the map for the border-to-shadow work.

### Audit of the second session's commits (2026-10-07)

Ten commits after `8f6a4920a`, reviewed against a before/after snapshot of every token (28 themes × 11
contexts, 38 192 comparisons) and, for the macOS theme, a real WKWebView. Most of the work holds: no
existing token moved except in `claude` (recalibrated) and `kernel` (a regression, below); the shadow
scale only adds; the migrations use roles. Findings, all fixed:

- **The macOS dynamic theme was dead code** (see above). Fixed, and `tests/styles/webkit.test.mjs` fails on the old version.
- **`kernel` regressed:** `&[data-color-mode="dark"]` was added to a hand-written block of role-level overrides, so a forced dark mode differed from the system dark mode again (`bold`, `accent`, `ring`, `border-accent`). The block only ever applied under the dead `data-theme-mode` attribute; removed. `tests/styles/consistency.test.mjs` fails on the old version.
- **`data-theme-mode`** was still used by `kernel`, `apex` and `forest` (dead aliases). Removed; `conformance.test.mjs` now fails on any occurrence.
- **Orphan tokens:** `--color-selected-accent` (not an industry name) and `--color-border-subtle` were defined only inside the dead block. Gone with it.
- **The suite tested the model, not the CSS:** it recomputes from the yaml, so it passed with both defects. Added the two tests above and `tests/styles/snapshot.mjs`, which captures every resolved token so a refactor's diff shows exactly what moved.
- **Left for a decision:** the `claude` recalibration (the dark values look measured; the light ones have no source on record), the unverified visual equivalence of the literal-to-token migrations, `apex` and `forest`'s dark `h1` rules, which apply under `.theme-dark` or a forced mode but not under the system dark scheme.
- **A correction to my own first reading:** `apps/obsidian-standard-garden/build.js` deploys into the Obsidian vault by design (set `VAULT_PLUGINS` to a path that does not exist to skip it), so the vault write was that script's normal behaviour, not an extra step.

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
| `--shadow-ring-highlight` | Unindented draft next to `--shadow-ring` | ☑ removed |

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
| `--color-light` / `--color-dark`, `--color-darker` | Polarity aliases; 1 read outside, `darker` none | ☑ `--color-darker` removed |
| `--color-pink`, `--color-brown` | 0 readers outside | ☑ **keep**: both are Apple system colours (GUIDE 11), so standard names; optional per theme |
| `--color-magenta` vs `--color-purple` | Two neighbouring hues (reads 3 and 5). Apple lists `purple` but not `magenta`; CSS and ANSI list `magenta` | ☐ keep both: `purple` is Apple's, `magenta` is CSS/ANSI's (3 themes use it) |
| `--border-hover`, `--border-accent`, `--border-transparent` (a `border` composite, as in the DTCG spec) | 0, 0 and 1 reads outside | ☐ remove the first two; keep `--border` |
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
| `--color-danger`, `--color-destructive` | stnd.gd, reveal | error | ☑ aliased to `--color-error` |
| `--color-surface-sunken` | stnd.gd | recessed well | `surface-sunken` |
| `--color-surface-2` | stnd.gd | a surface step | the ladder |
| `--color-backdrop` | ui | modal scrim | **new:** `scrim` |
| `--color-foreground-muted`, `--color-text`, `--color-background-subtle` | launcher, art, views | aliases of `muted`, `foreground`, a ground tint | `muted`, `foreground`, `stripe` |
| `--color-border-subtle` | **inside the framework** (prose, utilities), always with a grey fallback | a fainter hairline | `edge` (and `edge-strong`) |
| `--color-signal` | stnd.gd | an app-specific emphasis | probably not framework |
| `--color-accent-hsl`, `--color-red-hsl`, `--color-success-rgb` | obsidian-chisel, standard-garden, modules | alpha composition | not needed: relative colour syntax (`oklch(from var(--x) l c h / .5)`) already does it |
| `--shadow-xs/sm/md`, `--shadow-stationary` | stnd.gd, standard-garden | a shadow scale with gaps | ☑ scale formalized: `xs`, `sm`, `md`, `lg`, `xl` |

The framework's own fallbacks (`var(--color-success, #22c55e)`, `var(--color-muted, #888)`) sit on
tokens that always exist: they never fire and only hide the day a token is renamed (☑ removed).

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
`xs`, `sm`, `md`. ☑ Sized scale settled (`xs`, `sm`, `md`, `lg`, `xl`) and expressed with semantic
roles (`raised`, `inset`, `ring`, `hover`).

## 9. Hard-coded colours — 250 unlisted literals (544 originally)

| Area | Literals | Worst file |
|---|---|---|
| `apps/stnd.gd` | ~76 | `index.astro` cleaned (126 → 0); `AccountSettingsView` (17), `gallery/styles.css` (17) |
| `apps/reveal` | ~50 | `RapidEngine` cleaned; `CropOverlay` (16), `CheckLayerOverlay` (14), `Scopes` (9) (allowed technical scopes) |
| `apps/stnd.build` | ~60 | `UiShowcase.astro` (3), `ProseMock.svelte` (4) |
| `apps/obsidian-standard-garden` | ~30 | `panel/styles.css` (17), `feed/styles.css` (10) |
| `apps/design-labs` | 36 | `ColorEditor.svelte` (28, allowed colour editor) |
| `packages/views` | 0 | `SettingsView.svelte` (migrated to standard tokens) |
| `packages/styles` | 0 | dead tokens and fallbacks cleaned |
| the rest | ~40 | translate, reveal.photos, plant-dashboard, art… |

Some are legitimate (a colour picker, scopes that must be pure black, SVG data URIs, technical false-colour shaders). ☑ Conformance check implemented via `scripts/lint-colors.mjs` with documented allow-list and integrated via `pnpm lint:colors`.

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
