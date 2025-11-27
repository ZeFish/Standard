/**
 * Standard Framework Remark Plugin Manager
 * 
 * @component Remark Plugin Manager
 * @category Markdown Processing
 */

import remarkTags from "./remark/tags.js";
import remarkStandard from "./remark/standard.js";
import remarkEscapeCode from "./remark/escape-code.js";
import remarkFixDates from "./remark/fix-dates.js";
import remarkFrontmatterDefaults from "./remark/frontmatter-defaults.js";
import remarkObsidianLinks from "./remark/obsidian-links.js";
import remarkBacklinks from "./remark/backlinks.js";
import remarkSyntax from "./remark/syntax.js";

/**
 * Get configured remark plugins array
 * 
 * @param {Object} config - Merged configuration object
 * @returns {Array} Array of [plugin, options] tuples for Astro
 */
export function getRemarkPlugins(config = {}) {
  console.log("📦 REMARK PLUGINS SETUP with config:", {
    backlinksEnabled: config.backlinks !== false,
    verboseEnabled: config.verbose,
    backlinksConfig: config.backlinks,
  });

  const plugins = [
    [remarkTags, config.tags || {}],
    [remarkStandard, config.standard || {}],
    [remarkEscapeCode, config.escapeCode || {}],
    [remarkFixDates, config.dateFields || {}],
    [remarkFrontmatterDefaults, { defaults: config.frontmatterDefaults || {}, verbose: config.verbose }],
  ];

  // ✨ CRITICAL: Backlinks must run BEFORE ObsidianLinks
  if (config.backlinks !== false) {
    console.log("✅ Adding BACKLINKS plugin with options:", {
      verbose: config.verbose,
      ...config.backlinks,
    });
    plugins.push([remarkBacklinks, { verbose: config.verbose, ...config.backlinks }]);
  } else {
    console.log("⏭️  BACKLINKS plugin DISABLED");
  }

  // ObsidianLinks plugin
  plugins.push([remarkObsidianLinks, {}]);

  // Syntax highlighting always last (must run after content transformations)
  plugins.push([remarkSyntax, config.syntax || {}]);

  console.log("📝 Total remark plugins configured:", plugins.length);
  return plugins;
}

/**
 * Get list of all available remark plugins
 * 
 * @returns {Array} Array of plugin metadata objects
 */
export function getAvailableRemarkPlugins() {
  return [
    {
      name: "remarkTags",
      description: "Extract and process frontmatter tags",
      optional: false
    },
    {
      name: "remarkStandard",
      description: "Standard markdown enhancements (containers, callouts)",
      optional: false
    },
    {
      name: "remarkEscapeCode",
      description: "Escape code blocks to prevent double-processing",
      optional: false
    },
    {
      name: "remarkFixDates",
      description: "Normalize date fields across different formats",
      optional: false
    },
    {
      name: "remarkObsidianLinks",
      description: "Convert Obsidian-style [[wikilinks]] to standard links",
      optional: false
    },
    {
      name: "remarkBacklinks",
      description: "Generate automatic bidirectional backlinks",
      optional: true,
      default: true
    },
    {
      name: "remarkSyntax",
      description: "Syntax highlighting for code blocks (must run last)",
      optional: false
    },
    {
      name: "remarkFrontmatterDefaults",
      description: "Apply default values to missing frontmatter fields",
      optional: true,
      default: false
    },
  ];
}
