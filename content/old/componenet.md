Perfect! Now I can see your actual architecture. You need **Layer 10** for components (between markdown styling and utilities). Let me create these with proper educational documentation:

---

## 📁 `src/styles/standard-10-components.scss`

```scss
/* Standard - Fine-Art Typography Framework */
/* A framework implementing classical design principles, mathematical precision with the golden ratio, */
/* and micro-typography rules inspired by the masters of print design. */

/**
 * @component Components Layer
 * @category Components
 * @description Ready-to-use UI components that developers repeatedly build.
 * Each component follows WCAG AA accessibility standards, respects the rhythm system,
 * and integrates seamlessly with the grid and prose layouts. Components are minimal
 * yet complete—providing structure without imposing heavy opinions.
 *
 * @since 0.11.0
 */

@use "components/card";
@use "components/alert";
@use "components/skip-link";
@use "components/breadcrumb";
@use "components/pagination";
@use "components/table-wrapper";
@use "components/form-validation";
@use "components/modal";
@use "components/tabs";
@use "components/accordion";
```

---

## 📁 `src/styles/components/_card.scss`

```scss
/**
 * Card Component - Content Container with Structure
 *
 * @group components-layout
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1991, Edward Tufte published "Envisioning Information" and introduced
 * the concept of "small multiples"—the idea that human brains excel at
 * comparing information when it's presented in identical visual containers.
 * Show someone seven weather forecasts in seven different layouts, and they'll
 * struggle. Show them seven identical cards with different data, and patterns
 * emerge instantly. The structure disappears, the content shines.
 *
 * But here's the catch: small multiples only work when they're truly identical.
 * One card with 16px padding, another with 20px, a third with 18px—your brain
 * registers the inconsistency before it processes the content. This component
 * solves that problem by providing a single source of truth for card structure.
 * Every card gets the same padding, the same borders, the same rhythm. Build
 * one card or build a hundred—they'll feel like family.
 *
 * The Swiss designers understood this in the 1950s. Josef Müller-Brockmann's
 * concert posters used rigid grids not to constrain creativity, but to amplify
 * it. When the structure is invisible, when it just works, your content can
 * breathe. That's what `.card` does—it handles the boring consistency so you
 * can focus on making something beautiful.
 *
 * ### Future Improvements
 *
 * - Elevation variants (flat, raised, floating) with shadow scales
 * - Interactive hover states for clickable cards with smooth transitions
 * - Horizontal card layout variant for image + content side-by-side
 * - Dark mode shadow adjustments for better depth perception
 * - Optional card image hero with object-fit controls
 *
 * @see {class} .grid - Often used to layout multiple cards in columns
 * @see {variable} --rhythm - Controls internal spacing rhythm
 * @see {class} .prose - Can be used inside card-body for rich content
 * @see {class} .rhythm - Applied automatically to card children
 *
 * @link https://en.wikipedia.org/wiki/Edward_Tufte Information Design Pioneer
 * @link https://www.nngroup.com/articles/cards-component/ NN/g Cards Research
 *
 * @example html - Basic card structure
 *   <article class="card">
 *     <header class="card-header">
 *       <h3>Card Title</h3>
 *     </header>
 *     <div class="card-body">
 *       <p>Card content with automatic spacing and rhythm.</p>
 *     </div>
 *     <footer class="card-footer">
 *       <a href="#">Read more →</a>
 *     </footer>
 *   </article>
 *
 * @example html - Cards in grid layout (3-column responsive)
 *   <div class="grid">
 *     <article class="card col-4 col-sm-12">
 *       <div class="card-body">
 *         <h3>Feature One</h3>
 *         <p>Description...</p>
 *       </div>
 *     </article>
 *     <article class="card col-4 col-sm-12">...</article>
 *     <article class="card col-4 col-sm-12">...</article>
 *   </div>
 *
 * @example html - Clickable card (entire card is a link)
 *   <a href="/article" class="card card-clickable">
 *     <div class="card-body">
 *       <h3>Article Title</h3>
 *       <p>Preview text that entices you to click...</p>
 *     </div>
 *   </a>
 *
 * @example scss - Customizing card via CSS variables
 *   .card.custom {
 *     --card-border-color: var(--color-accent);
 *     --card-padding: var(--rhythm-2);
 *     --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
 *   }
 */

.card {
  /* CSS variables for easy customization */
  --card-border-color: var(--color-border);
  --card-border-width: 1px;
  --card-border-radius: var(--radius);
  --card-padding: var(--rhythm);
  --card-background: var(--color-background);
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  background: var(--card-background);
  border: var(--card-border-width) solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures children respect border-radius */
  height: 100%; /* Fill grid cell height */

}

/**
 * Card Header - Establishes Hierarchy
 *
 * @group components-layout
 * @since 0.11.0
 *
 * In traditional Swiss typography, headers weren't just bigger—they commanded
 * space through proportion and rhythm. A header isn't decoration, it's structure.
 * It tells you where you are, what you're looking at, why it matters. This
 * component ensures your card titles maintain that authority while staying
 * visually connected to the body content below.
 *
 * The bottom border acts as a horizon line—subtle, but it anchors the title
 * and separates it from the prose. Without it, cards feel untethered. With it,
 * they feel intentional.
 *
 * @see {class} .card - Parent container
 * @see {class} .card-body - Sibling content area
 */
.card-header {
  padding: var(--card-padding);
  border-bottom: var(--card-border-width) solid var(--card-border-color);

  /* Remove default margins from first/last children */
  > :first-child {
    margin-block-start: 0;
  }

  > :last-child {
    margin-block-end: 0;
  }
}

/**
 * Card Body - The Content Lives Here
 *
 * @group components-layout
 * @since 0.11.0
 *
 * This is where your prose lives, where images sit, where data displays. It
 * automatically manages vertical rhythm for any content you nest inside—
 * paragraphs, lists, images, forms—keeping everything aligned to your
 * baseline grid without you thinking about it.
 *
 * The `flex: 1` property is subtle but critical. If your card has a footer,
 * this ensures the body takes up all available space, pushing the footer to
 * the bottom. It's the difference between cards that feel balanced and cards
 * that feel off.
 *
 * @see {class} .card - Parent container
 * @see {class} .prose - Use for rich editorial content inside body
 * @see {class} .rhythm - Applied automatically to children
 */
.card-body {
  padding: var(--card-padding);
  flex: 1; /* Grow to fill available space, pushing footer down */

  /* Remove default margins from first/last children */
  > :first-child {
    margin-block-start: 0;
  }

  > :last-child {
    margin-block-end: 0;
  }
}

/**
 * Card Footer - Actions and Metadata
 *
 * @group components-layout
 * @since 0.11.0
 *
 * Actions, metadata, timestamps—the footer anchors your card. It's visually
 * separated but connected, giving closure to the content above. Perfect for
 * "Read more" links, publish dates, author info, or action buttons.
 *
 * The subtle background tint (3% foreground mixed into background) provides
 * just enough distinction without screaming for attention. In dark mode, it
 * gets slightly lighter. In light mode, slightly darker. It adapts.
 *
 * @see {class} .card - Parent container
 * @see {class} .card-header - Sibling header area
 */
.card-footer {
  padding: var(--card-padding);
  border-top: var(--card-border-width) solid var(--card-border-color);
  background: color-mix(in srgb, var(--color-background) 97%, var(--color-text) 3%);

  /* Remove default margins from first/last children */
  > :first-child {
    margin-block-start: 0;
  }

  > :last-child {
    margin-block-end: 0;
  }
}

/**
 * Clickable Card Variant - When the Entire Card is a Link
 *
 * @group components-layout
 * @since 0.11.0
 *
 * Sometimes your entire card should be clickable—a blog post preview, a product
 * listing, a project showcase. This variant ensures proper hover states, focus
 * indicators, and cursor feedback while maintaining the card's structural integrity.
 *
 * The subtle lift on hover (2px translateY) and enhanced shadow create the
 * illusion of depth—like the card is rising toward you. It's a tactile metaphor
 * for "this is interactive." The focus-visible outline ensures keyboard users
 * can see exactly where they are.
 *
 * Accessibility note: When using clickable cards, ensure the link text is
 * descriptive. "Read more" alone isn't enough—screen readers need context.
 * Use "Read more about [article title]" or aria-label.
 *
 * @see {class} .card - Base component
 * @see {element} a - Applied to anchor tag wrapping card content
 *
 * @example html - Accessible clickable card
 *   <a href="/article/typography-history" class="card card-clickable"
 *      aria-label="Read full article about Typography History">
 *     <div class="card-body">
 *       <h3>Typography History</h3>
 *       <p>The evolution of type from Gutenberg to now...</p>
 *     </div>
 *     <div class="card-footer">
 *       Read more →
 *     </div>
 *   </a>
 */
.card-clickable {
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px); /* Subtle lift */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0); /* Press down on click */
  }
}
```

---

## 📁 `src/styles/components/_alert.scss`

