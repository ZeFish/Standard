/**
 * @zefish/standard Astro Integration
 *
 * A comprehensive wrapper that orchestrates:
 * - OpenRouter AI integration
 * - Cloudflare integration
 * - Standard framework features
 */
import { fileURLToPath } from "url";
import { createRequire } from "module";
import * as path from "path";
import * as fs from "fs";
import logger from "../core/logger.js";
import openrouterIntegration from "./integrations/openrouter.js";
import cloudflareIntegration from "./integrations/cloudflare.js";
import { deepMerge } from "./utils/utils.js";
import { createFontImports, DEFAULT_FONT_FLAGS } from "./utils/fonts.js";

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
const require = createRequire(import.meta.url);

// ========================================
// HELPERS
// ========================================

function sanitizeConfig(config) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(config, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      if (typeof value === "function") {
        return undefined;
      }
      return value;
    }),
  );
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

        // 1. Configure Remark/Rehype Plugins
        const remarkPlugins = [
          [remarkTags, finalConfig.tags || {}],
          [remarkStandard, finalConfig.standard || {}],
          [remarkEscapeCode, finalConfig || {}],
          [remarkFixDates, finalConfig.dateFields || {}],
        ];

        // ✨ CRITICAL: Backlinks must run BEFORE ObsidianLinks
        if (finalConfig.backlinks !== false) {
          remarkPlugins.push([
            remarkBacklinks,
            { verbose: finalConfig.verbose, ...finalConfig.backlinks },
          ]);
        }

        remarkPlugins.push([remarkObsidianLinks, {}]);
        remarkPlugins.push([remarkSyntax, finalConfig.syntax || {}]);

        const rehypePlugins = [
          [
            rehypeTypography,
            {
              defaultLocale: finalConfig.language || "en",
              ...finalConfig.typography,
            },
          ],
          [rehypeStandard, finalConfig.html || {}],
        ];

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
              },
            },
          },
        });

        // 3. Inject Routes (optional)
        if (finalConfig.injectRoutes !== false) {
          // Inject dynamic content route for markdown files

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

        const fontImports = createFontImports(
          finalConfig.fonts && Object.keys(finalConfig.fonts).length > 0
            ? finalConfig.fonts
            : DEFAULT_FONT_FLAGS,
          (specifier) => {
            try {
              return require.resolve(specifier);
            } catch (e) {
              return specifier;
            }
          },
        );

        if (fontImports.length > 0) {
          injectScript("page-ssr", fontImports.join("\n"));
        }

        const cssEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.scss";
        if (cssEntry) {
          injectScript("page-ssr", `import "${cssEntry}";`);
        }

        const themeEntry =
          assetsConfig.theme ?? "@zefish/standard/themes/standard.theme.scss";
        if (themeEntry) {
          injectScript("page-ssr", `import "${themeEntry}";`);
        }


      },
    },
  };
}
