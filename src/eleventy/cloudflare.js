import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createLogger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function CloudflarePages(eleventyConfig, site = {}) {
  // Read Cloudflare config from the site object
  const cf = site.standard?.cloudflare ?? {
    functions: { enabled: false },
    images: { enabled: false },
    verbose: false,
  };

  // Normalize with defaults
  const config = {
    functions: {
      enabled: cf.functions?.enabled ?? false,
      outputDir: cf.functions?.outputDir ?? "functions",
      environment: cf.functions?.environment ?? "production",
      env: cf.functions?.env ?? {},
    },
    images: {
      enabled: cf.images?.enabled ?? false,
      baseUrl: cf.images?.baseUrl ?? "",
      sizes: cf.images?.sizes ?? [640, 960, 1280, 1920],
      quality: cf.images?.quality ?? 85,
      format: cf.images?.format ?? "auto",
      sharpen: cf.images?.sharpen ?? 0.5,
      skipExternal: cf.images?.skipExternal ?? true,
      skipClass: cf.images?.skipClass ?? "no-cdn",
      generateSrcset: cf.images?.generateSrcset ?? true,
      lazyLoad: cf.images?.lazyLoad ?? true,
      fit: cf.images?.fit ?? "scale-down",
      skipInDev: cf.images?.skipInDev ?? true,
    },
    verbose: cf.verbose ?? false,
  };

  const logger = createLogger({
    verbose: config.verbose,
    scope: "Cloudflare",
  });

  // Internal guard: if nothing is enabled, skip plugin work
  if (!config.functions.enabled && !config.images.enabled) {
    logger.info("Disabled (no functions or images enabled)");
    return;
  }

  // If functions are enabled, you also wanted to auto-enable comments
  if (config.functions.enabled && site.standard) {
    site.standard.comments = site.standard.comments || {};
    site.standard.comments.enabled = true;
  }

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

    // Expose Cloudflare data to templates
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
    const isDevelopment =
      process.env.ENV === "DEV" ||
      process.env.NODE_ENV === "development" ||
      process.env.ELEVENTY_ENV === "development";

    if (isDevelopment && config.images.skipInDev) {
      logger.warn("Image optimization skipped in development mode");
    } else {
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

      function shouldSkipImage(imgTag, src) {
        if (imgTag.includes(`class="${config.images.skipClass}"`)) return true;
        if (config.images.skipExternal && src.startsWith("http")) return true;
        if (src.startsWith("data:")) return true;
        if (src.endsWith(".svg")) return true;
        return false;
      }

      function transformImage(match, fullTag) {
        const srcMatch = fullTag.match(/src\s*=\s*['"]([^'"]*?)['"]/);
        if (!srcMatch) return match;

        const originalSrc = srcMatch[1];
        if (shouldSkipImage(fullTag, originalSrc)) return match;

        let newTag = fullTag.replace(/\s+srcset\s*=\s*['"][^'"]*['"]/gi, "");

        const primarySize =
          config.images.sizes[Math.floor(config.images.sizes.length / 2)] ||
          config.images.sizes[0];
        const primarySrc = buildCloudflareUrl(originalSrc, primarySize);

        newTag = newTag.replace(
          /src\s*=\s*['"]([^'"]*?)['"]/,
          `src="${primarySrc}"`,
        );

        if (config.images.generateSrcset && config.images.sizes.length > 1) {
          const srcsetEntries = config.images.sizes
            .map((size) => `${buildCloudflareUrl(originalSrc, size)} ${size}w`)
            .join(", ");

          const sizesAttr = `(max-width: ${primarySize}px) 100vw, ${primarySize}px`;
          newTag = `${newTag} srcset="${srcsetEntries}" sizes="${sizesAttr}"`;
        }

        if (config.images.lazyLoad && !newTag.includes("loading=")) {
          newTag = `${newTag} loading="lazy"`;
        }

        return `<img ${newTag}>`;
      }

      eleventyConfig.addTransform("cloudflare-images", function (content) {
        if (!(this.page.outputPath || "").endsWith(".html")) {
          return content;
        }

        const scripts = [];
        let processed = content.replace(
          /<script[\s\S]*?<\/script>/gi,
          (match) => {
            scripts.push(match);
            return `%%SCRIPT_${scripts.length - 1}%%`;
          },
        );

        processed = processed.replace(/<img\s([^>]*?)>/gi, transformImage);

        processed = processed.replace(
          /%%SCRIPT_(\d+)%%/g,
          (_, i) => scripts[i],
        );

        return processed;
      });

      logger.info("Image optimization enabled");
    }
  }

  // Summary
  const enabledFeatures = [];
  if (config.functions.enabled) enabledFeatures.push("Functions");
  if (config.images.enabled && !config.images.skipInDev)
    enabledFeatures.push("Images");

  if (enabledFeatures.length > 0) {
    logger.success(`Pages: ${enabledFeatures.join(" + ")}`);
  }
  logger.success("Initialized");
}
