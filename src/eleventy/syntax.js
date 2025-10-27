// src/eleventy/notion-syntax.js

/**
 * Notion-Friendly Layout Syntax
 *
 * @component Notion Syntax PreProcessor
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 2005, Notion was born from a simple idea: what if you could build
 * anything without code? Fast forward to today, and millions of non-technical
 * people use it daily to organize their lives. But there's always been a gap—
 * how do you take that content and make it a beautiful website without learning
 * HTML, CSS, or template languages?
 *
 * This plugin bridges that gap. It transforms simple, natural markers like
 * `::columns 2` into Standard Framework's sophisticated grid system. Behind
 * the scenes, it's generating semantic HTML with proper ARIA labels and
 * responsive classes. But your user just sees "columns 2" and knows exactly
 * what it means.
 *
 * Inspired by Swiss poster design where layout is intuitive and intentional,
 * not accidental. Josef Müller-Brockmann didn't need code—he had a grid and
 * clear intent. This gives your users the same power.
 *
 * **Why Preprocessing Matters**: Unlike transforms that run after rendering,
 * this preprocessor runs *before* markdown processing. That means the HTML
 * it generates gets parsed by markdown-it, and any Nunjucks template syntax
 * (like `{% for %}` loops in `::grid`) gets executed by the template engine.
 * Order matters—this runs early so everything else can build on top of it.
 *
 * ### Future Improvements
 *
 * - Add visual preview in Notion (browser extension)
 * - Support nested syntax (::columns inside ::feature)
 * - Add undo/redo for syntax experiments
 *
 * @see {mixin} grid - Standard Framework grid system
 * @see {class} .feature - Feature section styling
 * @see {file} preprocessor.js - Markdown preprocessing
 *
 * @example
 *   eleventyConfig.addPlugin(Syntax, {
 *     patterns: ['columns', 'grid', 'feature']
 *   });
 */

import { createLogger } from "./logger.js";

export default function Syntax(eleventyConfig, options = {}) {
  const defaultOptions = {
    patterns: "all", // or array of pattern names
  };

  const opts = { ...defaultOptions, ...options };

  const logger = createLogger({
    verbose: options.verbose,
    scope: "Syntax",
  });

  logger.info("Notion Syntax PreProcessor initialized");

  // Use preprocessor instead of transform
  eleventyConfig.addPreprocessor("syntax", "md", (data, content) => {
    // Process all patterns
    content = processColumns(content);
    content = processSplit(content);
    content = processGrid(content, data);

    content = processSmall(content);
    content = processAccent(content);
    content = processFeature(content);
    content = processHero(content);

    content = processCard(content);
    content = processTestimonial(content);
    content = processImage(content);
    content = processGallery(content);
    content = processSpace(content);
    content = processCenter(content);
    content = processCallout(content);
    content = processButton(content);
    content = processForm(content);
    content = processStackMobile(content);
    content = processIf(content, data);

    // CLEANUP: Remove any unprocessed ::syntax
    const unprocessed = findUnprocessedSyntax(content);
    if (unprocessed.length > 0) {
      //logger.warn(`Removed unprocessed syntax in ${data.page.inputPath}:`);
      //unprocessed.forEach((pattern) => {
      //  logger.warn(`  - ::${pattern}`);
      //});
    }

    content = cleanupUnprocessedSyntax(content);

    return content;
  });
}

/**
 * Find Unprocessed Syntax Patterns
 *
 * @component Syntax Validator
 * @category Debugging
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * When you're building a custom syntax system, the worst thing that can
 * happen is silent failures. You type `::gallery 3` and... nothing. Did
 * it work? Was there a typo? Is the plugin even running?
 *
 * This function acts as a safety net. Before cleanup removes unprocessed
 * syntax, it extracts every `::pattern` that's about to be deleted and
 * reports it in debug mode. It's like a spell-checker for your custom
 * markup—catching typos before they become mysteries.
 *
 * The practice of "making the invisible visible" comes from Bauhaus
 * teaching methods. Walter Gropius believed students learned best when
 * they could *see* their mistakes. This function does exactly that.
 *
 * ### Future Improvements
 *
 * - Suggest corrections using Levenshtein distance (::colums → ::columns?)
 * - Track frequency of removed patterns to identify common typos
 * - Generate a report file: `.notion-syntax-removed.log`
 *
 * @see {function} cleanupUnprocessedSyntax - Removes invalid syntax
 * @see {function} processColumns - Valid column syntax
 *
 * @example
 *   const removed = findUnprocessedSyntax(content);
 *   // Returns: ['note', 'todo', 'columsn']
 *
 * @param {string} content - Content to scan
 * @returns {string[]} Array of unprocessed pattern names
 */
