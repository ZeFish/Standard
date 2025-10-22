---
title: Grid System
layout: article
eleventyNavigation:
  key: Grid
  parent: CSS Framework
  title: Grid System
permalink: /css/grid/
---

# Grid System

Build responsive layouts with a flexible, mobile-first grid system.

## Philosophy

Standard Framework uses **CSS Grid** with intuitive column classes for modern, responsive layouts. Mobile-first approach means you design for mobile first, then enhance for larger screens.

### Key Principles

- **Mobile-first** - Base styles for mobile, enhance with breakpoints
- **Flexible** - From 1 to 12 columns
- **Responsive** - Breakpoints for all screen sizes
- **Simple** - Intuitive class names
- **Semantic** - Works with standard HTML

## Basic Grid

### Simple Grid

```html
<div class="grid">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Grid with Columns

```html
<!-- 3 equal columns -->
<div class="grid grid-cols-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- 4 equal columns -->
<div class="grid grid-cols-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>
```

## Responsive Columns

Change number of columns at different breakpoints:

```html
<!-- 
  Mobile: 1 column
  Tablet (480px+): 2 columns
  Desktop (1024px+): 3 columns
-->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

```html
<!-- Main content spans 2 columns, sidebar 1 column -->
<div class="grid grid-cols-3">
  <article class="col-span-2">
    <h1>Main Content</h1>
    <!-- ... -->
  </article>
  <aside>
    <h3>Sidebar</h3>
  </aside>
</div>
```

### Responsive Spanning

```html
<!-- 
  Mobile: spans full width (3 cols)
  Desktop: spans 2 of 3 columns
-->
<div class="grid grid-cols-3">
  <article class="col-span-3 lg:col-span-2">
    Main content
  </article>
  <aside class="col-span-3 lg:col-span-1">
    Sidebar
  </aside>
</div>
```

## Common Layouts

### Single Column (Full Width)

```html
<div class="grid grid-cols-1">
  <article>
    <h1>Full Width Article</h1>
    <p>Content spans the full width</p>
  </article>
</div>
```

### Two Column

```html
<!-- Equal columns -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 2:1 ratio (wider left) -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">Wide column</div>
  <div>Narrow column</div>
</div>
```

### Three Column

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Or with sidebar layout -->
<div class="grid grid-cols-3 gap-4">
  <article class="col-span-2">Wide main content</article>
  <aside>Sidebar</aside>
</div>
```

### Card Grid

```html
<!-- Responsive card grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

```html
<!-- Small gap (0.5rem) -->
<div class="grid grid-cols-2 gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Medium gap (1rem) -->
<div class="grid grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Large gap (2rem) -->
<div class="grid grid-cols-2 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Responsive Gap

```html
<!-- Small gap mobile, larger gap on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
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

```html
<!-- Items start at left -->
<div class="grid grid-cols-3 justify-start gap-4">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items end at right -->
<div class="grid grid-cols-3 justify-end gap-4">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items centered -->
<div class="grid grid-cols-3 justify-center gap-4">
  <div>Item</div>
  <div>Item</div>
</div>

<!-- Items spaced evenly -->
<div class="grid grid-cols-3 justify-between gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Vertical Alignment

```html
<!-- Items align to top -->
<div class="grid grid-cols-3 items-start gap-4">
  <div>Top</div>
  <div>Top</div>
  <div>Top</div>
</div>

<!-- Items align to center -->
<div class="grid grid-cols-3 items-center gap-4" style="min-height: 200px;">
  <div>Center</div>
  <div>Center</div>
  <div>Center</div>
</div>

<!-- Items align to bottom -->
<div class="grid grid-cols-3 items-end gap-4">
  <div>Bottom</div>
  <div>Bottom</div>
  <div>Bottom</div>
</div>
```

## Real-World Examples

### Blog Layout

```html
<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <!-- Main content spans 3 columns -->
  <main class="lg:col-span-3">
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

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Featured project spans full width -->
  <div class="col-span-1 md:col-span-2 lg:col-span-3">
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
</div>
```

### Dashboard

```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <!-- Large stat card spans 2 columns -->
  <div class="col-span-1 md:col-span-2">
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
