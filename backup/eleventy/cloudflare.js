import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Logger from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function Cloudflare(eleventyConfig, site = {}) {
  // Read Cloudflare config safely
  const cf = site.standard?.cloudflare ?? {};

  // Accept both keys: comment and comments; prefer plural if both exist
  const commentsBlock = cf.comments ?? cf.comment ?? {};
  const commentsEnabled = !!commentsBlock.enabled;

  // Respect explicit functions.enabled; otherwise inherit from commentsEnabled
  const explicitFunctions = cf.functions?.enabled;
  const functionsEnabled =
    explicitFunctions !== undefined ? explicitFunctions : commentsEnabled;

  const config = {
    functions: {
      enabled: functionsEnabled,
      outputDir: cf.functions?.outputDir ?? "functions/api",
      environment: cf.functions?.environment ?? "production",
      env: cf.functions?.env ?? {},
    },
    images: {
      enabled: cf.images?.enabled ?? false,
      baseUrl: cf.images?.baseUrl ?? "",
      sizes: cf.images?.sizes ?? [640, 960, 1280, 1920],
      quality: cf.images?.quality ?? 85,
      format: cf.images?.format ?? "auto",
      sharpen: cf.images?.sharpen ?? 1,
      skipExternal: cf.images?.skipExternal ?? true,
      skipClass: cf.images?.skipClass ?? "no-cdn",
      generateSrcset: cf.images?.generateSrcset ?? true,
      lazyLoad: cf.images?.lazyLoad ?? true,
      fit: cf.images?.fit ?? "scale-down",
      skipInDev: cf.images?.skipInDev ?? true,
    },
    // Keep comments under cloudflare namespace (not top-level), derived from comment(s) block
    comments: {
      enabled: commentsEnabled,
      // Endpoint under Functions; adjust if you copy to a subfolder (e.g., /api/comments)
      apiEndpoint: commentsBlock.apiEndpoint ?? "/api/comments",
      commentsPath: commentsBlock.commentsPath ?? "data/comments",
      // If you want to pass through a version, inject it here from your package
      version:
        commentsBlock.version ??
        (typeof pkg !== "undefined" ? pkg.version : "0.0.0"),
      clientLibrary: commentsBlock.clientLibrary ?? "",
    },
    verbose: site.standard.verbose ?? false,
  };

  const logger = Logger({
    verbose: site.standard.verbose,
    scope: "Cloudflare",
  });

  if (commentsEnabled && config.functions.enabled === false) {
    logger.warn(
      "Comments are enabled but functions are explicitly disabled; comment API won’t work.",
    );
  }
  // Internal guard
  if (!config.functions.enabled && !config.images.enabled) {
    logger.warn("Cloudflare plugin disabled (no features enabled)");
    return;
  }

  // If functions ended up enabled, auto-enable comments in site.standard for downstream usage
  if (config.functions.enabled && site.standard) {
    site.standard.comments = site.standard.comments || {};
    site.standard.comments.enabled = true;
  }
  // =====================================================================
  // FUNCTIONS DEPLOYMENT
  // =====================================================================

  if (config.functions.enabled) {
    // Adjusted source to src/cloudflare/api
    const cloudflareDir = path.join(__dirname, "..", "cloudflare", "api");
    const projectRoot = process.cwd();
    const functionsOutputPath = path.join(
      projectRoot,
      config.functions.outputDir,
    );

    logger.debug(`Project root :: ${projectRoot}`);
    logger.debug(`Source :: ${cloudflareDir}`);
    logger.debug(`Output :: ${functionsOutputPath}`);

    eleventyConfig.on("eleventy.before", async () => {
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
      logger.debug(`Functions copied to /${config.functions.outputDir}/`);
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

      logger.success("Image optimization");
    }
  }

  // Summary
  const enabledFeatures = [];
  if (config.functions.enabled) enabledFeatures.push("Functions");
  if (config.images.enabled && !config.images.skipInDev)
    enabledFeatures.push("Images");

  logger.success();
}
