
/**
 * Vite Plugin for Standard Framework Syntax
 * Ports the logic from src/eleventy/syntax.js to a Vite transform plugin.
 */

const DEFAULT_OBSIDIAN_ICONS = {
    abstract: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
    bug: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>',
    danger: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    example: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
    failure: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    question: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    quote: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
    tip: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    todo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
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


class SyntaxProcessor {
    constructor() {
        this.handlers = new Map();
        this.registerBuiltIns();
    }

    add(name, options, handler) {
        if (typeof options === "function") {
            handler = options;
            options = {};
        }
        const defaultOptions = { type: "block", priority: 100 };
        this.handlers.set(name, { ...defaultOptions, ...options, handler });
    }

    process(content) {
        const sorted = Array.from(this.handlers.entries()).sort(
            (a, b) => a[1].priority - b[1].priority
        );

        for (const [name, config] of sorted) {
            const { type, handler } = config;
            if (type === "inline" || type === "both") {
                content = this.processInline(content, name, handler);
            }
            if (type === "block" || type === "both") {
                content = this.processBlock(content, name, handler);
            }
        }
        return content;
    }

    processInline(content, name, handler) {
        const regex = new RegExp(`^::${name}\\s+([^\\n]+)`, "gm");
        return content.replace(regex, (fullMatch, value) => {
            try {
                return handler({
                    type: "inline",
                    name,
                    value: String(value).trim(),
                    args: String(value).trim(),
                    raw: fullMatch,
                });
            } catch (error) {
                console.error(`Error in ${name}:`, error);
                return fullMatch;
            }
        });
    }

    processBlock(content, name, handler) {
        const regex = new RegExp(`^::${name}([^\\n]*)\\n([\\s\\S]*?)^::end`, "gm");
        return content.replace(regex, (fullMatch, args, innerContent) => {
            try {
                return handler({
                    type: "block",
                    name,
                    args: String(args || "").trim(),
                    content: String(innerContent || "").trim(),
                    raw: fullMatch,
                });
            } catch (error) {
                console.error(`Error in ${name}:`, error);
                return fullMatch;
            }
        });
    }

    splitContent(content, delimiter = "---") {
        return String(content || "")
            .split(new RegExp(`\\n${delimiter}\\n`))
            .map((s) => s.trim())
            .filter(Boolean);
    }

    registerBuiltIns() {
        // Columns
        this.add("columns", (match) => {
            const cols = (match.args || 2);
            return `  <div class="columns-${cols}">\n\n${match.content}\n\n</div>\n`;
        });

        // Split
        this.add("split", (match) => {
            const sizes = (match.args || "").split("/").map((n) => parseInt(n, 10)).filter((n) => !isNaN(n) && n > 0);
            const cols = this.splitContent(match.content);
            let html = '<div class="grid">\n';
            cols.forEach((col, i) => {
                const span = sizes[i] || Math.max(1, Math.floor(12 / cols.length));
                html += `  <div class="sm:row col-${span}">\n\n${col}\n\n  </div>\n`;
            });
            html += "</div>\n";
            return html;
        });

        // Grid
        this.add("grid", (match) => {
            const items = this.splitContent(match.content);
            const count = items.length;
            let html = `<div class="grid-${count}">\n`;
            items.forEach((item) => {
                html += `  <div class="sm:row">\n\n${item}\n\n</div>\n`;
            });
            html += "</div>\n";
            return html;
        });

        // Containers
        this.add("small", (match) => `<div class="container-small">\n\n${match.content}\n\n</div>\n`);
        this.add("accent", (match) => `<div class="container-accent">\n\n${match.content}\n\n</div>\n`);
        this.add("feature", (match) => `<div class="container-feature">\n\n${match.content}\n\n</div>\n`);

        // Hero
        this.add("hero", (match) => {
            const align = (match.args || "").trim();
            const alignClass = align ? `text-${align}` : "";
            return `<div class="container-hero ${alignClass}">\n\n${match.content}\n\n</div>\n`;
        });

        // Cards
        this.add("cards", (match) => {
            const cards = this.splitContent(match.content);
            const count = cards.length;
            let html = `<div class="grid-${count}">\n`;
            cards.forEach((card) => {
                html += `  <div class="sm:row card">\n\n${card}\n\n</div>\n`;
            });
            html += "</div>\n";
            return html;
        });

        // Card
        this.add("card", (match) => `<div class="card">\n\n${match.content}\n\n</div>\n`);

        // Image
        this.add("image", (match) => {
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

        // Utilities
        this.add("space", { type: "inline" }, (match) => {
            const sizeMap = { small: "2", medium: "4", large: "6", xlarge: "8" };
            const size = (match.value || "").trim();
            return `<div class="space-${sizeMap[size] || "4"}"></div>\n`;
        });

        this.add("center", (match) => `<div class="center">\n\n${match.content}\n\n</div>\n`);

        // Inline alerts
        this.add("note", { type: "inline" }, (match) => `<aside class="note">${match.value}</aside>`);
        this.add("error", { type: "inline" }, (match) => `<div class="alert error">${match.value}</div>`);
        this.add("alert", { type: "inline" }, (match) => `<div class="alert">${match.value}</div>`);
        this.add("warning", { type: "inline" }, (match) => `<div class="alert warning">${match.value}</div>`);
        this.add("success", { type: "inline" }, (match) => `<div class="alert success">${match.value}</div>`);

        // Callouts
        this.add("callout", (match) => {
            const args = String(match.args || "").trim();
            const content = String(match.content || "");
            const argsMatch = args.match(/^([+-])?\s*(.+)$/);
            if (!argsMatch) return match.raw;

            const [, fold, header] = argsMatch;
            const type = header.toLowerCase();
            const title = header.charAt(0).toUpperCase() + header.slice(1);
            const isCollapsible = fold === "+" || fold === "-";
            const isOpen = fold === "+";
            const calloutContent = content.trim();
            const icon = DEFAULT_OBSIDIAN_ICONS[type] || DEFAULT_OBSIDIAN_ICONS.note;

            if (isCollapsible) {
                return `<details class="callout" data-callout="${type}"${isOpen ? " open" : ""}>
<summary class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</summary>
<div class="callout-content">${calloutContent}</div>
</details>`;
            } else {
                return `<div class="callout" data-callout="${type}">
<div class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</div>
<div class="callout-content">${calloutContent}</div>
</div>`;
            }
        });
    }
}

export default function standardSyntax() {
    const processor = new SyntaxProcessor();

    return {
        name: 'standard-syntax',
        enforce: 'pre',
        transform(code, id) {
            if (id.endsWith('.md')) {
                const processed = processor.process(code);
                return {
                    code: processed,
                    map: null
                };
            }
        }
    };
}
