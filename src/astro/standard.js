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

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import logger from "./logger.js";
import openrouterIntegration from "./integrations/openrouter.js";
import cloudflareIntegration from "./integrations/cloudflare.js";
import { deepMerge } from "./utils/utils.js";
// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// MAIN INTEGRATION
// ========================================

export default function standard(options = {}) {
  const log = logger({
    verbose: options.verbose ?? false,
    scope: "Core",
  });

  // Get package version for banner
  let packageVersion = "0.0.0";
  try {
    const packagePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../package.json",
    );
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    packageVersion = packageData.version || "0.0.0";
  } catch (error) {
    // Fallback to default version if package.json can't be read
  }

  // Banner to indicate successful initialization
  log.banner(packageVersion);

  // Load site config if specified in options
  let siteConfig = {};
  const configPath = options.configPath || "site.config.yml";

  if (configPath && fs.existsSync(configPath)) {
    try {
      const configFile = fs.readFileSync(configPath, "utf8");
      siteConfig = yaml.load(configFile) || {};
      log.info(`Found ${configPath}`);
    } catch (error) {
      log.warn(`Could not parse config file (${configPath}): ${error.message}`);
    }
  } else if (configPath) {
    log.warn(`Config file not found: ${configPath}`);
  }

  // Merge site config with options using deep merge
  const mergedConfig = deepMerge(siteConfig, options);

  return {
    name: "@zefish/standard",
    hooks: {
      "astro:config:setup": async ({
        config,
        updateConfig,
        injectScript,
        injectRoute,
      }) => {
        // Use centralized plugin managers
        // ✨ ENABLE backlinks plugin for testing
        const remarkPlugins = getRemarkPlugins({
          ...mergedConfig,
          backlinks: true, // Enable remark backlinks
        });
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
              return `export default ${JSON.stringify(mergedConfig)}`;
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
                "@zefish/standard/js": path.resolve(
                  __dirname,
                  "../js/standard.js",
                ),
                "@zefish/standard/logger": path.resolve(__dirname, "logger.js"),
                "@zefish/standard/utils": path.resolve(
                  __dirname,
                  "utils/utils.js",
                ),
                "@zefish/standard/utils/content-transform": path.resolve(
                  __dirname,
                  "utils/content-transform.js",
                ),
                "@zefish/standard/utils/collections": path.resolve(
                  __dirname,
                  "utils/collections.js",
                ),
                "@zefish/standard/utils/typography": path.resolve(
                  __dirname,
                  "utils/typography.js",
                ),
                // New utility alias
                "@zefish/standard/utils/backlinks": path.resolve(
                  __dirname,
                  "utils/backlinks.js",
                ),
                "@zefish/standard/components/Backlinks": path.resolve(
                  __dirname,
                  "components/Backlinks.astro",
                ),
                "@zefish/standard": path.resolve(__dirname, "./standard.js"),
              },
            },
          },
        });

        // 3. Inject Routes (optional)
        if (mergedConfig.injectRoutes !== false) {
          // Inject dynamic content route for markdown files
          injectRoute({
            pattern: "/[...slug]",
            entrypoint: path.join(__dirname, "routes/content.astro"),
          });

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

        if (mergedConfig.cloudflare?.enabled !== false) {
          integrations.push(
            cloudflareIntegration({
              ...mergedConfig.cloudflare,
              verbose: mergedConfig.verbose,
            }),
          );
        }

        if (mergedConfig.openrouter?.enabled !== false) {
          integrations.push(
            openrouterIntegration({
              ...mergedConfig.openrouter,
              verbose: mergedConfig.verbose,
              siteUrl: mergedConfig.site?.url || mergedConfig.url,
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
    },
  };
}
