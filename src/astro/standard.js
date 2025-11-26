/**
 * @zefish/standard Astro Integration
 *
 * A comprehensive wrapper that orchestrates:
 * - OpenRouter AI integration
 * - Cloudflare integration
 * - Standard framework features
 */
import { getRemarkPlugins } from "./standard-remark.js";
import { getRehypePlugins } from "./standard-rehype.js";
import { getBacklinkGraph, resetBacklinkGraph } from "./remark/backlinks.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import createLogger from "../lib/logger.js";
import openrouterIntegration from "./integrations/openrouter.js";
import cloudflareIntegration from "./integrations/cloudflare.js";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Deep merge two objects recursively
 * Options take precedence over defaults
 *
 * @param {Object} target - Base object (defaults)
 * @param {Object} source - Object to merge (overrides)
 * @returns {Object} Merged object with all nested properties
 *
 * @example
 * deepMerge(
 *   { db: { host: 'localhost', port: 5432 } },
 *   { db: { port: 3306 } }
 * )
 * // Returns: { db: { host: 'localhost', port: 3306 } }
 */
export function deepMerge(target = {}, source = {}) {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    // Recursively merge objects (but not arrays or null)
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      sourceValue !== null &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue) &&
      targetValue !== null
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Otherwise, source takes precedence
      result[key] = sourceValue;
    }
  }

  return result;
}

// ========================================
// MAIN INTEGRATION
// ========================================

