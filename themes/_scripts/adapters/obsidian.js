import fs from 'fs';
import path from 'path';

export function build(config, options) {
    const meta = config.rawConfig.meta || {};

    // The directory name of the theme is the ID used for the SCSS file
    const themeFolder = path.basename(options.sourceDir);
    const themeName = (meta.id || themeFolder).toLowerCase();
    const label = meta.label || options.displayName;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Read structural CSS overrides from theme.scss (tokens live in tokens.yaml
    // and are bundled separately — no duplication here).
    const scssPath = path.join(options.sourceDir, `${themeFolder}.scss`);
    let customCss = "";
    if (fs.existsSync(scssPath)) {
        let scssContent = fs.readFileSync(scssPath, "utf8");

        // Strip anything inside TOKENS.YAML ADAPTER comments
        scssContent = scssContent.replace(/\/\* TOKENS\.YAML ADAPTER BEGIN \*\/[\s\S]*?\/\* TOKENS\.YAML ADAPTER END \*\//g, "").trim();

        // Strip the outer :root[data-theme="..."], [data-theme="..."] { ... } wrapper
        const firstBraceIdx = scssContent.indexOf("{");
        const lastBraceIdx = scssContent.lastIndexOf("}");
        if (firstBraceIdx !== -1 && lastBraceIdx !== -1) {
            customCss = scssContent.substring(firstBraceIdx + 1, lastBraceIdx).trim();
        } else {
            customCss = scssContent.trim();
        }

        // Strip any @use statements
        customCss = customCss.replace(/@use\s+['"][^'"]+['"]\s*;?/g, "").trim();
    }

    // Build the markdown note — structural CSS only, tokens are bundled.
    let cssBlock = "";
    if (customCss) {
        cssBlock = `[data-stnd-theme="${themeName}"] {\n    /* ─── Custom rules for ${label} ───────────────────────────── */\n`;
        const indentedCss = customCss
            .split("\n")
            .map(line => line ? "    " + line : line)
            .join("\n");
        cssBlock += indentedCss + "\n}\n";
    }

    const content = `---
aliases: []
created: ${now}
modified: ${now}
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: ${themeName}
type: theme
visibility: private
snippet: false
---

![[Sample content]]

\`\`\`css
${cssBlock}\`\`\`
`;

    // 4. Write to generated directory
    const outputDir = options.outputDir || process.cwd();
    const destPath = path.join(outputDir, `${themeName}.md`);
    fs.writeFileSync(destPath, content, "utf8");
    console.log(`    [Obsidian] Generated: ${destPath}`);
}
