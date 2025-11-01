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

export default function (eleventyConfig, site = {}) {
  const standard = site.standard || {};
  const outputDir = standard.outputDir || "assets/standard";
  const comments = standard.comments || { enabled: false };

  // ===== SHORTCODES =====
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standard_assets", function () {
    let html = "";

    html = `\n<link rel="stylesheet" href="/${outputDir}/standard.bundle.css">
    <script src="/${outputDir}/standard.bundle.full.js" type="module"></script>`;

    // Add comments client library if comments are enabled
    if (comments.enabled) {
      html += `\n<script src="/${outputDir}/standard.comment.js"></script>`;
    }

    return html;
  });

  // ===== SHORTCODES =====
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standard_css", function () {
    let html = "";

    html = `<link rel="stylesheet" href="/${outputDir}/standard.min.css">`;

    // Add comments client library if comments are enabled
    if (comments.enabled) {
      html += `\n<script src="/${outputDir}/standard.comment.js"></script>`;
    }

    return html;
  });

  eleventyConfig.addShortcode("standard_lab", function (labOptions = {}) {
    const { attributes = "" } = labOptions;

    return `<script src="/${outputDir}/standard.lab.js" ${attributes}><\/script>`;
  });

  eleventyConfig.addShortcode("htmx", function () {
    return `hx-boost="true" hx-ext="preload" preload="mouseover" hx-target="body" hx-swap="innerHTML scroll:window:top"`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standard_fonts", function () {
    return `<link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">`;
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

  /**
   * Normalize page URL to safe file path for GitHub storage
   * Examples:
   * - "/blog/my-post/" → "blog_my-post"
   * - "/about/" → "about"
   * - "/" → "index"
   * - "/blog/2024/article/" → "blog_2024_article"
   */
  function normalizePageId(url) {
    if (!url || typeof url !== "string") {
      return "index";
    }
    return (
      url
        .replace(/^\//, "") // Remove leading slash
        .replace(/\/$/, "") // Remove trailing slash
        .replace(/\//g, "_") || "index"
    ); // Replace slashes with underscore, fallback to 'index'
  }

  // Shortcode to render comment form with semantic HTML and auto-initialize
  // Usage: {% standard_comments %}
  // Auto-initializes if comment: true is in frontmatter
  eleventyConfig.addShortcode(
    "standard_comments",
    function (showSubmit, showReset) {
      // Set defaults - 11ty passes empty string when no arg provided, not undefined
      // Default to true unless explicitly set to false
      showSubmit =
        showSubmit === false || showSubmit === "false" ? false : true;
      showReset = showReset === false || showReset === "false" ? false : true;

      // Get frontmatter variables from this context (ctx property)
      // Use comment: true in frontmatter, page ID auto-generated from page.url
      const context = this.ctx || this;
      const isCommentsEnabled = context.comments === true;
      const rawUrl = context.page && context.page.url;
      const pageId = isCommentsEnabled ? normalizePageId(rawUrl) : null;
      const apiUrl = context.commentApiUrl || "/api/comments";
      const pollInterval = context.pollInterval || null;

      // If comments not enabled, silently return empty string
      if (!isCommentsEnabled || !pageId) {
        return "";
      }

      // Build comments container and form HTML with semantic structure
      const commentsContainer = `<div id="comments"></div>`;

      const writeButton = `<button id="show-comment-form-btn" type="button" class="button" onclick="document.getElementById('comment-form-wrapper').style.display='block'; this.style.display='none';">Write a Comment</button>`;

      const form = `<div id="comment-form-wrapper" style="display: none;">
  <form id="comment-form" class="small container-small" method="post" action="${apiUrl}" novalidate>
  <fieldset>
    <legend>Leave a Comment</legend>


      <label for="author">Your Name <span aria-label="required">*</span></label>
      <input
        type="text"
        id="author"
        name="author"
        placeholder="Your name will be displayed with your comment."
        required
        maxlength="100"
      />

      <label for="email">Email Address <span aria-label="required">*</span></label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Your email will not be displayed publicly."
        required
      />

      <label for="content">Comment <span aria-label="required">*</span></label>
      <textarea
        id="content"
        name="content"
        placeholder="Share your thoughts... Supports **bold**, *italic*, \`code\`, and [links](url)"
        required
        minlength="3"
        maxlength="10000"
        rows="6"
      ></textarea>


    <!-- Hidden fields (REQUIRED - do not remove) -->
    <input type="hidden" id="pageId" name="pageId" value="${pageId}" />
    <input type="hidden" id="parentId" name="parentId" value="" />

    <!-- Status indicator -->
    <div id="form-status" role="status" aria-live="polite"></div>

    <!-- Submit buttons -->
    <div class="form-actions">
      ${showSubmit ? '<button type="submit" class="button">Post Comment</button>' : ""}
      ${showReset ? '<button type="reset" class="button">Clear</button>' : ""}
    </div>

    <!-- Privacy notice -->
    <!--p class="smaller">
        By submitting a comment, you agree to our
        <a href="/privacy/">privacy policy</a> and
        <a href="/terms/">terms of service</a>.
    </p-->
  </fieldset>
</form>
</div>`;

      // Build initialization script
      const initOptions = {
        apiUrl,
        pageId,
        container: "#comments",
        form: "#comment-form",
      };
      if (pollInterval) {
        initOptions.pollInterval = pollInterval;
      }

      const initScript = `<script defer>
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

      return (
        "<div class='container-small smaller'>" +
        commentsContainer +
        "\n" +
        writeButton +
        "\n" +
        form +
        "</div>\n" +
        initScript
      );
    },
  );
}
