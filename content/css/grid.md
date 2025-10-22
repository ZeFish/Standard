---
title: Grid System

eleventyNavigation:
  key: Grid
  parent: CSS Framework
  title: Grid System
permalink: /css/grid/
---

# Grid System

Build responsive layouts with flexible CSS Grid. Mobile-first approach with automatic responsive columns and proper spacing.

## Quick Navigation

- **[Typography System](/css/typography/)** - Font scales, sizes, and weights
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Prose System](/css/prose/)** - Readable article layouts
- **[Colors](/css/colors/)** - Text and background colors
- **[Utilities](/css/utilities/)** - Helper classes for common patterns

## Basic Grid

### Simple Grid

```html
<div class="display-grid gap-base" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">Column 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">Column 3</div>
</div>
```

### Grid with Columns

**3 equal columns:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 3</div>
</div>

**4 equal columns:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(4, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 3</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 4</div>
</div>

## Responsive Columns

Change number of columns at different breakpoints:

**Mobile: 1 column | Tablet: 2 columns | Desktop: 3 columns**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 3</div>
</div>

```html
<div class="display-grid gap-base" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Breakpoint Prefixes

| Prefix | Breakpoint | Screen Size |
|--------|-----------|-------------|
| (none) | Default | Mobile (< 480px) |
| `md:` | Small | 480px+ |
| `lg:` | Large | 1024px+ |
| `xl:` | Wide | 1440px+ |

## Column Spanning

Make items span multiple columns:

**2-column main content + 1-column sidebar layout:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 2;">
    <strong>Main Content</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Spans 2 columns</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">
    <strong>Sidebar</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Spans 1 column</p>
  </div>
</div>

```html
<!-- Main content spans 2 columns, sidebar 1 column -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <article style="grid-column: span 2;">
    <h1>Main Content</h1>
  </article>
  <aside>
    <h3>Sidebar</h3>
  </aside>
</div>
```

### Responsive Spanning

**Mobile: Full width | Desktop: 2-column content + sidebar:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: 1fr;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Main Content</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Mobile: full width</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Sidebar</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Mobile: full width below</p>
  </div>
</div>

```html
<!--
  Mobile: spans full width (1 col)
  Desktop: main spans 2 of 3, sidebar spans 1
-->
<div class="display-grid gap-base" style="grid-template-columns: 1fr;">
  <article style="grid-column: span 1;">
    Main content
  </article>
  <aside style="grid-column: span 1;">
    Sidebar
  </aside>
</div>

<!-- On large screens, use: style="grid-template-columns: repeat(3, 1fr);" -->
```

## Common Layouts

### Single Column (Full Width)

**Full-width layout:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: 1fr;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Full Width Article</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Content spans the full width of the container</p>
  </div>
</div>

```html
<div class="display-grid" style="grid-template-columns: 1fr;">
  <article>
    <h1>Full Width Article</h1>
    <p>Content spans the full width</p>
  </article>
</div>
```

### Two Column

**Equal columns:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(2, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 2</div>
</div>

**2:1 ratio (wider left):**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 2;">Wide column</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">Narrow</div>
</div>

```html
<!-- Equal columns -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(2, 1fr);">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 2:1 ratio (wider left) -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <div style="grid-column: span 2;">Wide column</div>
  <div>Narrow column</div>
</div>
```

### Three Column

**Three equal columns:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Column 3</div>
</div>

**With sidebar layout:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 2;">
    <strong>Wide main content</strong>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Sidebar</strong>
  </div>
</div>

```html
<!-- Three equal columns -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Or with sidebar layout -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <article style="grid-column: span 2;">Wide main content</article>
  <aside>Sidebar</aside>
</div>
```

### Card Grid

**Responsive card layout (hover effect visualization):**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Card 1</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Card content here</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Card 2</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Card content here</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Card 3</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Card content here</p>
  </div>
</div>

```html
<!-- Responsive card grid -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="card">
    <h3>Card 1</h3>
    <p>Card content</p>
  </div>
  <div class="card">
    <h3>Card 2</h3>
    <p>Card content</p>
  </div>
  <div class="card">
    <h3>Card 3</h3>
    <p>Card content</p>
  </div>
</div>
```

## Gap (Spacing Between Items)

Control space between grid items:

**Small gap (0.5rem):**
<div class="display-grid margin-bottom-base" style="grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 2</div>
</div>

**Medium gap (1rem):**
<div class="display-grid margin-bottom-base" style="grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 2</div>
</div>

**Large gap (2rem):**
<div class="display-grid margin-bottom-base" style="grid-template-columns: repeat(2, 1fr); gap: 2rem;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 2</div>
</div>

```html
<!-- Small gap -->
<div class="display-grid" style="grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Medium gap -->
<div class="display-grid" style="grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Large gap -->
<div class="display-grid" style="grid-template-columns: repeat(2, 1fr); gap: 2rem;">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Responsive Gap

**Small gap on mobile (0.5rem), larger gap on larger screens (1.5rem):**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 2</div>
</div>

```html
<!-- Small gap mobile, larger gap on desktop -->
<div class="display-grid" style="grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
  <!-- On larger screens, change gap to: gap: 1.5rem; -->
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Row Span

Make items span multiple rows (less common):

```html
<div class="grid grid-cols-3 auto-rows-max gap-4">
  <div class="row-span-2">Tall item</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

## Alignment

### Horizontal Alignment

**Items start at left:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: start;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
</div>

**Items end at right:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: end;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
</div>

**Items centered:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: center;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item</div>
</div>

**Items spaced evenly:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 1fr); justify-items: stretch;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 1</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 2</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Item 3</div>
</div>

