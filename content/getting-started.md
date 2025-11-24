# Getting Started

Welcome! Choose your path: either use Standard Framework only with CSS CDN in any project, or use it as a complete 11ty plugin for long form sites.

- **Typography, grid, colors, spacing, and utilities** - [CSS Framework Overview](/css/)
- **[11ty Plugin Documentation](/11ty/)**
- **[Cheat Sheet](/cheat-sheet/)** - Quick reference for common patterns


## Choose Your Path

### Path 1: CSS

Use Standard's CSS framework with any HTML or JavaScript framework (React, Vue, Svelte, etc.).

**Perfect for**: Static HTML, web apps, or any project needing beautiful styling.

```html
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard/css">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>
```

### That’s It!

You now have a beautiful, responsive, accessible website with:
- Perfect typography
- Dark mode support
- Mobile-friendly layout
- Semantic HTML
- Professional styling

Open in browser. No build process. No configuration.

—

### Path 2: 11ty

Use Standard as a complete 11ty plugin for blogs, documentation, and content sites.

**One plugin. Everything included:**
- Typography system with smart quotes and widow prevention
- Complete CSS framework (grid, spacing, colors)
- Enhanced markdown with syntax highlighting
- Template filters and shortcodes
- Wiki-style backlinks
- Cloudflare Functions (optional)
- GitHub Comments System (optional)

**Perfect for**: Blogs, documentation, knowledge bases, portfolios, marketing sites.

### Step 1: Create Project

```bash
mkdir my-website
cd my-website
npx @zefish/standard
```

### Step 6: Build

```bash
npx @11ty/eleventy --serve
```

Visit `http://localhost:8080`

Your website is live with:
- Beautiful typography
- Responsive layout
- Dark mode
- Professional styling
- Zero configuration

Congrats for your first website!


## Project Structure

### Standalone

```
my-project/
├── index.html          # Your page
├── css/
│   └── custom.css      # Optional custom styles
└── images/
    └── logo.png
```

### 11ty + Standard

```
my-website/
├── eleventy.config.js  # 11ty config
├── package.json        # Dependencies
├── content/
│   ├── index.md        # Homepage
│   ├── about.md        # About page
│   └── blog/
│       └── post-1.md   # Blog post
├── _includes/
│   └── layouts/
│       └── base.njk    # Main layout
└── _site/              # Built output (auto-generated)
```


## Utilities

Standard Framework includes extensive utility classes for spacing, sizing, typography, and layout.

See the complete [Utilities Reference](/css/utilities/) for:
- **Margin utilities** — `.margin-top-base`, `.margin-left-l`, etc.
- **Padding utilities** — `.padding-base`, `.padding-xl`, etc.
- **Sizing utilities** — `.width-full`, `.height-auto`, etc.
- **Typography utilities** — `.text-size-small`, `.text-weight-bold`, etc.
- **Color utilities** — `.text-color-muted`, `.background-color-secondary`, etc.
- **Layout utilities** — `.display-flex`, `.center-content`, etc.

**Quick tip**: All utilities follow the pattern `[property]-[side]-[size]` making them easy to guess.


## Next Steps

### Learn More

- **[CSS Framework](/css/)** — Typography, colors, grid, spacing
- **[Utilities Reference](/css/utilities/)** — All helper classes
- **[Utilities Cheat Sheet](/cheat-sheet/)** — Quick reference
- **[11ty Plugin](/11ty/)** — Collections, filters, markdown

### For Content Sites

- **[Markdown Features](/11ty/markdown/)** — Enhanced markdown support
- **[Backlinks](/11ty/backlinks/)** — Connect related pages
- **[Encryption](/11ty/encryption/)** — Password-protect content
- **[Filters](/11ty/filters/)** — Transform data

### For Designers

- **[Typography](/css/typography/)** — Font system and scales
- **[Colors](/css/colors/)** — Semantic color system
- **[Layout Systems](/css/grid/)** — Grid and spacing


- **[Utilities Cheat Sheet](/cheat-sheet/)** — Quick reference card
- **[Full API Reference](/docs/)** — Auto-generated documentation
- **[Examples](/examples/)** — Code examples
- **[GitHub Issues](https://github.com/zefish/standard)** — Report bugs


Remember: **Stop configuring. Start creating.**

The boring stuff is handled. Focus on your content.