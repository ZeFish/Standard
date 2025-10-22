---
title: Components
layout: article
eleventyNavigation:
  key: Components
  parent: CSS Framework
  title: Components
permalink: /css/buttons/
---

# Components

Styled components that work perfectly with the Standard Framework design system.

## Buttons

Professional, accessible buttons with semantic meaning.

### Button Styles

#### Primary Button

```html
<button class="btn btn-primary">
  Primary Action
</button>
```

- **Color**: Accent color
- **Usage**: Main action on the page
- **Contrast**: WCAG AAA

#### Secondary Button

```html
<button class="btn btn-secondary">
  Secondary Action
</button>
```

- **Color**: Outlined with accent
- **Usage**: Alternative action
- **Style**: Hollow/outlined

#### Success Button

```html
<button class="btn btn-success">
  ✓ Confirm
</button>
```

- **Color**: Green (success semantic)
- **Usage**: Positive actions (save, confirm)
- **Meaning**: Approval

#### Warning Button

```html
<button class="btn btn-warning">
  ⚠ Caution
</button>
```

- **Color**: Orange/gold
- **Usage**: Cautionary actions
- **Meaning**: Requires attention

#### Danger Button

```html
<button class="btn btn-danger">
  ✕ Delete
</button>
```

- **Color**: Red (error semantic)
- **Usage**: Destructive actions
- **Meaning**: Permanent action

#### Ghost Button

```html
<button class="btn btn-ghost">
  Learn More
</button>
```

- **Style**: Transparent, text only
- **Usage**: Tertiary actions
- **Styling**: Minimal

### Button Sizes

```html
<!-- Small button -->
<button class="btn btn-primary btn-sm">
  Small
</button>

<!-- Default button -->
<button class="btn btn-primary">
  Default
</button>

<!-- Large button -->
<button class="btn btn-primary btn-lg">
  Large
</button>

<!-- Extra large button -->
<button class="btn btn-primary btn-xl">
  Extra Large
</button>
```

### Button States

#### Hover

```html
<button class="btn btn-primary">
  Hover me
</button>
<!-- Automatically enhanced with darker shade -->
```

#### Focus (Keyboard)

```html
<button class="btn btn-primary">
  Tab to focus
</button>
<!-- Visible focus ring for accessibility -->
```

#### Active

```html
<button class="btn btn-primary active">
  Active
</button>
<!-- Shows pressed state -->
```

#### Disabled

```html
<button class="btn btn-primary" disabled>
  Disabled
</button>
<!-- Grayed out, not clickable -->
```

#### Loading

```html
<button class="btn btn-primary is-loading">
  <span class="spinner"></span> Loading...
</button>
```

### Button Widths

```html
<!-- Default width (auto) -->
<button class="btn btn-primary">
  Normal width
</button>

<!-- Full width -->
<button class="btn btn-primary w-full">
  Full Width Button
</button>

<!-- Block-level -->
<button class="btn btn-primary block">
  Block button
</button>
```

### Button Groups

Group related buttons:

```html
<!-- Horizontal button group -->
<div class="button-group">
  <button class="btn btn-primary">Left</button>
  <button class="btn btn-primary">Center</button>
  <button class="btn btn-primary">Right</button>
</div>

<!-- Vertical button group -->
<div class="button-group vertical">
  <button class="btn btn-primary">Top</button>
  <button class="btn btn-primary">Middle</button>
  <button class="btn btn-primary">Bottom</button>
</div>
```

### Button with Icon

```html
<!-- Icon left -->
<button class="btn btn-primary">
  <span class="icon">↓</span>
  Download
</button>

<!-- Icon right -->
<button class="btn btn-primary">
  Learn More
  <span class="icon">→</span>
</button>

<!-- Icon only -->
<button class="btn btn-icon" title="Settings">
  ⚙
</button>
```

## Links as Buttons

Style links to look like buttons:

```html
<!-- Link button -->
<a href="/page" class="btn btn-primary">
  Go to Page
</a>

<!-- Different variants -->
<a href="/page" class="btn btn-secondary">Secondary</a>
<a href="/page" class="btn btn-success">Confirm</a>
```

## Form Elements

Basic form styling integrated with the design system.

### Text Inputs

```html
<input type="text" placeholder="Enter text...">
<input type="email" placeholder="Your email...">
<input type="password" placeholder="Password...">
```

### Textareas

```html
<textarea placeholder="Your message..."></textarea>
```

### Select/Dropdown

```html
<select>
  <option>Choose an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkboxes

```html
<label>
  <input type="checkbox"> Option 1
</label>
<label>
  <input type="checkbox"> Option 2
