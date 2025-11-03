---
title: Prose System

eleventyNavigation:
  key: Prose
  parent: CSS Framework
  title: Prose System
permalink: /css/prose/
---

# Prose System

Create beautifully styled, readable articles with automatic vertical rhythm, optimal line lengths, and professional typography.

## Quick Navigation

- **[Typography System](/css/typography/)** - Font sizes, weights, and families
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Grid System](/css/grid/)** - Layout options including prose + sidebar
- **[Colors](/css/colors/)** - Text and background colors
- **[Utilities](/css/utilities/)** - Helper classes for common patterns

## Basic Prose Layout

The `.prose` class transforms any container into a beautifully styled, readable article or content area:

**Default prose container:**
  <h1>Article Title</h1>
  <p>This is how prose content looks when styled with the prose system. All typography, spacing, and layout are automatically applied. The prose container ensures your content is readable with optimal line length and professional appearance.</p>
  <p>Paragraphs have consistent spacing based on the vertical rhythm system. Each paragraph is separated by proper spacing that creates visual breathing room without appearing disconnected.</p>

```html
<article class="prose">
  <h1>Article Title</h1>
  <p>Your content here stays within optimal reading width with perfect spacing...</p>
  <p>Multiple paragraphs maintain consistent rhythm throughout the document.</p>
</article>
```

## Heading Hierarchy

The prose system includes six levels of heading hierarchy, each with carefully calculated sizing and spacing:

**All heading levels:**
  <h1>H1 - Main Article Heading</h1>
  <p>This is your primary page heading, largest and most prominent.</p>

  <p>
      <img src="https://picsum.photos/400/300?random=1" alt="Demo 1" />
      <img src="https://picsum.photos/400/300?random=2" alt="Demo 2" />
      <img src="https://picsum.photos/400/300?random=3" alt="Demo 3" />
    </p>
    <p>
      <img src="https://picsum.photos/400/300?random=1" alt="Demo 1" />
      <img src="https://picsum.photos/400/300?random=2" alt="Demo 2" />
      <img src="https://picsum.photos/400/300?random=3" alt="Demo 3" />
    </p>

  <h2>H2 - Section Heading</h2>
  <p>Divides content into major sections within the article.</p>

  <h3>H3 - Subsection Heading</h3>
  <p style="font-size: 0.875rem; color: #666;">Creates a third level of organization for detailed content.</p>

  <h4>H4 - Minor Heading</h4>
  <p style="font-size: 0.875rem; color: #666;">Breaks up content within subsections.</p>

  <h5>H5 - Sub-minor Heading</h5>
  <p style="font-size: 0.875rem; color: #666;">Rarely used but available for deep nesting.</p>

  <h6>H6 - Small Heading</h6>
  <p style="font-size: 0.875rem; color: #666;">The smallest heading level, typically used for special sections.</p>

```html
<article class="prose">
  <h1>Main Article Heading</h1>
  <p>Introduction paragraph...</p>

  <h2>First Major Section</h2>
  <p>Content for this section...</p>

  <h3>Subsection within first section</h3>
  <p>More detailed content...</p>

  <h2>Second Major Section</h2>
  <p>More content...</p>
</article>
```

## Paragraph Styling

Paragraphs automatically receive optimal line height, spacing, and typography:

**Paragraphs with rhythm spacing:**
<div class="prose mb" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>This paragraph has proper line-height (1.618 for body text) for comfortable reading. The golden ratio ensures each line has optimal spacing. Longer paragraphs are easier to read when line-height is generous but not excessive.</p>
  <p>Each paragraph is automatically separated from the next by the rhythm spacing. This creates visual breathing room and helps readers process content in digestible chunks. The spacing is based on your typography's line-height multiplier.</p>
  <p>The prose system applies these styles automatically. You don't need to add classes to individual paragraphs—just write semantic HTML and the system handles the rest.</p>
</div>

```html
<article class="prose">
  <p>First paragraph with automatic spacing and styling.</p>
  <p>Second paragraph appears below with proper vertical rhythm.</p>
  <p>Each paragraph receives consistent treatment throughout the article.</p>
</article>
```

