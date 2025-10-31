// src/eleventy/syntax.js

/**
 * Friendly Layout Syntax
 *
 * @component  Syntax PreProcessor
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 */

import { createLogger } from "./logger.js";

/**
 * Syntax Processor Class
 */
class SyntaxProcessor {
  constructor(options = {}) {
    this.options = options;
    this.handlers = new Map();
    this.logger = createLogger({
      verbose: options.verbose,
      scope: "Syntax",
    });
  }

  add(name, options, handler) {
    if (typeof options === "function") {
      handler = options;
      options = {};
    }

    const defaultOptions = {
      type: "block", // 'inline', 'block', or 'both'
      priority: 100, // Lower processed first
    };

    this.handlers.set(name, {
      ...defaultOptions,
      ...options,
      handler,
    });
  }

  process(content, pageData = {}) {
    const sorted = Array.from(this.handlers.entries()).sort(
      (a, b) => a[1].priority - b[1].priority,
    );

    for (const [name, config] of sorted) {
      const { type, handler } = config;

      if (type === "inline" || type === "both") {
        content = this.processInline(content, name, handler, pageData);
      }

      if (type === "block" || type === "both") {
        content = this.processBlock(content, name, handler, pageData);
      }
    }

    const unprocessed = this.findUnprocessedSyntax(content);
    if (unprocessed.length > 0 && this.options.verbose) {
      this.logger.warn(`Removed unprocessed syntax:`);
      unprocessed.forEach((pattern) => {
        this.logger.warn(`  - ::${pattern}`);
      });
    }

    content = this.cleanup(content);
    return content;
  }

