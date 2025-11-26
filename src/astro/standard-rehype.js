/**
 * Standard Framework Rehype Plugin Manager
 * 
 * @component Rehype Plugin Manager
 * @category HTML Processing
 * @author Francis Fontaine
 * 
 * Centralized configuration for all rehype (HTML) plugins.
 * Orchestrates plugins from /rehype/ directory.
 */

import rehypeTypography from "./rehype/typography.js";
import rehypeStandard from "./rehype/standard.js";

/**
 * Get configured rehype plugins array
 * 
 * @param {Object} config - Merged configuration object
 * @returns {Array} Array of [plugin, options] tuples for Astro
 * 
 * @example
 * const plugins = getRehypePlugins({ 
 *   typography: { smartQuotes: true },
 *   html: { lazyLoad: true } 
 * });
 */
export function getRehypePlugins(config = {}) {
  return [
    [rehypeTypography, config.typography || {}],
    [rehypeStandard, config.html || {}],
  ];
}

/**
 * Get list of all available rehype plugins
 * 
 * @returns {Array} Array of plugin metadata objects
 */
export function getAvailableRehypePlugins() {
  return [
    { 
      name: "rehypeTypography", 
      description: "Typography enhancements (smart quotes, fractions, etc.)",
      optional: false 
    },
    { 
      name: "rehypeStandard", 
      description: "Standard HTML processing (classes, attributes, optimization)",
      optional: false 
    },
  ];
}
