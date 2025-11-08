---
aliases: []
created: 2025-10-11 19:02
modified: 2025-10-12 23:51
cssclasses: [reflexion]
maturity:
publish: false
tags: []
type: note
lang: en
visibility: public
---

# Standard Framework

::muted Typography is the voice · Grid is the structure · Rhythm is the flow · Color is the emotion

A fine-art design framework implementing classical typography, Swiss grid systems, and vertical rhythm with mathematical precision inspired by centuries of print mastery.
  
### Contents

<ol>
  <li><a href="#typography">Typography System</a></li>
  <li><a href="#grid">Grid System</a></li>
  <li><a href="#rhythm">Vertical Rhythm</a></li>
  <li><a href="#color">Color Management</a></li>
  <li><a href="#reading">Reading Layout</a></li>
  <li><a href="#forms">Form Elements</a></li>
</ol>
<h2 id="typography">Typography is the Voice</h2>
<div class="card">
  Standard implements fine-art typography with smart quotes, proper punctuation, widow
  prevention, and multi-locale support. The golden ratio governs all typographic relationships.
</div>
<h3>Heading Hierarchy</h3>
<p>
  Each heading level maintains precise mathematical relationships based on the golden ratio (φ =
  1.618).
</p>
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

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  <h3 class="circular">Heading Level 3</h3>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h4>Heading Level 4</h4>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h5>Heading Level 5</h5>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
  <h6>Heading Level 6</h6>
  <p>Body text with <strong>bold emphasis</strong> and <em>italic stress</em>.</p>
</div>
<h3>Smart Typography</h3>
<p>
  The JavaScript engine automatically enhances your text with proper typographic conventions:
</p>
<ul>
  <li>"Straight quotes" become "curly quotes"</li>
  <li>Double hyphens -- become em-dashes—like this</li>
  <li>Three periods... become proper ellipsis…</li>
  <li>Fractions like 1/2 become ½</li>
  <li>No orphaned words on last lines</li>
</ul>
<blockquote>
  "Typography is the craft of endowing human language with a durable visual form."
  <cite>— Robert Bringhurst</cite>
</blockquote>
<h3>Code & Monospace</h3>
<p>
  Inline code like <code>const standard = new Standard()</code> and code blocks maintain rhythm:
</p>
<pre><code>// Initialize Standard
        const standard = new Standard({
          locale: 'en',
          enableSmartQuotes: true,
          enableWidowPrevention: true,
          observeDOM: true
        });
    </code></pre>
<div class="feature">
  <h2 id="grid">Grid is the Structure</h2>
  <p>
    A Swiss-style 12-column responsive grid with logical properties. Inspired by Josef
    Müller-Brockmann and the International Typographic Style.
  </p>
  <h3>Basic Columns</h3>
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
  <h3>Responsive Grid</h3>
  <p>Columns adapt at breakpoints (md: #{$small}, lg: #{$large}):</p>
  <div class="grid">
    <div class="sm:row col-6 lg:col-4 card">12 → 6 → 4</div>
    <div class="sm:row col-6 lg:col-4 card">12 → 6 → 4</div>
    <div class="sm:row col-12 lg:col-4 card">12 → 12 → 4</div>
  </div>
  <h3>Free Column Positioning</h3>
  <p>Precise control with CSS variables:</p>
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
  <h3>Gap Variants</h3>
  <div class="grid compact">
    <div class="col-4 card">compact gaps</div>
    <div class="col-4 card">compact gaps</div>
    <div class="col-4 card">compact gaps</div>
  </div>
  <div class="grid wide">
    <div class="col-4 card">Wide gaps</div>
    <div class="col-4 card">Wide gaps</div>
    <div class="col-4 card">Wide gaps</div>
  </div>
</div>
<h2 id="rhythm">Rhythm is the Flow</h2>
<p>
  Mathematical vertical spacing based on <code>1rlh</code> (root line-height) creates visual
  harmony and guides the eye naturally through content.
</p>
<h3>Consistent Spacing</h3>
<p>
  All elements automatically align to the baseline grid. Headings, paragraphs, lists,
  blockquotes, forms, and media all follow the same rhythmic system.
</p>
<div class="card inset tight">
  <h4 class="mt-d">tight Rhythm</h4>
  <p>Spacing multiplier: 0.75×</p>
  <ul>
    <li>Closer spacing</li>
    <li>More compact</li>
  </ul>
</div>
<div class="card inset compact">
  <h4 class="mt-d">compact Rhythm</h4>
  <p>Spacing multiplier: 0.75×</p>
  <ul>
    <li>Closer spacing</li>
    <li>More compact</li>
  </ul>
</div>
<div class="card inset relaxed">
  <h4 class="mt-d">relaxed Rhythm</h4>
  <p>Spacing multiplier: 1.5×</p>
  <ul>
    <li>More breathing room</li>
    <li>Generous spacing</li>
  </ul>
</div>
<h3>Lists & Hierarchy</h3>
<p>Lists maintain rhythm with proper indentation:</p>
<ul>
  <li>Unordered lists use centered bullets</li>
  <li>Proper indentation with <code>--rhythm</code></li>
  <li>
    Nested lists maintain rhythm
    <ul>
      <li>Second level nesting</li>
      <li>
        Consistent spacing
        <ul>
          <li>Third level nesting</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
<ol>
  <li>Ordered lists use right-aligned numbers</li>
  <li>Tabular number formatting</li>
  <li>
    Mathematical precision
    <ol>
      <li>Nested ordered lists</li>
      <li>Maintain alignment</li>
    </ol>
  </li>
</ol>
<h3>Special Elements</h3>
<p>Blockquotes, code blocks, and figures get generous spacing:</p>
<blockquote>
  Special elements receive <code>--rhythm-block-gap-special</code> (2× rhythm) to create visual
  breathing room and emphasize their importance.
</blockquote>
<figure>
  <div class="demo-placeholder">[Figure Placeholder]</div>
  <figcaption>Figures and captions maintain rhythm spacing</figcaption>
</figure>
<div class="container-feature">
  <h2 id="color">Color is the Emotion</h2>
  <p>
    Automatic light/dark theming with analog-inspired colors. Zero configuration— respects
    <code>prefers-color-scheme</code> automatically.
  </p>
  <h3>Color Palette</h3>
  <div class="grid-4 sm:grid-3">
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-red); color: var(--color-background)"
      >Red
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-orange); color: var(--color-background)"
      >Orange
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-yellow); color: var(--color-background)"
      >Yellow
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-green); color: var(--color-background)"
      >Green
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-cyan); color: var(--color-background)"
      >Cyan
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="border-color:var(--color-blue); background: color-mix(in srgb, var(--color-blue) 90%, var(--color-background-secondary)); color: var(--color-background)"
      >Blue
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-purple); color: var(--color-background)"
      >Purple
      </div>
    </div>
    <div class="sm:col-1">
      <div
        class="card"
        style="background: var(--color-pink); color: var(--color-background)"
      >Pink
      </div>
    </div>
  </div>
  <h3>Semantic Colors</h3>
  <div class="grid-3 sm:grid-2">
    <div>
      <div
        class="card"
        style="background: var(--color-background); color: var(--color-foreground)"
      >Background
      </div>
    </div>
    <div>
      <div
        class="card"
        style="background: var(--color-foreground); color: var(--color-background)"
      >Foreground
      </div>
    </div>
    <div class="sm:row">
      <div class="card" style="background: var(--color-background-secondary)">Secondary</div>
    </div>
  </div>
  <h3>Text Colors</h3>
  <p>Normal text color</p>
  <p class="text-muted">Muted text (60% opacity)</p>
  <p class="text-subtle">Subtle text (40% opacity)</p>
  <p class="text-accent">Accent color text</p>
  <p class="text-success">Success message</p>
  <p class="text-warning">Warning message</p>
  <p class="text-error">Error message</p>
