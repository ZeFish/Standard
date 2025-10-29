import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const srcDir = path.join(projectRoot, "src/js");
const distDir = path.join(projectRoot, "dist");

const isWatch = process.argv.includes("--watch");

// ========================================
// LOAD CONFIGURATION FROM site.config.yml
// ========================================

let config = {};
const configPath = path.join(projectRoot, "site.config.yml");

if (fs.existsSync(configPath)) {
  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const fullConfig = yaml.load(configContent);
    config = fullConfig.build?.js || {};
    console.log("📋 Loaded build configuration from site.config.yml\n");
  } catch (error) {
    console.warn(`⚠️  Failed to parse site.config.yml: ${error.message}`);
    console.warn("⚠️  Using fallback configuration\n");
  }
}

// Fallback configuration if site.config.yml is missing
const JS_FILES = config.files || [
  {
    input: "standard.js",
    output: "standard.min.js",
    minify: true,
  },
  {
    input: "standard.comment.js",
    output: "standard.comment.js",
    minify: true,
  },
  {
    input: "standard.lab.js",
    output: "standard.lab.js",
    minify: false,
  },
];

const BUNDLES = config.bundles || [
  {
    name: "standard.bundle.js",
    files: [
      "node_modules/htmx.org/dist/htmx.min.js",
      "node_modules/htmx.org/dist/ext/preload.js",
      "dist/standard.min.js",
    ],
  },
  {
    name: "standard.bundle.full.js",
    files: [
      "node_modules/htmx.org/dist/htmx.min.js",
      "node_modules/htmx.org/dist/ext/preload.js",
      "dist/standard.min.js",
      "dist/standard.comment.js",
      "src/js/standard.toast.js",
    ],
  },
];

// ========================================

async function buildJS() {
  console.log("🔨 Building JavaScript files...\n");

  // Ensure dist exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Step 1: Build individual files
    console.log("📦 Step 1: Building individual files");

    for (const file of JS_FILES) {
      const inputPath = path.join(srcDir, file.input);
      const outputPath = path.join(distDir, file.output);
      const source = fs.readFileSync(inputPath, "utf8");

      if (file.minify) {
        const result = await minify(source, {
          compress: true,
          mangle: true,
        });
        fs.writeFileSync(outputPath, result.code);
        console.log(
          `   ✅ ${file.output} (${(Buffer.byteLength(result.code) / 1024).toFixed(2)} KB)`,
        );
      } else {
        fs.copyFileSync(inputPath, outputPath);
        console.log(`   ✅ ${file.output} (copied)`);
      }
    }

    // Step 2: Create bundles
    console.log("\n📦 Step 2: Creating bundles");

    for (const bundle of BUNDLES) {
      const contents = bundle.files.map((filepath) => {
        // Handle both absolute and relative paths
        const fullPath = filepath.startsWith("node_modules")
          ? filepath
          : path.join(__dirname, "..", filepath);

        return fs.readFileSync(fullPath, "utf8");
      });

      const bundled = contents.join("\n\n");
      const minified = await minify(bundled, {
        compress: true,
        mangle: true,
      });

      fs.writeFileSync(path.join(distDir, bundle.name), minified.code);

      console.log(
        `   ✅ ${bundle.name} (${(Buffer.byteLength(minified.code) / 1024).toFixed(2)} KB)`,
      );
    }

    console.log("\n✅ JavaScript build complete!\n");
  } catch (error) {
    console.error("❌ JavaScript build failed:", error.message);
    process.exit(1);
  }
}

// Initial build
await buildJS();

// Watch mode
if (isWatch) {
  console.log("👀 Watching JS files for changes...\n");

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      console.log(`\n📝 Changed: ${filename}`);
      await buildJS();
    }
  });
}
