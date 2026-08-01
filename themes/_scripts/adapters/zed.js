import fs from "fs";
import path from "path";
import { withOpacity, Color } from "../utils/color.js";

/** @param {string} p */
function formatPath(p) {
  const rel = path.relative(process.cwd(), p);
  if (!rel.startsWith("..")) return rel;
  if (process.env.HOME && p.startsWith(process.env.HOME)) {
    return "~" + p.slice(process.env.HOME.length);
  }
  return p;
}

/**
 * Generate a Zed theme object for a given name and appearance.
 * @param {string} name
 * @param {'light'|'dark'} appearance
 * @param {{ colors: Record<string,string> }} entryConfig
 * @param {string} backgroundAppearance
 */
function generateTheme(
  name,
  appearance,
  entryConfig,
  backgroundAppearance = "opaque",
  commonConfig = {},
) {
  const C = entryConfig.colors;
  /** @param {*} v Ensure a string hex (fallback to black) */
  const s = (v) => (typeof v === "string" ? v : String(v || "#000000"));
  const common = { transparent: "#00000000" };
  const accentKeys = [
    "magenta",
    "blue",
    "cyan",
    "green",
    "yellow",
    "orange",
    "red",
  ];

  // Generate Derived Colors
  // We mix Foreground relative to Background to create steps
  let bg_base = s(C.background).slice(0, 7);
  if (commonConfig && commonConfig.opacity !== undefined) {
    const opacityFloat = Number(commonConfig.opacity);
    if (!isNaN(opacityFloat) && opacityFloat >= 0 && opacityFloat < 1) {
      const alphaHex = Math.round(opacityFloat * 255)
        .toString(16)
        .padStart(2, "0");
      bg_base = withOpacity(bg_base, alphaHex);
    }
  }

  let bg_surface,
    bg_elevated,
    bg_element,
    bg_hover,
    bg_active,
    border_default,
    text_base,
    text_muted,
    text_dim,
    text_disable;

  if (appearance === "light") {
    bg_surface = Color.fromHex(s(C.background))
      .mix(s(C.foreground), 0.04)
      .saturate(0.5).hex; // Slight depth
    bg_elevated = Color.fromHex(s(C.background))
      .mix("#ffffff", 0.65)
      .saturate(1).hex; // Very bright
    bg_element = Color.fromHex(s(C.background))
      .mix(s(C.foreground), 0.08)
      .saturate(1).hex;
    bg_hover = bg_surface;
    bg_active = bg_surface;
    border_default = C.border
      ? C.border
      : Color.fromHex(s(C.background)).mix(s(C.foreground), 0.075).saturate(1)
          .hex;

    // Text
    text_base = C.foreground;
    text_muted = Color.fromHex(s(C.foreground))
      .mix(s(C.background), 0.5)
      .saturate(1).hex; // 40% visibility
    text_dim = Color.fromHex(s(C.foreground))
      .mix(s(C.background), 0.85)
      .saturate(1).hex; // 25% visibility
    text_disable = Color.fromHex(s(C.foreground)).mix(
      s(C.background),
      0.65,
    ).hex; // Same as dim
  } else {
    // Dark Mode: Elevations are lighter
    bg_surface = Color.fromHex(s(C.background))
      .mix("#000000", 0.1)
      .saturate(1).hex; // Slightly lighter
    bg_elevated = Color.fromHex(s(C.background))
      .mix(s(C.foreground), 0.05)
      .saturate(0.75).hex; // Even lighter
    bg_element = Color.fromHex(s(C.background))
      .mix(s(C.foreground), 0.1)
      .saturate(1).hex;
    bg_hover = bg_surface;
    bg_active = bg_surface;
    border_default = C.border
      ? C.border
      : Color.fromHex(s(C.background)).mix("#000000", 0.2).saturate(1).hex;

    // Text
    text_base = C.foreground;
    text_muted = Color.fromHex(s(C.foreground))
      .mix(s(C.background), 0.6)
      .saturate(0.5).hex; // 40% visibility
    text_dim = Color.fromHex(s(C.foreground))
      .mix(s(C.background), 0.9)
      .saturate(0.5).hex; // 25% visibility
    text_disable = Color.fromHex(s(C.foreground))
      .mix(s(C.background), 0.65)
      .saturate(1).hex; // Same as dim
  }

  return {
    name: name,
    appearance: appearance,
    style: {
      "background.appearance": backgroundAppearance,
      border: border_default,
      "border.variant": common.transparent,
      "border.focused": common.transparent,
      "border.selected": common.transparent,
      "border.transparent": common.transparent,
      "border.disabled": common.transparent,

      "elevated_surface.background": bg_elevated,
      "surface.background": bg_surface,
      background: bg_base,
      "element.background": bg_element,
      "element.hover": bg_hover,
      "element.active": bg_active,
      "element.selected": bg_active,
      "element.disabled": bg_base,

      "drop_target.background": withOpacity(bg_surface, "80"),
      "ghost_element.background": common.transparent,
      "ghost_element.hover": bg_hover,
      "ghost_element.active": bg_active,
      "ghost_element.selected": bg_active,
      "ghost_element.disabled": common.transparent,

      text: text_base,
      "text.muted": text_muted,
      "text.placeholder": text_dim,
      "text.disabled": text_disable,
      "text.dim": text_dim,
      "text.accent": C.accent,

      icon: text_base,
      "icon.muted": text_muted,
      "icon.disabled": text_disable,
      "icon.placeholder": text_dim,
      "icon.accent": C.accent,

      "status_bar.background": bg_base,
      "title_bar.background": bg_base,
      "title_bar.inactive_background": bg_base,
      "toolbar.background": common.transparent,
      "tab_bar.background": common.transparent,
      "tab.inactive_background": common.transparent,
      "tab.active_background": bg_active,
      "search.match_background": withOpacity(s(C.accent), "50"),

      "panel.background": bg_base,
      "panel.focused_border": common.transparent,
      "panel.indent_guide": border_default,
      "panel.indent_guide_active": border_default,
      "panel.indent_guide_hover": border_default,
      "pane.focused_border": border_default,
      "pane_group.border": border_default,

      "scrollbar.thumb.background": withOpacity(s(bg_element), "99"),
      "scrollbar.thumb.hover_background": withOpacity(s(C.accent), "50"),
      "scrollbar.thumb.active_background": withOpacity(s(C.accent), "50"),
      "scrollbar.thumb.border": common.transparent,
      "scrollbar.track.background": common.transparent,
      "scrollbar.track.border": common.transparent,

      "minimap.thumb.background": withOpacity(s(bg_element), "99"),
      "minimap.thumb.hover_background": withOpacity(s(C.accent), "50"),
      "minimap.thumb.active_background": withOpacity(s(C.accent), "50"),
      "minimap.thumb.border": common.transparent,

      "editor.foreground": text_base,
      "editor.background": bg_base,
      "editor.gutter.background": bg_base,
      "editor.subheader.background": bg_surface,
      "editor.active_line.background": bg_surface,
      "editor.highlighted_line.background": bg_surface,
      "editor.line_number": text_dim,
      "editor.active_line_number": text_muted,
      "editor.invisible": border_default,
      "editor.wrap_guide": border_default,
      "editor.active_wrap_guide": border_default,
      "editor.indent_guide": border_default,
      "editor.indent_guide_active": text_muted,
      "editor.document_highlight.read_background": common.transparent,
      "editor.document_highlight.write_background": C.red,
      "editor.document_highlight.bracket_background": C.accent,

      "terminal.background": bg_base,
      "terminal.foreground": text_base,
      "terminal.dim_foreground": text_muted,
      "terminal.bright_foreground": text_base,
      "terminal.ansi.black": text_base,
      "terminal.ansi.red": s(C.red),
      "terminal.ansi.green": s(C.green),
      "terminal.ansi.yellow": s(C.yellow),
      "terminal.ansi.blue": s(C.blue),
      "terminal.ansi.magenta": s(C.magenta),
      "terminal.ansi.cyan": s(C.cyan),
      "terminal.ansi.white": text_base,

      "terminal.ansi.bright_black": text_muted,
      "terminal.ansi.bright_red": s(C.red),
      "terminal.ansi.bright_green": s(C.green),
      "terminal.ansi.bright_yellow": s(C.yellow),
      "terminal.ansi.bright_blue": s(C.blue),
      "terminal.ansi.bright_magenta": s(C.magenta),
      "terminal.ansi.bright_cyan": s(C.cyan),
      "terminal.ansi.bright_white": text_base,

      "terminal.ansi.dim_black": text_muted,
      "terminal.ansi.dim_red": s(C.red),
      "terminal.ansi.dim_green": s(C.green),
      "terminal.ansi.dim_yellow": s(C.yellow),
      "terminal.ansi.dim_blue": s(C.blue),
      "terminal.ansi.dim_magenta": s(C.magenta),
      "terminal.ansi.dim_cyan": s(C.cyan),
      "terminal.ansi.dim_white": text_dim,

      // Generated Accents
      accents: ["accent", ...accentKeys].map((k) => withOpacity(s(C[k]), "66")),

      // Generated Players
      players: accentKeys.map((k) => ({
        cursor: s(C[k]),
        selection: withOpacity(s(C[k]), "50"),
        background: withOpacity(s(C[k]), "50"),
      })),

      conflict: s(C.red),
      "conflict.border": s(C.red),
      "conflict.background": s(C.red),
      created: s(C.green),
      "created.border": common.transparent,
      "created.background": common.transparent,
      deleted: s(C.red),
      "deleted.border": common.transparent,
      "deleted.background": common.transparent,
      error: s(C.red),
      "error.border": common.transparent,
      "error.background": common.transparent,
      hidden: text_dim,
      "hidden.border": common.transparent,
      "hidden.background": common.transparent,
      hint: text_muted,
      "hint.border": common.transparent,
      "hint.background": common.transparent,
      ignored: text_muted,
      "ignored.border": common.transparent,
      "ignored.background": common.transparent,
      modified: s(C.accent), // yellow for modified
      "modified.border": common.transparent,
      "modified.background": common.transparent,
      info: s(C.blue),
      "info.border": common.transparent,
      "info.background": bg_surface,
      predictive: text_muted,
      "predictive.border": common.transparent,
      "predictive.background": common.transparent,
      renamed: s(C.orange),
      "renamed.border": common.transparent,
      "renamed.background": common.transparent,
      success: s(C.green),
      "success.border": common.transparent,
      "success.background": common.transparent,
      unreachable: s(C.red),
      "unreachable.border": common.transparent,
      "unreachable.background": common.transparent,
      warning: s(C.orange),
      "warning.border": common.transparent,
      "warning.background": common.transparent,

      syntax: {
        variable: { color: s(C.green) },
        "variable.builtin": { color: s(C.blue) },
        "variable.parameter": { color: s(C.orange) },
        "variable.member": { color: text_base },
        "variable.special": { color: text_muted, font_style: "italic" },
        constant: { color: s(C.orange) },
        "constant.builtin": { color: s(C.orange) },
        "constant.macro": { color: s(C.orange) },
        module: { color: s(C.green) },
        label: { color: s(C.blue) },
        string: { color: s(C.yellow) },
        "string.documentation": { color: s(C.yellow) },
        "string.regexp": { color: s(C.green) },
        "string.escape": { color: s(C.green) },
        "string.special": { color: s(C.green) },
        "string.special.path": { color: s(C.green) },
        "string.special.symbol": { color: s(C.red) },
        "string.special.url": { color: s(C.blue) },
        character: { color: s(C.yellow) },
        "character.special": { color: s(C.green) },
        boolean: { color: s(C.red) },
        number: { color: s(C.orange) },
        "number.float": { color: s(C.orange) },
        type: { color: s(C.green) },
        "type.builtin": { color: s(C.blue) },
        "type.definition": { color: s(C.green) },
        "type.interface": { color: s(C.green) },
        "type.super": { color: s(C.green) },
        attribute: { color: s(C.green) },
        property: { color: text_base },
        function: { color: s(C.blue), font_style: "italic" },
        "function.builtin": { color: s(C.blue), font_style: "italic" },
        "function.call": { color: s(C.blue), font_style: "italic" },
        "function.macro": { color: s(C.blue), font_style: "italic" },
        "function.method": { color: s(C.blue), font_style: "italic" },
        "function.method.call": { color: s(C.blue), font_style: "italic" },
        constructor: { color: s(C.blue) },
        operator: { color: s(C.orange) },
        keyword: { color: s(C.orange), font_style: "italic" },
        "keyword.modifier": { color: s(C.orange), font_style: "italic" },
        "keyword.type": { color: s(C.orange), font_style: "italic" },
        "keyword.coroutine": { color: s(C.orange), font_style: "italic" },
        "keyword.function": { color: s(C.orange), font_style: "italic" },
        "keyword.operator": { color: s(C.orange), font_style: "italic" },
        "keyword.import": { color: s(C.orange), font_style: "italic" },
        "keyword.repeat": { color: s(C.orange), font_style: "italic" },
        "keyword.return": { color: s(C.orange), font_style: "italic" },
        "keyword.debug": { color: s(C.orange), font_style: "italic" },
        "keyword.exception": { color: s(C.orange), font_style: "italic" },
        "keyword.conditional": { color: s(C.orange), font_style: "italic" },
        "keyword.conditional.ternary": {
          color: s(C.orange),
          font_style: "italic",
        },
        "keyword.directive": { color: s(C.orange), font_style: "italic" },
        "keyword.directive.define": {
          color: s(C.orange),
          font_style: "italic",
        },
        "keyword.export": { color: s(C.orange), font_style: "italic" },
        punctuation: { color: s(C.orange) },
        "punctuation.delimiter": { color: text_muted },
        "punctuation.bracket": { color: text_muted },
        "punctuation.special": { color: s(C.cyan) },
        "punctuation.special.symbol": { color: s(C.red) },
        "punctuation.list_marker": { color: s(C.cyan) },
        comment: { color: text_muted, font_style: "italic" },
        "comment.doc": { color: s(C.orange), font_style: "italic" },
        tag: { color: s(C.blue) },
        "tag.attribute": { color: s(C.blue) },
        "tag.delimiter": { color: text_muted },
      },
    },
  };
}

