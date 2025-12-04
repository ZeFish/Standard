/**
 * @zefish/standard Astro Integration
 *
 * A comprehensive wrapper that orchestrates:
 * - OpenRouter AI integration
 * - Cloudflare integration
 * - Standard framework features
 */
import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";
import logger from "../core/logger.js";
import openrouterIntegration from "./integrations/openrouter.js";
import cloudflareIntegration from "./integrations/cloudflare.js";
import { deepMerge } from "./utils/utils.js";

// Remark & Rehype Plugins
import remarkTags from "./remark/tags.js";
import remarkStandard from "./remark/standard.js";
import remarkEscapeCode from "./remark/escape-code.js";
import remarkFixDates from "./remark/fix-dates.js";
import remarkObsidianLinks from "./remark/obsidian-links.js";
import remarkBacklinks from "./remark/backlinks.js";
import remarkSyntax from "./remark/syntax.js";

import rehypeTypography from "./rehype/typography.js";
import rehypeStandard from "./rehype/standard.js";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// PLUGIN MANAGERS
// ========================================

/**
 * Get configured remark plugins array
 *
 * @param {Object} config - Merged configuration object
 * @returns {Array} Array of [plugin, options] tuples for Astro
 */
function getRemarkPlugins(config = {}) {
  const plugins = [
    // Frontmatter defaults now handled by Vite plugin (runs earlier)
    [remarkTags, config.tags || {}],
    [remarkStandard, config.standard || {}],
    [remarkEscapeCode, config || {}],
    [remarkFixDates, config.dateFields || {}],
  ];

  // ✨ CRITICAL: Backlinks must run BEFORE ObsidianLinks
  if (config.backlinks !== false) {
    plugins.push([
      remarkBacklinks,
      { verbose: config.verbose, ...config.backlinks },
    ]);
  }

  // ObsidianLinks plugin
  plugins.push([remarkObsidianLinks, {}]);

  // Syntax highlighting always last (must run after content transformations)
  plugins.push([remarkSyntax, config.syntax || {}]);

  return plugins;
}

/**
 * Get list of all available remark plugins
 *
 * @returns {Array} Array of plugin metadata objects
 */
function getAvailableRemarkPlugins() {
  return [
    {
      name: "remarkTags",
      description: "Extract and process frontmatter tags",
      optional: false,
    },
    {
      name: "remarkStandard",
      description: "Standard markdown enhancements (containers, callouts)",
      optional: false,
    },
    {
      name: "remarkEscapeCode",
      description: "Escape code blocks to prevent double-processing",
      optional: false,
    },
    {
      name: "remarkFixDates",
      description: "Normalize date fields across different formats",
      optional: false,
    },
    {
      name: "remarkObsidianLinks",
      description: "Convert Obsidian-style [[wikilinks]] to standard links",
      optional: false,
    },
    {
      name: "remarkBacklinks",
      description: "Generate automatic bidirectional backlinks",
      optional: true,
      default: true,
    },
    {
      name: "remarkSyntax",
      description: "Syntax highlighting for code blocks (must run last)",
      optional: false,
    },
    {
      name: "remarkFrontmatterDefaults",
      description:
        "Apply default values to missing frontmatter fields (deprecated - now handled by Vite plugin)",
      optional: true,
      default: false,
      deprecated: true,
    },
  ];
}

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
function getRehypePlugins(config = {}) {
  return [
    [
      rehypeTypography,
      {
        defaultLocale: config.language || "en",
        ...config.typography,
      },
    ],
    [rehypeStandard, config.html || {}],
  ];
}

/**
 * Get list of all available rehype plugins
 *
 * @returns {Array} Array of plugin metadata objects
 */
function getAvailableRehypePlugins() {
  return [
    {
      name: "rehypeTypography",
      description: "Typography enhancements (smart quotes, fractions, etc.)",
      optional: false,
    },
    {
      name: "rehypeStandard",
      description:
        "Standard HTML processing (classes, attributes, optimization)",
      optional: false,
    },
  ];
}

/**
 * Sanitize config to remove circular references and functions
 * @param {Object} obj - Object to sanitize
 * @param {WeakSet} seen - Track visited objects
 * @returns {Object} Sanitized object safe for JSON.stringify
 */