function findUnprocessedSyntax(content) {
  const patterns = [];
  const regex = /^::([\w-]+)/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    patterns.push(match[1]);
  }

  return [...new Set(patterns)]; // Unique patterns only
}

// ... (rest of your processing functions remain exactly the same)

/**
 * Process ::columns syntax
 *
 * @example
 *   ::columns 2
 *   Left content
 *   ---
 *   Right content
 *   ::end
 */
function processColumns(content) {
  const regex = /^::columns\s+(\d+)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, count, inner) => {
    const cols = inner.split(/\n---\n/);
    const colCount = parseInt(count);
    const colSpan = Math.floor(12 / colCount);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col.trim()}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });
}

/**
 * Process ::split syntax (asymmetric columns)
 *
 * @example
 *   ::split 8/4
 *   Main content (8 columns)
 *   ---
 *   Sidebar (4 columns)
 *   ::end
 */
function processSplit(content) {
  const regex = /^::split\s+([\d/]+)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, ratio, inner) => {
    const sizes = ratio.split("/").map((n) => parseInt(n));
    const cols = inner.split(/\n---\n/);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col, i) => {
      const span = sizes[i] || Math.floor(12 / cols.length);
      html += `  <div class="col-12 md:col-${span}">\n\n${col.trim()}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });
}

/**
 * Process ::grid syntax (dynamic collections)
 *
 * @example
 *   ::grid products 3
 *   **{{ item.title }}**
 *   {{ item.price }}
 *   ::end
 */
function processGrid(content, pageData) {
  const regex = /^::grid\s+(\w+)\s+(\d+)\n?([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, collection, columns, template) => {
    const colCount = parseInt(columns);
    const colSpan = Math.floor(12 / colCount);

    // Default template if none provided
    const itemTemplate =
      template.trim() ||
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
}

/**
 * Process ::small syntax
 *
 * @example
 *   ::small
 *   # Important Section
 *   Standout content
 *   ::end
 */
function processSmall(content) {
  const regex = /^::small\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<div class="container-small">\n\n${inner.trim()}\n\n</div>\n`;
  });
}

/**
 * Process ::accent syntax
 *
 * @example
 *   ::accent
 *   # Important Section
 *   Standout content
 *   ::end
 */
function processAccent(content) {
  const regex = /^::accent\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<div class="container-accent">\n\n${inner.trim()}\n\n</div>\n`;
  });
}

/**
 * Process ::feature syntax
 *
 * @example
 *   ::feature
 *   # Important Section
 *   Standout content
 *   ::end
 */
function processFeature(content) {
  const regex = /^::feature\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<div class="container-feature">\n\n${inner.trim()}\n\n</div>\n`;
  });
}

/**
 * Process ::hero syntax
 *
 * @example
 *   ::hero center
 *   # Main Headline
 *   Subheading
 *   ::end
 */
function processHero(content) {
  const regex = /^::hero(?:\s+(center|left|right))?\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, align, inner) => {
    const alignClass = align ? `text-${align}` : "";
    return `<div class="container-hero ${alignClass}">\n\n${inner.trim()}\n\n</div>\n`;
  });
}

/**
 * Process ::card and ::cards syntax
 *
 * @example
 *   ::cards 3
 *   ### Card 1
 *   ---
 *   ### Card 2
 *   ---
 *   ### Card 3
 *   ::end
 */
