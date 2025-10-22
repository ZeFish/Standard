---
title: Quick Start - Build Your First Website
layout: article
eleventyNavigation:
  key: Quick Start
  parent: 11ty Plugin
  title: Quick Start
permalink: /11ty/quick-start/
---

# Build Your First Website in 5 Minutes

**Stop configuring. Start creating.** Standard Framework handles all the boring stuff so you can focus on content.

---

## The Problem with 11ty

Every time you start a new 11ty site, you spend hours on:

- Setting up CSS (or choosing a framework)
- Creating base layouts
- Configuring markdown processing
- Building collections and filters
- Styling forms, buttons, typography
- Setting up responsive grids
- Choosing colors and themes
- Adding dark mode support
- Dealing with vertical rhythm
- Configuring everything from scratch

Then you finally write content. **Not ideal.**

---

## The Standard Way

**5 steps. That's it.**

### Step 1: Create Project Folder

```bash
mkdir my-website
cd my-website
```

### Step 2: Initialize & Install

```bash
npm init -y
npm install --save-dev @11ty/eleventy
npm install @zefish/standard
```

**That's 6 packages.** One installs 11ty. One brings Standard. Done.

### Step 3: Create One Config File

Create `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);
  
  return {
    dir: { input: "content", output: "_site" }
  };
}
```

**Literally copy-paste this. It works.**

### Step 4: Create One Layout

Create `_includes/layouts/base.njk`:

```nunjucks
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or "My Website" }}</title>
  {% standardAssets %}
</head>
<body class="bg-background text-foreground">
  <header class="rhythm-block p-4">
    <h1>{{ site.name }}</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/blog/">Blog</a>
    </nav>
  </header>

  <main class="max-w-prose mx-auto px-4 rhythm-block">
    {{ content | safe }}
  </main>

  <footer class="rhythm-block p-4 border-t">
    <p>&copy; 2024 {{ site.name }}</p>
  </footer>
</body>
</html>
```

**Copy this too. Customize the nav if you want.**

### Step 5: Write Content

Create `content/index.md`:

```markdown
---
layout: layouts/base.njk
title: Home
---

# Welcome to My Website

This is my website. It has beautiful typography, responsive design, and dark mode.

**All automatically.**

No CSS to write. No classes to memorize. Just markdown.
```

Create `content/about.md`:

```markdown
---
layout: layouts/base.njk
title: About Me
---

# About Me

I'm a person who builds websites with Standard Framework instead of spending hours on setup.

This frees me to focus on content.
```

### Step 6: Build & View

```bash
npx @11ty/eleventy --serve
```

Visit `http://localhost:8080`

**Your website is live. With styling. With dark mode. With responsive layout. No JavaScript needed.**

---

## That's It

Seriously. You now have:

✅ **Beautiful typography** - Perfect fonts and spacing  
✅ **Responsive grid** - Works on phone, tablet, desktop  
✅ **Dark mode** - Automatic theme switching  
✅ **Semantic HTML** - Clean, accessible code  
✅ **Professional styling** - Golden ratio proportions  
✅ **Fast build** - Completes in seconds  
✅ **Zero configuration** - It just works  

---

## Now Add Your Features

Once your site is running, add features as needed:

### Add a Blog

```bash
mkdir content/blog
```

Create `content/blog/post-1.md`:

```markdown
---
layout: layouts/base.njk
title: My First Post
date: 2024-10-21
tags:
  - thoughts
  - web
---

# {{ title }}

<time>{{ date | dateFilter('long') }}</time>

Your blog post content here.
```

### Add Wiki-Style Links

Just use `[[Page Name]]` in markdown:

```markdown
Learn about [[Web Development]] and [[CSS]].
```

Automatic backlinks appear on those pages.

### Protect Premium Content

```markdown
---
layout: layouts/base.njk
title: Premium Article
encrypted: true
password: premium-access
---

# Premium Content

Members only.
```

### Add Custom Styles

Create `src/custom.css`:

```css
:root {
  --color-accent: #0066cc;
}
```

And passthrough copy it in `eleventy.config.js`:

```javascript
eleventyConfig.addPassthroughCopy("src/custom.css");
```

---

## Your Project Structure

That's all you need:

```
my-website/
├── eleventy.config.js       (Copy-paste from above)
├── package.json
├── content/
│   ├── index.md            (Your homepage)
│   ├── about.md            (Your about page)
│   └── blog/
│       └── post-1.md       (Your first post)
├── _includes/
│   └── layouts/
│       └── base.njk        (Copy-paste from above)
└── _site/                  (Auto-generated, ignore)
```

**That's the entire structure. Nothing else needed.**

---

## Common Questions

### Q: How do I customize the colors?

