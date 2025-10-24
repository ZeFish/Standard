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

// Files to update
const files = [
  "dist/standard.css",
  "dist/standard.min.css",
  "dist/standard.js",
  "dist/standard.min.js",
  "dist/standard.lab.js",
];

for (const file of files) {
  const filePath = path.join(projectRoot, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Check if placeholder exists
    if (content.includes(placeholder)) {
      // Replace placeholder with version info
      content = content.replace(placeholder, versionString);
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✓ ${file} (placeholder replaced)`);
    } else {
      console.log(`⚠ ${file} (placeholder not found, skipped)`);
    }
  } else {
    console.log(`✗ ${file} (file not found)`);
  }
}

console.log(`\n✓ Version ${version} injected into dist files`);
