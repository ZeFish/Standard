---
layout: base.njk
title: Cheat Sheet
description: The essential commands you'll use every day and always forget
permalink: /cheat-sheet/
---

# Cheat Sheet

The **20% of commands you'll use 80% of the time**. Copy-paste ready.

> **💡 Philosophy**: This isn't a complete reference—it's the stuff you'll actually use. If you need exhaustive documentation, see the [full utilities guide](/css/utilities/).

---

## Keyboard Shortcuts

```bash
Shift + Cmd/Ctrl + D    # Open/close Inspector (your new best friend)
Shift + Cmd/Ctrl + S    # Toggle debug mode (baseline grid, rhythm overlay)
ESC                     # Close Inspector (when you're done tweaking)
```

**Why these shortcuts matter**: Design systems live or die by iteration speed. These shortcuts let you debug layout issues and adjust design tokens without context-switching to your code editor. Use debug mode when your vertical rhythm feels off or grid columns aren't aligning.

---

## Spacing (The Ones You Forget)

```html
<!-- Center horizontally (THE most-used utility) -->
<div class="margin-inline-auto">Centered</div>
<!-- Why: margin: 0 auto is hard to remember. This is semantic. -->

<!-- Remove all spacing (reset browser defaults) -->
<div class="margin-0 padding-0">No space</div>
<!-- Why: Browsers add margin to <p>, <h1>, <ul>, etc. This kills it. -->

<!-- Negative space (pull content up to close gaps) -->
<div class="margin-top-0">Touches previous element</div>
<!-- Why: Default rhythm adds bottom margin. This removes top to close the gap. -->

<!-- Flex/Grid gaps (YOU ALWAYS FORGET THESE EXIST) -->
<div class="flex gap-base">Items with gap</div>
<!-- Why: Better than margin on children. Gap doesn't break at container edges. -->
```

**Quick sizes**: `xs` (tiny), `s` (small), `base` (normal), `l` (large), `xl` (huge)

**Mental model**: Think of spacing like musical rests. Too much = disconnected. Too little = cluttered. The `base` size (1rem) is your quarter note—use it as your default, go smaller/larger for emphasis.

**Common mistake**: Adding `margin-bottom` to every element instead of using `gap` on the parent. Gap is cleaner and prevents edge issues.

---

## Width (Reading & Centering)

```html
<!-- Optimal reading width (60-75 chars) - YOU FORGET THIS CONSTANTLY -->
<article class="width-line margin-inline-auto">
  Long form content
</article>
<!-- Why: Lines longer than 75 characters are hard to read. This constrains
     width to ~42rem for optimal readability. Every blog post should use this. -->

<!-- Full width (edge-to-edge, breaks out of container) -->
<section class="width-full">Full width</section>
<!-- Why: When you want background to extend but text stays readable -->

<!-- Constrain maximum width (responsive container) -->
<div class="max-width-xl margin-inline-auto">
  Constrained container
</div>
<!-- Why: Prevents content from stretching too wide on large monitors -->
```

**Reading widths explained**:
- `width-line-s` (32rem) — Short content, sidebars, narrow columns
- `width-line` (42rem) — **Sweet spot for articles** (60-75 chars at 16px)
- `width-line-l` (50rem) — Documentation, wider content

**Rule of thumb**: If users are reading paragraphs, use `width-line`. If they're scanning cards/UI, use `max-width-xl`.

**Pro tip**: Combine `width-line` with `margin-inline-auto` to center readable content on the page. This is the "article wrapper" pattern you'll use everywhere.

---

## Typography (Common Patterns)

```html
<!-- Small muted text (captions, metadata, timestamps) -->
<p class="small muted">
  Posted 2 hours ago
</p>
<!-- Why: .small reduces size, .muted reduces emphasis. Perfect for secondary info. -->

<!-- Uppercase label (auto includes letter-spacing) -->
<span class="uppercase">Category</span>
<!-- Why: Uppercase text needs letter-spacing (0.05em) for readability.
     This utility adds it automatically. Don't manually uppercase text. -->

<!-- Truncate long text with ellipsis (single-line overflow) -->
<p class="ellipsis" style="max-width: 200px;">
  This will truncate with three dots...
</p>
<!-- Why: Prevents text from breaking layout. Requires max-width to work. -->

<!-- Prevent text wrapping (keep labels/buttons on one line) -->
<span class="no-wrap">Stay on one line</span>
<!-- Why: Sometimes you want "Buy Now" to never split across lines -->
```

**Typography hierarchy quick reference**:
- **Primary text**: Default (1rem)
- **Secondary text**: `.small` (0.875rem)
- **Tertiary text**: `.smaller` (0.75rem)
- **Labels/metadata**: `.micro` (0.625rem)

