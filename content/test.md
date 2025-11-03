---
layout: base.njk
title: Cheat Sheet
description: The essential commands you'll use every day and always forget
permalink: /test/
comments: true
---

# Test

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

qwdqdwd

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