export default function standard(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "Core",
  });

  // Load site config if specified in options
  let siteConfig = {};
  const configPath = options.configPath || "site.config.yml";

  if (configPath && fs.existsSync(configPath)) {
    try {
      const configFile = fs.readFileSync(configPath, "utf8");
      siteConfig = yaml.load(configFile) || {};
      logger.debug(`Loaded config from: ${configPath}`);
    } catch (error) {
      logger.warn(
        `Warning: Could not parse config file (${configPath}): ${error.message}`
      );
    }
  } else if (configPath) {
    logger.debug(`Config file not found: ${configPath}`);
  }

  // Merge site config with options using deep merge
  // Options take precedence over config file
  const mergedConfig = deepMerge(siteConfig, options);

  // Get package version for banner
  let packageVersion = "0.0.0";
  try {
    const packagePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../package.json"
    );
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    packageVersion = packageData.version || "0.0.0";
  } catch (error) {
    // Fallback to default version if package.json can't be read
  }

  // Banner to indicate successful initialization
  logger.banner(packageVersion);

  return {
    name: "@zefish/standard",
    hooks: {
      "astro:config:setup": ({
        config,
        updateConfig,
        injectScript,
        injectRoute,
      }) => {
        const backlinksEnabled = mergedConfig.backlinks !== false;
        if (backlinksEnabled) {
          resetBacklinkGraph();
        }

        // Use centralized plugin managers
        const remarkPlugins = getRemarkPlugins(mergedConfig);
        const rehypePlugins = getRehypePlugins(mergedConfig);

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

        // 2. Virtual Modules (config + backlinks)
        const moduleDir = path.dirname(fileURLToPath(import.meta.url));
        const currentDir = path.resolve(moduleDir);
        const backlinksModulePath = path
          .join(currentDir, "remark", "backlinks.js")
          .split(path.sep)
          .join("/");

        const virtualModulesPlugin = {
          name: "vite-plugin-standard-virtual",
          resolveId(id) {
            if (id === "virtual:standard/config") {
              return "\0standard-virtual-config";
            }
            if (id === "virtual:standard/backlinks") {
              return "\0standard-virtual-backlinks";
            }
          },
          load(id) {
            if (id === "\0standard-virtual-config") {
              return `export default ${JSON.stringify(mergedConfig)}`;
            }
            if (id === "\0standard-virtual-backlinks") {
              if (!backlinksEnabled) {
                return `export const backlinks = {}; export const normalizeKey = (s) => s; export default backlinks;`;
              }
              return `import { getBacklinkGraph, normalizeKey } from "${backlinksModulePath}"; const graph = getBacklinkGraph(); export { normalizeKey }; export const backlinks = graph; export default graph;`;
            }
          },
        };

        updateConfig({
          vite: {
            plugins: [virtualModulesPlugin],
            resolve: {
              alias: {
                // Use source in dev for fast HMR
                "@zefish/standard/styles": path.resolve(__dirname, "../styles"),
                "@zefish/standard/js": path.resolve(__dirname, "../js/standard.js"),
                "@zefish/standard": path.resolve(__dirname, "./standard.js"),
              },
            },
          },
        });

        // 3. Inject Routes (optional)
        if (mergedConfig.injectRoutes !== false) {
          injectRoute({
            pattern: "/robots.txt",
            entrypoint: path.join(currentDir, "routes/robots.js"),
          });
          injectRoute({
            pattern: "/site.webmanifest",
            entrypoint: path.join(currentDir, "routes/manifest.js"),
          });
          injectRoute({
            pattern: "/_headers",
            entrypoint: path.join(currentDir, "routes/headers.js"),
          });
        }

        // 4. Configure Vite aliases to expose Standard assets
        const moduleDirAliases = path.dirname(fileURLToPath(import.meta.url));
        const packageSrcDir = path.resolve(moduleDirAliases, "../");

        const aliasEntries = {};
        const stylesDir = path.resolve(packageSrcDir, "styles");
        if (fs.existsSync(stylesDir)) {
          aliasEntries["@standard-styles"] = stylesDir;
        }

        const scriptsDir = path.resolve(packageSrcDir, "js");
        if (fs.existsSync(scriptsDir)) {
          aliasEntries["@standard-js"] = scriptsDir;
        }

        const fontsDir = path.resolve(
          packageSrcDir,
          "../",
          "public",
          "assets",
          "fonts"
        );
        if (fs.existsSync(fontsDir)) {
          aliasEntries["@standard-fonts"] = fontsDir;
        }

        // ✨ Copy fonts from package to public directory
        const packageFontsDir = path.resolve(
          packageSrcDir,
          "../public/assets/fonts"
        );
        const clientPublicDir = path.resolve(
          fileURLToPath(config.root), // ← Convert URL to string
          "public/assets/fonts"
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
              //logger.debug(`Copied font: ${file}`);
            }
          });

          logger.success("Fonts copied to public directory");
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

        if (mergedConfig.cloudflare?.enabled !== false) {
          integrations.push(
            cloudflareIntegration({
              ...mergedConfig.cloudflare,
              verbose: mergedConfig.verbose,
            })
          );
          logger.success("Cloudflare integration enabled");
        }

        if (mergedConfig.openrouter?.enabled !== false) {
          integrations.push(
            openrouterIntegration({
              ...mergedConfig.openrouter,
              verbose: mergedConfig.verbose,
              siteUrl: mergedConfig.site?.url || mergedConfig.url,
            })
          );
          logger.success("OpenRouter AI integration enabled");
        }

        // Update config with registered integrations
        if (integrations.length > 0) {
          updateConfig({
            integrations,
          });
        }

        // 6. Add Global Assets (CSS/JS)
        const assetsConfig = mergedConfig.assets || {};

        const cssEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.scss";
        if (cssEntry) {
          injectScript("page-ssr", `import "${cssEntry}";`);
        }

        const themeEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.theme.scss";
        if (themeEntry) {
          injectScript("page-ssr", `import "${themeEntry}";`);
        }

        const jsEntry = assetsConfig.js ?? "@zefish/standard/js";
        if (jsEntry) {
          injectScript("page", `import "${jsEntry}";`);
        }
      },

      "astro:build:done": ({ dir }) => {
        // Build completed - integrations handled their own cleanup
        logger.debug(
          "Build completed - integrations handled their own cleanup"
        );
      },
    },
  };
}