## Lists

Lists are automatically styled with proper indentation and spacing within prose containers:

**Unordered list example:**
<div class="prose mb" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Benefits of the Prose System</h3>
  <ul>
    <li>Automatic vertical rhythm keeps content visually harmonious</li>
    <li>Optimal line length ensures comfortable reading</li>
    <li>Professional heading hierarchy guides readers</li>
    <li>Consistent spacing creates visual polish</li>
    <li>Works with semantic HTML without extra markup</li>
  </ul>
</div>

**Ordered list example:**
<div class="prose mb" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Steps to Create a Prose Container</h3>
  <ol>
    <li>Add the <code>.prose</code> class to your container element</li>
    <li>Write semantic HTML with proper heading hierarchy</li>
    <li>Add paragraphs, lists, and other content elements</li>
    <li>All styling is applied automatically</li>
    <li>Customize with CSS variables if needed</li>
  </ol>
</div>

**Description list example:**
<div class="prose mb" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Typography Terms</h3>
  <dl>
    <dt>Line Height</dt>
    <dd>The vertical distance between lines of text. The prose system uses 1.618 (golden ratio) for comfortable reading.</dd>
    <dt>Vertical Rhythm</dt>
    <dd>Consistent spacing throughout a layout. All elements align to a baseline grid for visual harmony.</dd>
    <dt>Reading Width</dt>
    <dd>The ideal line length (60-75 characters) for comfortable reading. The prose system keeps content within this range.</dd>
  </dl>
</div>

```html
<article class="prose">
  <!-- Unordered list -->
  <ul>
    <li>First item</li>
    <li>Second item with more details</li>
    <li>Third item concluding the list</li>
  </ul>

  <!-- Ordered list -->
  <ol>
    <li>First step in a process</li>
    <li>Second step continues the process</li>
    <li>Final step completes the process</li>
  </ol>

  <!-- Description list -->
  <dl>
    <dt>Term</dt>
    <dd>Definition of the term goes here with complete explanation.</dd>
  </dl>
</article>
```

## Blockquotes

Blockquotes are styled to stand out while maintaining visual harmony with the rest of your prose:

**Blockquote styling:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Here's a powerful thought from a famous author:</p>
  <blockquote>
    <p>The beautiful thing about learning is that no one can take it away from you. Every investment you make in yourself comes back with dividends throughout your life. It's not about money, it's about growth.</p>
  </blockquote>
  <p>This blockquote is styled to emphasize the quoted content while maintaining visual rhythm with surrounding paragraphs.</p>
</div>

```html
<article class="prose">
  <p>Here's a meaningful quote:</p>
  <blockquote>
    <p>Your blockquoted text appears here in italics with a left border accent, creating visual emphasis.</p>
  </blockquote>
  <p>Continue your prose after the blockquote with normal styling.</p>
</article>
```

## Code Blocks

Code examples within prose are styled with syntax highlighting support:

**Inline code:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Use the <code>.prose</code> class on any container to enable prose styling. You can also use the <code>class="prose"</code> attribute directly in your HTML.</p>
</div>

**Code block:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>JavaScript Example</h3>
  <pre><code class="language-javascript">// Apply prose styling to content
const article = document.querySelector('article');
article.classList.add('prose');

// Now all typography and spacing is automatically applied
console.log('Prose styling activated!');
</code></pre>
</div>

```html
<article class="prose">
  <p>Inline code example: use <code>variable_name</code> in your code.</p>

  <pre><code>
// Code block with multiple lines
function exampleFunction() {
  return "This code appears in a styled block";
}
  </code></pre>
</article>
```

## Tables

Tables within prose are responsive and automatically styled:

**Table example:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Feature Comparison</h3>
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Description</th>
        <th>Availability</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Vertical Rhythm</td>
        <td>Automatic spacing based on line-height</td>
        <td>All elements</td>
      </tr>
      <tr>
        <td>Reading Width</td>
        <td>Optimal line length for readability</td>
        <td>Prose containers</td>
      </tr>
      <tr>
        <td>Heading Hierarchy</td>
        <td>Six levels with scaled sizing</td>
        <td>H1 through H6</td>
      </tr>
      <tr>
        <td>Typography System</td>
        <td>Golden ratio based proportions</td>
        <td>All text elements</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<article class="prose">
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>Data 3</td>
      </tr>
    </tbody>
  </table>