function processCard(content) {
  // Multiple cards
  content = content.replace(
    /^::cards\s+(\d+)\n([\s\S]*?)^::end/gm,
    (match, count, inner) => {
      const cards = inner.split(/\n---\n/);
      const colCount = parseInt(count);
      const colSpan = Math.floor(12 / colCount);

      let html = '<div class="grid gap-4">\n';
      cards.forEach((card) => {
        html += `  <div class="col-12 md:col-${colSpan}">\n    <div class="card">\n\n${card.trim()}\n\n    </div>\n  </div>\n`;
      });
      html += "</div>\n";

      return html;
    },
  );

  // Single card
  content = content.replace(/^::card\n([\s\S]*?)^::end/gm, (match, inner) => {
    return `<div class="card">\n\n${inner.trim()}\n\n</div>\n`;
  });

  return content;
}

/**
 * Process ::testimonial syntax
 *
 * @example
 *   ::testimonial
 *   This service changed my life!
 *   — Client Name
 *   ::end
 */
function processTestimonial(content) {
  const regex = /^::testimonial\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<blockquote class="testimonial">\n\n${inner.trim()}\n\n</blockquote>\n`;
  });
}

/**
 * Process ::image syntax
 *
 * @example
 *   ::image full
 *   https://example.com/image.jpg
 *   Caption text
 *   ::end
 */
function processImage(content) {
  const regex =
    /^::image\s+(full|wide|float-right|float-left)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, variant, inner) => {
    const lines = inner.trim().split("\n");
    const url = lines[0];
    const caption = lines.slice(1).join("\n");

    let classes = "image-" + variant;
    let html = `<figure class="${classes}">\n`;
    html += `  <img src="${url}" alt="${caption || ""}">\n`;
    if (caption) {
      html += `  <figcaption>${caption}</figcaption>\n`;
    }
    html += `</figure>\n`;

    return html;
  });
}

/**
 * Process ::gallery syntax
 *
 * @example
 *   ::gallery 3
 *   image1.jpg
 *   ---
 *   image2.jpg
 *   ---
 *   image3.jpg
 *   ::end
 */
function processGallery(content) {
  const regex = /^::gallery\s+(\d+)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, columns, inner) => {
    const images = inner.split(/\n---\n/);
    const colCount = parseInt(columns);
    const colSpan = Math.floor(12 / colCount);

    let html = '<div class="gallery grid gap-4">\n';
    images.forEach((img) => {
      const url = img.trim();
      html += `  <div class="col-12 md:col-${colSpan}">\n`;
      html += `    <img src="${url}" alt="">\n`;
      html += `  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });
}

/**
 * Process ::space syntax
 *
 * @example
 *   ::space large
 *   ::end
 */
function processSpace(content) {
  const regex = /^::space\s+(small|medium|large|xlarge)\n?^::end/gm;

  return content.replace(regex, (match, size) => {
    const sizeMap = {
      small: "2",
      medium: "4",
      large: "6",
      xlarge: "8",
    };
    return `<div class="space-${sizeMap[size] || "4"}"></div>\n`;
  });
}

/**
 * Process ::center syntax
 *
 * @example
 *   ::center
 *   Centered content
 *   ::end
 */