Override CSS variables in a custom style:

```css
:root {
  --color-background: #f5f5f5;
  --color-foreground: #1a1a1a;
  --color-accent: #ff6600;
}
```

### Q: How do I add navigation menus?

Add `eleventyNavigation` to front matter:

```markdown
---
layout: layouts/base.njk
eleventyNavigation:
  key: About
  title: About
  order: 2
---
```

11ty handles the rest.

### Q: How do I change fonts?

Override in CSS:

```css
:root {
  --font-family-serif: "Georgia", serif;
  --font-family-sans: "Segoe UI", sans-serif;
}
```

### Q: How do I add images?

Just use markdown:

```markdown
![My photo](/images/photo.jpg)

Or HTML:

<img src="/images/photo.jpg" alt="My photo" loading="lazy">
```

Then add to `eleventy.config.js`:

```javascript
eleventyConfig.addPassthroughCopy("src/images/");
```

### Q: How do I deploy?

Build for production:

```bash
npm run build
```

Upload the `_site` folder to:
- **Netlify** - Drop folder, it's live
- **Vercel** - Connect repo, it auto-deploys
- **Any web server** - FTP the `_site` folder

---

## Common Tasks

### Create a Second Layout

For blog posts, create `_includes/layouts/blog-post.njk`:

```nunjucks
---
layout: layouts/base.njk
---

<article class="rhythm-block">
  <h1>{{ title }}</h1>
  <time class="text-sm text-foreground/60">{{ date | dateFilter('long') }}</time>
  
  {{ content | safe }}
  
  <!-- Backlinks appear here -->
  {% if backlinks %}
    <aside class="mt-8 p-4 bg-accent/10 border-l-4 border-accent">
      <h3>Linked from</h3>
      <ul class="list-none">
        {% for link in backlinks %}
          <li><a href="{{ link.url }}">{{ link.data.title }}</a></li>
        {% endfor %}
      </ul>
    </aside>
  {% endif %}
</article>
```

Use it:

```markdown
---
layout: layouts/blog-post.njk
title: My Post
date: 2024-10-21
---
```

### Show Recent Posts

In `_includes/recent-posts.njk`:

```nunjucks
{% set posts = collections.all | reverse %}

<section>
  <h2>Recent Posts</h2>
  <ul>
    {% for post in posts | head(5) %}
      <li>
        <a href="{{ post.url }}">{{ post.data.title }}</a>
        <time>{{ post.date | dateFilter }}</time>
      </li>
    {% endfor %}
  </ul>
</section>
```

Use in any template:

```nunjucks
{% include "recent-posts.njk" %}
```

### Add Code Highlighting

Standard includes syntax highlighting automatically. Just use code blocks:

~~~markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

```python
def greet(name):
    print(f"Hello, {name}!")
```
~~~

Automatically highlighted.

---

## What You Get (Seriously)

By installing Standard, you get:

- 🎨 Complete CSS framework (15KB min)
- 📝 Enhanced markdown processing
- 🔗 Wiki-style backlinks
- 🔐 Content encryption
- 📊 Responsive grid system
- 🌓 Automatic dark mode
- 📐 Perfect typography
- ⚡ Fast builds
- ♿ Accessibility built-in
- 🎯 SEO-friendly structure

All with **zero additional configuration**.

---

## The Philosophy

Standard Framework does one thing: **removes the boring.**

No more:

- Choosing CSS frameworks
- Writing boilerplate HTML
- Configuring markdown processing
- Setting up collections
- Building responsive grids
- Creating color systems
- Worrying about typography
- Adding dark mode

**Just write content.**

---

## Next Steps

### If You're Comfortable

Start building and learn as you go. Pick up features from:
- [Markdown Guide](/11ty/markdown/) - Enhanced markdown
- [Filters](/11ty/filters/) - Transform data
- [Backlinks](/11ty/backlinks/) - Connect pages
- [Encryption](/11ty/encryption/) - Protect content

### If You Want a Deeper Dive

Work through the complete guides:
1. [Getting Started](/11ty/getting-started/) - Full setup guide
2. [CSS Framework](/css/) - Understand the styling
3. [Advanced Features](/11ty/advanced/) - Power user techniques

### Just Start

Create a folder. Run npm install. Copy the config and layout. Write markdown.

**Your website is ready.**

---

## The Big Picture

This is what Standard is for. Not "how do I configure 11ty?" but "how do I just make a website?"

The answer: Copy-paste config, write content, done.

**Everything else is handled.**

---

Ready? Start here:

```bash
mkdir my-site
cd my-site
npm init -y
npm install --save-dev @11ty/eleventy
npm install @zefish/standard
```

Then follow the 5 steps above.

**Your website launches in 5 minutes.** ✨