</article>
```

## Text Emphasis

Within prose, emphasis elements are styled appropriately:

**Text emphasis examples:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Use <strong>strong tags for bold text</strong> to emphasize important points. The <em>em tag creates italic text</em> for gentle emphasis. You can also use <b>b tags for bold</b> and <i>i tags for italic</i>.</p>
  <p>For marked or highlighted text, use <mark>the mark element</mark>. Deleted or removed text looks like <del>this deleted text</del>. New or inserted text appears as <ins>this inserted text</ins>.</p>
  <p>Special formatting: Subscript like H<sub>2</sub>O or superscript like E=mc<sup>2</sup> are automatically styled.</p>
</div>

```html
<article class="prose">
  <p>This is <strong>bold text</strong> and <em>italic text</em>.</p>
  <p><mark>Highlighted text</mark>, <del>deleted text</del>, <ins>inserted text</ins>.</p>
  <p>H<sub>2</sub>O and E=mc<sup>2</sup> subscript and superscript.</p>
</article>
```

## Links

Links within prose maintain visual hierarchy while remaining accessible:

**Link styling:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>This paragraph contains a <a href="/example">standard link to another page</a>. The link is styled distinctly so readers can identify it. <a href="/visited">Visited links</a> appear in a different color to show where you've already been.</p>
  <p>Links are underlined and color-coded for accessibility. Hover over a link to see the hover state. Active links show their current state with different styling.</p>
</div>

```html
<article class="prose">
  <p>Read more in the <a href="/docs/typography/">typography documentation</a>.</p>
  <p>Visit the <a href="/css/grid/">grid system guide</a> for layout examples.</p>
</article>
```

## Prose with Sidebars

Combine prose with sidebar layouts for more complex article structures:

**Main content with sidebar:**
<div class="display-grid gap-base margin-bottom-base" style="grid-template-columns: 1fr 250px;">
  <div class="prose" style="padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
    <h1>Article with Sidebar</h1>
    <p>This is the main article content using the prose system for optimal readability. The prose class ensures all typography and spacing is perfectly proportioned.</p>
    <h2>Main Content Section</h2>
    <p>Articles often benefit from having a sidebar for supplementary information, advertisements, or related links. The prose system maintains perfect spacing even with adjacent sidebars.</p>
  </div>
  <div style="padding: 2rem; background-color: #e8e8e8; border-radius: 0.5rem;">
    <h3 style="margin-top: 0;">Sidebar</h3>
    <ul style="font-size: 0.875rem; line-height: 1.5;">
      <li><a href="#">Related Article 1</a></li>
      <li><a href="#">Related Article 2</a></li>
      <li><a href="#">Related Article 3</a></li>
    </ul>
  </div>
</div>

```html
<div class="display-grid gap-base" style="grid-template-columns: 1fr 250px;">
  <article class="prose">
    <h1>Article Title</h1>
    <p>Main article content with optimal reading width...</p>
  </article>

  <aside>
    <h3>Related Content</h3>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </aside>
</div>
```

## Heading Spacing

The prose system carefully manages spacing before and after headings for visual hierarchy:

**Heading spacing in context:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>This paragraph comes before a heading. Notice the spacing below it.</p>

  <h2>This is an H2 Heading</h2>

  <p>The paragraph after a heading has consistent spacing. H2 headings have larger top margin (spacing above) than bottom margin (spacing below) to maintain rhythm.</p>

  <h3>This is an H3 Heading</h3>

  <p>Smaller headings like H3 have proportionally smaller spacing. The rhythm system maintains perfect alignment throughout the entire document.</p>

  <p>Multiple paragraphs between headings maintain the same consistent spacing.</p>
</div>

```html
<article class="prose">
  <h1>Main Heading</h1>
  <p>Paragraph after main heading...</p>

  <h2>Section Heading</h2>
  <p>Content under this section...</p>
  <p>Another paragraph...</p>

  <h3>Subsection Heading</h3>
  <p>More detailed content...</p>
