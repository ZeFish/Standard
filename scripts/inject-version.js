import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Read package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8"),
);

const version = pkg.version;

// Version string to inject
const versionString = `Standard Framework v${version}`;

// Placeholder to replace
const placeholder = "@VERSION_PLACEHOLDER@";

// Get all files in dist/ directory
const distDir = path.join(projectRoot, "dist");

if (!fs.existsSync(distDir)) {
  console.error(`✗ dist/ directory not found at ${distDir}`);
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter((file) => {
  const filePath = path.join(distDir, file);
  return fs.statSync(filePath).isFile(); // Only process files, not directories
});

if (files.length === 0) {
  console.warn("⚠ No files found in dist/ directory");
  process.exit(0);
}

let replacedCount = 0;
let skippedCount = 0;
let notFoundCount = 0;

for (const file of files) {
  const filePath = path.join(distDir, file);

  try {
    let content = fs.readFileSync(filePath, "utf-8");

    // Check if placeholder exists
    if (content.includes(placeholder)) {
      // Replace placeholder with version info
      content = content.replace(new RegExp(placeholder, "g"), versionString);
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✓ ${file} (placeholder replaced)`);
      replacedCount++;
    } else {
      console.log(`⚠ ${file} (placeholder not found, skipped)`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`✗ ${file} (error: ${error.message})`);
    notFoundCount++;
  }
}

console.log(`\n✓ Version ${version} injected into dist files`);
console.log(`  - Replaced: ${replacedCount}`);
console.log(`  - Skipped: ${skippedCount}`);
console.log(`  - Errors: ${notFoundCount}`);