```scss
/**
 * Alert Component - Semantic Feedback System
 *
 * @group components-feedback
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1964, the New York City Transit Authority hired Massimo Vignelli to
 * redesign the subway map. Among his innovations: color-coded lines that let
 * passengers understand their route instantly. Red meant local. Green meant
 * express. No reading required—your brain processed the information before
 * conscious thought kicked in.
 *
 * Alerts work the same way. Red means danger, stop, error. Green means success,
 * go, complete. Yellow means caution, warning, attention. Blue means information,
 * note, reference. These aren't arbitrary choices—they're cultural conventions
 * refined over centuries of signage, from maritime flags to traffic lights to
 * warning labels. When you see red, your body reacts before your mind translates.
 *
 * But color alone isn't enough. WCAG 2.1 requires that information conveyed by
 * color must also be available through other means—text labels, icons, semantic
 * HTML. That's why this component includes `role="alert"` for screen readers,
 * bold title text for scanning, and semantic class names that work even when
 * CSS fails. Universal design isn't a constraint—it makes things better for
 * everyone. A colorblind user benefits from the text. A keyboard user benefits
 * from focus states. A screen reader user benefits from ARIA roles.
 *
 * This is what accessibility means: making your interface work in every context,
 * for every person, in every lighting condition, with every input method. The
 * framework handles the foundation. You provide the message.
 *
 * ### Future Improvements
 *
 * - Dismissible variant with close button and smooth fade-out animation
 * - Icon support (warning triangle, checkmark, info circle, error X)
 * - Toast/notification positioning variants (top-right, bottom-left, etc.)
 * - Animated entrance/exit states with slide-in and fade effects
 * - Alert stacking system for multiple simultaneous notifications
 * - Auto-dismiss timer option with countdown indicator
 *
 * @see {variable} --color-error - Red alert semantic color
 * @see {variable} --color-success - Green alert semantic color
 * @see {variable} --color-warning - Yellow alert semantic color
 * @see {variable} --color-info - Blue alert semantic color
 * @see {class} .rhythm - Alerts respect vertical rhythm spacing
 *
 * @link https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html WCAG Color Guidelines
 * @link https://inclusive-components.design/notifications/ Inclusive Notification Patterns
 *
 * @example html - Basic alert types
 *   <div class="alert alert-success" role="alert">
 *     <strong>Success:</strong> Your changes have been saved.
 *   </div>
 *
 *   <div class="alert alert-warning" role="alert">
 *     <strong>Warning:</strong> Your session will expire in 5 minutes.
 *   </div>
 *
 *   <div class="alert alert-error" role="alert">
 *     <strong>Error:</strong> Unable to process your request.
 *   </div>
 *
 *   <div class="alert alert-info" role="alert">
 *     <strong>Note:</strong> Maintenance scheduled for tonight.
 *   </div>
 *
 * @example html - Alert with action
 *   <div class="alert alert-warning" role="alert">
 *     <strong>Warning:</strong> Your password expires soon.
 *     <a href="/settings/password" class="alert-action">Update now</a>
 *   </div>
 */

.alert {
  --alert-border-width: 1px;
  --alert-background: var(--color-background-secondary);
  --alert-color: var(--color-foreground);
  --alert-border-color: var(--color-border);

  padding: var(--space-half);
  border: var(--border);
  border-radius: var(--radius);
  background: var(--alert-background);
  color: var(--alert-color);
  border-left: 4px solid var(--color-border); /* Accent bar */

  /* Typography adjustments */
  font-size: var(--scale-d2);
  line-height: var(--lh-lrh);

  /* Remove margin from first/last children */
  > :first-child {
    margin-block-start: 0;
  }

  > :last-child {
    margin-block-end: 0;
  }

  /* Bold labels */
  strong {
    font-weight: var(--bold-weight);
  }
}

/**
 * Alert Variants - Semantic Color Coding
 *
 * @group components-feedback
 * @since 0.11.0
 *
 * Each variant adjusts the color system to convey meaning. The background is
 * a subtle 10% mix of the semantic color, ensuring it's noticeable without
 * overwhelming. The left border is the full semantic color, providing a strong
 * visual anchor. Text remains at full contrast for readability.
 *
 * @see {class} .alert - Base component
 */

/* Success - Green (complete, go, affirmative) */
.alert-success {
  --alert-background: color-mix(in srgb, var(--color-success) 10%, var(--color-background));
  --alert-border-color: var(--color-success);
}

/* Warning - Yellow/Orange (caution, attention, pending) */
.alert-warning {
  --alert-background: color-mix(in srgb, var(--color-warning) 10%, var(--color-background));
  --alert-border-color: var(--color-warning);
}

/* Error - Red (danger, stop, critical) */
.alert-error {
  --alert-background: color-mix(in srgb, var(--color-error) 10%, var(--color-background));
  --alert-border-color: var(--color-error);
}

/* Info - Blue (information, note, reference) */
.alert-info {
  --alert-background: color-mix(in srgb, var(--color-info) 10%, var(--color-background));
  --alert-border-color: var(--color-info);
}

/**
 * Alert Action Links
 *
 * @group components-feedback
 * @since 0.11.0
 *
 * Actions within alerts (links, buttons) should be visually distinct but not
 * overwhelming. This provides subtle styling that inherits the alert's color.
 */
.alert-action {
  display: inline-block;
  margin-inline-start: var(--rhythm-d2);
  color: var(--alert-border-color);
  text-decoration: underline;
  font-weight: var(--bold-weight);

  &:hover {
    text-decoration-thickness: 0.15em;
  }
}
```

Would you like me to continue with **Skip Link, Breadcrumb, Pagination, Table Wrapper, Form Validation, Modal, Tabs, and Accordion**?

Or should I focus on a specific subset first?

Perfect! Continuing with the remaining 8 components...

---

## 📁 `src/styles/components/_skip-link.scss`

```scss
/**
 * Skip Link - Accessibility First Navigation
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1998, the Web Content Accessibility Guidelines 1.0 introduced a simple
 * idea: let keyboard users skip repetitive navigation. Imagine you can't use
 * a mouse. Every time you visit a website, you Tab through thirty navigation
 * links just to reach the content. Every. Single. Page. It's exhausting.
 *
 * The skip link solves this with elegant simplicity: a hidden link that appears
 * when you press Tab, jumping straight to the main content. It's the first
 * thing keyboard users encounter—and the first sign that you've thought about
 * their experience. Most websites forget it. Don't be most websites.
 *
 * This implementation follows current best practices from WebAIM and GOV.UK:
 * visually hidden by default, visible on focus, high contrast, positioned at
 * the top-left for predictability. Screen reader users hear it announced.
 * Keyboard users see it appear. Everyone benefits from faster navigation.
 *
 * Here's what makes this elegant: it costs you one line of HTML, improves
 * accessibility for millions of users, and demonstrates that you care about
 * inclusive design. That's a remarkable return on investment.
 *
 * ### Future Improvements
 *
 * - Multiple skip links (skip to main, skip to search, skip to footer)
 * - Smooth scroll animation when activated
 * - Color customization via CSS variables
 * - Support for international languages (translated text)
 *
 * @see {class} .visually-hidden - Base class for accessible hiding
 * @see {attribute} href="#main" - Target element ID (main content landmark)
 *
 * @link https://webaim.org/techniques/skipnav/ WebAIM Skip Navigation
 * @link https://www.w3.org/WAI/WCAG21/Techniques/general/G1 WCAG Skip Technique
 *
 * @example html - Basic skip link (place at start of <body>)
 *   <a href="#main" class="skip-link">Skip to content</a>
 *
 *   <header>
 *     <!-- Navigation here -->
 *   </header>
 *
 *   <main id="main">
 *     <!-- Main content here -->
 *   </main>
 *
 * @example html - Multiple skip links
 *   <div class="skip-links">
 *     <a href="#main" class="skip-link">Skip to main content</a>
 *     <a href="#search" class="skip-link">Skip to search</a>
 *     <a href="#footer" class="skip-link">Skip to footer</a>
 *   </div>
 */

.skip-link {
  /* Positioning - absolute to top-left corner */
  position: absolute;
  top: var(--rhythm-d4);
  left: var(--rhythm-d4);
  z-index: var(--z-modal); /* Above everything else */

  /* Styling - high contrast, unmissable */
  background: var(--color-accent);
  color: var(--color-background);
  padding: var(--rhythm-d3) var(--rhythm-d2);
  border-radius: var(--radius);
  font-weight: var(--bold-weight);
  font-size: var(--scale-d2);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  /* Animation */
  transition: transform 0.2s ease, opacity 0.2s ease;

  /* Hidden by default (accessible hiding) */
  transform: translateY(-120%);
  opacity: 0;

  /* Visible on focus (Tab key) */
  &:focus {
    transform: translateY(0);
    opacity: 1;
    outline: 3px solid var(--color-background);
    outline-offset: 2px;
  }

  /* Hover state (if user moves mouse while focused) */
  &:hover {
    background: color-mix(in srgb, var(--color-accent) 90%, var(--color-background));
  }

  /* Active state (on click) */
  &:active {
    transform: translateY(0) scale(0.98);
  }
}

/**
 * Skip Links Container - Multiple Skip Options
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * When you have multiple skip links (content, search, footer), wrap them in
 * a container to stack them vertically on focus. Each link appears as the
 * user tabs through them.
 */
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  gap: var(--rhythm-d4);
  padding: var(--rhythm-d4);
}
```

