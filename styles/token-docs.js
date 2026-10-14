/**
 * Helpers for documenting the design tokens, shared by the manual (which generates the
 * CSS pages) and the Studio (whose tooltips link back to them). Nothing here holds a
 * value or a description: those come from the declarations and the `@property`
 * comments in the `.scss` files, so they cannot drift from the code.
 */

export const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * The custom properties a stylesheet declares, `name → value`, first declaration wins (later
 * ones are fallbacks for older browsers, print, high contrast…). A value runs to the first
 * `;` outside parentheses, however deeply `calc(…)` and `var(…)` nest: a pattern cannot count
 * parentheses, and a regular expression that tried silently dropped `--leading`.
 */
export function declaredValues(css) {
  const code = String(css || "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const values = new Map();
  const start = /(?:^|[;{\s])(--[a-z0-9-]+)\s*:/g;
  let m;
  while ((m = start.exec(code))) {
    const from = start.lastIndex;
    let i = from;
    let depth = 0;
    for (; i < code.length; i++) {
      const c = code[i];
      if (c === "(") depth++;
      else if (c === ")") depth--;
      else if (depth <= 0 && (c === ";" || c === "}")) break;
    }
    if (!values.has(m[1])) values.set(m[1], code.slice(from, i).replace(/\s+/g, " ").trim());
    start.lastIndex = i;
  }
  return values;
}

/** `_standard-06-prose.scss` → `prose`: the name of a stylesheet's page, `css/<name>`. */
export const pageName = (filepath) =>
  filepath
    .split("/")
    .pop()
    .replace(/\.scss$/, "")
    .replace(/^_?standard-\d+-/, "")
    .replace(/^_/, "");

/**
 * Where each token is documented: `{ [token]: { page, anchor, title } }`, read from the
 * `@property` comments. `page` is the CSS page (`css/color`), `title` the heading of the
 * comment block that documents it and `anchor` that heading's id on the page. A token
 * documented twice keeps the first; one with no comment is not in the index.
 * `sources` is `[filepath, raw]` pairs of the `_standard-*.scss` partials.
 */
export function tokenIndex(sources) {
  const index = {};
  for (const [filepath, raw] of sources) {
    if (filepath.includes("-99-debug")) continue;
    const page = pageName(filepath);
    for (const block of raw.match(/\/\*\*[\s\S]*?\*\//g) ?? []) {
      const title = block.match(/@(?:component|name)[ \t]+(.+)/)?.[1].trim();
      for (const m of block.matchAll(/@property[ \t]+(?:\{[^}]*\}[ \t]+)?(--[a-z0-9-]+)/g)) {
        index[m[1]] ??= { page, anchor: title ? slugify(title) : "", title: title ?? "" };
      }
    }
  }
  return index;
}

/** Where to see a Studio mockup: the Studio lives at `/studio` on the same site. */
export const studioHref = (mockupId) => (mockupId ? `/studio#${mockupId}` : "/studio");

/** The small "Studio ↗" line under a heading, opening the matching mockup in a new tab. */
export const studioLink = (mockupId) =>
  `<p class="studio-link"><a href="${studioHref(mockupId)}" target="_blank" rel="noopener">Studio ↗</a></p>`;

/**
 * A small live preview of a token, as an HTML string for the docs (markdown
 * with inline HTML). It is drawn with `var(--token)` itself, so it follows the
 * theme the docs are shown in, and it copies `var(--token)` when clicked (a
 * script in the manual layout handles `[data-copy]`). Tokens that have no
 * sensible static preview (easings, z-index, breakpoints) return "": the Studio
 * is where those are shown.
 */
export function previewOf(token) {
  const t = token;
  const base = `display:inline-block;vertical-align:middle;margin-right:.5em;cursor:copy;`;
  const attrs = `class="tok" stnd-preserve="tok" data-copy="var(${t})" title="Click to copy var(${t})"`;
  const box = (style, inner = "&nbsp;") => `<span ${attrs} style="${base}${style}">${inner}</span>`;
  if (/-tone$/.test(t)) return "";
  if (/^--(shadow|pane-edge)/.test(t))
    return box(`width:2.2em;height:1.2em;border-radius:.3em;background:var(--color-surface-raised);box-shadow:var(${t})`);
  if (/^--color-/.test(t))
    return box(`width:2.2em;height:1.2em;border-radius:.3em;background:linear-gradient(var(${t}),var(${t})),var(--color-surface-raised);box-shadow:var(--shadow-border)`);
  if (/^--(radius|window-radius|pane-radius)/.test(t))
    return box(`width:1.4em;height:1.4em;border-radius:var(${t});background:var(--color-fill-tertiary);box-shadow:var(--shadow-border)`);
  if (/^--space/.test(t))
    return box(`width:min(var(${t}),6em);height:.45em;border-radius:9999px;background:var(--color-accent)`);
  if (/^--(scale|font-size)/.test(t)) return box(`font-size:min(var(${t}),2.2em);line-height:1`, "Aa");
  if (/^--font-weight/.test(t)) return box(`font-weight:var(${t})`, "Aa");
  if (/^--font-(sans|serif|monospace|text|header|interface)$/.test(t)) return box(`font-family:var(${t})`, "Aa");
  if (/^--tracking/.test(t)) return box(`letter-spacing:var(${t})`, "Abc");
  if (/^--opacity-disabled$/.test(t)) return box(`width:2.2em;height:1.2em;border-radius:.3em;background:var(--color-accent);opacity:var(${t})`);
  if (/^--stroke-width/.test(t)) return box(`width:2.2em;height:0;border-top:var(${t}) solid var(--color-foreground)`);
  return "";
}
