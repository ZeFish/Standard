import fs from 'fs';
import path from 'path';
import { parseHex, lighten, darken } from '../utils/color.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hexToSwiftColor(hex) {
    if (!hex) return 'Color.clear';
    const { r, g, b } = parseHex(hex);
    // Remove trailing zeros for cleaner code
    const rf = parseFloat((r / 255).toFixed(4));
    const gf = parseFloat((g / 255).toFixed(4));
    const bf = parseFloat((b / 255).toFixed(4));
    return `Color(red: ${rf}, green: ${gf}, blue: ${bf})`;
}

function build(config, options) {
    const templatePath = path.join(__dirname, '../templates/Theme.swift.template');
    if (!fs.existsSync(templatePath)) {
        console.warn(`    [Reveal] Template not found: ${templatePath}`);
        return;
    }

    let template = fs.readFileSync(templatePath, 'utf8');
    const rawTokens = (config.rawConfig && config.rawConfig.tokens) || {};

    // Light mode calculations
    const lightBg = config.light.colors.background || '#ffffff';
    const lightFg = config.light.colors.foreground || '#000000';
    // `elevated`/`photoFrame` are Reveal-only extras (a photo-culling app needs
    // these; a note theme doesn't) — prefer an explicit token when the theme
    // defines one (Reveal's own tokens.yaml does, so its hand-tuned "quiet
    // groove" survives regeneration exactly), else fall back to a lighten/
    // darken guess off the background for any theme that doesn't.
    const lightElevated = rawTokens['color-light-elevated'] || '#ffffff';
    const lightPhotoFrame = rawTokens['color-light-photoFrame'] || '#ffffff';

    // Dark mode calculations
    const darkBg = config.dark.colors.background || '#000000';
    const darkFg = config.dark.colors.foreground || '#ffffff';
    const darkElevated = rawTokens['color-dark-elevated'] || lighten(darkBg, 0.06); // bg + ~6%
    const darkPhotoFrame = rawTokens['color-dark-photoFrame'] || darken(darkBg, 0.05); // slightly darker than bg

    const replacements = {
        '{{light_bg}}': hexToSwiftColor(lightBg),
        '{{light_fg}}': hexToSwiftColor(lightFg),
        '{{light_elevated}}': hexToSwiftColor(lightElevated),
        '{{light_photoFrame}}': hexToSwiftColor(lightPhotoFrame),
        '{{dark_bg}}': hexToSwiftColor(darkBg),
        '{{dark_fg}}': hexToSwiftColor(darkFg),
        '{{dark_elevated}}': hexToSwiftColor(darkElevated),
        '{{dark_photoFrame}}': hexToSwiftColor(darkPhotoFrame),
        '{{accent}}': hexToSwiftColor(config.light.colors.accent), // Reveal uses single accent for both
    };

    for (const [key, val] of Object.entries(replacements)) {
        template = template.replace(new RegExp(key, 'g'), val);
    }
    
    const outputDir = options.outputDir || process.cwd();
    const destPath = path.join(outputDir, 'Theme.swift');
    fs.writeFileSync(destPath, template);
    console.log(`    [Reveal] Generated: ${destPath}`);
}

export { build };
