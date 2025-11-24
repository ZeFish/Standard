/**
 * Standard Framework Cloudflare Plugin for Astro
 *
 * @component Cloudflare Integration
 * @category Astro Integrations
 * @author Francis Fontaine
 *
 * Uses Cloudflare's built-in image optimization and Pages Functions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import createLogger from "../../lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function cloudflareIntegration(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "Cloudflare",
  });

  // Store config in closure for access in hooks
  let cloudflareConfig = null;

  return {
    name: "@standard/astro-cloudflare",

    hooks: {
      "astro:config:setup": ({ config }) => {
        // Functions configuration
        const functionsConfig = {
          enabled: options.functions?.enabled ?? false,
          outputDir: options.functions?.outputDir ?? "functions/api",
          environment: options.functions?.environment ?? "production",
          env: options.functions?.env ?? {},
        };

        // Comments configuration
        const commentsConfig = {
          enabled: options.comments?.enabled ?? false,
          apiEndpoint: options.comments?.apiEndpoint ?? "/api/comments",
          commentsPath: options.comments?.commentsPath ?? "data/comments",
          version: options.comments?.version ?? "0.0.0",
          clientLibrary: options.comments?.clientLibrary ?? "",
        };

        // Image handler configuration (using Cloudflare's built-in)
        const imageConfig = {
          enabled: options.images?.enabled ?? true, // Default to true for Cloudflare
          baseUrl: options.images?.baseUrl ?? "",
          // Cloudflare Image Resizing parameters
          quality: options.images?.quality ?? 85,
          format: options.images?.format ?? "auto",
          fit: options.images?.fit ?? "cover",
          position: options.images?.position ?? "center",
          background: options.images?.background ?? "",
          sharpen: options.images?.sharpen ?? 0,
          blur: options.images?.blur ?? 0,
          dpr: options.images?.dpr ?? "auto",
          metadata: options.images?.metadata ?? "none",
          skipClass: options.images?.skipClass ?? "no-cdn",
          skipExternal: options.images?.skipExternal ?? true,
        };

        // Validate configuration
        if (commentsConfig.enabled && !functionsConfig.enabled) {
          logger.warn(
            "Comments are enabled but functions are explicitly disabled; comment API won't work.",
          );
        }

        if (!functionsConfig.enabled && !imageConfig.enabled) {
          logger.warn("Cloudflare integration disabled (no features enabled)");
          return;
        }

        // Enable comments if functions are enabled
        if (functionsConfig.enabled) {
          commentsConfig.enabled = true;
        }

        // Store config for later use
        cloudflareConfig = {
          imageConfig,
          functionsConfig,
          commentsConfig,
        };

        // Also store in config for potential future use
        config._cloudflare = cloudflareConfig;

        logger.success("Cloudflare integration initialized");
      },

      "astro:build:done": ({ dir }) => {
        if (!cloudflareConfig) return;

        // Copy Cloudflare functions
        if (cloudflareConfig.functionsConfig.enabled) {
          const cloudflareDir = path.join(__dirname, "../../cloudflare/api");
          const functionsOutputPath = path.join(
            dir.toString(),
            cloudflareConfig.functionsConfig.outputDir,
          );

          logger.debug(`Source: ${cloudflareDir}`);
          logger.debug(`Output: ${functionsOutputPath}`);

          if (!fs.existsSync(cloudflareDir)) {
            logger.warn(`Functions directory not found: ${cloudflareDir}`);
            return;
          }

          try {
            fs.mkdirSync(functionsOutputPath, { recursive: true });
          } catch (e) {
            logger.error(
              `Failed to create functions output dir: ${functionsOutputPath}: ${e.message}`,
            );
            return;
          }

          const copyRecursive = (src, dest) => {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            const entries = fs.readdirSync(src);
            if (entries.length === 0) {
              logger.warn(`No function files in ${src}`);
            }

            entries.forEach((name) => {
              const srcPath = path.join(src, name);
              const destPath = path.join(dest, name);
              const stat = fs.statSync(srcPath);

              if (stat.isDirectory()) {
                copyRecursive(srcPath, destPath);
              } else {
                try {
                  const fileName = path.basename(srcPath);
                  fs.copyFileSync(srcPath, destPath);
                  logger.debug(`Copied: ${fileName}`);
                } catch (e) {
                  logger.error(
                    `Copy failed ${srcPath} -> ${destPath}: ${e.message}`,
                  );
                }
              }
            });
          };

          copyRecursive(cloudflareDir, functionsOutputPath);
          logger.success(
            `Functions copied to /${cloudflareConfig.functionsConfig.outputDir}/`,
          );
        }
      },
    },
  };
}

// Cloudflare Image Resizing utilities
export function buildCloudflareImageUrl(src, options = {}) {
  // Build Cloudflare Image Resizing URL
  const params = new URLSearchParams();

  // Add parameters based on options
  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.quality) params.append("quality", options.quality.toString());
  if (options.format && options.format !== "auto")
    params.append("format", options.format);
  if (options.fit) params.append("fit", options.fit);
  if (options.position) params.append("position", options.position);
  if (options.background) params.append("background", options.background);
  if (options.sharpen > 0) params.append("sharpen", options.sharpen.toString());
  if (options.blur > 0) params.append("blur", options.blur.toString());
  if (options.dpr && options.dpr !== "auto")
    params.append("dpr", options.dpr.toString());
  if (options.metadata) params.append("metadata", options.metadata);

  const paramsString = params.toString();
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}${paramsString}`;
}

export function generateImageSrcset(
  src,
  sizes = [640, 960, 1280, 1920],
  options = {},
) {
  return sizes
    .map(
      (size) =>
        `${buildCloudflareImageUrl(src, { ...options, width: size })} ${size}w`,
    )
    .join(", ");
}

export function shouldUseCloudflareImage(src, options = {}) {
  // Skip if explicitly disabled
  if (options.skip === true) return false;

  // Skip external images (unless explicitly allowed)
  if (
    options.allowExternal !== true &&
    (src.startsWith("http") || src.startsWith("//"))
  ) {
    return false;
  }

  // Skip data URLs
  if (src.startsWith("data:")) return false;

  // Skip SVG files (Cloudflare doesn't optimize SVG)
  if (src.endsWith(".svg") || src.includes(".svg?")) return false;

  // Skip if has skip class (for manual control)
  if (options.skipClass && options.skipClass !== "no-cdn") return false;

  return true;
}

// Astro component for optimized images
export function CloudflareImage({
  src,
  alt = "",
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 768px",
  quality = 85,
  format = "auto",
  fit = "cover",
  class: className = "",
  loading = "lazy",
  ...props
}) {
  const imageOptions = { width, height, quality, format, fit };

  if (!shouldUseCloudflareImage(src)) {
    // Fallback to regular img tag
    return `<img src="${src}" alt="${alt}" class="${className}" loading="${loading}" ${props} />`;
  }

  const optimizedSrc = buildCloudflareImageUrl(src, imageOptions);
  const srcset = generateImageSrcset(src, [640, 960, 1280, 1920], imageOptions);

  return `<img
    src="${optimizedSrc}"
    srcset="${srcset}"
    sizes="${sizes}"
    alt="${alt}"
    class="${className}"
    loading="${loading}"
    ${props}
  />`;
}