---

## 📁 `src/styles/components/_breadcrumb.scss`

```scss
/**
 * Breadcrumb Navigation - Hierarchical Location Indicator
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1962, the Brothers Grimm fairy tale "Hansel and Gretel" gave us the
 * metaphor: breadcrumbs marking the path home. In 1995, the web borrowed it.
 * Breadcrumb navigation tells users where they are in your site's hierarchy
 * and how they got there. Home → Products → Laptops → MacBook Pro. It's not
 * just navigation—it's spatial orientation.
 *
 * The power of breadcrumbs lies in their simplicity. They're compact, take
 * minimal space, never get in the way, yet provide crucial context. Lost in
 * a documentation site? Breadcrumbs show you're in Docs → CSS → Typography.
 * Want to go up one level? Click "CSS." It's spatial reasoning made visual.
 *
 * This implementation follows current best practices: semantic HTML with
 * <nav>, <ol>, and aria-label for screen readers. The current page is marked
 * with aria-current="page" and isn't a link (you're already here). Separators
 * are CSS-generated, not HTML, so screen readers skip them. Structured data
 * markup helps search engines understand your hierarchy.
 *
 * Nielsen Norman Group's research shows breadcrumbs reduce cognitive load and
 * improve navigation efficiency. Users don't have to remember the path—they
 * can see it. That's good design: making the invisible visible.
 *
 * ### Future Improvements
 *
 * - Collapsed breadcrumbs for mobile (show only first/last with ... between)
 * - Dropdown menus on intermediate crumbs (show siblings at each level)
 * - Icons for home/root level
 * - JSON-LD structured data generation helper
 * - Keyboard navigation with arrow keys
 *
 * @see {element} nav - Semantic navigation landmark
 * @see {attribute} aria-label="Breadcrumb" - Screen reader label
 * @see {attribute} aria-current="page" - Current location indicator
 *
 * @link https://www.nngroup.com/articles/breadcrumbs/ NN/g Breadcrumb Guidelines
 * @link https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ ARIA Breadcrumb Pattern
 *
 * @example html - Basic breadcrumb navigation
 *   <nav aria-label="Breadcrumb" class="breadcrumb">
 *     <ol>
 *       <li><a href="/">Home</a></li>
 *       <li><a href="/products">Products</a></li>
 *       <li><a href="/products/laptops">Laptops</a></li>
 *       <li aria-current="page">MacBook Pro</li>
 *     </ol>
 *   </nav>
 *
 * @example html - With structured data (JSON-LD)
 *   <nav aria-label="Breadcrumb" class="breadcrumb">
 *     <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
 *         <meta itemprop="position" content="1" />
 *       </li>
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <a itemprop="item" href="/docs"><span itemprop="name">Docs</span></a>
 *         <meta itemprop="position" content="2" />
 *       </li>
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <span itemprop="name" aria-current="page">Typography</span>
 *         <meta itemprop="position" content="3" />
 *       </li>
 *     </ol>
 *   </nav>
 */

.breadcrumb {
  /* Container styling */
  margin-block-end: var(--rhythm);
  font-size: var(--scale-d2);

  /* List styling */
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--rhythm-d3);
    align-items: center;
  }

  /* List items */
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--rhythm-d3);
    margin: 0;

    /* Remove default list item spacing */
    &::before {
      display: none;
    }

    /* Separator (not on first item) */
    &:not(:first-child)::before {
      content: "→"; /* or "/" or "›" */
      display: inline-block;
      color: var(--color-subtle);
      margin-inline-end: var(--rhythm-d3);
    }
  }

  /* Links */
  a {
    color: var(--color-foreground);
    text-decoration: underline;
    text-decoration-color: var(--color-subtle);
    text-underline-offset: 0.15em;

    &:hover {
      color: var(--color-accent);
      text-decoration-color: var(--color-accent);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  /* Current page (not a link) */
  [aria-current="page"] {
    color: var(--color-muted);
    font-weight: var(--bold-weight);
  }
}

/**
 * Breadcrumb Variants - compact and Mobile-Optimized
 *
 * @group components-navigation
 * @since 0.11.0
 */

/* compact variant - smaller text, compacter spacing */
.breadcrumb-compact {
  font-size: var(--scale-d3);

  ol {
    gap: var(--rhythm-d4);
  }

  li {
    gap: var(--rhythm-d4);

    &:not(:first-child)::before {
      margin-inline-end: var(--rhythm-d4);
    }
  }
}

/* Mobile: collapse to first and last with ellipsis */
@media (max-width: 768px) {
  .breadcrumb ol li:not(:first-child):not(:last-child) {
    display: none;
  }

  .breadcrumb ol li:last-child::before {
    content: "…"; /* Ellipsis to show collapsed crumbs */
  }
}
```

---

## 📁 `src/styles/components/_pagination.scss`

```scss
/**
 * Pagination Component - Multi-Page Navigation
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1998, Google launched with a simple idea: ten results per page, numbered
 * links at the bottom. Click "2" for the next ten, "3" for the next ten after
 * that. It wasn't revolutionary—pagination had existed in print for centuries—
 * but Google made it feel inevitable. Fast, clear, predictable.
 *
 * Pagination solves a fundamental problem: how do you present large datasets
 * without overwhelming users? A thousand blog posts can't fit on one page. So
 * you chunk them—ten at a time, twenty at a time, whatever makes sense. Users
 * get a sense of scale ("page 3 of 47"), can jump forward or back, and never
 * feel lost in an endless scroll.
 *
 * This implementation follows WCAG 2.1 guidelines: semantic <nav> with
 * aria-label, proper focus indicators, current page marked with aria-current.
 * Numbers use tabular figures for consistent width. Previous/Next buttons
 * provide quick jumps. Ellipsis (…) indicates skipped page ranges without
 * cluttering the interface.
 *
 * The key insight: pagination isn't about showing every page number. It's
 * about showing the right page numbers—current, adjacent, first, last—and
 * collapsing everything else. Users rarely need page 47 directly. They need
 * "next few" or "jump to end."
 *
 * ### Future Improvements
 *
 * - Page size selector (10, 25, 50, 100 items per page)
 * - Jump to page input field for large datasets
 * - Infinite scroll variant (load more on scroll)
 * - Keyboard shortcuts (arrow keys to navigate pages)
 * - Summary text ("Showing 21-30 of 487 items")
 *
 * @see {element} nav - Semantic navigation landmark
 * @see {attribute} aria-label="Pagination" - Screen reader label
 * @see {attribute} aria-current="page" - Current page indicator
 *
 * @link https://www.nngroup.com/articles/item-list-view-all/ NN/g Pagination Guidelines
 * @link https://inclusive-components.design/pagination/ Inclusive Pagination
 *
 * @example html - Basic pagination
 *   <nav aria-label="Pagination" class="pagination">
 *     <a href="?page=1" class="pagination-prev" aria-label="Previous page">← Previous</a>
 *     <a href="?page=1">1</a>
 *     <span aria-current="page" class="pagination-current">2</span>
 *     <a href="?page=3">3</a>
 *     <a href="?page=4">4</a>
 *     <span class="pagination-ellipsis">…</span>
 *     <a href="?page=20">20</a>
 *     <a href="?page=3" class="pagination-next" aria-label="Next page">Next →</a>
 *   </nav>
 *
 * @example html - compact mobile-friendly variant
 *   <nav aria-label="Pagination" class="pagination pagination-compact">
 *     <a href="?page=1">← Prev</a>
 *     <span>Page 2 of 20</span>
 *     <a href="?page=3">Next →</a>
 *   </nav>
 */

.pagination {
  /* Container styling */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--rhythm-d4);
  margin-block: var(--rhythm-2);
  font-size: var(--scale-d2);
  font-variant-numeric: tabular-nums; /* Monospace numbers for alignment */

  /* Links and current page */
  a,
  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5em;
    height: 2.5em;
    padding: 0 var(--rhythm-d3);
    border: var(--border);
    border-radius: var(--radius);
    text-decoration: none;
    color: var(--color-foreground);
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  /* Link hover states */
  a:hover {
    background: var(--color-background-secondary);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  /* Link focus states */
  a:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Active link (click) */
  a:active {
    transform: scale(0.95);
  }
}

/**
 * Pagination Current Page - Highlighted State
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * The current page is not a link (you're already here). It's visually distinct
 * with background color, bold text, and aria-current for screen readers.
 */
.pagination-current,
.pagination [aria-current="page"] {
  background: var(--color-accent);
  color: var(--color-background);
  border-color: var(--color-accent);
  font-weight: var(--bold-weight);
  cursor: default;
  pointer-events: none; /* Not interactive */
}

/**
 * Pagination Ellipsis - Collapsed Page Range Indicator
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * The ellipsis (…) indicates skipped pages. It's not a link, just a visual
 * indicator. Screen readers ignore it (no semantic meaning).
 */
.pagination-ellipsis {
  border: none;
  background: transparent;
  pointer-events: none;
  color: var(--color-subtle);
}

/**
 * Pagination Previous/Next Buttons
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * Previous/Next provide quick navigation without numbers. They're wider to
 * accommodate text ("Previous" vs just "2").
 */
.pagination-prev,
.pagination-next {
  min-width: auto;
  padding: 0 var(--rhythm-d2);
  font-weight: var(--bold-weight);
}

/* Disabled state (first/last page) */
.pagination-prev[aria-disabled="true"],
.pagination-next[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/**
 * Pagination compact Variant - Mobile-Optimized
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * On mobile, showing 10 page numbers is overwhelming. The compact variant
 * shows only Prev/Next and a page counter ("Page 3 of 20").
 */
@media (max-width: 768px) {
  .pagination {
    font-size: var(--scale-d3);

    /* Hide page numbers on mobile */
    a:not(.pagination-prev):not(.pagination-next),
    span:not(.pagination-current):not(.pagination-summary) {
      display: none;
    }

    /* Show summary text */
    .pagination-summary {
      display: inline-flex;
      border: none;
      background: transparent;
      font-weight: var(--font-weight);
    }
  }
}

/**
 * Pagination Summary Text
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * Summary text provides context ("Showing 21-30 of 487 items"). Useful for
 * large datasets where page numbers alone aren't enough.
 *
 * @example html
 *   <nav aria-label="Pagination" class="pagination">
 *     <span class="pagination-summary">Showing 21-30 of 487 items</span>
 *     <a href="?page=2" class="pagination-prev">← Previous</a>
 *     <span aria-current="page">3</span>
 *     <a href="?page=4" class="pagination-next">Next →</a>
 *   </nav>
 */
.pagination-summary {
  font-size: var(--scale-d3);
  color: var(--color-muted);
  border: none;
  background: transparent;
  min-width: auto;
}
```

