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

### Simple Grid (default 12 columns)

```html
<div class="grid">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Grid with Columns

**3 equal columns:**
<div class="grid">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

**4 equal columns:**
<div class="grid">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>

## Responsive Columns

Change number of columns at different breakpoints:

**Mobile: 1 column | Tablet: 2 columns | Desktop: 3 columns**
<div class="sm:grid-1 grid-2 lg:grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

```html
<div class="sm:grid-1 grid-2 lg:grid-3">
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
<div class="grid-sidebar">
  <div>
    <strong>Main Content</strong>
    <p>Spans 2 columns</p>
  </div>
  <div style="text-align: center;">
    <strong>Sidebar</strong>
    <p>Spans 1 column</p>
  </div>
</div>

```html
<!-- Main content spans 2 columns, sidebar 1 column -->
<div class="grid-sidebar">
  <article>
    <h1>Main Content</h1>
  </article>
  <aside>
    <h3>Sidebar</h3>
  </aside>
</div>
```

### Responsive Spanning

**Mobile: Full width | Desktop: 2-column content + sidebar:**
<div class="grid-sidebar">
  <div class="col-sm-row">
    <strong>Main Content</strong>
    <p>Mobile: full width</p>
  </div>
  <div class="col-sm-row">
    <strong>Sidebar</strong>
    <p>Mobile: full width below</p>
  </div>
</div>

```html
<!--
  Mobile: spans full width (1 col)
  Desktop: main spans 2 of 3, sidebar spans 1
-->
<div class="grid-sidebar">
  <article class="sm:col-row">
    Main content
  </article>
  <aside class="sm:col-row">
    Sidebar
  </aside>
</div>

<!-- On large screens, use: -->
```

## Common Layouts

### Single Column (Full Width)

**Full-width layout:**
<div>
  <div>
    <strong>Full Width Article</strong>
    <p>Content spans the full width of the container</p>
  </div>
</div>

```html
<div class="grid">
  <article>
    <h1>Full Width Article</h1>
    <p>Content spans the full width</p>
  </article>
</div>
```

### Two Column

**Equal columns:**
<div class="grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

**2:1 ratio (wider left):**
<div>
  <div>Wide column</div>
  <div>Narrow</div>
</div>

```html
<!-- Equal columns -->
<div class="grid">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 2:1 ratio (wider left) -->
<div class="grid">
  <div>Wide column</div>
  <div>Narrow column</div>
</div>
```

### Three Column

**Three equal columns:**
<div class="grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

**With sidebar layout:**
<div class="grid-sidebar">
  <div>
    Wide main content
  </div>
  <div>
    Sidebar
  </div>
</div>

```html
<!-- Three equal columns -->
<div class="grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Or with sidebar layout -->
<div class="grid-sidebar">
  <article>Wide main content</article>
  <aside>Sidebar</aside>
</div>
```

### Card Grid

**Responsive card layout (hover effect visualization):**
<div class="grid-3">
  <div class="card">
    <strong>Card 1</strong>
    <p>Card content here</p>
  </div>
  <div class="card">
    <strong>Card 2</strong>
    <p>Card content here</p>
  </div>
  <div class="card">
    <strong>Card 3</strong>
    <p>Card content here</p>
  </div>
</div>

```html
<!-- Responsive card grid -->
<div class="grid-3">
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
<div class="grid compact">
  <div style="text-align: center;">Item 1</div>
  <div style="text-align: center;">Item 2</div>
</div>

**Medium gap (1rem):**
<div class="grid">
  <div style="text-align: center;">Item 1</div>
  <div style="text-align: center;">Item 2</div>
</div>

**Large gap (2rem):**
<div class="grid relaxed {
">
  <div style="text-align: center;">Item 1</div>
  <div style="text-align: center;">Item 2</div>
</div>

```html
<!-- Small gap -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Medium gap -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Large gap -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Responsive Gap

**Small gap on mobile (0.5rem), larger gap on larger screens (1.5rem):**
<div style="grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
  <div style="text-align: center;">Item 1</div>
  <div style="text-align: center;">Item 2</div>
</div>

```html
<!-- Small gap mobile, larger gap on desktop -->
<div class="grid">
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
<div class="grid" style="justify-items: start;">
  <div style="text-align: center;">Item</div>
  <div style="text-align: center;">Item</div>
</div>

**Items end at right:**
<div class="grid" style="justify-items: end;">
  <div style="text-align: center;">Item</div>
  <div style="text-align: center;">Item</div>
</div>

**Items centered:**
<div class="grid" style="justify-items: center;">
  <div style="text-align: center;">Item</div>
  <div style="text-align: center;">Item</div>
</div>

**Items spaced evenly:**
<div class="grid" style="justify-items: stretch;">
  <div style="text-align: center;">Item 1</div>
  <div style="text-align: center;">Item 2</div>
  <div style="text-align: center;">Item 3</div>
</div>

```html
<!-- Items start at left -->
<div class="grid" style="justify-items: start;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items end at right -->
<div class="grid" style="justify-items: end;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items centered -->
<div class="grid" style="justify-items: center;">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items spaced evenly -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Vertical Alignment

**Items align to top:**
<div class="grid" style="align-items: start;">
  <div style="text-align: center;">Top</div>
  <div style="text-align: center;">Top</div>
  <div style="text-align: center;">Top</div>
</div>

**Items align to center:**
<div class="grid" style="align-items: center;">
  <div style="text-align: center;">Center</div>
  <div style="text-align: center;">Center</div>
  <div style="text-align: center;">Center</div>
</div>

**Items align to bottom:**
<div class="grid" style="align-items: end;">
  <div style="text-align: center;">Bottom</div>
  <div style="text-align: center;">Bottom</div>
  <div style="text-align: center;">Bottom</div>
</div>

```html
<!-- Items align to top -->
<div class="grid" style="align-items: start;">
  <div>Top</div>
  <div>Top</div>
  <div>Top</div>
</div>

<!-- Items align to center -->
<div class="grid" style="align-items: center;">
  <div>Center</div>
  <div>Center</div>
  <div>Center</div>
</div>

<!-- Items align to bottom -->
<div class="grid" style="align-items: end;">
  <div>Bottom</div>
  <div>Bottom</div>
  <div>Bottom</div>
</div>
```

## Real-World Examples

### Blog Layout

**Main content (3 columns) + Sidebar (1 column):**
<div>
  <div>
    <strong>Main Content</strong>
    <p>Blog post title and content</p>
  </div>
  <div>
    <strong>Sidebar</strong>
    <p>Recent posts</p>
  </div>
</div>

```html
<div class="grid">
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
<div>
  <div>
    <strong>Featured Project</strong>
    <p>Full-width hero image and project title</p>
  </div>
  <div>
    <strong>Project 1</strong>
    <p>Portfolio item</p>
  </div>
  <div>
    <strong>Project 2</strong>
    <p>Portfolio item</p>
  </div>
  <div>
    <strong>Project 3</strong>
    <p>Portfolio item</p>
  </div>
</div>

```html
<div class="grid">
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
<div>
  <div>
    <strong>Total Users</strong>
    <p>1,234</p>
  </div>
  <div>
    <strong>Active</strong>
    <p>567</p>
  </div>
  <div>
    <strong>Inactive</strong>
    <p>667</p>
  </div>
</div>

```html
<div class="grid">
  <!-- Large stat card spans 2 columns -->
  <div>
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
<div>
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
