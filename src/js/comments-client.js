/**
 * @component GitHub Comments Client
 * @category Cloudflare Functions
 * @description Client-side library for interacting with the GitHub comments API.
 * Handles form submission, comment rendering, and real-time updates.
 *
 * Features:
 * - Submit comments via form
 * - Render comments with nested threads
 * - Auto-format timestamps and user mentions
 * - Client-side caching of comments
 * - Real-time comment updates (optional polling)
 * - Markdown support with code blocks
 *
 * @example
 * // Initialize on page
 * const comments = new GitHubComments({
 *   apiUrl: '/api/comments',
 *   pageId: 'blog/my-post',
 *   container: '#comments-section'
 * });
 *
 * await comments.load();
 * comments.render();
 * comments.attachFormHandler('#comment-form');
 *
 * @since 0.10.53
 */

class GitHubComments {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || "/api/comments";
    this.pageId = options.pageId;
    this.container = document.querySelector(options.container || "#comments");
    this.formSelector = options.form || "#comment-form";
    this.comments = [];
    this.loading = false;
    this.pollInterval = options.pollInterval || null; // ms, null = disabled
    this.pollTimer = null;
  }

  /**
   * Fetch comments from API
   */
  async load() {
    if (!this.pageId) {
      console.error("GitHubComments: pageId is required");
      return;
    }

    this.loading = true;
    try {
      const response = await fetch(
        `${this.apiUrl}?pageId=${encodeURIComponent(this.pageId)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      this.comments = data.comments || [];
      this.loading = false;
      return this.comments;
    } catch (error) {
      console.error("Error loading comments:", error);
      this.loading = false;
      return [];
    }
  }

  /**
   * Submit new comment
   */
  async submit(data) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: this.pageId,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const result = await response.json();

      // Add to local comments list
      if (result.comment) {
        this.comments.push(result.comment);
        this.comments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      return result;
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  }

  /**
   * Format timestamp to relative time (e.g., "2 hours ago")
   */
  formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Convert simple markdown and links in comment
   */
  formatContent(content) {
    let html = this.escapeHTML(content);

    // Bold: **text** → <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text* or _text_ → <em>text</em>
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.+?)_/g, "<em>$1</em>");

    // Code blocks: ```code``` → <pre><code>code</code></pre>
    html = html.replace(
      /```(.*?)```/gs,
      "<pre><code>$1</code></pre>"
    );

    // Inline code: `code` → <code>code</code>
    html = html.replace(/`(.+?)`/g, "<code>$1</code>");

    // Links: [text](url) → <a href="url">text</a>
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Line breaks: preserve newlines
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  /**
   * Render single comment
   */
  renderComment(comment, level = 0) {
    const approved = comment.approved !== false ? "" : " data-pending";
    const spam = comment.spam ? " data-spam" : "";

    return `
      <div class="comment" data-id="${comment.id}" data-level="${level}"${approved}${spam}>
        <div class="comment-header">
          <strong>${this.escapeHTML(comment.author)}</strong>
          <span class="comment-date">${this.formatTime(comment.createdAt)}</span>
          ${comment.spam ? '<span class="comment-flag">⚠️ Flagged as spam</span>' : ""}
          ${!comment.approved ? '<span class="comment-pending">⏳ Awaiting moderation</span>' : ""}
        </div>
        <div class="comment-content">
          ${this.formatContent(comment.content)}
        </div>
        <div class="comment-actions">
          <button class="comment-reply" data-parent-id="${comment.id}">Reply</button>
        </div>
      </div>
    `;
  }

  /**
   * Build nested comment tree
   */
  buildCommentTree() {
    const byId = {};
    const roots = [];

    // Index comments by ID
    for (const comment of this.comments) {
      byId[comment.id] = { ...comment, replies: [] };
    }

    // Build tree structure
    for (const comment of this.comments) {
      if (comment.parentId && byId[comment.parentId]) {
        byId[comment.parentId].replies.push(byId[comment.id]);
      } else {
        roots.push(byId[comment.id]);
      }
    }

    return roots;
  }

  /**
   * Render comment tree recursively
   */
  renderTree(comments, level = 0) {
    return comments
      .map((comment) => {
        let html = this.renderComment(comment, level);

        if (comment.replies && comment.replies.length > 0) {
          html += `<div class="comment-replies">${this.renderTree(
            comment.replies,
            level + 1
          )}</div>`;
        }

        return html;
      })
      .join("");
  }

  /**
   * Render all comments
   */
  render() {
    if (!this.container) {
      console.error("GitHubComments: container not found");
      return;
    }

    if (this.comments.length === 0) {
      this.container.innerHTML =
        '<p class="comments-empty">No comments yet. Be the first to comment!</p>';
      return;
    }

    const tree = this.buildCommentTree();
    this.container.innerHTML = this.renderTree(tree);

    // Attach reply handlers
    this.attachReplyHandlers();
  }

  /**
   * Attach reply button handlers
   */
  attachReplyHandlers() {
    this.container.querySelectorAll(".comment-reply").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parentId = e.target.dataset.parentId;
        const form = document.querySelector(this.formSelector);

        if (form) {
          const parentInput = form.querySelector('[name="parentId"]');
          if (parentInput) {
            parentInput.value = parentId;
          }
          form.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /**
   * Attach comment form handler
   */
  attachFormHandler(formSelector = null) {
    const form = document.querySelector(formSelector || this.formSelector);
    if (!form) {
      console.error("GitHubComments: form not found");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        author: formData.get("author"),
        email: formData.get("email"),
        content: formData.get("content"),
        parentId: formData.get("parentId") || null,
      };

      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        const result = await this.submit(data);

        // Clear form
        form.reset();
        form.querySelector('[name="parentId"]').value = "";

        // Re-render
        this.render();

        // Show success message
        const message = form.querySelector(".form-message");
        if (message) {
          message.textContent =
            "Comment submitted! It will appear after moderation.";
          message.className = "form-message success";
          setTimeout(() => {
            message.textContent = "";
            message.className = "";
          }, 5000);
        }
      } catch (error) {
        const message = form.querySelector(".form-message");
        if (message) {
          message.textContent = `Error: ${error.message}`;
          message.className = "form-message error";
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /**
   * Start polling for new comments
   */
  startPolling() {
    if (!this.pollInterval) return;

    this.pollTimer = setInterval(async () => {
      const before = this.comments.length;
      await this.load();

      if (this.comments.length > before) {
        this.render();
      }
    }, this.pollInterval);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

// Export for use in browser or build systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = GitHubComments;
}