</div>
<h2 id="reading">Reading Layout System</h2>
<p>
  Editorial-quality layouts for long-form content. Inspired by centuries of book design with
  flexible content areas.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
  non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
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
<p>Main content continues here in the default area.</p>
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
<div class="container-feature">
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
<h3>Image Galleries</h3>
<p>Multiple images in a paragraph create automatic galleries:</p>
<p class="small">
  <img src="https://picsum.photos/400/300?random=1" alt="Demo 1" />
  <img src="https://picsum.photos/400/300?random=2" alt="Demo 2" />
  <img src="https://picsum.photos/400/300?random=3" alt="Demo 3" />
</p>
<p>
  <img src="https://picsum.photos/800/400?random=4" alt="Wide demo" />
</p>
<div class="comments-box container-small"><div id="comments">
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
<div>
  <h2 id="forms">Form Elements</h2>
  <p>Consistent form styling that integrates with the rhythm system and color management.</p>
  <form class="small">
    <fieldset>
      <legend>Contact Information</legend>
      <label for="name">Full Name</label>
      <input type="text" id="name" placeholder="John Doe" />
      <label for="email">Email Address</label>
      <input type="email" id="email" placeholder="john@example.com" />
      <label for="message">Message</label>
      <textarea id="message" rows="4" placeholder="Your message here..."></textarea>
      <div>
        <input type="checkbox" id="newsletter" />
        <label for="newsletter">Subscribe to newsletter</label>
      </div>
      <div>
        <input type="radio" id="option1" name="option" />
        <label for="option1">Option 1</label>
        <input type="radio" id="option2" name="option" />
        <label for="option2">Option 2</label>
      </div>
    </fieldset>
    <div class="button-group">
      <button type="submit">Send Message</button>
      <button type="reset">Reset Form</button>
    </div>
  </form>
</div>
<div class="feature md">
  <h2 id="markdown">Markdown Enhancements</h2>
  <p>Add the <code>.md</code> class for enhanced callouts and formatting:</p>
  <div class="callout" data-callout="note">
    <div class="callout-title">Note</div>
    <div class="callout-content">
      <p>Standard callout for general information and notes.</p>
    </div>
  </div>
  <div class="callout" data-callout="warning">
    <div class="callout-title">Warning</div>
    <div class="callout-content">
      <p>Warning callout for cautionary information.</p>
    </div>
  </div>
  <div class="callout" data-callout="important">
    <div class="callout-title">Important</div>
    <div class="callout-content">
      <p>Important callout for critical information.</p>
    </div>
  </div>
  <details class="callout" data-callout="note">
    <summary>
      <div class="callout-title">Collapsible Callout</div>
    </summary>
    <div class="callout-content">
      <p>Click the title to expand and collapse this content.</p>
    </div>
  </details>
</div>
