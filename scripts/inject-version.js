import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Read package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8")
);

const version = pkg.version;
const timestamp = new Date().toISOString();

// CSS Header
const cssHeader = `/*! Standard Framework v${version} | ${timestamp} */\n`;

// JS Header
const jsHeader = `/*! Standard Framework v${version} | ${timestamp} */\n`;

// Files to update
const files = [
  { path: "dist/standard.css", header: cssHeader },
  { path: "dist/standard.min.css", header: cssHeader },
  { path: "dist/standard.js", header: jsHeader },
  { path: "dist/standard.min.js", header: jsHeader },
  { path: "dist/standard.lab.js", header: jsHeader },
];

for (const file of files) {
  const filePath = path.join(projectRoot, file.path);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Remove existing version header if present
    content = content.replace(/\/\*! Standard Framework v[\d.]+.*?\*\/\n/, "");

    // Add new header
    content = file.header + content;

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ ${file.path}`);
  }
}

console.log(`\n✓ Version ${version} injected into dist files`);
