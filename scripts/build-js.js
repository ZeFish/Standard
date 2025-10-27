import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "../dist");

async function bundle() {
  // Read source files
  const htmx = fs.readFileSync(
    "node_modules/htmx.org/dist/htmx.min.js",
    "utf8",
  );
  const preload = fs.readFileSync(
    "node_modules/htmx.org/dist/ext/preload.js",
    "utf8",
  );
  const standard = fs.readFileSync(
    path.join(distDir, "standard.min.js"),
    "utf8",
  );
  const comment = fs.readFileSync(
    path.join(distDir, "standard.comment.js"),
    "utf8",
  );

  // Core bundle (htmx + preload + standard)
  const coreCode = [htmx, preload, standard].join("\n");
  const coreMinified = await minify(coreCode, {
    compress: true,
    mangle: true,
    sourceMap: {
      filename: "standard.bundle.js",
      url: "standard.bundle.js.map",
    },
  });

  fs.writeFileSync(path.join(distDir, "standard.bundle.js"), coreMinified.code);

  if (coreMinified.map) {
    fs.writeFileSync(
      path.join(distDir, "standard.bundle.js.map"),
      coreMinified.map,
    );
  }

  // Full bundle (core + comments)
  const fullCode = [htmx, preload, standard, comment].join("\n");
  const fullMinified = await minify(fullCode, {
    compress: true,
    mangle: true,
    sourceMap: {
      filename: "standard.bundle.full.js",
      url: "standard.bundle.full.js.map",
    },
  });

  fs.writeFileSync(
    path.join(distDir, "standard.bundle.full.js"),
    fullMinified.code,
  );

  if (fullMinified.map) {
    fs.writeFileSync(
      path.join(distDir, "standard.bundle.full.js.map"),
      fullMinified.map,
    );
  }

  console.log("✅ JavaScript bundles created:");
  console.log(
    `   - standard.bundle.js (${(Buffer.byteLength(coreMinified.code) / 1024).toFixed(2)} KB)`,
  );
  console.log(
    `   - standard.bundle.full.js (${(Buffer.byteLength(fullMinified.code) / 1024).toFixed(2)} KB)`,
  );
}

bundle().catch(console.error);