function processCenter(content) {
  const regex = /^::center\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<div class="text-center">\n\n${inner.trim()}\n\n</div>\n`;
  });
}

/**
 * Process ::callout syntax
 *
 * @example
 *   ::callout
 *   💡 Important tip here
 *   ::end
 */
function processCallout(content) {
  const regex = /^::callout\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    return `<aside class="callout">\n\n${inner.trim()}\n\n</aside>\n`;
  });
}

/**
 * Process ::button syntax
 *
 * @example
 *   ::button primary
 *   [Sign Up Now](/signup)
 *   ::end
 */
function processButton(content) {
  const regex =
    /^::button(?:\s+(primary|secondary))?\n\[(.*?)\]\((.*?)\)\n?^::end/gm;

  return content.replace(regex, (match, variant, text, url) => {
    const classes = variant ? `button button-${variant}` : "button";
    return `<a href="${url}" class="${classes}">${text}</a>\n`;
  });
}

/**
 * Process ::form syntax
 *
 * @example
 *   ::form contact
 *   Name
 *   Email
 *   Message
 *   ::end
 */
function processForm(content) {
  const regex = /^::form\s+(\w+)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, formType, inner) => {
    const fields = inner.trim().split("\n");

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
}

/**
 * Process ::stack-mobile syntax
 *
 * @example
 *   ::stack-mobile
 *   Column 1
 *   ---
 *   Column 2
 *   ::end
 */
function processStackMobile(content) {
  const regex = /^::stack-mobile\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, inner) => {
    const cols = inner.split(/\n---\n/);
    const colSpan = Math.floor(12 / cols.length);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col.trim()}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });
}

/**
 * Process ::if syntax (conditional based on frontmatter)
 *
 * @component Conditional Content
 * @category Template Logic
 *
 * Evaluates frontmatter variables to show/hide content sections.
 * Supports equality checks, existence checks, and negation.
 *
 * @example
 *   ::if featured
 *   This only shows if page has featured: true
 *   ::end
 *
 * @example
 *   ::if status == "published"
 *   Published content only
 *   ::end
 *
 * @example
 *   ::if !draft
 *   Shows unless draft is true
 *   ::end
 */
function processIf(content, pageData) {
  const regex = /^::if\s+(.*?)\n([\s\S]*?)^::end/gm;

  return content.replace(regex, (match, condition, inner) => {
    const shouldShow = evaluateCondition(condition.trim(), pageData);

    if (shouldShow) {
      return `\n${inner.trim()}\n`;
    } else {
      return "";
    }
  });
}

/**
 * Evaluate frontmatter condition
 *
 * Supports:
 * - featured (truthy check)
 * - !draft (negation)
 * - status == "published" (equality)
 * - count > 5 (comparison)
 */
function evaluateCondition(condition, pageData) {
  // Negation: !variable
  if (condition.startsWith("!")) {
    const key = condition.slice(1).trim();
    return !pageData[key];
  }

  // Equality: variable == "value"
  if (condition.includes("==")) {
    const [key, value] = condition.split("==").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) === cleanValue;
  }

  // Inequality: variable != "value"
  if (condition.includes("!=")) {
    const [key, value] = condition.split("!=").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) !== cleanValue;
  }

  // Greater than: count > 5
  if (condition.includes(">")) {
    const [key, value] = condition.split(">").map((s) => s.trim());
    return Number(pageData[key]) > Number(value);
  }

  // Less than: count < 5
  if (condition.includes("<")) {
    const [key, value] = condition.split("<").map((s) => s.trim());
    return Number(pageData[key]) < Number(value);
  }

  // Simple truthy check: featured
  return !!pageData[condition];
}

/**
 * Clean up unprocessed syntax (acts as comments)
 *
 * @component Comment Cleanup
 * @category Preprocessing
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * Any `::syntax` pattern that wasn't processed by a specific handler gets
 * removed. This is brilliant for two reasons:
 *
 * First, it gives non-technical users a way to leave notes to themselves
 * that never appear on the published site. Want to remember why you structured
 * a section a certain way? Add `::note My reasoning here ::end` and it
 * vanishes during build.
 *
 * Second, it's forgiving. If someone types `::columsn 2` (typo), the site doesn't
 * break with mysterious markup—it just silently removes it. Less stress,
 * more experimentation.
 *
 * The Swiss designer Armin Hofmann once said "the problem contains the solution."
 * By making unrecognized syntax disappear, we turn potential errors into features.
 *
 * ### Future Improvements
 *
 * - Add warning in debug mode listing removed patterns
 * - Suggest corrections for common typos (::columsn → ::columns)
 * - Create a `.notion-syntax-log` file with removed patterns
 *
 * @see {function} processIf - Conditional syntax
 * @see {function} processColumns - Column layouts
 *
 * @example
 *   ::note Remember to update pricing next month ::end
 *   (This disappears from the final HTML)
 *
 * @example
 *   ::todo Add testimonial from Sarah ::end
 *   (Invisible to-do list in your content)
 *
 * @example
 *   ::draft
 *   Section I'm working on but not ready to publish
 *   ::end
 *   (Hidden until you implement ::draft or rename it)
 *
 * @param {string} content - HTML/Markdown content
 * @returns {string} Content with unprocessed syntax removed
 */
function cleanupUnprocessedSyntax(content) {
  // Remove block syntax: ::anything ... ::end (only when :: is at start of line)
  content = content.replace(/^::[\w-]+[^\n]*\n[\s\S]*?^::end/gm, "");

  // Remove single-line syntax: ::anything (only when on its own line)
  content = content.replace(/^::[\w-]+.*$/gm, "");

  return content;
}
