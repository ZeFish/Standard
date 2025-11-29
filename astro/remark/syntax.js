/**
 * Remark plugin for Standard Framework :: syntax
 * Handles ::center, ::columns, ::split, ::grid, ::card, ::callout, etc.
 */

import { visit } from "unist-util-visit";
import { parse } from "node:querystring";

const DEFAULT_OBSIDIAN_ICONS = {
  abstract:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
  bug: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>',
  danger:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  example:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
  failure:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  question:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  quote:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
  tip: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  todo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
};

// Aliases
DEFAULT_OBSIDIAN_ICONS.attention = DEFAULT_OBSIDIAN_ICONS.warning;
DEFAULT_OBSIDIAN_ICONS.caution = DEFAULT_OBSIDIAN_ICONS.warning;
DEFAULT_OBSIDIAN_ICONS.check = DEFAULT_OBSIDIAN_ICONS.success;
DEFAULT_OBSIDIAN_ICONS.cite = DEFAULT_OBSIDIAN_ICONS.quote;
DEFAULT_OBSIDIAN_ICONS.done = DEFAULT_OBSIDIAN_ICONS.success;
DEFAULT_OBSIDIAN_ICONS.error = DEFAULT_OBSIDIAN_ICONS.danger;
DEFAULT_OBSIDIAN_ICONS.fail = DEFAULT_OBSIDIAN_ICONS.failure;
DEFAULT_OBSIDIAN_ICONS.faq = DEFAULT_OBSIDIAN_ICONS.question;
DEFAULT_OBSIDIAN_ICONS.help = DEFAULT_OBSIDIAN_ICONS.question;
DEFAULT_OBSIDIAN_ICONS.hint = DEFAULT_OBSIDIAN_ICONS.tip;
DEFAULT_OBSIDIAN_ICONS.important = DEFAULT_OBSIDIAN_ICONS.tip;
DEFAULT_OBSIDIAN_ICONS.missing = DEFAULT_OBSIDIAN_ICONS.failure;
DEFAULT_OBSIDIAN_ICONS.summary = DEFAULT_OBSIDIAN_ICONS.abstract;
DEFAULT_OBSIDIAN_ICONS.tldr = DEFAULT_OBSIDIAN_ICONS.abstract;

function splitContent(content, delimiter = "---") {
  return String(content || "")
    .split(new RegExp(`\\n${delimiter}\\n`))
    .map((s) => s.trim())
    .filter(Boolean);
}

function createHTMLNode(value) {
  return {
    type: "html",
    value: value,
  };
}

function createTextNode(value) {
  return {
    type: "text",
    value: value,
  };
}

function parseCalloutArgs(args) {
  const argsMatch = String(args || "")
    .trim()
    .match(/^([+-])?\s*(.+)$/);
  if (!argsMatch) return null;

  const [, fold, header] = argsMatch;
  const type = header.toLowerCase();
  const title = header.charAt(0).toUpperCase() + header.slice(1);
  const isCollapsible = fold === "+" || fold === "-";
  const isOpen = fold === "+";

  return { type, title, isCollapsible, isOpen };
}

import Logger from "../../core/logger.js";