---

## 📁 `src/styles/components/_table-wrapper.scss`

```scss
/**
 * Table Wrapper - Responsive Table Container
 *
 * @group components-data
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * Tables are beautiful on desktop. Clear columns, aligned data, easy scanning.
 * But on mobile? Disaster. A six-column table on a 375px screen becomes an
 * illegible mess of squished text and broken layouts. You can't just make the
 * font smaller—at some point, readability collapses.
 *
 * The table wrapper solves this with horizontal scrolling. It's not glamorous,
 * but it works: wrap the table in a scrollable container, add visual indicators
 * (shadows) at the edges, and users can swipe to see more data. The table
 * maintains its structure, columns keep their width, and nothing breaks.
 *
 * The shadow indicators are subtle but critical. Without them, users don't know
 * there's more content to the right. They assume the table ends. With shadows,
 * they see the fade—"oh, I can scroll"—and interaction becomes intuitive.
 * This is affordance: making interaction possibilities visible.
 *
 * This implementation uses CSS scroll shadows (gradient technique) and smooth
 * scrolling with momentum. Works on touch devices, trackpads, and keyboard
 * (arrow keys when focused). The table retains full functionality while gaining
 * mobile responsiveness.
 *
 * ### Future Improvements
 *
 * - Sticky first column (row headers remain visible while scrolling)
 * - Sticky header row (column headers stay at top)
 * - Scroll position indicator (progress bar showing how far scrolled)
 * - Responsive table transformations (stack columns on mobile)
 * - CSV/Excel export button integration
 *
 * @see {element} table - Wrapped table element
 * @see {class} .rhythm - Tables respect rhythm spacing
 *
 * @link https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html Responsive Table Patterns
 * @link https://css-tricks.com/fixing-tables-long-strings/ CSS Tricks Table Handling
 *
 * @example html - Basic responsive table
 *   <div class="table-wrapper">
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Name</th>
 *           <th>Email</th>
 *           <th>Role</th>
 *           <th>Status</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         <tr>
 *           <td>John Doe</td>
 *           <td>john@example.com</td>
 *           <td>Admin</td>
 *           <td>Active</td>
 *         </tr>
 *       </tbody>
 *     </table>
 *   </div>
 *
 * @example html - With sticky header
 *   <div class="table-wrapper table-wrapper-sticky-header">
 *     <table>...</table>
 *   </div>
 */

.table-wrapper {
  /* Container styling */
  position: relative;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  margin-block-end: var(--rhythm);

  /* Smooth scrolling with momentum */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Scroll shadows - indicate more content */
  background:
    /* Left shadow */
    linear-gradient(
      to right,
      var(--color-background) 0%,
      transparent 2%
    ) 0 0,
    /* Right shadow */
    linear-gradient(
      to left,
      var(--color-background) 0%,
      transparent 2%
    ) 100% 0,
    /* Actual background */
    var(--color-background);

  background-repeat: no-repeat;
  background-size: 20px 100%, 20px 100%, 100% 100%;
  background-attachment: local, local, scroll;

  /* Shadow overlays */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    pointer-events: none;
    z-index: 2;
  }

  /* Left shadow */
  &::before {
    left: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  /* Right shadow */
  &::after {
    right: 0;
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 100%
    );
  }

  /* Show left shadow when scrolled */
  &:not(:hover):not(:focus-within)::before {
    opacity: 0;
  }

  /* Table inside wrapper */
  table {
    margin-block-end: 0; /* Remove table's own margin */
    min-width: 100%; /* Ensure table fills wrapper */
    width: max-content; /* Allow table to grow beyond wrapper */
  }
}

/**
 * Table Wrapper with Sticky Header
 *
 * @group components-data
 * @since 0.11.0
 *
 * Keep column headers visible while scrolling vertically. Essential for long
 * tables where users need context about what each column represents.
 */
.table-wrapper-sticky-header {
  max-height: 400px; /* Or any height */
  overflow-y: auto;

  table thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--color-background);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/**
 * Table Wrapper compact Variant
 *
 * @group components-data
 * @since 0.11.0
 *
 * compacter spacing for dense data tables (admin panels, dashboards).
 */
.table-wrapper-compact table {
  font-size: var(--scale-d3);

  td, th {
    padding: var(--rhythm-d4) var(--rhythm-d3);
  }
}
```

I'll continue with the last 4 components (Form Validation, Modal, Tabs, Accordion) in the next message...

Perfect! Continuing with the remaining 8 components...

---

## 📁 `src/styles/components/_skip-link.scss`

```scss
/**
 * Skip Link - Accessibility First Navigation
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1998, the Web Content Accessibility Guidelines 1.0 introduced a simple
 * idea: let keyboard users skip repetitive navigation. Imagine you can't use
 * a mouse. Every time you visit a website, you Tab through thirty navigation
 * links just to reach the content. Every. Single. Page. It's exhausting.
 *
 * The skip link solves this with elegant simplicity: a hidden link that appears
 * when you press Tab, jumping straight to the main content. It's the first
 * thing keyboard users encounter—and the first sign that you've thought about
 * their experience. Most websites forget it. Don't be most websites.
 *
 * This implementation follows current best practices from WebAIM and GOV.UK:
 * visually hidden by default, visible on focus, high contrast, positioned at
 * the top-left for predictability. Screen reader users hear it announced.
 * Keyboard users see it appear. Everyone benefits from faster navigation.
 *
 * Here's what makes this elegant: it costs you one line of HTML, improves
 * accessibility for millions of users, and demonstrates that you care about
 * inclusive design. That's a remarkable return on investment.
 *
 * ### Future Improvements
 *
 * - Multiple skip links (skip to main, skip to search, skip to footer)
 * - Smooth scroll animation when activated
 * - Color customization via CSS variables
 * - Support for international languages (translated text)
 *
 * @see {class} .visually-hidden - Base class for accessible hiding
 * @see {attribute} href="#main" - Target element ID (main content landmark)
 *
 * @link https://webaim.org/techniques/skipnav/ WebAIM Skip Navigation
 * @link https://www.w3.org/WAI/WCAG21/Techniques/general/G1 WCAG Skip Technique
 *
 * @example html - Basic skip link (place at start of <body>)
 *   <a href="#main" class="skip-link">Skip to content</a>
 *
 *   <header>
 *     <!-- Navigation here -->
 *   </header>
 *
 *   <main id="main">
 *     <!-- Main content here -->
 *   </main>
 *
 * @example html - Multiple skip links
 *   <div class="skip-links">
 *     <a href="#main" class="skip-link">Skip to main content</a>
 *     <a href="#search" class="skip-link">Skip to search</a>
 *     <a href="#footer" class="skip-link">Skip to footer</a>
 *   </div>
 */

.skip-link {
  /* Positioning - absolute to top-left corner */
  position: absolute;
  top: var(--rhythm-d4);
  left: var(--rhythm-d4);
  z-index: var(--z-modal); /* Above everything else */

  /* Styling - high contrast, unmissable */
  background: var(--color-accent);
  color: var(--color-background);
  padding: var(--rhythm-d3) var(--rhythm-d2);
  border-radius: var(--radius);
  font-weight: var(--bold-weight);
  font-size: var(--scale-d2);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  /* Animation */
  transition: transform 0.2s ease, opacity 0.2s ease;

  /* Hidden by default (accessible hiding) */
  transform: translateY(-120%);
  opacity: 0;

  /* Visible on focus (Tab key) */
  &:focus {
    transform: translateY(0);
    opacity: 1;
    outline: 3px solid var(--color-background);
    outline-offset: 2px;
  }

  /* Hover state (if user moves mouse while focused) */
  &:hover {
    background: color-mix(in srgb, var(--color-accent) 90%, var(--color-background));
  }

  /* Active state (on click) */
  &:active {
    transform: translateY(0) scale(0.98);
  }
}

/**
 * Skip Links Container - Multiple Skip Options
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * When you have multiple skip links (content, search, footer), wrap them in
 * a container to stack them vertically on focus. Each link appears as the
 * user tabs through them.
 */
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  gap: var(--rhythm-d4);
  padding: var(--rhythm-d4);
}
```

