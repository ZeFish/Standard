/**
 * Translates standard web HTML element selectors (blockquote, h1-h6, hr, callout-title)
 * into Obsidian dual-mode selectors (Reading View + CodeMirror 6 Live Preview).
 *
 * @param {string} css SCSS or CSS string using standard web selectors
 * @returns {string} CSS with Obsidian-compatible selectors
 */
function mapWebSelectorsToObsidian(css) {
  if (!css) return "";

  // Replace legacy Obsidian variables if still referenced
  let result = css
    .replace(/var\(--background-primary\)/g, "var(--color-background)")
    .replace(/var\(--text-normal\)/g, "var(--color-foreground)")
    .replace(/var\(--color-primary\)/g, "var(--color-accent)");

  const prefix = "(^|[\\s,{>+~(:])";
  const suffix = "(?=[\\s,{:>+~),;]|$)";

  // 1. blockquote -> Reading View blockquote + Live Preview .HyperMD-quote + Slides
  result = result.replace(
    new RegExp(`${prefix}blockquote${suffix}`, "gm"),
    "$1:is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote, .reveal blockquote, .slides blockquote)"
  );

  // 2. pre -> Reading View pre + Live Preview .cm-embed-block:has(pre) + Slides
  result = result.replace(
    new RegExp(`${prefix}pre${suffix}`, "gm"),
    "$1:is(.markdown-reading-view pre, .markdown-rendered pre, .markdown-preview-view pre, .cm-embed-block:has(pre), .reveal pre, .slides pre)"
  );

  // 3. code -> code + Live Preview .cm-inline-code
  result = result.replace(
    new RegExp(`${prefix}code${suffix}`, "gm"),
    "$1:is(code, .cm-inline-code)"
  );

  // 4. table -> Reading View table + Live Preview .cm-embed-block:has(table) + Slides
  result = result.replace(
    new RegExp(`${prefix}table${suffix}`, "gm"),
    "$1:is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table), .reveal table, .slides table)"
  );

  // 5. mark -> mark + Live Preview .cm-highlight
  result = result.replace(
    new RegExp(`${prefix}mark${suffix}`, "gm"),
    "$1:is(mark, .cm-highlight)"
  );

  // 6. Headings h1..h6 -> Reading View hX + Live Preview .HyperMD-header-X + inline-title + Slides
  result = result.replace(
    new RegExp(`${prefix}h1${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title, .reveal h1, .slides h1)"
  );
  result = result.replace(
    new RegExp(`${prefix}h2${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h2, .HyperMD-header-2, .reveal h2, .slides h2)"
  );
  result = result.replace(
    new RegExp(`${prefix}h3${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h3, .HyperMD-header-3, .reveal h3, .slides h3)"
  );
  result = result.replace(
    new RegExp(`${prefix}h4${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h4, .HyperMD-header-4, .reveal h4, .slides h4)"
  );
  result = result.replace(
    new RegExp(`${prefix}h5${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h5, .HyperMD-header-5, .reveal h5, .slides h5)"
  );
  result = result.replace(
    new RegExp(`${prefix}h6${suffix}`, "gm"),
    "$1:is(.markdown-reading-view h6, .HyperMD-header-6, .reveal h6, .slides h6)"
  );

  // 7. hr -> hr + .HyperMD-hr + Slides
  result = result.replace(
    new RegExp(`${prefix}hr${suffix}`, "gm"),
    "$1:is(hr, .HyperMD-hr, .reveal hr, .slides hr)"
  );

  // 8. .callout-title -> .callout-title + .callout-title-inner
  result = result.replace(
    new RegExp(`${prefix}\\.callout-title${suffix}`, "gm"),
    "$1:is(.callout-title, .callout-title-inner)"
  );

  return result;
}

module.exports = { mapWebSelectorsToObsidian };
module.exports.default = mapWebSelectorsToObsidian;