**Common mistake**: Using `text-size-small` instead of just `.small`. The shorter names exist for the most common sizes—use them.

---

## Centering (Every Single Time)

```html
<!-- Center everything (flex center, vertical + horizontal) -->
<div class="center-content">
  <p>Perfectly centered in all directions</p>
</div>
<!-- Why: Flex center is the modern way. Works for both text and block elements. -->

<!-- Center horizontally only (classic auto-margin method) -->
<div class="center-horizontally" style="width: 50%;">
  <p>Horizontally centered</p>
</div>
<!-- Why: Requires width/max-width to work. Alias for margin-inline-auto. -->

<!-- Center text (inline content within a block) -->
<p class="center">Centered text</p>
<!-- Why: text-align: center. Use for headings, hero sections. -->

<!-- Center inline elements (buttons, images) -->
<div class="center">
  <button>Button is centered</button>
</div>
<!-- Why: Parent has text-align: center, inline children center themselves -->
```

**The 3 types of centering**:
1. **Flex center** (`.center-content`) — Centers anything inside a flex container
2. **Auto margin** (`.center-horizontally` or `.margin-inline-auto`) — Centers block elements with defined width
3. **Text align** (`.center`) — Centers inline content (text, images, buttons)

**Debugging centering issues**:
- Not working? Check if element is `display: block` and has a width
- Still not working? Try flex center instead
- Text won't center? Parent might have `text-align: left`

---

## Layout Patterns (Copy These)

### Card Grid (3 columns, responsive)

```html
<div class="grid gap-base">
  <article class="col-4 col-sm-12 padding-base border">
    <h3>Card 1</h3>
    <p>Description</p>
  </article>
  <article class="col-4 col-sm-12 padding-base border">
    <h3>Card 2</h3>
  </article>
  <article class="col-4 col-sm-12 padding-base border">
    <h3>Card 3</h3>
  </article>
</div>
```
**Why this works**:
- `.grid` creates 12-column layout
- `.col-4` = 4 columns wide (4/12 = 1/3 = 3 columns)
- `.col-sm-12` = full width on mobile (≤768px)
- `.gap-base` = space between cards (cleaner than margin)

**Common variations**:
- 2 columns: `.col-6`
- 4 columns: `.col-3`
- Asymmetric: `.col-8` + `.col-4` (main + sidebar)

---

### Hero Section (landing page header)

```html
<header class="padding-xl center">
  <h1 class="tight">Welcome to Our Product</h1>
  <p class="small muted">The tagline that explains what you do</p>
  <a href="#" class="button margin-top-base">Get Started →</a>
</header>
```
**Why this works**:
- `.padding-xl` = generous white space (4rem top/bottom)
- `.center` = centers all inline content
- `.tight` on h1 = reduces line-height for display text
- `.margin-top-base` = adds space above button

**Pro tip**: Use `.tight` on large headings to reduce awkward line spacing. Default line-height (1.5) looks weird on 3rem+ text.

---

### Two-Column Layout (Content + Sidebar)

```html
<div class="grid gap-l">
  <main class="col-8 col-sm-12">
    <article class="width-line">
      <h1>Article Title</h1>
      <p>Main content with optimal reading width...</p>
    </article>
  </main>
  <aside class="col-4 col-sm-12">
    <h3>Related</h3>
    <ul>...</ul>
  </aside>
</div>
```
**Why this works**:
- 8/12 + 4/12 = classic 2:1 ratio (66% + 33%)
- `.width-line` inside main column constrains text for readability
- `.gap-l` creates clear separation
- `.col-sm-12` stacks columns on mobile

**Alternative ratios**:
- Equal columns: `.col-6` + `.col-6`
- Dominant sidebar: `.col-4` + `.col-8`
- Three column: `.col-4` + `.col-4` + `.col-4`

---

### Centered Container (classic article layout)

```html
<div class="width-line margin-inline-auto padding-base">
  <h1>Page Title</h1>
  <p>This is the pattern for 90% of readable content pages.</p>
  <p>Text stays at optimal width. Container is centered. Perfect.</p>
</div>
```
**Why this is the default for articles**:
- `width-line` = ~42rem = 60-75 characters per line
- `margin-inline-auto` = centers the container
- `padding-base` = breathing room on mobile

**Use this for**: Blog posts, docs, about pages, terms of service, privacy policies, landing page content.

---

## Colors (Semantic)