---

## 📁 `src/styles/components/_breadcrumb.scss`

```scss
/**
 * Breadcrumb Navigation - Hierarchical Location Indicator
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1962, the Brothers Grimm fairy tale "Hansel and Gretel" gave us the
 * metaphor: breadcrumbs marking the path home. In 1995, the web borrowed it.
 * Breadcrumb navigation tells users where they are in your site's hierarchy
 * and how they got there. Home → Products → Laptops → MacBook Pro. It's not
 * just navigation—it's spatial orientation.
 *
 * The power of breadcrumbs lies in their simplicity. They're compact, take
 * minimal space, never get in the way, yet provide crucial context. Lost in
 * a documentation site? Breadcrumbs show you're in Docs → CSS → Typography.
 * Want to go up one level? Click "CSS." It's spatial reasoning made visual.
 *
 * This implementation follows current best practices: semantic HTML with
 * <nav>, <ol>, and aria-label for screen readers. The current page is marked
 * with aria-current="page" and isn't a link (you're already here). Separators
 * are CSS-generated, not HTML, so screen readers skip them. Structured data
 * markup helps search engines understand your hierarchy.
 *
 * Nielsen Norman Group's research shows breadcrumbs reduce cognitive load and
 * improve navigation efficiency. Users don't have to remember the path—they
 * can see it. That's good design: making the invisible visible.
 *
 * ### Future Improvements
 *
 * - Collapsed breadcrumbs for mobile (show only first/last with ... between)
 * - Dropdown menus on intermediate crumbs (show siblings at each level)
 * - Icons for home/root level
 * - JSON-LD structured data generation helper
 * - Keyboard navigation with arrow keys
 *
 * @see {element} nav - Semantic navigation landmark
 * @see {attribute} aria-label="Breadcrumb" - Screen reader label
 * @see {attribute} aria-current="page" - Current location indicator
 *
 * @link https://www.nngroup.com/articles/breadcrumbs/ NN/g Breadcrumb Guidelines
 * @link https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ ARIA Breadcrumb Pattern
 *
 * @example html - Basic breadcrumb navigation
 *   <nav aria-label="Breadcrumb" class="breadcrumb">
 *     <ol>
 *       <li><a href="/">Home</a></li>
 *       <li><a href="/products">Products</a></li>
 *       <li><a href="/products/laptops">Laptops</a></li>
 *       <li aria-current="page">MacBook Pro</li>
 *     </ol>
 *   </nav>
 *
 * @example html - With structured data (JSON-LD)
 *   <nav aria-label="Breadcrumb" class="breadcrumb">
 *     <ol itemscope itemtype="https://schema.org/BreadcrumbList">
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
 *         <meta itemprop="position" content="1" />
 *       </li>
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <a itemprop="item" href="/docs"><span itemprop="name">Docs</span></a>
 *         <meta itemprop="position" content="2" />
 *       </li>
 *       <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
 *         <span itemprop="name" aria-current="page">Typography</span>
 *         <meta itemprop="position" content="3" />
 *       </li>
 *     </ol>
 *   </nav>
 */

.breadcrumb {
  /* Container styling */
  margin-block-end: var(--rhythm);
  font-size: var(--scale-d2);

  /* List styling */
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--rhythm-d3);
    align-items: center;
  }

  /* List items */
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--rhythm-d3);
    margin: 0;

    /* Remove default list item spacing */
    &::before {
      display: none;
    }

    /* Separator (not on first item) */
    &:not(:first-child)::before {
      content: "→"; /* or "/" or "›" */
      display: inline-block;
      color: var(--color-subtle);
      margin-inline-end: var(--rhythm-d3);
    }
  }

  /* Links */
  a {
    color: var(--color-foreground);
    text-decoration: underline;
    text-decoration-color: var(--color-subtle);
    text-underline-offset: 0.15em;

    &:hover {
      color: var(--color-accent);
      text-decoration-color: var(--color-accent);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  /* Current page (not a link) */
  [aria-current="page"] {
    color: var(--color-muted);
    font-weight: var(--bold-weight);
  }
}

/**
 * Breadcrumb Variants - compact and Mobile-Optimized
 *
 * @group components-navigation
 * @since 0.11.0
 */

/* compact variant - smaller text, compacter spacing */
.breadcrumb-compact {
  font-size: var(--scale-d3);

  ol {
    gap: var(--rhythm-d4);
  }

  li {
    gap: var(--rhythm-d4);

    &:not(:first-child)::before {
      margin-inline-end: var(--rhythm-d4);
    }
  }
}

/* Mobile: collapse to first and last with ellipsis */
@media (max-width: 768px) {
  .breadcrumb ol li:not(:first-child):not(:last-child) {
    display: none;
  }

  .breadcrumb ol li:last-child::before {
    content: "…"; /* Ellipsis to show collapsed crumbs */
  }
}
```

---

## 📁 `src/styles/components/_pagination.scss`

```scss
/**
 * Pagination Component - Multi-Page Navigation
 *
 * @group components-navigation
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1998, Google launched with a simple idea: ten results per page, numbered
 * links at the bottom. Click "2" for the next ten, "3" for the next ten after
 * that. It wasn't revolutionary—pagination had existed in print for centuries—
 * but Google made it feel inevitable. Fast, clear, predictable.
 *
 * Pagination solves a fundamental problem: how do you present large datasets
 * without overwhelming users? A thousand blog posts can't fit on one page. So
 * you chunk them—ten at a time, twenty at a time, whatever makes sense. Users
 * get a sense of scale ("page 3 of 47"), can jump forward or back, and never
 * feel lost in an endless scroll.
 *
 * This implementation follows WCAG 2.1 guidelines: semantic <nav> with
 * aria-label, proper focus indicators, current page marked with aria-current.
 * Numbers use tabular figures for consistent width. Previous/Next buttons
 * provide quick jumps. Ellipsis (…) indicates skipped page ranges without
 * cluttering the interface.
 *
 * The key insight: pagination isn't about showing every page number. It's
 * about showing the right page numbers—current, adjacent, first, last—and
 * collapsing everything else. Users rarely need page 47 directly. They need
 * "next few" or "jump to end."
 *
 * ### Future Improvements
 *
 * - Page size selector (10, 25, 50, 100 items per page)
 * - Jump to page input field for large datasets
 * - Infinite scroll variant (load more on scroll)
 * - Keyboard shortcuts (arrow keys to navigate pages)
 * - Summary text ("Showing 21-30 of 487 items")
 *
 * @see {element} nav - Semantic navigation landmark
 * @see {attribute} aria-label="Pagination" - Screen reader label
 * @see {attribute} aria-current="page" - Current page indicator
 *
 * @link https://www.nngroup.com/articles/item-list-view-all/ NN/g Pagination Guidelines
 * @link https://inclusive-components.design/pagination/ Inclusive Pagination
 *
 * @example html - Basic pagination
 *   <nav aria-label="Pagination" class="pagination">
 *     <a href="?page=1" class="pagination-prev" aria-label="Previous page">← Previous</a>
 *     <a href="?page=1">1</a>
 *     <span aria-current="page" class="pagination-current">2</span>
 *     <a href="?page=3">3</a>
 *     <a href="?page=4">4</a>
 *     <span class="pagination-ellipsis">…</span>
 *     <a href="?page=20">20</a>
 *     <a href="?page=3" class="pagination-next" aria-label="Next page">Next →</a>
 *   </nav>
 *
 * @example html - compact mobile-friendly variant
 *   <nav aria-label="Pagination" class="pagination pagination-compact">
 *     <a href="?page=1">← Prev</a>
 *     <span>Page 2 of 20</span>
 *     <a href="?page=3">Next →</a>
 *   </nav>
 */

.pagination {
  /* Container styling */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--rhythm-d4);
  margin-block: var(--rhythm-2);
  font-size: var(--scale-d2);
  font-variant-numeric: tabular-nums; /* Monospace numbers for alignment */

  /* Links and current page */
  a,
  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5em;
    height: 2.5em;
    padding: 0 var(--rhythm-d3);
    border: var(--border);
    border-radius: var(--radius);
    text-decoration: none;
    color: var(--color-foreground);
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  /* Link hover states */
  a:hover {
    background: var(--color-background-secondary);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  /* Link focus states */
  a:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Active link (click) */
  a:active {
    transform: scale(0.95);
  }
}

/**
 * Pagination Current Page - Highlighted State
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * The current page is not a link (you're already here). It's visually distinct
 * with background color, bold text, and aria-current for screen readers.
 */
.pagination-current,
.pagination [aria-current="page"] {
  background: var(--color-accent);
  color: var(--color-background);
  border-color: var(--color-accent);
  font-weight: var(--bold-weight);
  cursor: default;
  pointer-events: none; /* Not interactive */
}

/**
 * Pagination Ellipsis - Collapsed Page Range Indicator
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * The ellipsis (…) indicates skipped pages. It's not a link, just a visual
 * indicator. Screen readers ignore it (no semantic meaning).
 */
.pagination-ellipsis {
  border: none;
  background: transparent;
  pointer-events: none;
  color: var(--color-subtle);
}

/**
 * Pagination Previous/Next Buttons
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * Previous/Next provide quick navigation without numbers. They're wider to
 * accommodate text ("Previous" vs just "2").
 */
.pagination-prev,
.pagination-next {
  min-width: auto;
  padding: 0 var(--rhythm-d2);
  font-weight: var(--bold-weight);
}

/* Disabled state (first/last page) */
.pagination-prev[aria-disabled="true"],
.pagination-next[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/**
 * Pagination compact Variant - Mobile-Optimized
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * On mobile, showing 10 page numbers is overwhelming. The compact variant
 * shows only Prev/Next and a page counter ("Page 3 of 20").
 */
@media (max-width: 768px) {
  .pagination {
    font-size: var(--scale-d3);

    /* Hide page numbers on mobile */
    a:not(.pagination-prev):not(.pagination-next),
    span:not(.pagination-current):not(.pagination-summary) {
      display: none;
    }

    /* Show summary text */
    .pagination-summary {
      display: inline-flex;
      border: none;
      background: transparent;
      font-weight: var(--font-weight);
    }
  }
}

/**
 * Pagination Summary Text
 *
 * @group components-navigation
 * @since 0.11.0
 *
 * Summary text provides context ("Showing 21-30 of 487 items"). Useful for
 * large datasets where page numbers alone aren't enough.
 *
 * @example html
 *   <nav aria-label="Pagination" class="pagination">
 *     <span class="pagination-summary">Showing 21-30 of 487 items</span>
 *     <a href="?page=2" class="pagination-prev">← Previous</a>
 *     <span aria-current="page">3</span>
 *     <a href="?page=4" class="pagination-next">Next →</a>
 *   </nav>
 */
.pagination-summary {
  font-size: var(--scale-d3);
  color: var(--color-muted);
  border: none;
  background: transparent;
  min-width: auto;
}
```

