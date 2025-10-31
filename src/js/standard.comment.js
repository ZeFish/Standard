(function (global) {
  "use strict";

  /**
   * @component GitHub Comments Client
   * @category Cloudflare Functions
   * @description Client-side library for interacting with the GitHub comments API.
   * Exposes a global singleton `comments` API and auto-initializes on DOM ready.
   *
   * Features:
   * - Singleton API: `comments.init()`, `comments.load()`, `comments.render()`, `comments.submit()`, etc.
   * - Auto-initialize when DOM is ready (scans for comment container)
   * - Graceful in environments without DOM (no-ops)
   *
   * Example:
   *   comments.configure({ apiUrl: '/api/comments', pollInterval: 15000 });
   *   comments.init(); // optional; auto-init runs on DOM ready
   *
   * @since 0.10.53
   * @version @VERSION_PLACEHOLDER@
   */

  /* --------------------------------------------------------
   * Core GitHubComments class (kept small and focused)
   * --------------------------------------------------------*/
  class GitHubComments {
    constructor(options = {}) {
      this.apiUrl = options.apiUrl || "/api/comments";
      this.pageId = options.pageId;
      this.container =
        typeof options.container === "string"
          ? document.querySelector(options.container)
          : options.container || document.querySelector("#comments");
      this.formSelector = options.form || "#comment-form";
      this.comments = [];
      this.loading = false;
      this.pollInterval = options.pollInterval || null; // ms, null = disabled
      this.pollTimer = null;
      this.onLoad = options.onLoad || null;
      this.onRender = options.onRender || null;
    }

    async load() {
      if (!this.pageId) {
        console.error("GitHubComments: pageId is required");
        return [];
      }

      this.loading = true;
      try {
        const response = await fetch(
          `${this.apiUrl}?pageId=${encodeURIComponent(this.pageId)}`,
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        this.comments = data.comments || [];
        this.loading = false;

        if (typeof this.onLoad === "function") {
          try {
            this.onLoad(this.comments);
          } catch (e) {
            /* swallow user onLoad errors */
          }
        }

        return this.comments;
      } catch (error) {
        console.error("Error loading comments:", error);
        this.loading = false;
        return [];
      }
    }

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
          let errorMessage = `API error: ${response.status}`;
          try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } catch (e) {
            errorMessage = `API endpoint not available (${response.status})`;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();

        if (result.comment) {
          this.comments.push(result.comment);
          this.comments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        }

        return result;
      } catch (error) {
        console.error("Error submitting comment:", error);
        throw error;
      }
    }

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

    escapeHTML(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    formatContent(content) {
      let html = this.escapeHTML(content);

      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
      html = html.replace(/_(.+?)_/g, "<em>$1</em>");
      html = html.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
      html = html.replace(/`(.+?)`/g, "<code>$1</code>");
      html = html.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      );
      html = html.replace(/\n/g, "<br>");

      return html;
    }

    renderComment(comment, level = 0) {
      const approved = comment.approved !== false ? "" : ' data-pending="true"';
      const spam = comment.spam ? ' data-spam="true"' : "";

      return `
      <div class="comment" data-id="${this.escapeHTML(
        String(comment.id),
      )}" data-level="${level}"${approved}${spam}>
        <div class="comment-header">
          <span class="comment-author">${this.escapeHTML(
            comment.author || "Anonymous",
          )}</span>
          <span class="comment-date">${this.formatTime(
            comment.createdAt,
          )}</span>
          ${
            comment.spam
              ? '<span class="comment-flag">Flagged as spam</span>'
              : ""
          }
          ${
            !comment.approved
              ? '<span class="comment-pending">Awaiting moderation</span>'
              : ""
          }
        </div>
        <div class="comment-content">
          ${this.formatContent(comment.content || "")}
        </div>
      </div>
    `;
    }

    buildCommentTree() {
      const byId = {};
      const roots = [];

      for (const comment of this.comments) {
        byId[comment.id] = { ...comment, replies: [] };
      }

      for (const comment of this.comments) {
        if (comment.parentId && byId[comment.parentId]) {
          byId[comment.parentId].replies.push(byId[comment.id]);
        } else {
          roots.push(byId[comment.id]);
        }
      }

      return roots;
    }

    renderTree(comments, level = 0) {
      return comments
        .map((comment) => {
          let html = this.renderComment(comment, level);

          if (comment.replies && comment.replies.length > 0) {
            html += `<div class="comment-replies">${this.renderTree(
              comment.replies,
              level + 1,
            )}</div>`;
          }

          return html;
        })
        .join("");
    }

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

      this.attachReplyHandlers();

      if (typeof this.onRender === "function") {
        try {
          this.onRender(this.container);
        } catch (e) {
          /* swallow user errors */
        }
      }
    }

    attachReplyHandlers() {
      if (!this.container) return;
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

    attachFormHandler(formSelector = null) {
      const form = document.querySelector(formSelector || this.formSelector);
      if (!form) {
        console.error("GitHubComments: form not found");
        return;
      }

      form.removeAttribute("hx-boost");
      form.setAttribute("hx-disable", "true");

      if (window.htmx) {
        const clone = form.cloneNode(true);
        form.parentNode.replaceChild(clone, form);
        const newForm = document.querySelector(
          formSelector || this.formSelector,
        );
        newForm.addEventListener("submit", this._handleFormSubmit.bind(this));
        return;
      }

      form.addEventListener("submit", this._handleFormSubmit.bind(this));
    }

    async _handleFormSubmit(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const form = e.target;

      const formData = new FormData(form);
      const data = {
        author: formData.get("author"),
        email: formData.get("email"),
        content: formData.get("content"),
        parentId: formData.get("parentId") || null,
      };

      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn ? submitBtn.textContent : "";
      const statusDiv = form.querySelector("#form-status");

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting...";
          submitBtn.style.opacity = "0.7";
        }

        if (statusDiv) {
          statusDiv.style.display = "block";
          statusDiv.textContent = "Sending your comment...";
          statusDiv.style.color = "var(--color-foreground, #000)";
        }

        const result = await this.submit(data);

        if (statusDiv) {
          statusDiv.textContent =
            "Comment submitted successfully! It will appear after moderation.";
          statusDiv.style.color = "var(--color-green, green)";
          setTimeout(() => {
            statusDiv.style.display = "none";
            statusDiv.textContent = "";
          }, 6000);
        }

        form.reset();

        const parentIdField = form.querySelector('[name="parentId"]');
        if (parentIdField) {
          parentIdField.value = "";
        }

        this.render();
        return result;
      } catch (error) {
        if (statusDiv) {
          statusDiv.textContent = `Error: ${error.message}`;
          statusDiv.style.color = "var(--color-red, red)";
          statusDiv.style.display = "block";
        }
        throw error;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = "1";
        }
      }
    }

    startPolling() {
      if (!this.pollInterval) return;

      this.stopPolling();

      this.pollTimer = setInterval(async () => {
        const before = this.comments.length;
        await this.load();

        if (this.comments.length > before) {
          this.render();
        }
      }, this.pollInterval);
    }

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
  }

  /* --------------------------------------------------------
   * Helper: normalize page id
   * --------------------------------------------------------*/
  function normalizePageId(pathOrId) {
    if (!pathOrId || typeof pathOrId !== "string") return "index";
    // If already looks like an id (contains underscores), keep it
    let id = pathOrId.trim();
    // Common case: full URL or path
    try {
      // If a full URL passed, extract pathname
      const u = new URL(id, window.location.origin);
      id = u.pathname;
    } catch (e) {
      // not a full URL, keep as-is
    }
    // Normalize: trim slashes, replace with underscore, collapse multiple underscores
    id = id.replace(/^\/+|\/+$/g, "");
    if (id === "") return "index";
    id = id.replace(/[\/]+/g, "_");
    // Replace characters not safe for filenames
    id = id.replace(/[^A-Za-z0-9_\-]/g, "_");
    return id;
  }

  /* --------------------------------------------------------
   * Singleton wrapper & public API
   * --------------------------------------------------------*/
  const DEFAULTS = {
    apiUrl: "/api/comments",
    containerSelector: "#comments",
    formSelector: "#comment-form",
    pollInterval: null,
    autoInit: true,
    pageId: null,
    onLoad: null,
    onRender: null,
  };

  let _instance = null;
  let _configured = { ...DEFAULTS };

  const comments = {
    version: "@VERSION_PLACEHOLDER@",

    configure(options = {}) {
      Object.assign(_configured, options || {});
      return _configured;
    },

    getInstance() {
      return _instance;
    },

    createInstance(options = {}) {
      const opts = {
        apiUrl: _configured.apiUrl,
        container: options.container || _configured.containerSelector,
        form: options.formSelector || _configured.formSelector,
        pollInterval:
          options.pollInterval != null
            ? options.pollInterval
            : _configured.pollInterval,
        onLoad: options.onLoad || _configured.onLoad,
        onRender: options.onRender || _configured.onRender,
      };

      // Resolve pageId (prefer explicit, then meta, then normalized location)
      const explicitPageId =
        options.pageId || _configured.pageId || _getPageIdFromDOM();
      opts.pageId = normalizePageId(explicitPageId || window.location.pathname);

      _instance = new GitHubComments(opts);
      return _instance;
    },

    async init(options = {}) {
      if (typeof document === "undefined") {
        // Not in a browser environment
        return null;
      }

      // If an instance already exists and user doesn't request recreate, keep it
      if (_instance && !options.recreate) {
        return _instance;
      }

      // Allow user to pass container selector(s). If multiple containers exist, pick first.
      let container = options.container;
      if (!container) {
        // Look for element with data-comments attribute or default selector
        const el =
          document.querySelector("[data-comments]") ||
          document.querySelector(_configured.containerSelector);
        container = el || _configured.containerSelector;
      }

      const inst = this.createInstance({
        ...options,
        container,
      });

      // Attempt to load and render but do not throw on failure
      try {
        await inst.load();
        inst.render();
      } catch (e) {
        // swallow
      }

      // Attach form handler if form exists
      try {
        inst.attachFormHandler(
          options.formSelector || _configured.formSelector,
        );
      } catch (e) {
        // swallow
      }

      // Start polling if configured
      if (inst.pollInterval) {
        inst.startPolling();
      }

      return inst;
    },

    async load() {
      if (!_instance) await this.init();
      if (!_instance) return [];
      return _instance.load();
    },

    render() {
      if (!_instance) {
        console.error("comments: not initialized (call comments.init())");
        return;
      }
      return _instance.render();
    },

    attachFormHandler(selector) {
      if (!_instance) {
        console.error("comments: not initialized (call comments.init())");
        return;
      }
      return _instance.attachFormHandler(selector);
    },

    submit(data) {
      if (!_instance) {
        console.error("comments: not initialized (call comments.init())");
        return Promise.reject(new Error("comments: not initialized"));
      }
      return _instance.submit(data);
    },

    startPolling() {
      if (!_instance) {
        console.error("comments: not initialized (call comments.init())");
        return;
      }
      return _instance.startPolling();
    },

    stopPolling() {
      if (!_instance) {
        return;
      }
      return _instance.stopPolling();
    },

    // Utility: return normalized page id that will be used if not provided explicitly
    getPageId() {
      if (_instance && _instance.pageId) return _instance.pageId;
      const explicit = _configured.pageId || _getPageIdFromDOM();
      return normalizePageId(
        explicit ||
          (typeof window !== "undefined" ? window.location.pathname : "index"),
      );
    },
  };

  /* --------------------------------------------------------
   * DOM helpers
   * --------------------------------------------------------*/
  function _getPageIdFromDOM() {
    if (typeof document === "undefined") return null;

    // 1. data-page-id on root or container
    const el = document.querySelector("[data-page-id]") || document.body;
    const attr = el && el.getAttribute && el.getAttribute("data-page-id");
    if (attr) return attr;

    // 2. meta[name="page-id"]
    const meta = document.querySelector('meta[name="page-id"]');
    if (meta && meta.content) return meta.content;

    // 3. og:url or canonical
    const og = document.querySelector('meta[property="og:url"]');
    if (og && og.content) {
      try {
        const u = new URL(og.content);
        return u.pathname;
      } catch (e) {
        return og.content;
      }
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      try {
        const u = new URL(canonical.href);
        return u.pathname;
      } catch (e) {
        return canonical.href;
      }
    }

    return null;
  }

  /* --------------------------------------------------------
   * Auto-initialize on DOM ready (if enabled)
   * --------------------------------------------------------*/
  function _autoInitIfNeeded() {
    if (!_configured.autoInit) return;

    // If already initialized, do nothing
    if (_instance) return;

    // Initialize after DOM is ready
    if (typeof document === "undefined") return;

    const runInit = () => {
      try {
        comments.init().catch(() => {
          // ignore init errors
        });
      } catch (e) {
        // ignore
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runInit, { once: true });
    } else {
      // DOM already ready
      runInit();
    }
  }

  // If configured.autoInit default true, schedule auto init
  try {
    _autoInitIfNeeded();
  } catch (e) {
    // ignore
  }

  /* --------------------------------------------------------
   * Export to global / module systems
   * --------------------------------------------------------*/
  if (typeof module !== "undefined" && module.exports) {
    module.exports = comments;
  } else {
    global.comments = comments;
    // For backward compatibility, also expose class
    global.GitHubComments = GitHubComments;
  }
})(typeof window !== "undefined" ? window : this);