```html
<!-- Muted text (secondary info, less important) -->
<p class="muted">Secondary text</p>
<!-- Usage: Timestamps, descriptions, helper text -->

<!-- Subtle text (even less emphasis) -->
<p class="subtle">Tertiary text</p>
<!-- Usage: Captions, footnotes, legal text -->

<!-- Accent color (calls attention) -->
<span class="accent">Highlighted text</span>
<!-- Usage: Links, important labels, CTAs -->

<!-- Secondary background (panels, cards, sections) -->
<div class="background-secondary padding-base">
  Panel with subtle background
</div>
<!-- Usage: Distinguishing sections without adding borders -->
```

**Color hierarchy** (from strongest to weakest):
1. **Accent** — Primary actions, important info
2. **Foreground** — Default text (no class needed)
3. **Muted** — Secondary text (60% opacity mix)
4. **Subtle** — Tertiary text (40% opacity mix)

**Rule of thumb**: If you're using more than 2 levels of text color on one screen, you're probably over-designing. Keep it simple.

---

## Visibility (The Useful Ones)

```html
<!-- Hide from everyone (display: none) -->
<div class="hidden">Gone completely</div>
<!-- Why: When you want something to not exist in the layout -->

<!-- Show only to screen readers (accessibility win) -->
<span class="visually-hidden">
  Additional context for screen reader users
</span>
<!-- Why: Adds helpful info for blind users without cluttering visual design.
     Example: "Opens in new tab" after external links -->

<!-- Flex display (YOU FORGET TO ADD THIS) -->
<div class="flex gap-base">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
<!-- Why: gap only works on flex/grid containers. This enables gap. -->
```

**Common use case for `.visually-hidden`**:
```html
<a href="https://external.com" target="_blank">
  Read more
  <span class="visually-hidden">Opens in new tab</span>
</a>
```

Screen reader announces: "Read more, opens in new tab"
Sighted users see: "Read more"

---

## Responsive (Mobile-First)

```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="grid">
  <div class="col-12 col-lg-6">Left</div>
  <div class="col-12 col-lg-6">Right</div>
</div>
<!-- Reads: Always full-width (col-12), but 6-columns on large screens (≥1024px) -->

<!-- Hide on mobile (show on desktop only) -->
<div class="sm-hidden">Desktop navigation</div>
<!-- Why: Complex navigation doesn't fit mobile. Show burger menu instead. -->

<!-- Show only on mobile (hide on desktop) -->
<button class="sm-only">☰ Menu</button>
<!-- Why: Mobile users need a menu button. Desktop has room for full nav. -->

<!-- Reduce spacing on mobile -->
<section class="padding-xl padding-sm-base">
  <!-- Desktop: 4rem padding. Mobile: 1rem padding -->
</section>
<!-- Why: Small screens can't afford huge margins. Conserve space. -->
```

**Breakpoints**:
- `sm` = Small (mobile, ≤768px)
- `lg` = Large (desktop, ≥1024px)

**Mobile-first philosophy**: Start with mobile layout (col-12), enhance for desktop (col-lg-6). This is why `.col-12` comes first.

---

## Common Fixes (Save These)

### Remove Default List Styling

```html
<ul class="margin-0 padding-0" style="list-style: none;">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```
**Why**: Browsers add margin, padding, and bullets to `<ul>`. This kills all of it for custom styled lists (navigation, card grids, etc).

**Alternative**: Use `.no-bullet` utility if you have it defined.

---

### Remove Button Styling

```html
<button class="padding-0 margin-0"
        style="background: none; border: none; cursor: pointer;">
  Unstyled button
</button>
```
**Why**: Native `<button>` elements have browser styling. This resets it so you can style from scratch. Common for icon buttons, text buttons, custom controls.

---

### Full-Width Section (edge-to-edge background)

```html
<section class="width-full padding-base background-secondary">
  Edge-to-edge background, but text still has padding
</section>
```
**Why**: `width-full` breaks out of centered containers. Useful for alternating background sections on landing pages.

---

### Tight Spacing (compact UI, dense layouts)

```html
<div class="padding-xs gap-xs">
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```
**Why**: Default spacing (1rem) is too generous for toolbars, inline buttons, compact cards. Use `xs` (0.5rem) for tighter layouts.

---

## Size Scale (Memorize These 5)

| Size | Usage | Value | When to use |
|------|-------|-------|-------------|
| `xs` | Tiny gaps, compact UI | ~0.5rem | Button groups, inline icons |
| `s` | Small spacing | ~0.75rem | Form fields, card padding |
| `base` | **Normal spacing** | ~1rem | Default gaps, standard rhythm |
| `l` | Section spacing | ~2rem | Between major sections |
| `xl` | Page spacing | ~4rem | Hero sections, page margins |

**Pattern**: `margin-top-base`, `padding-left-xs`, `gap-l`

**Mental model**: `base` is your default. Go smaller for UI density, larger for white space emphasis.