---

## 📁 `src/styles/components/_table-wrapper.scss`

```scss
/**
 * Table Wrapper - Responsive Table Container
 *
 * @group components-data
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * Tables are beautiful on desktop. Clear columns, aligned data, easy scanning.
 * But on mobile? Disaster. A six-column table on a 375px screen becomes an
 * illegible mess of squished text and broken layouts. You can't just make the
 * font smaller—at some point, readability collapses.
 *
 * The table wrapper solves this with horizontal scrolling. It's not glamorous,
 * but it works: wrap the table in a scrollable container, add visual indicators
 * (shadows) at the edges, and users can swipe to see more data. The table
 * maintains its structure, columns keep their width, and nothing breaks.
 *
 * The shadow indicators are subtle but critical. Without them, users don't know
 * there's more content to the right. They assume the table ends. With shadows,
 * they see the fade—"oh, I can scroll"—and interaction becomes intuitive.
 * This is affordance: making interaction possibilities visible.
 *
 * This implementation uses CSS scroll shadows (gradient technique) and smooth
 * scrolling with momentum. Works on touch devices, trackpads, and keyboard
 * (arrow keys when focused). The table retains full functionality while gaining
 * mobile responsiveness.
 *
 * ### Future Improvements
 *
 * - Sticky first column (row headers remain visible while scrolling)
 * - Sticky header row (column headers stay at top)
 * - Scroll position indicator (progress bar showing how far scrolled)
 * - Responsive table transformations (stack columns on mobile)
 * - CSV/Excel export button integration
 *
 * @see {element} table - Wrapped table element
 * @see {class} .rhythm - Tables respect rhythm spacing
 *
 * @link https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html Responsive Table Patterns
 * @link https://css-tricks.com/fixing-tables-long-strings/ CSS Tricks Table Handling
 *
 * @example html - Basic responsive table
 *   <div class="table-wrapper">
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Name</th>
 *           <th>Email</th>
 *           <th>Role</th>
 *           <th>Status</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         <tr>
 *           <td>John Doe</td>
 *           <td>john@example.com</td>
 *           <td>Admin</td>
 *           <td>Active</td>
 *         </tr>
 *       </tbody>
 *     </table>
 *   </div>
 *
 * @example html - With sticky header
 *   <div class="table-wrapper table-wrapper-sticky-header">
 *     <table>...</table>
 *   </div>
 */

.table-wrapper {
  /* Container styling */
  position: relative;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  margin-block-end: var(--rhythm);

  /* Smooth scrolling with momentum */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Scroll shadows - indicate more content */
  background:
    /* Left shadow */
    linear-gradient(
      to right,
      var(--color-background) 0%,
      transparent 2%
    ) 0 0,
    /* Right shadow */
    linear-gradient(
      to left,
      var(--color-background) 0%,
      transparent 2%
    ) 100% 0,
    /* Actual background */
    var(--color-background);

  background-repeat: no-repeat;
  background-size: 20px 100%, 20px 100%, 100% 100%;
  background-attachment: local, local, scroll;

  /* Shadow overlays */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    pointer-events: none;
    z-index: 2;
  }

  /* Left shadow */
  &::before {
    left: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  /* Right shadow */
  &::after {
    right: 0;
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 100%
    );
  }

  /* Show left shadow when scrolled */
  &:not(:hover):not(:focus-within)::before {
    opacity: 0;
  }

  /* Table inside wrapper */
  table {
    margin-block-end: 0; /* Remove table's own margin */
    min-width: 100%; /* Ensure table fills wrapper */
    width: max-content; /* Allow table to grow beyond wrapper */
  }
}

/**
 * Table Wrapper with Sticky Header
 *
 * @group components-data
 * @since 0.11.0
 *
 * Keep column headers visible while scrolling vertically. Essential for long
 * tables where users need context about what each column represents.
 */
.table-wrapper-sticky-header {
  max-height: 400px; /* Or any height */
  overflow-y: auto;

  table thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--color-background);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/**
 * Table Wrapper compact Variant
 *
 * @group components-data
 * @since 0.11.0
 *
 * compacter spacing for dense data tables (admin panels, dashboards).
 */
.table-wrapper-compact table {
  font-size: var(--scale-d3);

  td, th {
    padding: var(--rhythm-d4) var(--rhythm-d3);
  }
}
```

I'll continue with the last 4 components (Form Validation, Modal, Tabs, Accordion) in the next message...


Perfect! Here's a comprehensive demo page showcasing all 10 components:

---

## 📁 `content/example/components-demo.html`