/**
 * Write Zed theme JSON to disk.
 * @param {{ light: { colors: Record<string,string> }, dark: { colors: Record<string,string> } }} config
 * @param {{ displayName?: string, outputDir?: string, destinations?: string[] }} options
 */
function build(config, options) {
  const displayName =
    options && options.displayName ? options.displayName : "Forest";
  const filename = `${displayName}.json`;
  const outputDir = options.outputDir || process.cwd();

  const backgroundAppearance = config.appearance || "opaque";

  const zedThemeFamily = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: displayName,
    author: "Francis <francisfontaine@gmail.com>",
    themes: [
      generateTheme(
        displayName,
        "light",
        config.light,
        backgroundAppearance,
        config.common,
      ),
      generateTheme(
        `${displayName} Night`,
        "dark",
        config.dark,
        backgroundAppearance,
        config.common,
      ),
    ],
  };

  const dests = [
    path.join(outputDir, filename),
    ...(options.destinations || []),
  ];

  for (const dest of dests) {
    if (!dest) continue;
    try {
      let targetPath = dest;
      // Check if dest is directory, if so append filename
      try {
        // If path exists and is dir, append filename
        const stat = fs.statSync(dest);
        if (stat.isDirectory()) {
          targetPath = path.join(dest, filename);
        }
      } catch (e) {
        // Path does not exist.
        // If it ends in .json, assume full path.
        // If it doesn't, assume it's a dir we need to create.
        if (!dest.endsWith(".json")) {
          fs.mkdirSync(dest, { recursive: true });
          targetPath = path.join(dest, filename);
        }
      }

      fs.writeFileSync(targetPath, JSON.stringify(zedThemeFamily, null, 2));
      console.log(`    [Zed] Generated: ${formatPath(targetPath)}`);
    } catch (e) {
      console.warn(`    [Zed] Failed to write to ${dest}: ${e.message}`);
    }
  }
}

export { build };
