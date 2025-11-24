# Test

**Pattern**: `margin-top-base`, `padding-left-xs`, `gap-l`

**Mental model**: `base` is your default. Go smaller for UI density, larger for white space emphasis.

**Most common mistake**: Using `padding-xl` on small cards. Start with `base`, adjust down/up as needed.


## Inspector Quick Reference

The Inspector is Standard's built-in design tool. Open it with `Shift + Cmd/Ctrl + D` to:
- **Edit design tokens** (colors, fonts, spacing) in real-time
- **Toggle debug mode** to see baseline grid and layout zones
- **Export CSS** of your changes
- **Switch themes** instantly

qwdqdwd Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Obsidian-Style Callout Tests

::info hola

This error callout can be collapsed and expanded. It contains multiple lines of content to test the collapsible functionality.

::callout hola
This callout has a custom title instead of the default "Success" title.
::end

Multiple callouts can be stacked:

- They each get their own styling
- Icons are automatically assigned
- Colors match the callout type

This is a bug callout to test the icon and styling.

[!question]
Questions get their own icon and color scheme.

[/!callout]

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  <p>
      <img src="https://picsum.photos/400/300?random=1" alt="Demo 1" />
      <img src="https://picsum.photos/400/300?random=2" alt="Demo 2" />
      <img src="https://picsum.photos/400/300?random=3" alt="Demo 3" />
    </p>
    <p>
      <img src="https://picsum.photos/400/300?random=4" alt="Demo 1" />
      <img src="https://picsum.photos/400/300?random=6" alt="Demo 3" />
    </p>

```html
<!-- DON'T write custom CSS -->
<div style="padding: 1rem; margin-bottom: 2rem; text-align: center;">

<!-- DO combine utilities -->
<div class="padding-base margin-bottom-l center">
```
**Why**: Utilities are self-documenting. Six months later, `padding-base` still makes sense. `padding: 1rem` requires you to remember your spacing scale.

| Size | Usage | Value | When to use |
||-|-|-|
| `xs` | Tiny gaps, compact UI | ~0.5rem | Button groups, inline icons |
| `s` | Small spacing | ~0.75rem | Form fields, card padding |
| `base` | **Normal spacing** | ~1rem | Default gaps, standard rhythm |
| `l` | Section spacing | ~2rem | Between major sections |
| `xl` | Page spacing | ~4rem | Hero sections, page margins |