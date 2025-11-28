/**
 * Standard Framework Cloudflare Integration for Astro
 *
 * @component Cloudflare Integration
 * @category Astro Integrations
 * @author Francis Fontaine
 *
 * Self-contained module with:
 * - Integration hooks (setup, build)
 * - Image optimization utilities
 * - Cloudflare Pages Functions deployment
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import createLogger from "../logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ========================================
// INTEGRATION HOOKS
// ========================================

export default function cloudflareIntegration(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "Cloudflare",
  });
  logger.info();
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

        logger.success();
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

// ========================================
// IMAGE OPTIMIZATION UTILITIES
// ========================================

/**
 * Build a Cloudflare Image Resizing URL with optimization parameters
 *
 * @param {string} src - Source image URL
 * @param {Object} options - Image optimization options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.height - Target height in pixels
 * @param {number} options.quality - Image quality (1-100, default: 85)
 * @param {string} options.format - Image format (auto, webp, avif, default: auto)
 * @param {string} options.fit - How image fits (cover, contain, fill, default: cover)
 * @param {string} options.position - Image position (center, top, bottom, default: center)
 * @param {string} options.background - Background color for transparent images
 * @param {number} options.sharpen - Sharpen amount (0-10)
 * @param {number} options.blur - Blur amount (0-20)
 * @param {string} options.dpr - Device pixel ratio (auto, 1, 2, default: auto)
 * @param {string} options.metadata - Image metadata (all, none, default: none)
 * @returns {string} Optimized image URL
 */
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

/**
 * Generate a responsive srcset string for multiple image sizes
 *
 * @param {string} src - Source image URL
 * @param {number[]} sizes - Array of width sizes in pixels
 * @param {Object} options - Image optimization options (see buildCloudflareImageUrl)
 * @returns {string} Responsive srcset string
 */
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

/**
 * Determine if an image should use Cloudflare optimization
 *
 * @param {string} src - Source image URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.skip - Skip optimization entirely
 * @param {boolean} options.allowExternal - Allow external URLs
 * @param {string} options.skipClass - CSS class to skip optimization
 * @returns {boolean} Whether to use Cloudflare optimization
 */
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

/**
 * Astro component for optimized images using Cloudflare
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Source image URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} props.width - Target width
 * @param {number} props.height - Target height
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {number} props.quality - Image quality (1-100)
 * @param {string} props.format - Image format (auto, webp, avif)
 * @param {string} props.fit - How image fits (cover, contain, fill)
 * @param {string} props.class - CSS class names
 * @param {string} props.loading - Loading attribute (lazy, eager)
 * @param {Object} props - Additional HTML attributes
 * @returns {string} Optimized img HTML
 */
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

/**
 * Create a picture element with multiple formats and responsive srcset
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Source image URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} props.width - Target width
 * @param {number} props.height - Target height
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {number} props.quality - Image quality (1-100)
 * @param {string[]} props.formats - Image formats to generate (['webp', 'avif', 'auto'])
 * @param {string} props.fit - How image fits (cover, contain, fill)
 * @param {string} props.class - CSS class names
 * @param {string} props.loading - Loading attribute (lazy, eager)
 * @param {Object} props - Additional HTML attributes
 * @returns {string} Picture element HTML
 */
export function CloudflarePicture({
  src,
  alt = "",
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 768px",
  quality = 85,
  formats = ["webp", "avif", "auto"],
  fit = "cover",
  class: className = "",
  loading = "lazy",
  ...props
}) {
  if (!shouldUseCloudflareImage(src)) {
    // Fallback to regular img tag
    return `<img src="${src}" alt="${alt}" class="${className}" loading="${loading}" ${props} />`;
  }

  const baseOptions = { width, height, quality, fit };
  const optimizedSrc = buildCloudflareImageUrl(src, {
    ...baseOptions,
    format: "auto",
  });
  const srcset = generateImageSrcset(src, [640, 960, 1280, 1920], baseOptions);

  let sources = "";

  // Generate source elements for different formats
  formats.forEach((format) => {
    if (format === "auto") return; // Skip 'auto' for source elements

    const formatSrcset = generateImageSrcset(src, [640, 960, 1280, 1920], {
      ...baseOptions,
      format,
    });
    sources += `<source srcset="${formatSrcset}" sizes="${sizes}" type="image/${format}">`;
  });

  return `<picture>
    ${sources}
    <img
      src="${optimizedSrc}"
      srcset="${srcset}"
      sizes="${sizes}"
      alt="${alt}"
      class="${className}"
      loading="${loading}"
      ${props}
    />
  </picture>`;
}

/**
 * Generate blur placeholder for progressive image loading
 *
 * @param {string} src - Source image URL
 * @param {number} width - Blur width (default: 20px)
 * @param {number} quality - Blur quality (default: 10)
 * @returns {string} Blur placeholder URL
 */
export function generateBlurPlaceholder(src, width = 20, quality = 10) {
  return buildCloudflareImageUrl(src, {
    width,
    quality,
    format: "auto",
    fit: "cover",
  });
}

/**
 * Create a complete responsive image component with blur placeholder
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Source image URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} props.width - Target width
 * @param {number} props.height - Target height
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {number} props.quality - Image quality (1-100)
 * @param {string} props.format - Image format (auto, webp, avif)
 * @param {string} props.fit - How image fits (cover, contain, fill)
 * @param {string} props.class - CSS class names
 * @param {string} props.loading - Loading attribute (lazy, eager)
 * @param {boolean} props.blurPlaceholder - Whether to include blur placeholder
 * @param {Object} props - Additional HTML attributes
 * @returns {string} Complete responsive image HTML
 */
export function ResponsiveImage({
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
  blurPlaceholder = true,
  ...props
}) {
  if (!shouldUseCloudflareImage(src)) {
    return `<img src="${src}" alt="${alt}" class="${className}" loading="${loading}" ${props} />`;
  }

  const imageOptions = { width, height, quality, format, fit };
  const optimizedSrc = buildCloudflareImageUrl(src, imageOptions);
  const srcset = generateImageSrcset(src, [640, 960, 1280, 1920], imageOptions);

  let blurDataURL = "";
  if (blurPlaceholder) {
    blurDataURL = generateBlurPlaceholder(src);
  }

  const imgAttributes = [
    `src="${optimizedSrc}"`,
    `srcset="${srcset}"`,
    `sizes="${sizes}"`,
    `alt="${alt}"`,
    `class="${className}"`,
    `loading="${loading}"`,
    blurDataURL
      ? `style="background-image: url('${blurDataURL}'); background-size: cover; background-position: center;"`
      : "",
    props,
  ]
    .filter(Boolean)
    .join("\n    ");

  return `<img
    ${imgAttributes}
  />`;
}
