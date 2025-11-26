# Standard Framework

::muted Typography is the voice · Grid is the structure · Rhythm is the flow · Color is the emotion

A fine-art design framework implementing classical typography, Swiss grid systems, and vertical rhythm with mathematical precision inspired by centuries of print mastery.

### Contents
1. [Typography System](#typography)
2. [Grid System](#grid)
3. [Vertical Rhythm](#rhythm)
4. [Color Management](#color)
5. [Reading Layout](#reading)
6. [Form Elements](#forms)

## Typography is the Voice

- [Mardown](/markdown/)

> Standard implements fine-art typography with smart quotes, proper punctuation, widow prevention, and multi-locale support. The golden ratio governs all typographic relationships.

### Heading Hierarchy

Each heading level maintains precise mathematical relationships based on the golden ratio (φ = 1.618).

<div id="comments">
        <div class="comment" data-id="1762449150577-juzyfccm8" data-level="0" data-pending="true" "="">
          <div class="comment-header">
            <span class="comment-author">Francis</span>
            <span class="comment-date">just now</span>
            <span class="comment-pending">Awaiting moderation</span>
          </div>
          <div class="comment-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
        </div>
        <div class="comment" data-id="1762449106853-7dcdhny1w" data-level="0" data-pending="true" "="">
          <div class="comment-header">
            <span class="comment-author">awdawdawdawd</span>
            <span class="comment-date">just now</span>
            <span class="comment-pending">Awaiting moderation</span>
          </div>
          <div class="comment-content">adw</div>
        </div>
      </div>
<div class="card inset">

# Heading Level 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Heading Level 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id estlaborum.

### Heading Level 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Heading Level 4

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

##### Heading Level 5

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

###### Heading Level 6

Body text with **bold emphasis** and *italic stress*.

</div>

### Smart Typography

The JavaScript engine automatically enhances your text with proper typographic conventions:

* "Straight quotes" become "curly quotes"
* Double hyphens -- become em-dashes--like this
* Three periods... become proper ellipsis…
* Fractions like 1/2 become ½
* No orphaned words on last lines

> "Typography is the craft of endowing human language with a durable visual <cite>— Robert Bringhurst</cite>

### Code & Monospace

Inline code like <code>const standard = new Standard()</code> and code blocks maintain rhythm:

<pre><code>// Initialize Standard
const standard = new Standard({
    locale: 'en',
    enableSmartQuotes: true,
    enableWidowPrevention: true,
    observeDOM: true
});</code></pre>
<div class="feature">

## Grid is the Structure

A Swiss-style 12-column responsive grid with logical properties. Inspired by Josef Müller-Brockmann and the International Typographic Style.

### Basic Columns

  <div class="grid-12">
    <div class="col-12 card">col-12 (Full width)</div>
    <div class="col-6 card">col-6 (Half)</div>
    <div class="col-6 card">col-6 (Half)</div>
    <div class="col-4 card">col-4 (Third)</div>
    <div class="col-4 card">col-4 (Third)</div>
    <div class="col-4 card">col-4 (Third)</div>
    <div class="col-3 card">col-3</div>
    <div class="col-3 card">col-3</div>
    <div class="col-3 card">col-3</div>
    <div class="col-3 card">col-3</div>
  </div>

### Responsive Grid
Columns adapt at breakpoints (md: #{$small}, lg: #{$large}):

  <div class="grid">
    <div class="sm:row col-6 lg:col-4 card">12 → 6 → 4</div>
    <div class="sm:row col-6 lg:col-4 card">12 → 6 → 4</div>
    <div class="sm:row col-12 lg:col-4 card">12 → 12 → 4</div>
  </div>

### Free Column Positioning
Precise control with CSS variables:

  <div class="grid">
    <div class="free-col card" style="--start: 1; --span: 7">
      Main content<br />
      <code>--start: 1; --span: 7</code>
    </div>
    <div class="free-col card" style="--start: 9; --span: 4">
      Sidebar<br />
      <code>--start: 9; --span: 4</code>
    </div>
  </div>

### Gap Variants

  <div class="grid-3 sm:grid-1 compact">
    <div class="card">compact gaps</div>
    <div class="card">compact gaps</div>
    <div class="card">compact gaps</div>
  </div>
  <div class="grid-3 sm:grid-1 relaxed">
    <div class="card">Relaxed gaps</div>
    <div class="card">Relaxed gaps</div>
    <div class="card">Relaxed gaps</div>
  </div>
</div>

## Rhythm is the Flow
Mathematical vertical spacing based on <code>1rlh</code> (root line-height) creates visual harmony and guides the eye naturally through content.

### Consistent Spacing

All elements automatically align to the baseline grid. Headings, paragraphs, lists, blockquotes, forms, and media all follow the same rhythmic system.

<div class="card inset">
  #### tight Rhythm
  Spacing multiplier: 0.75x
  <ul class="tight">
    <li>Closer spacing</li>
    <li>More compact</li>
  </ul>
</div>
<div class="card inset">
  <h4 class="mt-d">compact Rhythm</h4>
  <p>Spacing multiplier: 0.75×</p>
  <ul class="compact">
    <li>Closer spacing</li>
    <li>More compact</li>
  </ul>
</div>
<div class="card inset">
  <h4 class="mt-d">Normal Rhythm</h4>
  <p>Spacing multiplier: 1×</p>
  <ul>
    <li>Normal breathing room</li>
    <li>Commmfortable</li>
  </ul>
</div>
<div class="card inset">
  <h4 class="mt-d">relaxed Rhythm</h4>
  <p>Spacing multiplier: 1.5×</p>
  <ul class="relaxed">
    <li>More breathing room</li>
    <li>Generous spacing</li>
  </ul>
</div>

### Lists & Hierarchy

Lists maintain rhythm with proper indentation:

* Unordered lists use centered bullets
* Proper indentation with `--rhythm`
* Nested lists maintain rhythm
  * Second level nesting
  * Consistent spacing
    * Third level nesting

1. Ordered lists use right-aligned numbers
2. Tabular number formatting
3. Mathematical precision
   1. Nested ordered lists
   2. Maintain alignment

### Special Elements
Blockquotes, code blocks, and figures get generous spacing:

> Special elements receive <code>--rhythm-block-gap-special</code> (2× rhythm) to create visual breathing room and emphasize their importance.

<figure>
  <div class="demo-placeholder">[Figure Placeholder]</div>
  <figcaption>Figures and captions maintain rhythm spacing</figcaption>
</figure>

## Color is the Emotion
Automatic light/dark theming with analog-inspired colors. Zero configuration— respects <code>prefers-color-scheme</code> automatically.

### Color Palette

  <div class="grid-4 sm:grid-3">
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-red); color: var(--color-background)"
      >Red
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-orange); color: var(--color-background)"
      >Orange
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-yellow); color: var(--color-background)"
      >Yellow
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-green); color: var(--color-background)"
      >Green
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-cyan); color: var(--color-background)"
      >Cyan
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="border-color:var(--color-blue); background: color-mix(in srgb, var(--color-blue) 90%, var(--color-background-secondary)); color: var(--color-background)"
      >Blue
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-purple); color: var(--color-background)"
      >Purple
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card center"
        style="background: var(--color-pink); color: var(--color-background)"
      >Pink
      </div>
    </div>
  </div>

### Semantic Colors

  <div class="grid-4 sm:grid-2">
    <div>
      <div
        class="card center"
        style="background: var(--color-background); color: var(--color-foreground)"
      >Background
      </div>
    </div>
    <div>
      <div
        class="card center"
        style="background: var(--color-foreground); color: var(--color-background)"
      >Foreground
      </div>
    </div>
    <div>
      <div class="card center" style="background: var(--color-background-secondary)">Secondary</div>
    </div>
    <div>
      <div class="card center" style="background: var(--color-accent)">Accent</div>
    </div>
  </div>

### Text Colors

Normal text color
  <p class="muted">Muted text (60% opacity)</p>
  <p class="subtle">Subtle text (40% opacity)</p>
  <p class="accent">Accent color text</p>
  <p class="success">Success message</p>
  <p class="warning">Warning message</p>
  <p class="error">Error message</p>

## Reading Layout System<

Editorial-quality layouts for long-form content. Inspired by centuries of book design with flexible content areas.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<div class="container-small card">
  <h4>Small Area</h4>
  <p>
    Perfect for supplementary information, footnotes, or sidebar content that doesn't need full
    width.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</div>

Main content continues here in the default area.

<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
  non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
<div class="container-accent card">
  <h4>Accent Area</h4>
  <p>
    Ideal for pullquotes, highlighted content, or important information that deserves extra
    attention.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</div>
<div class="container-feature card">
  <h4>Feature Area</h4>
  <div class="demo-placeholder">Wide Feature Content</div>
  <p class="text-muted small" style="text-align: center">
    Perfect for images, videos, tables, or wide content
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</div>
<div class="container-hero card inset">
  <h4>Full Width Area</h4>
  <p>Extends to complete container width for full-bleed backgrounds or spanning content.</p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</div>

### Image Galleries
Multiple images in a paragraph create automatic galleries:

<p>
  <img src="https://picsum.photos/400/300?random=1" alt="Demo 1" />
  <img src="https://picsum.photos/400/300?random=2" alt="Demo 2" />
  <img src="https://picsum.photos/400/300?random=3" alt="Demo 3" />
</p>
<p>
  <img src="https://picsum.photos/800/400?random=4" alt="Wide demo" />
</p>

<div class="comments-box"><div id="comments">
        <div class="comment" data-id="1762449150577-juzyfccm8" data-level="0" data-pending="true" "="">
          <div class="comment-header">
            <span class="comment-author">Francis</span>
            <span class="comment-date">3h ago</span>
            <span class="comment-pending">Awaiting moderation</span>
          </div>
          <div class="comment-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
        </div>
        <div class="comment" data-id="1762449106853-7dcdhny1w" data-level="0" data-pending="true" "="">
          <div class="comment-header">
            <span class="comment-author">awdawdawdawd</span>
            <span class="comment-date">3h ago</span>
            <span class="comment-pending">Awaiting moderation</span>
          </div>
          <div class="comment-content">adw</div>
        </div>
      </div>
<button id="show-comment-form-btn" type="button" class="button" onclick="document.getElementById('comment-form-wrapper').style.display='block'; this.style.display='none';">Write a Comment</button>
<div id="comment-form-wrapper" style="display: none;">
  <form id="comment-form" method="post" action="/api/comments" novalidate="" hx-disable="true">
  <fieldset>
    <legend>Leave a Comment</legend>
    <label for="author">Your Name <span aria-label="required">*</span></label>
      <input type="text" id="author" name="author" placeholder="Your name will be displayed with your comment." required="" maxlength="100">
      <label for="email">Email Address <span aria-label="required">*</span></label>
      <input type="email" id="email" name="email" placeholder="Your email will not be displayed publicly." required="">
      <label for="content">Comment <span aria-label="required">*</span></label>
      <textarea id="content" name="content" placeholder="Share your thoughts... Supports **bold**, *italic*, `code`, and [links](url)" required="" minlength="3" maxlength="10000" rows="6"></textarea>
    <!-- Hidden fields (REQUIRED - do not remove) -->
    <input type="hidden" id="pageId" name="pageId" value="n_camping">
    <input type="hidden" id="parentId" name="parentId" value="">
    <!-- Status indicator -->
    <div id="form-status" role="status" aria-live="polite"></div>
    <!-- Submit buttons -->
    <div class="form-actions">
      <button type="submit" class="button">Post Comment</button>
      <button type="reset" class="button">Clear</button>
    </div>
    <!-- Privacy notice -->
    <!--p class="smaller">
        By submitting a comment, you agree to our
        <a href="/privacy/" preload>privacy policy</a> and
        <a href="/terms/" preload>terms of service</a>.
    </p-->
  </fieldset>
</form>
</div></div>

## Form Elements
Consistent form styling that integrates with the rhythm system and color management.

  <form>
    <fieldset>
      <legend>Contact Information</legend>
      <label for="name">Full Name</label>
      <input type="text" id="name" placeholder="John Doe" />
      <label for="email">Email Address</label>
      <input type="email" id="email" placeholder="john@example.com" />
      <label for="message">Message</label>
      <textarea id="message" rows="4" placeholder="Your message here..."></textarea>
        <input type="checkbox" id="newsletter" />
        <label for="newsletter">Subscribe to newsletter</label>
        <input type="radio" id="option1" name="option" />
        <label for="option1">Option 1</label>
        <input type="radio" id="option2" name="option" />
        <label for="option2">Option 2</label>
    </fieldset>
    <div class="button-group">
      <button type="submit">Send Message</button>
      <button type="reset">Reset Form</button>
    </div>
  </form>

## Markdown Enhancements

Add the <code>.md</code> class for enhanced callouts and formatting:

::callout note
Standard callout for general information and notes.
::end

::callout warning
Warning callout for cautionary information.
::end

::callout important
Important callout for critical information.
::end

::callout + Custom title
Click the title to expand and collapse this content.
::end