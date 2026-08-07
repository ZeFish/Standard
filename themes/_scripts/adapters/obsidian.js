import fs from 'fs';
import path from 'path';

export function build(config, options) {
    const meta = config.rawConfig.meta || {};

    // The directory name of the theme is the ID used for the SCSS file.
    // `meta.id` comes from YAML, where an unquoted `id: 2064` parses as a
    // number — and a number has no `.toLowerCase()`. Coerce before lowering,
    // so a theme named after a year doesn't take the adapter down with it.
    const themeFolder = path.basename(options.sourceDir);
    const themeName = String(meta.id || themeFolder).toLowerCase();
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

    // Everything below the two timestamp lines. Kept separate so the note can
    // be compared against its previous version without the clock interfering.
    const body = `cssclasses: []
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

    // Write to the generated directory.
    //
    // Regenerating has to be idempotent: an unchanged theme must produce a
    // byte-identical file. Otherwise every build marks all 27 notes as
    // modified and a real change drowns in the churn.
    //
    // So the timestamps are treated as data to preserve, not to emit:
    //   · `created` never moves — it is read back from the existing note.
    //   · `modified` only advances when the body actually differs.
    //   · An unchanged body is not rewritten at all.
    const outputDir = options.outputDir || process.cwd();
    const destPath = path.join(outputDir, `${themeName}.md`);

    let created = now;
    if (fs.existsSync(destPath)) {
        const previous = fs.readFileSync(destPath, "utf8");
        const match = previous.match(/^created:\s*(.+)$/m);
        if (match) created = match[1].trim();

        const stripStamps = (text) => text.replace(/^(created|modified):.*$/gm, "");
        const candidate = `---\naliases: []\ncreated: ${created}\nmodified: ${now}\n${body}`;
        if (stripStamps(previous) === stripStamps(candidate)) {
            console.log(`    [Obsidian] Unchanged: ${destPath}`);
            return;
        }
    }

    fs.writeFileSync(destPath, `---\naliases: []\ncreated: ${created}\nmodified: ${now}\n${body}`, "utf8");
    console.log(`    [Obsidian] Generated: ${destPath}`);
}