**Most common mistake**: Using `padding-xl` on small cards. Start with `base`, adjust down/up as needed.

---

## Inspector Quick Reference

### What is the Inspector?
The Inspector is Standard's built-in design tool. Open it with `Shift + Cmd/Ctrl + D` to:
- **Edit design tokens** (colors, fonts, spacing) in real-time
- **Toggle debug mode** to see baseline grid and layout zones
- **Export CSS** of your changes
- **Switch themes** instantly

### When to use it:
- **Debugging rhythm issues** — Turn on debug mode to see if elements align to baseline
- **Trying different fonts** — Load Google Fonts on the fly
- **Adjusting colors** — See color changes immediately without rebuilding
- **Client presentations** — Toggle between themes live in a meeting

### Toggle Debug Mode
Shows baseline grid, grid columns, rhythm spacing overlays

**Shortcut**: `Shift + Cmd/Ctrl + S`

**What it shows**:
- Horizontal baseline grid (shows your vertical rhythm)
- Grid column overlays (visualizes 12-column system)
- Element spacing indicators (margin-bottom values)

**When to use**: Your layout feels "off" but you can't tell why. Debug mode reveals misalignments instantly.

---

## Pro Tips (The Non-Obvious Stuff)

### Combine utilities (no custom CSS needed)

```html
<!-- DON'T write custom CSS -->
<div style="padding: 1rem; margin-bottom: 2rem; text-align: center;">

<!-- DO combine utilities -->
<div class="padding-base margin-bottom-l center">
```
**Why**: Utilities are self-documenting. Six months later, `padding-base` still makes sense. `padding: 1rem` requires you to remember your spacing scale.

---

### Use `margin-inline-auto` to center block elements

```html
<div class="width-line margin-inline-auto">
  Centered container
</div>
```
**Why**: `margin-inline: auto` is semantic (works in RTL languages), shorter than `margin-left: auto; margin-right: auto`, and self-documenting.

---

### Use `gap-base` instead of margin on children

```html
<!-- DON'T do this -->
<div class="flex">
  <button class="margin-right-base">Button 1</button>
  <button class="margin-right-base">Button 2</button>
  <button>Button 3</button> <!-- Last one has no margin -->
</div>

<!-- DO this -->
<div class="flex gap-base">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>
```
**Why**: Gap is cleaner, works on all children automatically, doesn't create edge spacing issues.

---

### Remember `.uppercase` includes letter-spacing

```html
<!-- DON'T manually uppercase in HTML -->
<span style="text-transform: uppercase; letter-spacing: 0.05em;">Label</span>

<!-- DO use the utility -->
<span class="uppercase">Label</span>
```
**Why**: Uppercase text without letter-spacing is hard to read. The utility adds 0.05em automatically.

---

### Use reading widths for articles

```html
<article class="width-line margin-inline-auto">
  <h1>Article Title</h1>
  <p>Readable content stays within 60-75 characters per line...</p>
</article>
```
**Why**: Research shows optimal readability at 60-75 characters per line. `width-line` (~42rem) achieves this at default font size.

---

## Common Mistakes (Learn From Others' Pain)

### Forgetting to add `display: flex`

```html
<!-- DOESN'T WORK -->
<div class="gap-base">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
<!-- Gap requires flex or grid display -->

<!-- WORKS -->
<div class="flex gap-base">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

### Using `width-full` without understanding container context

```html
<!-- Breaks out of parent container (usually not what you want) -->
<div class="width-line">
  <div class="width-full">This is now 100vw, ignoring parent!</div>
</div>
```

---

### Adding inline styles when utilities exist

```html
<!-- DON'T -->
<div style="max-width: 42rem; margin: 0 auto;">

<!-- DO -->
<div class="width-line margin-inline-auto">
```

---

### Forgetting `.col-sm-12` for responsive cards

```html
<!-- Cards won't stack on mobile -->
<div class="grid">
  <div class="col-4">Card</div>
  <div class="col-4">Card</div>
  <div class="col-4">Card</div>
</div>

<!-- Cards stack properly on mobile -->
<div class="grid">
  <div class="col-4 col-sm-12">Card</div>
  <div class="col-4 col-sm-12">Card</div>
  <div class="col-4 col-sm-12">Card</div>
</div>
```

---

## Remember

**The Pattern**: `[property]-[side]-[size]`

```
margin-top-base
  ↓      ↓    ↓
property side size
```

If you forget a class name, **the pattern tells you what it should be**.

**99% of what you need is on this page.** 🎯

The other 1%? Check the [full utilities guide](/css/utilities/).

---

**Bookmark this page** (Cmd+D / Ctrl+D) and keep it open while coding.
**Print it** (Cmd+P / Ctrl+P) for a physical reference card.