</article>
```

## Callouts and Highlighted Sections

Special content can be highlighted using callout styling:

**Callout block:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Here's some regular prose content.</p>
  <div class="callout" style="padding: 1.5rem; background-color: #e3f2fd; border-left: 4px solid #1976d2; border-radius: 0.25rem;">
    <div style="font-weight: 700; margin-bottom: 0.5rem;">Pro Tip</div>
    <p style="margin: 0; font-size: 0.95rem;">This is a highlighted callout section. Use it for important notes, warnings, or tips. The callout styling draws attention while maintaining visual harmony with surrounding prose.</p>
  </div>
  <p>Content continues after the callout.</p>
</div>

```html
<article class="prose">
  <p>Regular prose content...</p>

  <div class="callout">
    <div class="callout-title">Important Note</div>
    <p>Content inside the callout gets highlighted styling.</p>
  </div>

  <p>More prose continues below...</p>
</article>
```

## Images and Figures

Images within prose maintain visual harmony:

**Image with caption:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Here's an image embedded in prose:</p>
  <figure style="margin-bottom: 2rem;">
    <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">
      [Placeholder Image]
    </div>
    <figcaption style="font-size: 0.875rem; color: #666; margin-top: 0.75rem; font-style: italic;">A sample figure with caption text. Captions provide context for images in your article.</figcaption>
  </figure>
  <p>The image maintains proper spacing before and after in the prose flow.</p>
</div>

```html
<article class="prose">
  <p>Introduction before the image...</p>

  <figure>
    <img src="/images/example.jpg" alt="Description of image">
    <figcaption>Caption text appears below the image</figcaption>
  </figure>

  <p>Content continues after the image...</p>
</article>
```

## Reading Width Variants

The prose system supports different reading widths for different content types:

**Standard prose (default width):**
<div class="prose margin-bottom-base" style="max-width: 672px; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Medium Width (Default)</h3>
  <p>This is the default prose width - optimal for most article content. At approximately 42rem (672px), this width provides excellent readability with approximately 60-75 characters per line depending on font size and spacing.</p>
</div>

**Narrow prose (for sidebars):**
<div class="prose margin-bottom-base" style="max-width: 512px; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Small Width</h3>
  <p>Narrower prose width for sidebar content or supplementary information. Still maintains perfect readability at a reduced width.</p>
</div>

**Wide prose (for special content):**
<div class="prose margin-bottom-base" style="max-width: 800px; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h3>Large Width</h3>
  <p>Wider prose width for feature articles or special content that benefits from more horizontal space while maintaining readability principles.</p>
</div>

```html
<!-- Standard prose width (42rem / 672px) -->
<article class="prose">
  <h1>Article Title</h1>
  <p>Content here uses optimal reading width...</p>
</article>

<!-- Narrow prose for sidebars -->
<aside class="prose" style="width: 32rem;">
  <h3>Sidebar Content</h3>
  <p>Narrower content area...</p>
</aside>

<!-- Wide prose for feature content -->
<article class="prose" style="width: 50rem;">
  <h1>Featured Article</h1>
  <p>Wider layout for special content...</p>
</article>
```

## Full-Width Content Within Prose

Sometimes you need full-width elements inside prose containers:

**Full-width element inside prose:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <p>Here's regular prose content at the optimal reading width.</p>
  <div style="width: 100%; height: 150px; background: linear-gradient(to right, #667eea 0%, #764ba2 100%); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 2rem;">
    Full-Width Section (breakout element)
  </div>
  <p>Content returns to normal prose width after the full-width section. This allows for impactful visuals while maintaining reading flow.</p>
</div>

```html
<article class="prose">
  <p>Regular prose content...</p>

  <div class="full">
    <!-- Full-width element breaks out of prose constraints -->
    <section style="background: var(--color-accent);">
      Full-width impactful content
    </section>
  </div>

  <p>Prose continues at normal width after the full-width section...</p>