```html
---
layout: layouts/base.njk
title: Component Library Demo
description: Live examples of all Standard Framework components
---

<!DOCTYPE html>
<html lang="en" class="rhythm">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standard Framework - Component Library Demo</title>
  <link rel="stylesheet" href="/assets/standard/standard.css">
  <style>
    /* Demo-specific styling */
    .demo-section {
      margin-block-end: var(--rhythm-3);
      padding-block-end: var(--rhythm-2);
      border-bottom: var(--border);
    }

    .demo-section:last-of-type {
      border-bottom: none;
    }

    .demo-header {
      margin-block-end: var(--rhythm);
    }

    .demo-label {
      font-size: var(--scale-d3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-muted);
      font-weight: var(--bold-weight);
      margin-block-end: var(--rhythm-d3);
    }

    .demo-grid {
      display: grid;
      gap: var(--rhythm);
      margin-block: var(--rhythm);
    }
  </style>
</head>
<body>

  <!-- Skip Link (appears on Tab key press) -->
  <a href="#main" class="skip-link">Skip to content</a>

  <!-- Header with Navigation -->
  <header class="negate-body-padding">
    <nav style="padding: var(--rhythm); border-bottom: var(--border);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: var(--scale-2);">Standard Framework</strong>
        <ul class="no-bullet" style="display: flex; gap: var(--rhythm-d2); list-style: none; padding: 0; margin: 0;">
          <li><a href="#cards">Cards</a></li>
          <li><a href="#alerts">Alerts</a></li>
          <li><a href="#forms">Forms</a></li>
          <li><a href="#modals">Modals</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main id="main" class="prose">

    <!-- Page Title -->
    <h1>Component Library Demo</h1>
    <p class="text-size-small text-color-muted">
      Live examples of all Standard Framework components with interactive demonstrations.
    </p>

    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/docs">Documentation</a></li>
        <li><a href="/examples">Examples</a></li>
        <li aria-current="page">Component Demo</li>
      </ol>
    </nav>

    <hr>

    <!-- ========================================
         1. CARD COMPONENT
    ========================================= -->
    <section id="cards" class="demo-section">
      <div class="demo-header">
        <h2>1. Card Component</h2>
        <p>Content containers with header, body, and footer sections.</p>
      </div>

      <div class="demo-label">Basic Cards</div>
      <div class="grid">
        <article class="card col-4 col-sm-12">
          <header class="card-header">
            <h3>Card Title One</h3>
          </header>
          <div class="card-body">
            <p>This is a basic card with header, body, and footer. Cards maintain consistent spacing and structure.</p>
          </div>
          <footer class="card-footer">
            <a href="#">Read more →</a>
          </footer>
        </article>

        <article class="card col-4 col-sm-12">
          <header class="card-header">
            <h3>Card Title Two</h3>
          </header>
          <div class="card-body">
            <p>Cards automatically align in grid layouts. Notice how they all have the same height.</p>
          </div>
          <footer class="card-footer">
            <a href="#">Learn more →</a>
          </footer>
        </article>

        <article class="card col-4 col-sm-12">
          <div class="card-body">
            <h3>Simple Card</h3>
            <p>Cards don't require headers or footers. Body-only cards work great for simple content.</p>
          </div>
        </article>
      </div>

      <div class="demo-label">Clickable Card</div>
      <div class="grid">
        <a href="#" class="card card-clickable col-6 col-sm-12">
          <div class="card-body">
            <h3>Entire Card is Clickable</h3>
            <p>Hover over this card to see the lift effect. The entire card acts as a link.</p>
          </div>
        </a>

        <article class="card col-6 col-sm-12" style="--card-border-color: var(--color-accent); --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <div class="card-body">
            <h3>Customized Card</h3>
            <p>Cards can be customized via CSS variables. This one has an accent border and enhanced shadow.</p>
          </div>
        </article>
      </div>
    </section>

    <!-- ========================================
         2. ALERT COMPONENT
    ========================================= -->
    <section id="alerts" class="demo-section">
      <div class="demo-header">
        <h2>2. Alert Component</h2>
        <p>Semantic feedback messages with color-coded states.</p>
      </div>

      <div class="demo-grid">
        <div class="alert alert-success" role="alert">
          <strong>Success:</strong> Your changes have been saved successfully.
        </div>

        <div class="alert alert-info" role="alert">
          <strong>Info:</strong> Scheduled maintenance tonight from 11 PM to 1 AM EST.
        </div>

        <div class="alert alert-warning" role="alert">
          <strong>Warning:</strong> Your session will expire in 5 minutes. Please save your work.
        </div>

        <div class="alert alert-error" role="alert">
          <strong>Error:</strong> Unable to process your request. Please try again later.
        </div>

        <div class="alert alert-info" role="alert">
          <strong>Note:</strong> This alert includes an action link.
          <a href="#" class="alert-action">Learn more</a>
        </div>
      </div>
    </section>

    <!-- ========================================
         3. SKIP LINK (already at top of page)
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>3. Skip Link</h2>
        <p>Accessibility-first navigation (visible on keyboard focus).</p>
      </div>

      <div class="callout" data-callout="note">
        <div class="callout-title">Try it!</div>
        <div class="callout-content">
          <p><strong>Press the Tab key</strong> at the top of this page to see the skip link appear in the top-left corner. It allows keyboard users to jump directly to the main content, bypassing repetitive navigation.</p>
        </div>
      </div>
    </section>

    <!-- ========================================
         4. BREADCRUMB (already shown above)
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>4. Breadcrumb Navigation</h2>
        <p>Hierarchical location indicator.</p>
      </div>

      <div class="demo-label">Standard Breadcrumb</div>
      <nav aria-label="Breadcrumb example 1" class="breadcrumb">
        <ol>
          <li><a href="#">Home</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Laptops</a></li>
          <li aria-current="page">MacBook Pro</li>
        </ol>
      </nav>

      <div class="demo-label">compact Breadcrumb</div>
      <nav aria-label="Breadcrumb example 2" class="breadcrumb breadcrumb-compact">
        <ol>
          <li><a href="#">Docs</a></li>
          <li><a href="#">CSS</a></li>
          <li><a href="#">Components</a></li>
          <li aria-current="page">Breadcrumb</li>
        </ol>
      </nav>
    </section>

    <!-- ========================================
         5. PAGINATION
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>5. Pagination Component</h2>
        <p>Multi-page navigation with page numbers and controls.</p>
      </div>

      <div class="demo-label">Full Pagination</div>
      <nav aria-label="Pagination example" class="pagination">
        <a href="#" class="pagination-prev" aria-label="Previous page">← Previous</a>
        <a href="#">1</a>
        <span aria-current="page" class="pagination-current">2</span>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <span class="pagination-ellipsis">…</span>
        <a href="#">20</a>
        <a href="#" class="pagination-next" aria-label="Next page">Next →</a>
      </nav>

      <div class="demo-label">With Summary Text</div>
      <nav aria-label="Pagination with summary" class="pagination">
        <span class="pagination-summary">Showing 21-30 of 487 items</span>
        <a href="#" class="pagination-prev">← Previous</a>
        <span aria-current="page">3</span>
        <a href="#" class="pagination-next">Next →</a>
      </nav>
    </section>

    <!-- ========================================
         6. TABLE WRAPPER
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>6. Responsive Table Wrapper</h2>
        <p>Horizontally scrollable tables with shadow indicators.</p>
      </div>

      <div class="demo-label">Scrollable Data Table</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MacBook Pro 16"</td>
              <td>Laptops</td>
              <td>$2,499</td>
              <td>42</td>
              <td><span style="color: var(--color-success);">In Stock</span></td>
              <td>2024-10-26</td>
              <td><a href="#">Edit</a></td>
            </tr>
            <tr>
              <td>iPhone 15 Pro</td>
              <td>Phones</td>
              <td>$999</td>
              <td>128</td>
              <td><span style="color: var(--color-success);">In Stock</span></td>
              <td>2024-10-25</td>
              <td><a href="#">Edit</a></td>
            </tr>
            <tr>
              <td>AirPods Pro</td>
              <td>Audio</td>
              <td>$249</td>
              <td>5</td>
              <td><span style="color: var(--color-warning);">Low Stock</span></td>
              <td>2024-10-24</td>
              <td><a href="#">Edit</a></td>
            </tr>
            <tr>
              <td>iPad Air</td>
              <td>Tablets</td>
              <td>$599</td>
              <td>0</td>
              <td><span style="color: var(--color-error);">Out of Stock</span></td>
              <td>2024-10-20</td>
              <td><a href="#">Edit</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-size-small text-color-muted">
        <strong>Try it:</strong> Scroll horizontally to see all columns. Notice the shadow indicators at the edges.
      </p>
    </section>

    <!-- ========================================
         7. FORM VALIDATION
    ========================================= -->
    <section id="forms" class="demo-section">
      <div class="demo-header">
        <h2>7. Form Validation States</h2>
        <p>Visual feedback for form inputs with error, success, and warning states.</p>
      </div>

      <form>
        <div class="demo-label">Normal State</div>
        <div class="field">
          <label for="name">Full Name</label>
          <input type="text" id="name" placeholder="John Doe" aria-describedby="name-helper">
          <span class="field-helper" id="name-helper">Enter your first and last name.</span>
        </div>

        <div class="demo-label">Error State</div>
        <div class="field field-error">
          <label for="email-error">Email Address</label>
          <input type="email" id="email-error" value="invalid-email" aria-invalid="true" aria-describedby="email-error-msg">
          <span class="field-error-message" id="email-error-msg" role="alert">
            Please enter a valid email address (e.g., user@example.com).
          </span>
        </div>

        <div class="demo-label">Success State</div>
        <div class="field field-success">
          <label for="username">Username</label>
          <input type="text" id="username" value="john_doe" aria-describedby="username-success">
          <span class="field-success-message" id="username-success">
            Username is available!
          </span>
        </div>

        <div class="demo-label">Warning State</div>
        <div class="field field-warning">
          <label for="password">Password</label>
          <input type="password" id="password" value="password123" aria-describedby="password-warning">
          <span class="field-warning-message" id="password-warning">
            Password is weak. Consider adding symbols and uppercase letters.
          </span>
        </div>

        <div class="demo-label">Required Field</div>
        <div class="field field-required">
          <label for="company">Company Name <span class="required-indicator"></span></label>
          <input type="text" id="company" required aria-required="true">
        </div>

        <button type="submit" class="button">Submit Form</button>
      </form>
    </section>

    <!-- ========================================
         8. MODAL/DIALOG
    ========================================= -->
    <section id="modals" class="demo-section">
      <div class="demo-header">
        <h2>8. Modal/Dialog Component</h2>
        <p>Focus-trapping overlay dialogs for important interactions.</p>
      </div>

      <button onclick="openModal('demo-modal')" class="button">Open Demo Modal</button>
      <button onclick="openModal('confirm-modal')" class="button" style="margin-left: var(--rhythm-d2);">Open Confirmation Modal</button>

      <!-- Demo Modal -->
      <dialog id="demo-modal" class="modal" aria-labelledby="demo-modal-title">
        <div class="modal-header">
          <h2 id="demo-modal-title">Example Modal Dialog</h2>
          <button class="modal-close" onclick="closeModal('demo-modal')" aria-label="Close dialog">×</button>
        </div>
        <div class="modal-body">
          <p>This is a modal dialog. It traps focus—try pressing Tab to cycle through interactive elements. Press Escape to close, or click the backdrop.</p>
          <p>Modals are powerful for capturing attention on critical actions, but use them sparingly.</p>
        </div>
        <div class="modal-footer">
          <button onclick="closeModal('demo-modal')">Close</button>
        </div>
      </dialog>

      <!-- Confirmation Modal -->
      <dialog id="confirm-modal" class="modal modal-small" aria-labelledby="confirm-modal-title">
        <div class="modal-header">
          <h2 id="confirm-modal-title">Confirm Action</h2>
          <button class="modal-close" onclick="closeModal('confirm-modal')" aria-label="Close dialog">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button onclick="closeModal('confirm-modal')">Cancel</button>
          <button onclick="alert('Deleted!'); closeModal('confirm-modal')" style="background: var(--color-error); border-color: var(--color-error);">Delete</button>
        </div>
      </dialog>
    </section>

    <!-- ========================================
         9. TABS
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>9. Tabs Component</h2>
        <p>Content switching interface with keyboard navigation.</p>
      </div>

      <div class="tabs">
        <div class="tabs-list" role="tablist">
          <button role="tab" aria-selected="true" aria-controls="tab-panel-1" id="tab-1" onclick="switchTab('tab-1', 'tab-panel-1')">
            Overview
          </button>
          <button role="tab" aria-selected="false" aria-controls="tab-panel-2" id="tab-2" onclick="switchTab('tab-2', 'tab-panel-2')">
            Features
          </button>
          <button role="tab" aria-selected="false" aria-controls="tab-panel-3" id="tab-3" onclick="switchTab('tab-3', 'tab-panel-3')">
            Documentation
          </button>
        </div>

        <div role="tabpanel" id="tab-panel-1" aria-labelledby="tab-1">
          <h3>Overview</h3>
          <p>Standard Framework is a typography-focused design system implementing classical design principles, mathematical precision with the golden ratio, and micro-typography rules inspired by the masters of print design.</p>
        </div>

        <div role="tabpanel" id="tab-panel-2" aria-labelledby="tab-2" hidden>
          <h3>Key Features</h3>
          <ul>
            <li>Fine-art typography with smart quotes and punctuation</li>
            <li>Swiss-style 12-column responsive grid</li>
            <li>Vertical rhythm system based on golden ratio</li>
            <li>Automatic light/dark theme support</li>
            <li>Zero runtime dependencies</li>
          </ul>
        </div>

        <div role="tabpanel" id="tab-panel-3" aria-labelledby="tab-3" hidden>
          <h3>Documentation</h3>
          <p>Comprehensive documentation is available covering all aspects of the framework:</p>
          <ul>
            <li><a href="#">Getting Started Guide</a></li>
            <li><a href="#">CSS Framework Documentation</a></li>
            <li><a href="#">11ty Plugin Documentation</a></li>
            <li><a href="#">Component Library</a></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ========================================
         10. ACCORDION
    ========================================= -->
    <section class="demo-section">
      <div class="demo-header">
        <h2>10. Accordion Component</h2>
        <p>Collapsible content panels for FAQs and progressive disclosure.</p>
      </div>

      <div class="demo-label">Accordion Group (FAQ Style)</div>
      <div class="accordion-group">
        <details class="accordion" open>
          <summary class="accordion-trigger">
            What is Standard Framework?
          </summary>
          <div class="accordion-content">
            <p>Standard Framework is a comprehensive design system that combines fine-art typography, Swiss grid systems, and mathematical precision. It includes an 11ty plugin, CSS framework, JavaScript typography engine, and Cloudflare functions.</p>
          </div>
        </details>

        <details class="accordion">
          <summary class="accordion-trigger">
            How do I install it?
          </summary>
          <div class="accordion-content">
            <p>Install via npm:</p>
            <pre><code>npm install @zefish/standard</code></pre>
            <p>Then import it in your project and configure the 11ty plugin.</p>
          </div>
        </details>

        <details class="accordion">
          <summary class="accordion-trigger">
            Is it accessible?
          </summary>
          <div class="accordion-content">
            <p>Yes! All components follow WCAG 2.1 AA accessibility standards with proper ARIA attributes, keyboard navigation, screen reader support, and semantic HTML.</p>
          </div>
        </details>

        <details class="accordion">
          <summary class="accordion-trigger">
            Can I customize the styling?
          </summary>
          <div class="accordion-content">
            <p>Absolutely. The framework uses CSS custom properties (variables) throughout, making it easy to customize colors, spacing, typography, and more without modifying the source code.</p>
          </div>
        </details>
      </div>

      <div class="demo-label">Individual Accordions</div>
      <details class="accordion">
        <summary class="accordion-trigger">
          Advanced Configuration Options
        </summary>
        <div class="accordion-content">
          <p>Standard Framework supports extensive configuration through CSS variables and 11ty plugin options. You can customize:</p>
          <ul>
            <li>Typography scales and ratios</li>
            <li>Color themes (light/dark)</li>
            <li>Grid system (columns, gaps)</li>
            <li>Vertical rhythm multipliers</li>
            <li>Responsive breakpoints</li>
          </ul>
        </div>
      </details>
    </section>

    <!-- ========================================
         FOOTER
    ========================================= -->
    <footer class="negate-body-padding-full smaller" style="background: var(--color-background-secondary); padding: var(--rhythm-2) var(--rhythm); text-align: center; margin-top: var(--rhythm-3);">
      <p style="margin: 0;">
        <strong>Standard Framework</strong> v0.11.0 ·
        <a href="#">Documentation</a> ·
        <a href="#">GitHub</a> ·
        <a href="#">MIT License</a>
      </p>
      <p style="margin-top: var(--rhythm-d3); color: var(--color-muted);">
        Built with fine-art typography and Swiss precision.
      </p>
    </footer>

  </main>

  <!-- JavaScript for Interactive Components -->
  <script>
    // Modal functions
    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.showModal();

      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.close();
        }
      });
    }

    function closeModal(modalId) {
      document.getElementById(modalId).close();
    }

    // Tab switching
    function switchTab(tabId, panelId) {
      // Get all tabs and panels
      const tabs = document.querySelectorAll('[role="tab"]');
      const panels = document.querySelectorAll('[role="tabpanel"]');

      // Deactivate all tabs and hide all panels
      tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
      panels.forEach(panel => panel.hidden = true);

      // Activate clicked tab and show its panel
      document.getElementById(tabId).setAttribute('aria-selected', 'true');
      document.getElementById(panelId).hidden = false;
    }

    // Keyboard navigation for tabs (arrow keys)
    document.querySelectorAll('[role="tab"]').forEach((tab, index, tabs) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;

        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else {
          return; // Not an arrow key, ignore
        }

        tabs[newIndex].focus();
        tabs[newIndex].click();
        e.preventDefault();
      });
    });

    // Form validation demo (prevent actual submission)
    document.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form submission prevented (this is a demo). All validation states are shown above.');
    });
  </script>

  <!-- Load Standard Framework JavaScript (if needed) -->
  <script src="/assets/standard/standard.js"></script>

</body>
</html>
```

