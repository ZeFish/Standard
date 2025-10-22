/**
 * @component Eleventy Shortcode Plugin
 * @category 11ty Plugins
 * @description Provides template shortcodes for including Standard Framework assets,
 * fonts, mobile meta tags, calculating reading time estimates, and initializing the
 * GitHub comments system. Integrates with Nunjucks templates for easy asset inclusion
 * and content utilities.
 *
 * @prop {shortcode} standardFonts Include Inter and Source Serif 4 fonts
 * @prop {shortcode} standardAssets Include CSS and JS (in main plugin)
 * @prop {shortcode} metaMobile Include mobile viewport meta tags
 * @prop {shortcode} readingTime Calculate and display reading time estimate
 * @prop {shortcode} standardComment Render semantic HTML comment form (auto-initializes)
 * @prop {shortcode} initComments Initialize GitHub comments system with configuration (optional)
 *
 * @example
 * // In Nunjucks template
 * {% standardFonts %}
 * {% standardAssets %}
 * {% metaMobile %}
 *
 * // Reading time shortcode
 * {% readingTime page.content %}
 *
 * // Comment form (auto-initializes with commentPageId from frontmatter)
 * {% standardComment %}
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardFonts", function () {
    return `<link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("metaMobile", function () {
    return `<!-- Mobile -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`;
  });

  eleventyConfig.addShortcode("readingTime", function (text) {
    // Return an empty string if the text is empty
    if (!text) {
      return "";
    }

    const wordsPerMinute = 225;
    // Count words by splitting on any whitespace
    const wordCount = text.split(/\s+/g).length;
    const minutes = Math.floor(wordCount / wordsPerMinute);

    // This follows your original logic of only showing for > 1 minute
    if (minutes > 1) {
      return `&nbsp;- ${minutes} minutes`;
    }

    // You could also uncomment this block to handle the 1 minute case
    /*
      if (minutes === 1) {
        return `&nbsp;- 1 minute`;
      }
      */

    return "";
  });

  // Shortcode to render comment form with semantic HTML and auto-initialize
  // Usage: {% standardComment %}
  // Auto-initializes if comment: true is in frontmatter
  eleventyConfig.addShortcode(
    "standardComment",
    function (showSubmit = true, showReset = true) {
      // Get frontmatter variables from this context
      // Use comment: true in frontmatter, page ID auto-generated from file slug
      const isCommentsEnabled = this.comment === true;
      const pageId = isCommentsEnabled
        ? (this.page && this.page.fileSlug) || null
        : null;
      const apiUrl = this.commentApiUrl || "/api/comments";
      const pollInterval = this.pollInterval || null;

      // Build comments container and form HTML with semantic structure using Standard design tokens
      const commentsContainer = `<div id="comments" class="comments-list" style="margin-bottom: var(--space-l);"></div>`;

      const form = `<form id="comment-form" class="comment-form" novalidate>
  <fieldset>
    <legend>Leave a Comment</legend>

    <div class="form-group">
      <label for="author">Your Name <span aria-label="required">*</span></label>
      <input
        type="text"
        id="author"
        name="author"
        placeholder="John Doe"
        required
        maxlength="100"
      />
      <small class="text-color-subtle">Your name will be displayed with your comment.</small>
    </div>

    <div class="form-group">
      <label for="email">Email Address <span aria-label="required">*</span></label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="john@example.com"
        required
      />
      <small class="text-color-subtle">Your email will not be displayed publicly.</small>
    </div>

    <div class="form-group">
      <label for="content">Comment <span aria-label="required">*</span></label>
      <textarea
        id="content"
        name="content"
        placeholder="Share your thoughts... Supports **bold**, *italic*, \`code\`, and [links](url)"
        required
        minlength="3"
        maxlength="10000"
      ></textarea>
      <small class="text-color-subtle">Markdown formatting supported. Max 10,000 characters.</small>
    </div>

    <!-- Hidden field for threaded replies -->
    <input type="hidden" name="parentId" value="" />

    <!-- Success/error message -->
    <div class="form-message" role="alert"></div>

    <!-- Submit buttons -->
    <div class="form-actions" style="display: flex; gap: var(--space-s);">
      ${showSubmit ? '<button type="submit" class="button">Post Comment</button>' : ""}
      ${showReset ? '<button type="reset" class="button" style="background: var(--color-background-secondary); color: var(--color-foreground); border: 1px solid var(--color-border);">Clear</button>' : ""}
    </div>

    <!-- Privacy notice -->
    <p class="text-color-subtle" style="font-size: var(--scale-s); margin-top: var(--space-l);">
      <small>
        By submitting a comment, you agree to our
        <a href="/privacy/">privacy policy</a> and
        <a href="/terms/">terms of service</a>.
      </small>
    </p>
  </fieldset>
</form>`;

      // Auto-initialize if pageId is available
      let html = commentsContainer + "\n" + form;
      if (pageId) {
        const initOptions = {
          apiUrl,
          pageId,
          container: "#comments",
          form: "#comment-form",
        };
        if (pollInterval) {
          initOptions.pollInterval = pollInterval;
        }

        html += `\n\n<script defer>
  document.addEventListener("DOMContentLoaded", async () => {
    const comments = new GitHubComments(${JSON.stringify(initOptions)});

    try {
      await comments.load();
      comments.render();
    } catch (error) {
      console.error("Error loading comments:", error);
      document.querySelector("#comments").innerHTML = '<p class="error">Failed to load comments. Please try again later.</p>';
    }

    comments.attachFormHandler();
  });
</script>`;
      }

      return html;
    },
  );

  // Shortcode to initialize GitHub comments system
  // Usage: {% initComments "blog/my-post" %}
  // Or with options: {% initComments "blog/my-post", "/api/comments", "#comments", "#comment-form", 30000 %}
  eleventyConfig.addShortcode(
    "initComments",
    function (
      pageId,
      apiUrl = "/api/comments",
      container = "#comments",
      form = "#comment-form",
      pollInterval = null,
    ) {
      if (!pageId) {
        console.error("initComments: pageId is required");
        return "";
      }

      // Build options object
      const options = {
        apiUrl,
        pageId,
        container,
        form,
      };

      // Only add pollInterval if provided
      if (pollInterval) {
        options.pollInterval = pollInterval;
      }

      // Generate JavaScript to initialize comments
      return `<script defer>
  document.addEventListener("DOMContentLoaded", async () => {
    const comments = new GitHubComments(${JSON.stringify(options)});

    try {
      await comments.load();
      comments.render();
    } catch (error) {
      console.error("Error loading comments:", error);
      document.querySelector("${container}").innerHTML = '<p class="error">Failed to load comments. Please try again later.</p>';
    }

    comments.attachFormHandler();
  });
</script>`;
    },
  );
}