  processInline(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}\\s+([^\\n]+)`, "gm");

    return content.replace(regex, (fullMatch, value) => {
      try {
        return handler({
          type: "inline",
          name,
          value: String(value).trim(),
          args: String(value).trim(),
          raw: fullMatch,
          pageData,
        });
      } catch (error) {
        this.logger.error(`Error in ${name}:`, error);
        return fullMatch;
      }
    });
  }

  processBlock(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}([^\\n]*)\\n([\\s\\S]*?)^::end`, "gm");

    return content.replace(regex, (fullMatch, args, innerContent) => {
      try {
        return handler({
          type: "block",
          name,
          args: String(args || "").trim(),
          content: String(innerContent || "").trim(),
          raw: fullMatch,
          pageData,
        });
      } catch (error) {
        this.logger.error(`Error in ${name}:`, error);
        return fullMatch;
      }
    });
  }

  findUnprocessedSyntax(content) {
    const patterns = [];
    const regex = /^::([\w-]+)/gm;
    let match;

    while ((match = regex.exec(content)) !== null) {
      patterns.push(match[1]);
    }

    return [...new Set(patterns)];
  }

  cleanup(content) {
    // Remove block syntax
    content = content.replace(/^::[\w-]+[^\n]*\n[\s\\S]*?^::end/gm, "");
    // Remove single-line syntax
    content = content.replace(/^::[\w-]+.*$/gm, "");
    return content;
  }

  parseArgs(argsString) {
    const args = {};
    const regex = /(\w+)=["']?([^"' \t]+)["']?/g;
    let match;

    while ((match = regex.exec(argsString)) !== null) {
      args[match[1]] = match[2];
    }

    return args;
  }

  splitContent(content, delimiter = "---") {
    return String(content || "")
      .split(new RegExp(`\\n${delimiter}\\n`))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

/**
 * Register Built-In Syntax Patterns
 */
function registerBuiltIns(processor) {
  // Columns
  processor.add("columns", (match) => {
    const count = Math.max(1, parseInt(match.args || "2", 10) || 2);
    const cols = processor.splitContent(match.content);
    const colSpan = Math.max(1, Math.floor(12 / count));

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Split
  processor.add("split", (match) => {
    const sizes = (match.args || "")
      .split("/")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n) && n > 0);
    const cols = processor.splitContent(match.content);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col, i) => {
      const span = sizes[i] || Math.max(1, Math.floor(12 / cols.length));
      html += `  <div class="col-12 md:col-${span}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Grid (dynamic via template)
  processor.add("grid", (match) => {
    const [collection, columns] = (match.args || "").split(/\s+/);
    const colCount = Math.max(1, parseInt(columns || "3", 10));
    const colSpan = Math.max(1, Math.floor(12 / colCount));
    const itemTemplate =
      match.content ||
      `
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
    `;

    return `
<div class="grid grid-sm-2">
{% for item in ${collection} %}
  <div class="col-${colSpan}">
${itemTemplate}
  </div>
{% endfor %}
</div>`.trim();
  });

  // Containers
  processor.add(
    "small",
    (match) => `<div class="container-small">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add(
    "accent",
    (match) => `<div class="container-accent">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add(
    "feature",
    (match) =>
      `<div class="container-feature">\n\n${match.content}\n\n</div>\n`,
  );

  // Hero
  processor.add("hero", (match) => {
    const align = (match.args || "").trim();
    const alignClass = align ? `text-${align}` : "";
    return `<div class="container-hero ${alignClass}">\n\n${match.content}\n\n</div>\n`;
  });

  // Card + Cards
  processor.add(
    "card",
    (match) => `<div class="card">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add("cards", (match) => {
    const count = Math.max(1, parseInt(match.args || "3", 10));
    const cards = processor.splitContent(match.content);
    const colSpan = Math.max(1, Math.floor(12 / count));

    let html = '<div class="grid gap-4">\n';
    cards.forEach((card) => {
      html += `  <div class="col-12 md:col-${colSpan}">
    <div class="card">\n\n${card}\n\n    </div>
  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Testimonial
  processor.add(
    "testimonial",
    (match) =>
      `<blockquote class="testimonial">\n\n${match.content}\n\n</blockquote>\n`,
  );

  // Image
  processor.add("image", (match) => {
    const variant = (match.args || "").trim();
    const lines = String(match.content || "").split("\n");
    const url = (lines[0] || "").trim();
    const caption = lines.slice(1).join("\n").trim();

    let html = `<figure class="image-${variant}">\n`;
    html += `  <img src="${url}" alt="${caption || ""}">\n`;
    if (caption) html += `  <figcaption>${caption}</figcaption>\n`;
    html += `</figure>\n`;
    return html;
  });

  // Gallery
  processor.add("gallery", (match) => {
    const columns = Math.max(1, parseInt(match.args || "3", 10));
    const images = processor.splitContent(match.content);
    const colSpan = Math.max(1, Math.floor(12 / columns));

    let html = '<div class="gallery grid gap-4">\n';
    images.forEach((img) => {
      const url = String(img || "").trim();
      html += `  <div class="col-12 md:col-${colSpan}">\n`;
      html += `    <img src="${url}" alt="">\n`;
      html += `  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Utilities
  processor.add("space", { type: "inline" }, (match) => {
    const sizeMap = { small: "2", medium: "4", large: "6", xlarge: "8" };
    const size = (match.value || "").trim();
    return `<div class="space-${sizeMap[size] || "4"}"></div>\n`;
  });

  processor.add(
    "center",
    (match) => `<div class="text-center">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add(
    "callout",
    (match) => `<aside class="callout">\n\n${match.content}\n\n</aside>\n`,
  );
  processor.add(
    "note",
    { type: "inline" },
    (match) => `<aside class="note">${match.value}</aside>\n`,
  );
  processor.add(
    "aside",
    (match) => `<aside>\n\n${match.content}\n\n</aside>\n`,
  );

  // Button
  processor.add("button", (match) => {
    const variant = (match.args || "").trim();
    const linkMatch = String(match.content || "").match(
      /\[([^\]]+)\]\(([^)]+)\)/,
    );
    if (linkMatch) {
      const [, text, url] = linkMatch;
      const classes = variant ? `button button-${variant}` : "button";
      return `<a href="${url}" class="${classes}">${text}</a>\n`;
    }
    return match.raw;
  });

  // Form
  processor.add("form", (match) => {
    const formType = (match.args || "").trim() || "contact";
    const fields = String(match.content || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    let html = `<form class="form form-${formType}" method="POST" action="/api/${formType}">\n`;
    fields.forEach((field) => {
      const fieldName = field.toLowerCase();
      const fieldType =
        fieldName === "email"
          ? "email"
          : fieldName === "message"
            ? "textarea"
            : "text";

      html += `  <div class="form-field">\n`;
      html += `    <label for="${fieldName}">${field}</label>\n`;
      if (fieldType === "textarea") {
        html += `    <textarea id="${fieldName}" name="${fieldName}" required></textarea>\n`;
      } else {
        html += `    <input type="${fieldType}" id="${fieldName}" name="${fieldName}" required>\n`;
      }
      html += `  </div>\n`;
    });
    html += `  <button type="submit" class="button button-primary">Send</button>\n`;
    html += `</form>\n`;
    return html;
  });

  // Stack-mobile
  processor.add("stack-mobile", (match) => {
    const cols = processor.splitContent(match.content);
    const colSpan = Math.max(1, Math.floor(12 / Math.max(1, cols.length)));

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // If (conditional)
  processor.add("if", (match) => {
    const shouldShow = evaluateCondition(
      match.args || "",
      match.pageData || {},
    );
    return shouldShow ? `\n${match.content}\n` : "";
  });
}

/**
 * Evaluate simple conditions against pageData
 */
function evaluateCondition(condition, pageData) {
  const cond = String(condition || "").trim();
  if (!cond) return false;

  if (cond.startsWith("!")) {
    const key = cond.slice(1).trim();
    return !pageData[key];
  }
  if (cond.includes("==")) {
    const [key, value] = cond.split("==").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) === cleanValue;
  }
  if (cond.includes("!=")) {
    const [key, value] = cond.split("!=").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) !== cleanValue;
  }
  if (cond.includes(">")) {
    const [key, value] = cond.split(">").map((s) => s.trim());
    return Number(pageData[key]) > Number(value);
  }
  if (cond.includes("<")) {
    const [key, value] = cond.split("<").map((s) => s.trim());
    return Number(pageData[key]) < Number(value);
  }
  return !!pageData[cond];
}

/**
 * Syntax Plugin Export (default)
 */
export default function Syntax(eleventyConfig, options = {}) {
  const processor = new SyntaxProcessor(options);

  // Register built-in syntax
  registerBuiltIns(processor);

  // Expose processor for custom syntax
  eleventyConfig.Syntax = processor;

  processor.logger.success();

  // 1) Async AI inline preprocessor (must run BEFORE the sync Syntax preprocessor)
  //    Replaces lines like: ::ai say hello
  eleventyConfig.addPreprocessor(
    "ai-inline",
    "md",
    async function (data, content) {
      const file = this?.inputPath || data?.page?.inputPath || "(unknown)";
      let text = String(content || "");

      // Only proceed when ::ai is present (allow leading spaces)
      if (!/^\s*::ai\s+/m.test(text)) {
        return content;
      }

      const stdAI = eleventyConfig.stdAI;

      // If AI unavailable, annotate and return
      if (!stdAI || !stdAI.enabled) {
        return text.replace(
          /^\s*::ai[^\n]*$/gm,
          '<aside class="note">[AI disabled]</aside>',
        );
      }

      // Replace each ::ai ... with AI output
      const matches = [...text.matchAll(/^\s*::ai\s+(.+)$/gm)];
      if (matches.length === 0) return text;

      for (const m of matches) {
        const full = m[0];
        let value = (m[1] || "").trim();

        // Optional inline model override: ::ai model=MODEL prompt...
        const mm = value.match(/^model=([^\s]+)\s+(.*)$/);
        const opts = {};
        if (mm) {
          opts.model = mm[1];
          value = mm[2];
        }

        try {
          const result = await stdAI.call(value, opts);
          const replacement = (typeof result === "string" ? result : "") || "";
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(new RegExp(escaped, "g"), replacement);
        } catch (e) {
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(
            new RegExp(escaped, "g"),
            `<aside class="note">[AI Error: ${e?.message || "unknown"}]</aside>`,
          );
        }
      }

      return text;
    },
  );

  // 1b) Async AI block preprocessor (must run BEFORE the sync Syntax preprocessor)
  //     Matches:
  //       ::ai
  //       ...content...
  //       ::end
  //     Or with args:
  //       ::ai model=MODEL
  //       ...content...
  //       ::end
  eleventyConfig.addPreprocessor(
    "ai-block",
    "md",
    async function (data, content) {
      const file = this?.inputPath || data?.page?.inputPath || "(unknown)";
      let text = String(content || "");

      // Quick check to avoid needless work
      if (!/^\s*::ai(?:\s|$)/m.test(text)) {
        return content;
      }

      const stdAI = eleventyConfig.stdAI;

      // If AI unavailable, annotate and return
      if (!stdAI || !stdAI.enabled) {
        return text.replace(
          // Block form
          /^\s*::ai[^\n]*\n([\s\S]*?)^\s*::end/gm,
          '<aside class="note">[AI disabled]</aside>',
        );
      }

      // Regex for block: leading spaces allowed
      // Captures optional args on the first line and the inner content
      const blockRe = /^\s*::ai([^\n]*)\n([\s\S]*?)^\s*::end/gm;

      // Resolve blocks sequentially (safe and deterministic)
      let match;
      while ((match = blockRe.exec(text)) !== null) {
        const full = match[0]; // entire block
        const rawArgs = (match[1] || "").trim();
        const inner = (match[2] || "").trim();

        // Parse simple key=value args (e.g., model=MODEL)
        const args = {};
        rawArgs.replace(/(\w+)=["']?([^"' \t]+)["']?/g, (_, k, v) => {
          args[k] = v;
          return "";
        });

        const opts = {};
        if (args.model) opts.model = args.model;

        const prompt = inner || rawArgs || "Say hello";

        try {
          const result = await stdAI.call(prompt, opts);
          const replacement = (typeof result === "string" ? result : "") || "";
          // Replace exactly this block instance
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(new RegExp(escaped, "g"), replacement);
        } catch (e) {
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(
            new RegExp(escaped, "g"),
            `<aside class="note">[AI Error: ${e?.message || "unknown"}]</aside>`,
          );
        }
      }

      return text;
    },
  );

  // 2) Synchronous preprocessor for layout directives (runs AFTER ai-inline)
  eleventyConfig.addPreprocessor("syntax", "md", (data, content) => {
    return processor.process(content, data);
  });

  return processor;
}

/**
 * Optional class export for advanced usage
 */
export { SyntaxProcessor };
