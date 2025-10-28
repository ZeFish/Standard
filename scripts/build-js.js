import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src/js");
const distDir = path.join(__dirname, "../dist");

const isWatch = process.argv.includes("--watch");

// ========================================
// CONFIGURATION - Edit files to bundle here
// ========================================

const JS_FILES = [
  {
    input: "standard.js", // Source JS file (in src/js/)
    output: "standard.min.js", // Output minified file
    minify: true, // Should minify?
  },
  {
    input: "standard.comment.js",
    output: "standard.comment.js",
    minify: true,
  },
  {
    input: "standard.lab.js",
    output: "standard.lab.js",
    minify: false, // Just copy, don't minify
  },
];

const BUNDLES = [
  {
    name: "standard.bundle.js", // Bundle name
    files: [
      // Files to include (in order)
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
