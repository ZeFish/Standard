/**
 * Cloudflare Pages Plugin
 *
 * @component Cloudflare Pages Integration
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 2017, Netlify launched their game-changing "Git push to deploy" workflow.
 * Commit to GitHub, and seconds later your site is live on their edge network.
 * Cloudflare watched, learned, and in 2021 launched Cloudflare Pages—free,
 * unlimited bandwidth, automatic SSL, and something Netlify couldn't match:
 * the fastest edge network on Earth.
 *
 * But Cloudflare Pages isn't just hosting. It's a complete application platform.
 * You get serverless functions (Workers), edge KV storage, image optimization,
 * and a global CDN—all integrated, all free (up to generous limits). The catch?
 * You need to structure your project correctly.
 *
 * Functions must live in a `/functions` directory. Images need specific URL
 * patterns (`/cdn-cgi/image/`) to trigger edge resizing. Environment variables
 * flow differently than traditional Node apps. This plugin handles all of it.
 *
 * **What This Plugin Does:**
 *
 * 1. **Functions Deployment** - Copies serverless functions from your source
 *    directory to `/functions` at build time, making them deployable to
 *    Cloudflare's edge. No manual file management.
 *
 * 2. **Image Optimization** - Automatically rewrites every `<img>` tag to use
 *    Cloudflare's image resizing service. Mobile users get 640px images.
 *    Desktop users get 1920px. Retina displays get 2x. All automatic, all
 *    optimized, all free. Generates proper `srcset` for responsive images.
 *
 * 3. **Environment Configuration** - Exposes Cloudflare config to templates
 *    via global data, making it easy to detect production vs. preview deploys.
 *
 * The beauty? You can enable/disable features independently. Need functions
 * but not image optimization? Fine. Want images but not functions? Also fine.
 * Each feature is optional but works seamlessly together.
 *
 * ### Technical Details
 *
 * **Cloudflare Functions:**
 * - Automatically copied from `src/cloudflare/` to project root `/functions/`
 * - Deployed as edge workers (V8 isolates, cold start <1ms)
 * - Access via `/api/*` routes (or custom paths)
 *
 * **Cloudflare Image Resizing:**
 * - URL pattern: `/cdn-cgi/image/width=800,quality=85,format=auto/path/image.jpg`
 * - Supports WebP, AVIF, automatic format negotiation
 * - Caches transformed images globally at Cloudflare's edge
 * - No storage costs, no processing delays, no API keys
 *
 * **Build-Time Transformation:**
 * - Scans HTML output for `<img>` tags
 * - Preserves `<script>` tags (prevents breaking inline JavaScript)
 * - Generates responsive `srcset` with multiple sizes
 * - Skips external images and opt-out classes
 * - Zero runtime overhead
 *
 * ### Future Improvements
 *
 * - Support for `<picture>` element with art direction
 * - Automatic dimension detection from source images
 * - Workers KV integration for edge data storage
 * - Durable Objects support for stateful edge apps
 * - Cloudflare Stream integration for video optimization
 * - Per-route function configuration
 *
 * @see {file} src/cloudflare/api/comments.js - Example serverless function
 * @see {file} src/styles/standard-08-img.scss - Image styling
 * @see {class} .no-cdn - Opt-out class for image transformation
 *
 * @link https://developers.cloudflare.com/pages/ Cloudflare Pages Docs
 * @link https://developers.cloudflare.com/images/image-resizing/ Image Resizing Docs
 * @link https://developers.cloudflare.com/workers/ Cloudflare Workers Docs
 *
 * @example javascript - Basic usage (functions only)
 *   import Standard from "@zefish/standard";
 *
 *   export default function (eleventyConfig) {
 *     eleventyConfig.addPlugin(Standard, {
 *       cloudflare: {
 *         functions: { enabled: true }
 *       }
 *     });
 *   }
 *
 * @example javascript - Full Cloudflare Pages integration
 *   eleventyConfig.addPlugin(Standard, {
 *     cloudflare: {
 *       functions: {
 *         enabled: true,
 *         outputDir: "functions",
 *         environment: "production",
 *         env: {
 *           GITHUB_TOKEN: process.env.GITHUB_TOKEN
 *         }
 *       },
 *       images: {
 *         enabled: true,
 *         baseUrl: "https://yourdomain.com",
 *         sizes: [640, 960, 1280, 1920],
 *         quality: 85,
 *         format: "auto", // Cloudflare negotiates WebP/AVIF
 *         sharpen: 0.5,
 *         generateSrcset: true,
 *         lazyLoad: true,
 *         skipInDev: true
 *       }
 *     }
 *   });
 *
 * @example javascript - Images only (no functions)
 *   eleventyConfig.addPlugin(Standard, {
 *     cloudflare: {
 *       functions: { enabled: false },
 *       images: { enabled: true, baseUrl: "https://example.com" }
 *     }
 *   });
 *
 * @example html - Opt-out of image transformation
 *   <!-- This image will NOT be transformed -->
 *   <img src="/photo.jpg" class="no-cdn" alt="Original quality">
 *
 * @example html - Generated image output
 *   <!-- Input: -->
 *   <img src="/images/photo.jpg" alt="Sunset">
 *
 *   <!-- Output: -->
 *   <img
 *     src="/cdn-cgi/image/width=960,quality=85,format=auto/images/photo.jpg"
 *     srcset="/cdn-cgi/image/width=640,quality=85,format=auto/images/photo.jpg 640w,
 *             /cdn-cgi/image/width=960,quality=85,format=auto/images/photo.jpg 960w,
 *             /cdn-cgi/image/width=1280,quality=85,format=auto/images/photo.jpg 1280w,
 *             /cdn-cgi/image/width=1920,quality=85,format=auto/images/photo.jpg 1920w"
 *     sizes="(max-width: 960px) 100vw, 960px"
 *     loading="lazy"
 *     alt="Sunset"
 *   />
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {object} options.functions Functions deployment configuration
 * @param {boolean} options.functions.enabled Enable functions deployment (default: true)
 * @param {string} options.functions.outputDir Output directory (default: "functions")
 * @param {string} options.functions.environment Environment name (default: "production")
 * @param {object} options.functions.env Environment variables for functions
 * @param {object} options.images Image optimization configuration
 * @param {boolean} options.images.enabled Enable image optimization (default: false)
 * @param {string} options.images.baseUrl Base URL for absolute paths
 * @param {number[]} options.images.sizes Responsive breakpoints (default: [640, 960, 1280, 1920])
 * @param {number} options.images.quality JPEG/WebP quality 1-100 (default: 85)
 * @param {string} options.images.format Output format (default: "auto")
 * @param {number} options.images.sharpen Sharpening 0-10 (default: 0.5)
 * @param {boolean} options.images.skipExternal Skip external images (default: true)
 * @param {string} options.images.skipClass CSS class to skip (default: "no-cdn")
 * @param {boolean} options.images.generateSrcset Generate srcset (default: true)
 * @param {boolean} options.images.lazyLoad Add loading="lazy" (default: true)
 * @param {string} options.images.fit Resize mode (default: "scale-down")
 * @param {boolean} options.images.skipInDev Skip in development (default: true)
 * @param {boolean} options.verbose Enable verbose logging
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createLogger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function CloudflarePages(eleventyConfig, options = {}) {
  const defaults = {
    functions: {
      enabled: true,
      outputDir: "functions",
      environment: "production",
      env: {},
    },
    images: {
      enabled: false,
      baseUrl: "",
      sizes: [640, 960, 1280, 1920],
      quality: 85,
      format: "auto",
      sharpen: 0.5,
      skipExternal: true,
      skipClass: "no-cdn",
      generateSrcset: true,
      lazyLoad: true,
      fit: "scale-down",
      skipInDev: true,
    },
    verbose: false,
  };

  const config = {
    functions: { ...defaults.functions, ...options.functions },
    images: { ...defaults.images, ...options.images },
    verbose: options.verbose || false,
  };

  const logger = createLogger({
    verbose: config.verbose,
    scope: "Cloudflare",
  });

  // =====================================================================
  // FUNCTIONS DEPLOYMENT
  // =====================================================================

  if (config.functions.enabled) {
    const cloudflareDir = path.join(__dirname, "../cloudflare");
    const projectRoot = process.cwd();
    const functionsOutputPath = path.join(
      projectRoot,
      config.functions.outputDir,
    );

    eleventyConfig.on("eleventy.before", async () => {
      if (!fs.existsSync(cloudflareDir)) {
        logger.warn("Functions directory not found");
        return;
      }

      // Ensure output directory exists
      if (!fs.existsSync(functionsOutputPath)) {
        fs.mkdirSync(functionsOutputPath, { recursive: true });
      }

      // Recursively copy function files
      const copyRecursive = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);
        files.forEach((file) => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          const stat = fs.statSync(srcPath);

          if (stat.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        });
      };

      copyRecursive(cloudflareDir, functionsOutputPath);
      logger.info(`Functions copied to ${config.functions.outputDir}/`);
    });

    // Add global data for templates
    eleventyConfig.addGlobalData("cloudflare", {
      environment: config.functions.environment,
      outputDir: config.functions.outputDir,
      env: config.functions.env,
      version: "0.11.0",
    });
  }

  // =====================================================================
  // IMAGE OPTIMIZATION
  // =====================================================================

  if (config.images.enabled) {
    // Check if we're in development
    const isDevelopment =
      process.env.ENV === "DEV" ||
      process.env.NODE_ENV === "development" ||
      process.env.ELEVENTY_ENV === "development";

    if (isDevelopment && config.images.skipInDev) {
      logger.warn("Image optimization skipped in development mode");
    } else {
      /**
       * Build Cloudflare Image Resizing URL
       */
      function buildCloudflareUrl(src, width) {
        const params = [
          `width=${width}`,
          `quality=${config.images.quality}`,
          `format=${config.images.format}`,
          config.images.sharpen > 0 ? `sharpen=${config.images.sharpen}` : null,
          config.images.fit !== "scale-down"
            ? `fit=${config.images.fit}`
            : null,
        ]
          .filter(Boolean)
          .join(",");

        return `/cdn-cgi/image/${params}${src}`;
      }

      /**
       * Check if image should be skipped
       */
      function shouldSkipImage(imgTag, src) {
        if (imgTag.includes(`class="${config.images.skipClass}"`)) return true;
        if (config.images.skipExternal && src.startsWith("http")) return true;
        if (src.startsWith("data:")) return true;
        if (src.endsWith(".svg")) return true;
        return false;
      }

      /**
       * Transform image tag with CDN URLs
       */
      function transformImage(match, fullTag) {
        const srcMatch = fullTag.match(/src\s*=\s*['"]([^'"]*?)['"]/);
        if (!srcMatch) return match;

        const originalSrc = srcMatch[1];
        if (shouldSkipImage(fullTag, originalSrc)) return match;

        let newTag = fullTag.replace(/\s+srcset\s*=\s*['"][^'"]*['"]/gi, "");

        // Generate primary src
        const primarySize =
          config.images.sizes[Math.floor(config.images.sizes.length / 2)] ||
          config.images.sizes[0];
        const primarySrc = buildCloudflareUrl(originalSrc, primarySize);

        newTag = newTag.replace(
          /src\s*=\s*['"]([^'"]*?)['"]/,
          `src="${primarySrc}"`,
        );

        // Generate srcset
        if (config.images.generateSrcset && config.images.sizes.length > 1) {
          const srcsetEntries = config.images.sizes
            .map((size) => {
              const url = buildCloudflareUrl(originalSrc, size);
              return `${url} ${size}w`;
            })
            .join(", ");

          const sizesAttr = `(max-width: ${primarySize}px) 100vw, ${primarySize}px`;
          newTag = `${newTag} srcset="${srcsetEntries}" sizes="${sizesAttr}"`;
        }

        // Add lazy loading
        if (config.images.lazyLoad && !newTag.includes("loading=")) {
          newTag = `${newTag} loading="lazy"`;
        }

        return `<img ${newTag}>`;
      }

      /**
       * 11ty Transform: Process HTML output
       */
      eleventyConfig.addTransform("cloudflare-images", function (content) {
        if (!(this.page.outputPath || "").endsWith(".html")) {
          return content;
        }

        // Preserve scripts
        const scripts = [];
        let processed = content.replace(
          /<script[\s\S]*?<\/script>/gi,
          (match) => {
            scripts.push(match);
            return `%%SCRIPT_${scripts.length - 1}%%`;
          },
        );

        // Transform images
        processed = processed.replace(/<img\s([^>]*?)>/gi, transformImage);

        // Restore scripts
        processed = processed.replace(
          /%%SCRIPT_(\d+)%%/g,
          (_, i) => scripts[i],
        );

        return processed;
      });

      logger.info("Image optimization enabled");
    }
  }

  // Summary logging
  const enabledFeatures = [];
  if (config.functions.enabled) enabledFeatures.push("Functions");
  if (config.images.enabled && !config.images.skipInDev)
    enabledFeatures.push("Images");

  if (enabledFeatures.length > 0) {
    logger.success(`Pages: ${enabledFeatures.join(" + ")}`);
  }
  logger.success("Initialized");
}