```html
<!-- Items start at left -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: start;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items end at right -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: end;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items centered -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 100px); justify-items: center;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items spaced evenly -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Vertical Alignment

**Items align to top:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: start; min-height: 150px;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Top</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Top</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Top</div>
</div>

**Items align to center:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: center; min-height: 150px;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Center</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Center</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Center</div>
</div>

**Items align to bottom:**
<div class="display-grid margin-bottom-base gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: end; min-height: 150px;">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Bottom</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Bottom</div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; text-align: center;">Bottom</div>
</div>

```html
<!-- Items align to top -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: start; min-height: 150px;">
  <div>Top</div>
  <div>Top</div>
  <div>Top</div>
</div>

<!-- Items align to center -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: center; min-height: 150px;">
  <div>Center</div>
  <div>Center</div>
  <div>Center</div>
</div>

<!-- Items align to bottom -->
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr); align-items: end; min-height: 150px;">
  <div>Bottom</div>
  <div>Bottom</div>
  <div>Bottom</div>
</div>
```

## Real-World Examples

### Blog Layout

**Main content (3 columns) + Sidebar (1 column):**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(4, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 3;">
    <strong>Main Content</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Blog post title and content</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Sidebar</strong>
    <p style="margin-top: 0.5rem; font-size: 0.75rem;">Recent posts</p>
  </div>
</div>

```html
<div class="display-grid gap-base" style="grid-template-columns: repeat(4, 1fr);">
  <!-- Main content spans 3 columns -->
  <main style="grid-column: span 3;">
    <article>
      <h1>Blog Post Title</h1>
      <p>Post content goes here...</p>
    </article>
  </main>

  <!-- Sidebar 1 column -->
  <aside>
    <h3>Recent Posts</h3>
    <ul>
      <li><a href="#">Post 1</a></li>
      <li><a href="#">Post 2</a></li>
    </ul>
  </aside>
</div>
```

### Portfolio Grid

**Featured project spans full width, regular items below:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(3, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 3;">
    <strong>Featured Project</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Full-width hero image and project title</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Project 1</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Portfolio item</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Project 2</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Portfolio item</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Project 3</strong>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Portfolio item</p>
  </div>
</div>

```html
<div class="display-grid gap-base" style="grid-template-columns: repeat(3, 1fr);">
  <!-- Featured project spans full width -->
  <div style="grid-column: span 3;">
    <img src="/hero-project.jpg" alt="Featured Project">
    <h2>Featured Project</h2>
  </div>

  <!-- Regular portfolio items -->
  <div class="card">
    <img src="/project-1.jpg" alt="Project 1">
    <h3>Project 1</h3>
  </div>
  <div class="card">
    <img src="/project-2.jpg" alt="Project 2">
    <h3>Project 2</h3>
  </div>
  <div class="card">
    <img src="/project-3.jpg" alt="Project 3">
    <h3>Project 3</h3>
  </div>
</div>
```

### Dashboard

**Large stat card (2 columns) + smaller stat cards (1 column each):**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: repeat(4, 1fr);">
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem; grid-column: span 2;">
    <strong>Total Users</strong>
    <p style="margin-top: 0.5rem; font-size: 1.5rem; font-weight: bold;">1,234</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Active</strong>
    <p style="margin-top: 0.5rem; font-size: 1.25rem;">567</p>
  </div>
  <div class="background-color-secondary padding-base border-color-default" style="border: 1px solid; border-radius: 0.5rem;">
    <strong>Inactive</strong>
    <p style="margin-top: 0.5rem; font-size: 1.25rem;">667</p>
  </div>
</div>

```html
<div class="display-grid gap-base" style="grid-template-columns: repeat(4, 1fr);">
  <!-- Large stat card spans 2 columns -->
  <div style="grid-column: span 2;">
    <div class="card">
      <h3>Total Users</h3>
      <p class="text-3xl">1,234</p>
    </div>
  </div>

  <!-- Regular stat cards -->
  <div class="card">
    <h3>Active</h3>
    <p class="text-2xl">567</p>
  </div>
  <div class="card">
    <h3>Inactive</h3>
    <p class="text-2xl">667</p>
  </div>
</div>
```

## CSS Grid vs Flexbox

### Use Grid For:
- Page layouts
- Two-dimensional layouts
- Complex layouts with rows and columns
- Spanning items across multiple cells

### Use Flexbox For:
- One-dimensional layouts
- Navigation menus
- Button groups
- Quick alignment

## Auto-fill and Auto-fit

Create responsive grids without media queries:

```html
<!-- Responsive without breakpoints -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
  <!-- More cards automatically wrap -->
</div>
```

## See Also

- **[API Reference](/docs/grid-system/)** - Complete grid documentation
- **[Spacing & Rhythm](/css/spacing/)** - Grid gap and spacing
- **[Components](/css/buttons/)** - Components within grids
- **[Typography](/css/typography/)** - Text within grid items

---

Master layout design with grids. [Learn spacing and rhythm](/css/spacing/)
