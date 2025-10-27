import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "sass";
import CleanCSS from "clean-css";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src/styles");
const distDir = path.join(__dirname, "../dist");

const isWatch = process.argv.includes("--watch");

async function buildCSS() {
  console.log("🎨 Building CSS files...\n");

  // Ensure dist exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Step 1: Compile SCSS
    console.log("📦 Compiling SCSS");

    const standardResult = compile(path.join(srcDir, "standard.scss"), {
      style: "compressed",
    });
    fs.writeFileSync(
      path.join(distDir, "standard.min.css"),
      standardResult.css
    );
    console.log(`   ✅ standard.min.css (${(Buffer.byteLength(standardResult.css) / 1024).toFixed(2)} KB)`);

    const themeResult = compile(path.join(srcDir, "standard-theme.scss"), {
      style: "compressed",
    });
    fs.writeFileSync(
      path.join(distDir, "standard.theme.min.css"),
      themeResult.css
    );
    console.log(`   ✅ standard.theme.min.css (${(Buffer.byteLength(themeResult.css) / 1024).toFixed(2)} KB)`);

    // Step 2: Bundle & Minify
    console.log("\n📦 Bundling and minifying");

    const standardCss = fs.readFileSync(
      path.join(distDir, "standard.min.css"),
      "utf8"
    );
    const themeCss = fs.readFileSync(
      path.join(distDir, "standard.theme.min.css"),
      "utf8"
    );

    const bundledCss = [standardCss, themeCss].join("\n\n");

    const minifier = new CleanCSS({
      level: 2,
      compatibility: "*",
    });

    const minified = minifier.minify(bundledCss);

    if (minified.errors.length > 0) {
      throw new Error(minified.errors.join("\n"));
    }

    fs.writeFileSync(
      path.join(distDir, "standard.bundle.css"),
      minified.styles
    );

    const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
    console.log(`   ✅ standard.bundle.css (${minifiedSize.toFixed(2)} KB)`);

    console.log("\n✅ CSS build complete!\n");
  } catch (error) {
    console.error("❌ CSS build failed:", error.message);
    if (!isWatch) {
      process.exit(1);
    }
  }
}

// Initial build
await buildCSS();

// Watch mode
if (isWatch) {
  console.log("👀 Watching for changes...\n");
  
  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".scss")) {
      console.log(`\n📝 Changed: ${filename}`);
      await buildCSS();
    }
  });
}