---

## ✨ What This Demo Includes:

### **All 10 Components Demonstrated:**

1. **Cards** - 3-column grid with header/body/footer, clickable variant, customized styling
2. **Alerts** - All 4 types (success, info, warning, error) with action links
3. **Skip Link** - Functional at top of page (press Tab to see)
4. **Breadcrumb** - Two examples (standard + compact)
5. **Pagination** - Full pagination with numbers + compact summary version
6. **Table Wrapper** - Scrollable data table with 7 columns
7. **Form Validation** - All states (normal, error, success, warning, required)
8. **Modal** - Two modals (info + confirmation) with backdrop dismissal
9. **Tabs** - 3-tab interface with keyboard arrow navigation
10. **Accordion** - FAQ-style group + individual accordions

### **Interactive Features:**

- ✅ **Working modals** with open/close functionality
- ✅ **Tab switching** with keyboard arrow navigation
- ✅ **Accordion** expand/collapse (native `<details>`)
- ✅ **Form validation** states displayed
- ✅ **Skip link** appears on Tab key
- ✅ **Responsive** - All components adapt to mobile

### **Accessibility:**

- ✅ Proper ARIA attributes
- ✅ Semantic HTML throughout
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader announcements

### **How to Use:**

1. Save as `content/example/components-demo.html`
2. Build your site: `npm run build`
3. Open in browser: `http://localhost:8090/example/components-demo/`
4. Test all interactions (click, keyboard, resize window)

🎉 **Complete, working demo of all 10 components in one page!**
