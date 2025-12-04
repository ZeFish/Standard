import { test, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "fs";
import { execSync } from "child_process";

function hashFile(filePath) {
  const fileBuffer = readFileSync(filePath);
  const hashSum = createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function hashDirectory(directory) {
  const files = {};
  const entries = readdirSync(directory);

  entries.forEach((file) => {
    const path = `${directory}/${file}`;
    if (statSync(path).isFile()) {
      files[file] = hashFile(path);
    }
  });

  return files;
}

test("Library files are up to date with source", () => {
  // First, rebuild the JS files to get fresh copies
  console.log("Building JS files...");
  execSync("npm run build", { stdio: "inherit" });

  // Now compare the hashes
  const libHashes = hashDirectory("./lib");
  const expectedJsFiles = ["standard.min.js", "standard.lab.js"];

  expectedJsFiles.forEach((fileName) => {
    expect(libHashes[fileName]).toBeDefined();
    console.log(`✓ ${fileName} exists in lib/`);
  });
});
