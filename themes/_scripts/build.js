import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { oklchToRgb, toHex } from "./utils/color.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themesBaseDir = path.join(process.cwd()); // We will run this from packages/themes
const adaptersDir = path.join(__dirname, "adapters");

// Ensure directories exist
if (!fs.existsSync(themesBaseDir)) {
  console.error(`Themes directory not found: ${themesBaseDir}`);
  process.exit(1);
}
if (!fs.existsSync(adaptersDir)) {
  console.error(`Adapters directory not found: ${adaptersDir}`);
  process.exit(1);
}

// Load adapters
const adapters = [];
const adapterFiles = fs.readdirSync(adaptersDir).filter((f) => f.endsWith(".js"));
for (const f of adapterFiles) {
  const mod = await import(path.join("file://", adaptersDir, f));
  adapters.push({
    name: path.basename(f, ".js"),
    module: mod,
  });
}

// Helper to parse CSS color values to hex
function parseColorValue(value, tokens, scheme) {
  if (!value) return "#000000";

  // Resolve var(--...)
  if (value.startsWith("var(--")) {
    const varName = value.match(/var\(--(.*?)\)/)[1];
    // e.g. color-yellow -> color-light-yellow or color-dark-yellow
    let resolvedValue;
    if (varName.startsWith("color-")) {
      const colorName = varName.replace("color-", "");
      resolvedValue = tokens[`color-${scheme}-${colorName}`];
    }
    if (!resolvedValue) resolvedValue = tokens[varName]; // fallback
    return parseColorValue(resolvedValue, tokens, scheme);
  }

  // Parse oklch(...)
  if (value.startsWith("oklch(")) {
    const match = value.match(/oklch\((.*?)\)/);
    if (match && match[1]) {
      const parts = match[1].split(/\s+/).map(Number);
      if (parts.length === 3) {
        const rgb = oklchToRgb(parts[0], parts[1], parts[2]);
        return toHex(rgb);
      }
    }
  }

  // Fallback, assume it's already a valid hex or generic color name
  return value.replace(/\"/g, ""); // remove quotes if any
}

async function processTheme(themeDir, configFile) {
  const configPath = path.join(themeDir, configFile);
  let rawConfig;
  try {
    rawConfig = yaml.load(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error(`Failed to load config ${configPath}:`, e.message);
    return;
  }

  if (!rawConfig || !rawConfig.tokens) {
    return; // Not a valid token file
  }

  const tokens = rawConfig.tokens;
  const meta = rawConfig.meta || {};
  const themeBaseName = meta.id || path.basename(themeDir);
  const displayName = meta.label || (themeBaseName.charAt(0).toUpperCase() + themeBaseName.slice(1));

  // Generate tokens block
  const selector = meta.selector || `:root[data-theme="${themeBaseName}"],\n[data-theme="${themeBaseName}"]`;
  const decls = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`).join("\n");
  const tokenBlock = [
    "/* TOKENS.YAML ADAPTER BEGIN */",
    `${selector} {`,
    decls,
    "}",
    "/* TOKENS.YAML ADAPTER END */"
  ].join("\n");

  const scssPath = path.join(themeDir, `${themeBaseName}.scss`);
  let scssContent = "";
  if (fs.existsSync(scssPath)) {
    scssContent = fs.readFileSync(scssPath, "utf8");
    // Strip any @use statements
    scssContent = scssContent.replace(/@use\s+['"][^'"]+['"]\s*;?/g, "").trim();

    const beginComment = "/* TOKENS.YAML ADAPTER BEGIN */";
    const endComment = "/* TOKENS.YAML ADAPTER END */";
    const beginIdx = scssContent.indexOf(beginComment);
    const endIdx = scssContent.indexOf(endComment);

    if (beginIdx !== -1 && endIdx !== -1) {
      scssContent = scssContent.substring(0, beginIdx).trim() + "\n\n" + tokenBlock + "\n\n" + scssContent.substring(endIdx + endComment.length).trim();
    } else {
      scssContent = tokenBlock + "\n\n" + scssContent;
    }
  } else {
    scssContent = tokenBlock + "\n";
  }

  fs.writeFileSync(scssPath, scssContent.trim() + "\n", "utf8");

  // Clean up legacy _tokens.generated.scss if present
  const genScssPath = path.join(themeDir, "_tokens.generated.scss");
  if (fs.existsSync(genScssPath)) {
    try {
      fs.unlinkSync(genScssPath);
    } catch (e) {}
  }

  console.log(`\nProcessing Theme: ${displayName} (${themeBaseName})`);

  // Build legacy config format for adapters
  const config = {
    appearance: "opaque",
    common: { opacity: 1, transparent: "#00000000" },
    light: { colors: {} },
    dark: { colors: {} },
    rawConfig,
  };

  // A theme can give a colour ONE value for both schemes (`color-accent`) instead of
  // splitting it (`color-light-accent`/`color-dark-accent`) — Reveal's accent is exactly
  // this ("same in both schemes" is the whole point of a sacred, rare accent). Without
  // this fallback, a scheme-prefixed-only lookup silently resolved to `undefined` →
  // parseColorValue's black default — every adapter for every such theme (15+ across
  // this package) was generating a black accent/red/etc. instead of the real colour.
  const schemeColor = (name, scheme) => tokens[`color-${scheme}-${name}`] ?? tokens[`color-${name}`];

  const schemes = ["light", "dark"];
  for (const scheme of schemes) {
    config[scheme].colors = {
      background: parseColorValue(schemeColor("background", scheme), tokens, scheme),
      foreground: parseColorValue(schemeColor("foreground", scheme), tokens, scheme),
      accent: parseColorValue(schemeColor("accent", scheme), tokens, scheme),
      red: parseColorValue(schemeColor("red", scheme), tokens, scheme),
      orange: parseColorValue(schemeColor("orange", scheme), tokens, scheme),
      yellow: parseColorValue(schemeColor("yellow", scheme), tokens, scheme),
      green: parseColorValue(schemeColor("green", scheme), tokens, scheme),
      cyan: parseColorValue(schemeColor("cyan", scheme), tokens, scheme),
      blue: parseColorValue(schemeColor("blue", scheme), tokens, scheme),
      // map purple/pink to magenta
      magenta: parseColorValue(schemeColor("purple", scheme) ?? schemeColor("pink", scheme), tokens, scheme),
    };
  }

  // Process all adapters for this theme
  for (const adapter of adapters) {
    console.log(`  - Running adapter: ${adapter.name}`);

    // Output directory specifically for this adapter within the theme folder
    const adapterOutputDir = path.join(themeDir, "generated", adapter.name);
    if (!fs.existsSync(adapterOutputDir)) {
      fs.mkdirSync(adapterOutputDir, { recursive: true });
    }

    if (adapter.module.build) {
      try {
        adapter.module.build(config, {
          displayName,
          sourceDir: themeDir,
          outputDir: adapterOutputDir,
          destinations: [], // Can be configured later if needed via meta.targets
        });
      } catch (e) {
        console.error(`    Error in adapter ${adapter.name}:`, e.message);
      }
    } else {
      console.warn(`    Adapter ${adapter.name} does not export a build function.`);
    }
  }
}

// Main Scan Loop
async function main() {
  const specifiedTheme = process.argv[2];

  if (specifiedTheme) {
    // Process specific theme
    const themeDir = path.join(themesBaseDir, specifiedTheme);
    if (!fs.existsSync(themeDir) || !fs.statSync(themeDir).isDirectory()) {
      console.error(`Theme directory not found: ${themeDir}`);
      process.exit(1);
    }
    await processTheme(themeDir, "tokens.yaml");
  } else {
    // Process all subdirectories in scan
    const items = fs.readdirSync(themesBaseDir);
    let themesFound = 0;

    for (const item of items) {
      const itemPath = path.join(themesBaseDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const tokenPath = path.join(itemPath, "tokens.yaml");
        if (fs.existsSync(tokenPath)) {
          await processTheme(itemPath, "tokens.yaml");
          themesFound++;
        }
      }
    }

    if (themesFound === 0) {
      console.log("No themes found to build.");
    }
  }
}
main();
