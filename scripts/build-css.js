import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "sass";
import CleanCSS from "clean-css";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const srcDir = path.join(projectRoot, "src/styles");
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
    config = fullConfig.build?.css || {};
    console.log("📋 Loaded build configuration from site.config.yml\n");
  } catch (error) {
    console.warn(`⚠️  Failed to parse site.config.yml: ${error.message}`);
    console.warn("⚠️  Using fallback configuration\n");
  }
}

// Fallback configuration if site.config.yml is missing
const SCSS_FILES = config.files || [
  {
    input: "standard.scss",
    output: "standard.min.css",
  },
  {
    input: "standard.theme.scss",
    output: "standard.theme.min.css",
  },
];

const BUNDLE_CONFIG = config.bundle || {
  files: ["standard.min.css", "standard.theme.min.css"],
  output: "standard.bundle.css",
};

const BUNDLE_FILES = BUNDLE_CONFIG.files;
const BUNDLE_OUTPUT = BUNDLE_CONFIG.output;

// ========================================

async function buildCSS() {
  console.log("🎨 Building CSS files...\n");

  // Ensure dist exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Step 1: Compile SCSS files
    console.log("📦 Step 1: Compiling SCSS");

    for (const file of SCSS_FILES) {
      const result = compile(path.join(srcDir, file.input), {
        style: "compressed",
      });

      fs.writeFileSync(path.join(distDir, file.output), result.css);

      console.log(
        `   ✅ ${file.output} (${(Buffer.byteLength(result.css) / 1024).toFixed(2)} KB)`,
      );
    }

    // Step 2: Bundle CSS files
    console.log("\n📦 Step 2: Bundling CSS");

    const cssContents = BUNDLE_FILES.map((filename) => {
      return fs.readFileSync(path.join(distDir, filename), "utf8");
    });

    const bundledCss = cssContents.join("\n\n");

    // Step 3: Minify bundle
    console.log("\n📦 Step 3: Minifying bundle");

    const minifier = new CleanCSS({
      level: 2,
      compatibility: "*",
    });

    const minified = minifier.minify(bundledCss);

    if (minified.errors.length > 0) {
      throw new Error(minified.errors.join("\n"));
    }

    fs.writeFileSync(path.join(distDir, BUNDLE_OUTPUT), minified.styles);

    const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
    console.log(`   ✅ ${BUNDLE_OUTPUT} (${minifiedSize.toFixed(2)} KB)`);

    console.log("\n✅ CSS build complete!\n");
  } catch (error) {
    console.error("❌ CSS build failed:", error.message);
    process.exit(1);
  }
}

// Initial build
await buildCSS();

// Watch mode
if (isWatch) {
  console.log("👀 Watching SCSS files for changes...\n");

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".scss")) {
      console.log(`\n📝 Changed: ${filename}`);
      await buildCSS();
    }
  });
}
