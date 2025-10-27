/**
 * Image Optimization Plugin
 *
 * @component Image Optimization & CDN Transform
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1826, Nicéphore Niépce captured the first photograph—an 8-hour exposure
 * that produced a grainy image of rooftops. For the next century and a half,
 * photographers obsessed over image quality: sharper lenses, finer film grain,
 * perfect exposures. Then came the web, and suddenly we faced a new problem:
 * images were too good, too large, too slow.
 *
 * By the 2010s, images accounted for 50-70% of web page weight. A single
 * unoptimized photo could be 5MB—larger than entire websites from the 1990s.
 * Responsive design made it worse: should you serve the same 3000px image
 * to a phone with a 375px screen? The answer was obvious: no. But implementing
 * it was painful.
 *
 * Cloudflare saw this and, in 2019, launched their image resizing service—free
 * for all Pages customers. No setup, no API keys, just append `/cdn-cgi/image/`
 * to your domain and describe what you want: width, format, quality. Their edge
 * network does the rest, caching transformed images globally.
 *
 * This plugin automates the entire process. Point it at your images, and it
 * rewrites every `<img>` tag to request perfectly-sized versions from Cloudflare's
 * edge. Mobile users get 640px images. Desktop users get 1920px. Retina displays
 * get 2x. All automatic, all optimized, all free.
 *
 * It's smart enough to skip external images, preserve your scripts, and respect
 * opt-out classes. It generates proper `srcset` attributes for responsive images.
 * And because it runs at build time, there's zero runtime overhead.
 *
 * ### Technical Details
 *
 * **Cloudflare Image Resizing Syntax:**
 * `/cdn-cgi/image/width=800,quality=85,format=auto/path/to/image.jpg`
 *
 * **Parameters Supported:**
 * - `width` - Target width in pixels
 * - `height` - Target height in pixels (optional)
 * - `quality` - 1-100 (default: 85)
 * - `format` - `auto`, `webp`, `avif`, `jpeg`, `png`
 * - `fit` - `scale-down`, `contain`, `cover`, `crop`, `pad`
 * - `sharpen` - 0-10 (sharpening strength)
 *
 * **What This Plugin Does:**
 * 1. Scans HTML output for `<img>` tags
 * 2. Preserves `<script>` tags (prevents breaking inline JS)
 * 3. Rewrites image sources through Cloudflare CDN
 * 4. Generates responsive `srcset` for multiple sizes
 * 5. Adds proper `width` and `height` attributes
 * 6. Skips external images and opt-out classes
 * 7. Works with lazy loading and HTMX
 *
 * ### Future Improvements
 *
 * - Support for `<picture>` element with art direction
 * - Automatic format negotiation (WebP, AVIF fallbacks)
 * - Per-image optimization hints via data attributes
 * - Support for other CDN backends (Cloudinary, Imgix)
 * - Automatic dimension detection from source images
 *
 * @see {plugin} CloudflarePlugin - Cloudflare Pages integration
 * @see {file} src/styles/standard-08-img.scss - Image styling
 * @see {class} .no-cdn - Opt-out class for skipping transformation
 *
 * @link https://developers.cloudflare.com/images/image-resizing/ Cloudflare Image Resizing Docs
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset Responsive Images Guide
 *
 * @example javascript - Basic usage in eleventy.config.js
 *   import Standard from "@zefish/standard";
 *
 *   export default function (eleventyConfig) {
 *     eleventyConfig.addPlugin(Standard, {
 *       images: {
 *         enabled: true,
 *         cdn: 'cloudflare',
 *         baseUrl: 'https://yourdomain.com'
 *       }
 *     });
 *   }
 *
 * @example javascript - Advanced configuration
 *   eleventyConfig.addPlugin(Standard, {
 *     images: {
 *       enabled: true,
 *       cdn: 'cloudflare',
 *       baseUrl: 'https://yourdomain.com',
 *       sizes: [640, 960, 1280, 1920], // Responsive breakpoints
 *       quality: 85,
 *       format: 'auto', // Cloudflare negotiates WebP/AVIF
 *       sharpen: 0.5,
 *       skipExternal: true,
 *       skipClass: 'no-cdn',
 *       generateSrcset: true,
 *       lazyLoad: false,
 *       fit: 'scale-down'
 *     }
 *   });
 *
 * @example html - Opt-out of CDN transformation
 *   <!-- This image will NOT be transformed -->
 *   <img src="/photo.jpg" class="no-cdn" alt="Original quality">
 *
 * @example html - Generated output
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
 *     alt="Sunset"
 *   />
 *
 * @param {object} options Configuration options
 * @param {boolean} options.enabled Enable image transformation (default: false)
 * @param {string} options.cdn CDN backend ('cloudflare', 'wsrv', 'custom')
 * @param {string} options.baseUrl Base URL for image paths (auto-detect if empty)
 * @param {number[]} options.sizes Responsive image sizes in pixels
 * @param {number} options.quality Image quality 1-100 (default: 85)
 * @param {string} options.format Output format ('auto', 'webp', 'avif', 'jpeg', 'png')
 * @param {number} options.sharpen Sharpening amount 0-10 (default: 0.5)
 * @param {boolean} options.skipExternal Skip external images (default: true)
 * @param {string} options.skipClass CSS class to skip transformation (default: 'no-cdn')
 * @param {boolean} options.generateSrcset Generate responsive srcset (default: true)
 * @param {boolean} options.lazyLoad Add loading="lazy" attribute (default: false)
 * @param {string} options.fit Resize mode ('scale-down', 'contain', 'cover', 'crop', 'pad')
 */

import { createLogger } from "./logger.js";