function sanitizeConfig(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return undefined;
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeConfig(item, seen)).filter(Boolean);
  }

  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // Skip functions and problematic keys
      if (typeof value === "function" || key.startsWith("_")) {
        continue;
      }
      sanitized[key] = sanitizeConfig(value, seen);
    }
  }
  return sanitized;
}

// ========================================
// MAIN INTEGRATION
// ========================================

export default function standard(options = {}) {
  const log = logger({ verbose: false, scope: "Core" });

  // Get package version for banner
  let packageVersion = "0.0.0";
  try {
    const packagePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../package.json",
    );
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    packageVersion = packageData.version || "0.0.0";
    options.version = packageVersion;
  } catch (error) {
    // Fallback to default version if package.json can't be read
  }

  // Banner to indicate successful initialization
  log.banner(packageVersion);

  // All configuration comes from astro.config.js root level
  // Options are merged as overrides if needed
  let mergedConfig = options;

  return {
    name: "@zefish/standard",
    hooks: {
      "astro:config:setup": async ({
        config,
        updateConfig,
        injectScript,
        injectRoute,
      }) => {
        // Merge full Astro config with Standard options
        // This allows all site config to live at the root level of astro.config.js
        const finalConfig = deepMerge(config, mergedConfig);

        // Store config globally so it can be accessed from anywhere
        // This is the official Astro pattern for sharing config across the build
        globalThis.__STANDARD_CONFIG__ = finalConfig;

        // Use centralized plugin managers
        // ✨ ENABLE backlinks plugin for testing
        const remarkPlugins = getRemarkPlugins({
          ...finalConfig,
          backlinks: true, // Enable remark backlinks
        });
        const rehypePlugins = getRehypePlugins(finalConfig);

        // 1. Configure Remark/Rehype Plugins
        updateConfig({
          markdown: {
            remarkPlugins,
            rehypePlugins,
            syntaxHighlight: "prism",
            shikiConfig: {
              wrap: false,
            },
          },
        });

        // 2. Virtual Modules (config only)
        const virtualModulesPlugin = {
          name: "vite-plugin-standard-virtual",
          resolveId(id) {
            if (id === "virtual:standard/config") {
              return "\0standard-virtual-config";
            }
          },
          load(id) {
            if (id === "\0standard-virtual-config") {
              // Sanitize config to remove circular references
              const cleanConfig = sanitizeConfig(finalConfig);
              return `export default ${JSON.stringify(cleanConfig)}`;
            }
          },
        };

        updateConfig({
          vite: {
            plugins: [virtualModulesPlugin],
            resolve: {
              alias: {
                // Use source in dev for fast HMR
                "@zefish/standard/styles": path.resolve(
                  __dirname,
                  "../design_system/styles",
                ),
                "@zefish/standard/themes": path.resolve(
                  __dirname,
                  "../design_system/themes",
                ),
                "@zefish/standard/js": path.resolve(
                  __dirname,
                  "../design_system/js/standard.js",
                ),
                "@zefish/standard/logger": path.resolve(
                  __dirname,
                  "../core/logger.js",
                ),
                "@zefish/standard/astro/utils/collections": path.resolve(
                  __dirname,
                  "utils/collections.js",
                ),
                "@zefish/standard/astro/components/Backlinks": path.resolve(
                  __dirname,
                  "components/Backlinks.astro",
                ),
                "@fontsource-variable/inter": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource-variable/inter/index.css",
                ),
                "@fontsource-variable/instrument-sans": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource-variable/instrument-sans/index.css",
                ),
                "@fontsource/instrument-serif": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource/instrument-serif/index.css",
                ),
                "@fontsource-variable/fraunces": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource-variable/fraunces/index.css",
                ),
                "@fontsource/ibm-plex-mono": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource/ibm-plex-mono/index.css",
                ),
                "@fontsource-variable/newsreader": path.resolve(
                  __dirname,
                  "../node_modules/@fontsource-variable/newsreader/index.css",
                ),
              },
            },
          },
        });

        // 3. Inject Routes (optional)
        if (finalConfig.injectRoutes !== false) {
          // Inject dynamic content route for markdown files
          //injectRoute({
          //  pattern: "/[...slug]",
          //  entrypoint: path.join(__dirname, "routes/content.astro"),
          //});

          injectRoute({
            pattern: "/robots.txt",
            entrypoint: path.join(__dirname, "routes/robots.js"),
          });
          injectRoute({
            pattern: "/site.webmanifest",
            entrypoint: path.join(__dirname, "routes/manifest.js"),
          });
          injectRoute({
            pattern: "/_headers",
            entrypoint: path.join(__dirname, "routes/headers.js"),
          });
        }

        // 4. Configure Vite aliases to expose Standard assets
        const moduleDirAliases = path.dirname(fileURLToPath(import.meta.url));
        const packageSrcDir = path.resolve(moduleDirAliases, "../");

        const aliasEntries = {};
        /*
        const stylesDir = path.resolve(packageSrcDir, "styles");
        if (fs.existsSync(stylesDir)) {
          aliasEntries["@standard-styles"] = stylesDir;
        }

        const scriptsDir = path.resolve(packageSrcDir, "js");
        if (fs.existsSync(scriptsDir)) {
          aliasEntries["@standard-js"] = scriptsDir;
        }
*/

        const fontsDir = path.resolve(
          packageSrcDir,
          "../",
          "public",
          "assets",
          "fonts",
        );
        if (fs.existsSync(fontsDir)) {
          aliasEntries["@standard-fonts"] = fontsDir;
        }

        // Copy fonts from package to public directory
        const packageFontsDir = path.resolve(
          packageSrcDir,
          "../public/assets/fonts",
        );
        const clientPublicDir = path.resolve(
          fileURLToPath(config.root), // ← Convert URL to string
          "public/assets/fonts",
        );

        // Create the directory if it doesn't exist
        if (!fs.existsSync(clientPublicDir)) {
          fs.mkdirSync(clientPublicDir, { recursive: true });
        }

        // Copy all font files
        if (fs.existsSync(packageFontsDir)) {
          const files = fs.readdirSync(packageFontsDir, { recursive: true });
          files.forEach((file) => {
            const src = path.join(packageFontsDir, file);
            const dest = path.join(clientPublicDir, file);

            // Create subdirectories
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }

            // Copy file
            if (fs.statSync(src).isFile()) {
              fs.copyFileSync(src, dest);
            }
          });

          log.info("Fonts copied to public directory");
        }

        if (Object.keys(aliasEntries).length > 0) {
          updateConfig({
            vite: {
              resolve: {
                alias: aliasEntries,
              },
            },
          });
        }

        // 5. Register sub-integrations as Astro plugins
        // Note: Astro will handle calling their hooks automatically
        const integrations = [];

        if (finalConfig.cloudflare?.enabled !== false) {
          integrations.push(
            cloudflareIntegration({
              ...finalConfig.cloudflare,
              verbose: finalConfig.verbose,
            }),
          );
        }

        if (finalConfig.openrouter?.enabled !== false) {
          integrations.push(
            openrouterIntegration({
              ...finalConfig.openrouter,
              verbose: finalConfig.verbose,
              siteUrl: finalConfig.site?.url || finalConfig.url,
            }),
          );
        }

        // Update config with registered integrations
        if (integrations.length > 0) {
          updateConfig({
            integrations,
          });
        }

        // 6. Add Global Assets (CSS/JS)
        const assetsConfig = finalConfig.assets || {};
        //import '@fontsource-variable/inter';
        injectScript("page-ssr", `import "@fontsource-variable/inter";`);
        injectScript(
          "page-ssr",
          `import "@fontsource-variable/instrument-sans/";`,
        );
        injectScript("page-ssr", `import "@fontsource/instrument-serif";`);
        injectScript("page-ssr", `import "@fontsource-variable/fraunces";`);
        injectScript("page-ssr", `import "@fontsource/ibm-plex-mono";`);
        injectScript("page-ssr", `import "@fontsource-variable/newsreader";`);

        const cssEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.scss";
        if (cssEntry) {
          injectScript("page-ssr", `import "${cssEntry}";`);
        }

        const themeEntry =
          assetsConfig.css ?? "@zefish/standard/themes/standard.theme.scss";
        if (themeEntry) {
          injectScript("page-ssr", `import "${themeEntry}";`);
        }

        const jsEntry = assetsConfig.js ?? "@zefish/standard/js";
        if (jsEntry) {
          //injectScript("page", `import "${jsEntry}";`);
        }
      },
    },
  };
}

// ========================================
// EXPORT HELPERS
// ========================================

export { getRemarkPlugins, getAvailableRemarkPlugins };
export { getRehypePlugins, getAvailableRehypePlugins };