</label>
```

### Radio Buttons

```html
<label>
  <input type="radio" name="choice"> Option A
</label>
<label>
  <input type="radio" name="choice"> Option B
</label>
```

### Form Layout

```html
<form class="form">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Your name">
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="Your email">
  </div>

  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" placeholder="Your message"></textarea>
  </div>

  <button type="submit" class="btn btn-primary">
    Send
  </button>
</form>
```

## Alerts

Visual notifications and feedback.

### Success Alert

```html
<div class="alert alert-success">
  <h3>Success!</h3>
  <p>Your changes have been saved.</p>
</div>
```

### Warning Alert

```html
<div class="alert alert-warning">
  <h3>Warning</h3>
  <p>Please review this information carefully.</p>
</div>
```

### Error Alert

```html
<div class="alert alert-error">
  <h3>Error</h3>
  <p>Something went wrong. Please try again.</p>
</div>
```

### Info Alert

```html
<div class="alert alert-info">
  <h3>Information</h3>
  <p>Here's something you should know.</p>
</div>
```

## Cards

Container for grouped content.

```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>

  <div class="card-body p-4">
    <p>Card content goes here</p>
  </div>

  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Card Variations

```html
<!-- Card with image -->
<div class="card">
  <img src="/image.jpg" alt="Image" class="card-image">
  <div class="card-body">
    <h3>Title</h3>
    <p>Content</p>
  </div>
</div>

<!-- Minimal card -->
<div class="card">
  <h3>Simple Card</h3>
  <p>Just content, no extra padding</p>
</div>

<!-- Interactive card (hover effect) -->
<a href="/link" class="card card-interactive">
  <h3>Clickable Card</h3>
  <p>Click to navigate</p>
</a>
```

## Badge

Small label or status indicator.

```html
<!-- Default badge -->
<span class="badge">Label</span>

<!-- Success -->
<span class="badge badge-success">Active</span>

<!-- Warning -->
<span class="badge badge-warning">Pending</span>

<!-- Error -->
<span class="badge badge-error">Error</span>

<!-- Info -->
<span class="badge badge-info">Info</span>
```

## Tags/Pills

Similar to badges but more interactive.

```html
<span class="tag">JavaScript</span>
<span class="tag">CSS</span>
<span class="tag">Design</span>

<!-- With close button -->
<span class="tag">
  Topic
  <button class="tag-close">&times;</button>
</span>
```

## Breadcrumb

Navigation aid showing hierarchy.

```html
<nav class="breadcrumb">
  <a href="/">Home</a>
  <span class="separator">/</span>
  <a href="/docs">Documentation</a>
  <span class="separator">/</span>
  <span class="current">Components</span>
</nav>
```

## Pagination

Navigation for multi-page content.

```html
<nav class="pagination">
  <a href="/page/1" class="prev">← Previous</a>
  
  <a href="/page/1">1</a>
  <a href="/page/2">2</a>
  <span class="current">3</span>
  <a href="/page/4">4</a>
  <a href="/page/5">5</a>

  <a href="/page/5" class="next">Next →</a>
</nav>
```

## Tooltip

Helpful information on hover.

```html
<button class="btn" data-tooltip="Save your work">
  Save
</button>

<!-- With position -->
<button class="btn" data-tooltip="Save your work" data-tooltip-position="top">
  Save
</button>
```

## Progress Bar

Show progress of a task.

```html
<!-- 60% complete -->
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
</div>

<!-- With label -->
<div class="progress">
  <div class="progress-bar" style="width: 60%">
    <span class="progress-label">60%</span>
  </div>
</div>

<!-- Animated -->
<div class="progress">
  <div class="progress-bar progress-animated" style="width: 60%"></div>
</div>
```

## Best Practices

### ✓ Do

- Use semantic button types (primary, secondary, danger)
- Provide clear, actionable button text
- Use `type="button"` on non-form buttons
- Make buttons large enough to tap (min 44px)
- Ensure sufficient color contrast
- Test keyboard navigation
- Use disabled state for unavailable actions

### ✗ Don't

- Use color alone for meaning (combine with text/icons)
- Create buttons with inconsistent styling
- Make button text ambiguous
- Disable buttons without reason
- Use too many button styles on one page
- Forget about focus states
- Make buttons too small

## See Also

- **[Button Component API](/docs/button-component/)** - Complete button documentation
- **[Colors](/css/colors/)** - Button color semantics
- **[Typography](/css/typography/)** - Button text styling
- **[Debug System](/css/debug/)** - Debugging components

---

Components bring consistency. [Master utilities](/css/utilities/)
