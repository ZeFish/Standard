import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

// Mirrors build.js's own assumption: run from packages/themes/ (that's what
// the "dev"/"build:themes" package.json scripts do via pnpm).
const themesBaseDir = process.cwd();
const buildScript = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "build.js",
);

function build(theme) {
  const label = theme || "all themes";
  console.log(`[themes] building ${label}...`);
  const args = [buildScript, theme].filter(Boolean);
  const result = spawnSync("node", args, { cwd: themesBaseDir, stdio: "inherit" });
  if (result.status !== 0) {
    // build.js already printed the error — keep watching rather than crash
    // the whole dev session over one bad tokens.yaml edit.
    console.error(`[themes] build failed for ${label} (see above)`);
  }
}

// One full build on startup so dev never serves stale theme output.
build();

console.log("[themes] watching tokens.yaml files for changes...");

const timers = new Map();
fs.watch(themesBaseDir, { recursive: true }, (_event, filename) => {
  if (!filename || !filename.endsWith("tokens.yaml")) return;
  const theme = filename.split(path.sep)[0];
  // Debounce: editors often fire multiple events per save.
  clearTimeout(timers.get(theme));
  timers.set(
    theme,
    setTimeout(() => build(theme), 150),
  );
});