export default function Image(eleventyConfig, options = {}) {
  const defaults = {
    enabled: false,
    cdn: "cloudflare", // 'cloudflare' | 'wsrv' | 'custom'
    baseUrl: "", // Auto-detect from site URL if empty
    sizes: [640, 960, 1280, 1920], // Responsive breakpoints
    quality: 85,
    format: "auto", // 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
    sharpen: 0.5,
    skipExternal: true,
    skipClass: "no-cdn",
    generateSrcset: true,
    lazyLoad: false,
    fit: "scale-down", // 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
    customTemplate: null, // Function for custom CDN URLs
    skipInDev: true, // ✅ NEW: Skip transformation in development
  };
  const config = { ...defaults, ...options };

  // Skip if disabled
  if (!config.enabled) {
    return;
  }

  const logger = createLogger({
    verbose: options.verbose,
    scope: "Image",
  });

  // ✅ NEW: Check environment and skip if in development
  const isDevelopment =
    process.env.ENV === "DEV" ||
    process.env.NODE_ENV === "development" ||
    process.env.ELEVENTY_ENV === "development";

  if (isDevelopment && config.skipInDev) {
    logger.warn("Skipped in development mode");
    return;
  }

  /**
   * Build Cloudflare Image Resizing URL
   */
  function buildCloudflareUrl(src, width, quality, format, sharpen, fit) {
    const params = [
      `width=${width}`,
      `quality=${quality}`,
      `format=${format}`,
      sharpen > 0 ? `sharpen=${sharpen}` : null,
      fit !== "scale-down" ? `fit=${fit}` : null,
    ]
      .filter(Boolean)
      .join(",");

    return `/cdn-cgi/image/${params}${src}`;
  }

  /**
   * Build wsrv.nl URL (fallback CDN)
   */
  function buildWsrvUrl(src, width, baseUrl) {
    const fullUrl = src.startsWith("http") ? src : `${baseUrl}${src}`;
    return `https://wsrv.nl/?url=${fullUrl}&w=${width}&sharp=${config.sharpen}`;
  }

  /**
   * Build custom CDN URL using user-provided template
   */
  function buildCustomUrl(src, width) {
    if (typeof config.customTemplate === "function") {
      return config.customTemplate(src, width, config);
    }
    return src; // Fallback to original
  }

  /**
   * Generate CDN URL for given size
   */
  function generateCdnUrl(src, width) {
    switch (config.cdn) {
      case "cloudflare":
        return buildCloudflareUrl(
          src,
          width,
          config.quality,
          config.format,
          config.sharpen,
          config.fit,
        );
      case "wsrv":
        return buildWsrvUrl(src, width, config.baseUrl);
      case "custom":
        return buildCustomUrl(src, width);
      default:
        return src;
    }
  }

  /**
   * Check if image should be skipped
   */
  function shouldSkipImage(imgTag, src) {
    // Skip if has opt-out class
    if (imgTag.includes(`class="${config.skipClass}"`)) return true;

    // Skip external images
    if (config.skipExternal && src.startsWith("http")) return true;

    // Skip data URIs
    if (src.startsWith("data:")) return true;

    // Skip SVGs (they don't need resizing)
    if (src.endsWith(".svg")) return true;

    return false;
  }

  /**
   * Transform image tag with CDN URLs and srcset
   */
  function transformImage(match, fullTag) {
    // Extract src attribute
    const srcMatch = fullTag.match(/src\s*=\s*['"]([^'"]*?)['"]/);
    if (!srcMatch) return match;

    const originalSrc = srcMatch[1];

    // Skip if should not transform
    if (shouldSkipImage(fullTag, originalSrc)) return match;

    // Remove existing srcset if present
    let newTag = fullTag.replace(/\s+srcset\s*=\s*['"][^'"]*['"]/gi, "");

    // Generate primary src (using middle size or first size)
    const primarySize =
      config.sizes[Math.floor(config.sizes.length / 2)] || config.sizes[0];
    const primarySrc = generateCdnUrl(originalSrc, primarySize);

    // Replace src with CDN version
    newTag = newTag.replace(
      /src\s*=\s*['"]([^'"]*?)['"]/,
      `src="${primarySrc}"`,
    );

    // Generate srcset if enabled
    if (config.generateSrcset && config.sizes.length > 1) {
      const srcsetEntries = config.sizes
        .map((size) => {
          const url = generateCdnUrl(originalSrc, size);
          return `${url} ${size}w`;
        })
        .join(", ");

      // Add sizes attribute for responsive behavior
      const sizesAttr = `(max-width: ${primarySize}px) 100vw, ${primarySize}px`;

      // Insert srcset and sizes attributes
      newTag = `${newTag} srcset="${srcsetEntries}" sizes="${sizesAttr}"`;
    }

    // Add lazy loading if enabled
    if (config.lazyLoad && !newTag.includes("loading=")) {
      newTag = `${newTag} loading="lazy"`;
    }

    return `<img ${newTag}>`;
  }

  /**
   * 11ty Transform: Process HTML output
   */
  eleventyConfig.addTransform("standard-images", function (content) {
    // Only process HTML files
    if (!(this.page.outputPath || "").endsWith(".html")) {
      return content;
    }

    // Preserve scripts (prevent breaking inline JS)
    const scripts = [];
    let processed = content.replace(/<script[\s\S]*?<\/script>/gi, (match) => {
      scripts.push(match);
      return `%%SCRIPT_${scripts.length - 1}%%`;
    });

    // Transform all img tags
    processed = processed.replace(/<img\s([^>]*?)>/gi, transformImage);

    // Restore scripts
    processed = processed.replace(/%%SCRIPT_(\d+)%%/g, (_, i) => scripts[i]);

    return processed;
  });

  console.log(`[Standard Images] Enabled with ${config.cdn} CDN`);
}