export default function remarkSyntax(options = {}) {
  const logger = Logger({ scope: "syntax" });
  logger.info("init");

  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      // Check if this paragraph contains :: syntax
      const text = node.children
        .filter((child) => child.type === "text" || child.type === "inlineCode")
        .map((child) => child.value)
        .join("");

      // Skip if no text content
      if (!text.trim()) return;

      // Check for block syntax first
      const blockMatch = text.match(/^::(\w+)([^\n]*)\n([\s\S]*?)\n::end$/);
      if (blockMatch) {
        const [, name, args, content] = blockMatch;
        const result = handleBlockSyntax(name, args, content);
        if (result) {
          parent.children.splice(index, 1, ...result);
          return index + result.length;
        }
      }

      // Check for inline syntax - entire paragraph is the directive
      const inlineMatch = text.match(/^::(\w+)\s+(.+)$/);
      if (inlineMatch) {
        const [, name, value] = inlineMatch;
        const result = handleInlineSyntax(name, value);
        if (result) {
          parent.children.splice(index, 1, ...result);
          return index + result.length;
        }
      }
    });
  };

  function handleBlockSyntax(name, args, content) {
    switch (name) {
      case "center":
        return [createHTMLNode(`<div class="center">\n\n${content}\n\n</div>`)];

      case "columns": {
        const cols = parseInt(args) || 2;
        return [
          createHTMLNode(
            `<div class="columns-${cols}">\n\n${content}\n\n</div>`,
          ),
        ];
      }

      case "split": {
        const sizes = String(args || "")
          .split("/")
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n) && n > 0);
        const cols = splitContent(content);
        let html = '<div class="grid">\n';
        cols.forEach((col, i) => {
          const span = sizes[i] || Math.max(1, Math.floor(12 / cols.length));
          html += `  <div class="sm:row col-${span}">\n\n${col}\n\n  </div>\n`;
        });
        html += "</div>\n";
        return [createHTMLNode(html)];
      }

      case "collection": {
        const [collection, columns] = String(args || "").split(/\s+/);
        const colCount = Math.max(1, parseInt(columns || "3", 10));
        const colSpan = Math.floor(12 / colCount);
        const itemTemplate = content.trim();

        return [
          createHTMLNode(`<!-- Collection: ${collection} with ${colCount} columns -->
<div class="grid collection collection-${collection}" data-collection="${collection}" data-columns="${colCount}">
  <div class="col-12 text-center">
    <em>Dynamic content from "${collection}" collection will appear here</em>
    <p>Template: ${itemTemplate}</p>
  </div>
</div>`),
        ];
      }

      case "grid": {
        const items = splitContent(content);
        const count = items.length;
        let html = `<div class="grid-${count}">\n`;
        items.forEach((item) => {
          html += `  <div class="sm:row">\n\n${item}\n\n</div>\n`;
        });
        html += "</div>\n";
        return [createHTMLNode(html)];
      }

      case "gallery": {
        const images = splitContent(content);
        const count = images.length;
        let html = `<div class="grid-${count}">\n`;
        images.forEach((image) => {
          html += `  <div class="sm:row">\n\n${image}\n\n</div>\n`;
        });
        html += "</div>\n";
        return [createHTMLNode(html)];
      }

      case "small":
        return [
          createHTMLNode(
            `<div class="container-small">\n\n${content}\n\n</div>`,
          ),
        ];

      case "accent":
        return [
          createHTMLNode(
            `<div class="container-accent">\n\n${content}\n\n</div>`,
          ),
        ];

      case "feature":
        return [
          createHTMLNode(
            `<div class="container-feature">\n\n${content}\n\n</div>`,
          ),
        ];

      case "hero": {
        const align = String(args || "").trim();
        const alignClass = align ? `text-${align}` : "";
        return [
          createHTMLNode(
            `<div class="container-hero ${alignClass}">\n\n${content}\n\n</div>`,
          ),
        ];
      }

      case "cards": {
        const cards = splitContent(content);
        const count = cards.length;
        let html = `<div class="grid-${count}">\n`;
        cards.forEach((card) => {
          html += `  <div class="sm:row card">\n\n${card}\n\n</div>\n`;
        });
        html += "</div>\n";
        return [createHTMLNode(html)];
      }

      case "card":
        return [createHTMLNode(`<div class="card">\n\n${content}\n\n</div>`)];

      case "image": {
        const variant = String(args || "").trim();
        const lines = String(content || "").split("\n");
        const url = (lines[0] || "").trim();
        const caption = lines.slice(1).join("\n").trim();
        let html = `<figure class="image-${variant}">\n`;
        html += `  <img src="${url}" alt="${caption || ""}">\n`;
        if (caption) html += `  <figcaption>${caption}</figcaption>\n`;
        html += `</figure>\n`;
        return [createHTMLNode(html)];
      }

      case "button": {
        const variant = String(args || "").trim();
        const linkMatch = String(content || "").match(
          /\[([^\]]+)\]\(([^)]+)\)/,
        );
        if (linkMatch) {
          const [, text, url] = linkMatch;
          const classes = variant ? `button button-${variant}` : "button";
          return [
            createHTMLNode(`<a href="${url}" class="${classes}">${text}</a>\n`),
          ];
        }
        return [createHTMLNode(content)];
      }

      case "form": {
        const formType = String(args || "").trim() || "contact";
        const fields = String(content || "")
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
        return [createHTMLNode(html)];
      }

      case "stack-mobile": {
        const cols = splitContent(content);
        const colSpan = Math.max(1, Math.floor(12 / Math.max(1, cols.length)));

        let html = '<div class="grid gap-4">\n';
        cols.forEach((col) => {
          html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
        });
        html += "</div>\n";
        return [createHTMLNode(html)];
      }

      case "if": {
        // Note: In Astro, we don't have pageData available in remark plugins
        // This is a simplified implementation - full conditional logic would need
        // to be implemented in a rehype plugin or with page context
        const condition = String(args || "").trim();
        const shouldShow = condition && !condition.startsWith("!");

        return [createHTMLNode(shouldShow ? `\n${content}\n` : "")];
      }

      case "callout": {
        const parsed = parseCalloutArgs(args);
        if (!parsed) return null;

        const { type, title, isCollapsible, isOpen } = parsed;
        const calloutContent = content.trim();
        const icon =
          DEFAULT_OBSIDIAN_ICONS[type] || DEFAULT_OBSIDIAN_ICONS.note;

        if (isCollapsible) {
          const html = `<details class="callout" data-callout="${type}"${isOpen ? " open" : ""}>
<summary class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</summary>
<div class="callout-content">${calloutContent}</div>
</details>`;
          return [createHTMLNode(html)];
        } else {
          const html = `<div class="callout" data-callout="${type}">
<div class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</div>
<div class="callout-content">${calloutContent}</div>
</div>`;
          return [createHTMLNode(html)];
        }
      }

      default:
        return null;
    }
  }

  function handleInlineSyntax(name, value) {
    switch (name) {
      case "space": {
        const sizeMap = { small: "2", medium: "4", large: "6", xlarge: "8" };
        const size = String(value || "").trim();
        return [
          createHTMLNode(`<div class="space-${sizeMap[size] || "4"}"></div>`),
        ];
      }

      case "note":
        return [createHTMLNode(`<aside class="note">${value}</aside>`)];

      case "error":
        return [createHTMLNode(`<div class="alert error">${value}</div>`)];

      case "alert":
        return [createHTMLNode(`<div class="alert">${value}</div>`)];

      case "warning":
        return [createHTMLNode(`<div class="alert warning">${value}</div>`)];

      case "success":
        return [createHTMLNode(`<div class="alert success">${value}</div>`)];

      case "muted":
        return [createHTMLNode(`<p class="muted">${value}</p>`)];

      case "subtle":
        return [createHTMLNode(`<p class="subtle">${value}</p>`)];

      default:
        return null;
    }
  }
}