</article>
```

## Nested Prose

You can nest prose containers for different contexts:

**Nested prose example:**
<div class="prose margin-bottom-base" style="max-width: 100%; padding: 2rem; background-color: #f5f5f5; border-radius: 0.5rem;">
  <h2>Main Article Section</h2>
  <p>This is the main prose content. You can have different prose containers for different sections of content.</p>

  <div style="margin-top: 2rem; padding: 1.5rem; background-color: #fff9e6; border-radius: 0.5rem;">
    <h3>Nested Prose Container</h3>
    <p>This nested section has its own prose styling applied. It might represent a sidebar, special section, or supplementary content with different styling context.</p>
  </div>
</div>

```html
<article class="prose">
  <h1>Main Article</h1>
  <p>Main content...</p>

  <section class="prose">
    <h2>Special Section</h2>
    <p>This section has its own prose styling context...</p>
  </section>
</article>
```

## Customization with CSS Variables

Override prose defaults with CSS variables:

```css
:root {
  /* Heading spacing multiplier */
  --rhythm-gap: 1;

  /* Line height for body text */
  --lh-lrh-base: 1.618;

  /* Line height for headings */
  --lh-lrh-headings: 1.2;

  /* Font sizes (automatically scaled) */
  --font-size-base: 16px;

  /* Reading width (prose container max-width) */
  --line-width: 42rem;
}
```

## Best Practices

### ✓ Do

- Use semantic HTML tags (`<h1>`, `<p>`, `<article>`)
- Start with `<h1>` on each page
- Follow heading hierarchy without skipping levels
- Use `.prose` class on article or main content containers
- Let the prose system handle spacing—don't add custom margins
- Use proper list elements (`<ul>`, `<ol>`, `<dl>`) for organized content
- Include figure captions for all images
- Use blockquotes for quoted material
- Apply emphasis with `<strong>` and `<em>` tags

### ✗ Don't

- Skip heading levels (don't jump from `<h1>` to `<h3>`)
- Use headings for styling (use classes instead)
- Add multiple `<h1>` tags per page
- Disable the prose class styling to save space
- Use non-semantic elements for content structure
- Add extra margins to individual elements
- Ignore heading hierarchy for visual design

## Advanced Patterns

### Blog Post with Multiple Sections

```html
<article class="prose">
  <h1>Complete Guide to Prose Styling</h1>
  <p>Introduction paragraph setting up the article topic...</p>

  <h2>Getting Started</h2>
  <p>Section content here...</p>

  <h3>First Concept</h3>
  <p>Details about the first concept...</p>

  <h3>Second Concept</h3>
  <p>Details about the second concept...</p>

  <h2>Advanced Topics</h2>
  <p>Moving into more complex territory...</p>

  <h3>Deep Dive</h3>
  <p>In-depth exploration of advanced topics...</p>
</article>
```

### Long-Form Article with Sidebars

```html
<div class="display-grid gap-base" style="grid-template-columns: 1fr 300px;">
  <article class="prose">
    <h1>In-Depth Article</h1>
    <p>Long-form content with perfect readability...</p>
  </article>

  <aside class="prose" style="width: 100%;">
    <h3>Quick Reference</h3>
    <ul>
      <li>Key point 1</li>
      <li>Key point 2</li>
    </ul>
  </aside>
</div>
```

### Documentation with Code Examples

```html
<article class="prose">
  <h1>API Documentation</h1>

  <h2>Installation</h2>
  <pre><code>npm install @example/package</code></pre>

  <h2>Basic Usage</h2>
  <p>Here's how to use the package:</p>
  <pre><code class="language-javascript">
import { example } from '@example/package';
example();
  </code></pre>

  <h2>Advanced Configuration</h2>
  <p>For advanced use cases...</p>
</article>
```

## See Also

- **[Typography System](/css/typography/)** - Font sizes, weights, and families
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Grid System](/css/grid/)** - Layout options including prose + sidebar
- **[Colors](/css/colors/)** - Text and background colors
- **[API Reference](/docs/prose-layout-system/)** - Complete technical documentation

---

Master readable, beautiful content. [Learn spacing and rhythm](/css/spacing/)
