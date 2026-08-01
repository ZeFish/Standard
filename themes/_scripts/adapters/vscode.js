import fs from 'fs';
import path from 'path';
import { mix, lighten, darken, withOpacity } from '../utils/color.js';

function formatPath(p) {
    const rel = path.relative(process.cwd(), p);
    if (!rel.startsWith('..')) return rel;
    if (process.env.HOME && p.startsWith(process.env.HOME)) {
        return '~' + p.slice(process.env.HOME.length);
    }
    return p;
}


function generateVSCodeTheme(name, appearance, entryConfig) {
    const C = entryConfig.colors;

    let bg_base = C.background;
    let bg_surface, bg_elevated, bg_element, bg_hover, bg_active, border_default, text_base, text_muted, text_dim, text_disable;

    if (appearance === "light") {
        bg_surface = mix(C.background, C.foreground, 0.05);
        bg_elevated = lighten(C.background, 0.65);
        bg_element = darken(C.background, 0.08);
        bg_hover = bg_surface;
        bg_active = bg_surface;
        border_default = C.border ? C.border : bg_surface;
        text_base = C.foreground;
        text_muted = mix(C.foreground, C.background, 0.60);
        text_dim = mix(C.foreground, C.background, 0.85);
        text_disable = mix(C.foreground, C.background, 0.65);
    } else {
        bg_surface = darken(C.background, 0.10);
        bg_elevated = mix(C.background, C.foreground, 0.07);
        bg_element = lighten(C.background, 0.12);
        bg_hover = bg_elevated;
        bg_active = bg_elevated;
        border_default = C.border ? C.border : mix(C.background, C.foreground, 0.08);
        text_base = C.foreground;
        text_muted = mix(C.foreground, C.background, 0.7);
        text_dim = mix(C.foreground, C.background, 0.9);
        text_disable = mix(C.foreground, C.background, 0.65);
    }

    return {
        "name": name,
        "type": appearance,
        "colors": {
            "foreground": text_base,
            "input.background": bg_element,
            "input.foreground": text_base,
            "input.placeholderForeground": text_dim,
            "inputOption.activeBorder": withOpacity(C.accent, "80"),
            "badge.foreground": bg_base,
            "badge.background": C.accent,
            "progressBar.background": C.accent,
            "button.background": C.accent,
            "button.foreground": text_base,
            "button.hoverBackground": withOpacity(C.accent, "90"),
            "dropdown.background": bg_element,
            "dropdown.foreground": text_base,
            "dropdown.border": border_default,
            "focusBorder": withOpacity(C.accent, "80"),
            "selection.background": withOpacity(C.accent, "40"),
            "editor.background": bg_base,
            "editor.foreground": text_base,
            "sideBar.background": bg_base,
            "sideBar.border": border_default,
            "activityBar.background": bg_base,
            "activityBar.foreground": text_base,
            "activityBar.inactiveForeground": text_muted,
            "statusBar.background": bg_base,
            "statusBar.foreground": text_base,
            "titleBar.activeBackground": bg_base,
            "titleBar.activeForeground": text_base,
            "editorLineNumber.foreground": text_dim,
            "editorLineNumber.activeForeground": text_muted,
            "editor.lineHighlightBackground": bg_surface,
            "editorIndentGuide.background": border_default,
            "editorIndentGuide.activeBackground": text_muted,
            "list.hoverBackground": bg_hover,
            "list.activeSelectionBackground": bg_active,
            "list.activeSelectionForeground": text_base,
            "tab.activeBackground": bg_active,
            "tab.activeForeground": text_base,
            "tab.inactiveBackground": bg_base,
            "tab.inactiveForeground": text_muted,
            "tab.border": border_default,
            "breadcrumb.foreground": text_muted,
            "breadcrumb.focusForeground": text_base,
            "widget.shadow": withOpacity("#000000", "40"),
            "quickInput.background": bg_elevated,
            "terminal.background": bg_base,
            "terminal.foreground": text_base
        },
        "tokenColors": [
            { "scope": ["comment", "punctuation.definition.comment"], "settings": { "foreground": text_muted, "fontStyle": "italic" } },
            { "scope": "variable", "settings": { "foreground": C.green } },
            { "scope": "variable.parameter", "settings": { "foreground": C.orange } },
            { "scope": "variable.other.member", "settings": { "foreground": text_base } },
            { "scope": ["constant", "entity.name.constant", "variable.other.constant"], "settings": { "foreground": C.orange } },
            { "scope": ["storage.type", "storage.modifier"], "settings": { "foreground": C.orange, "fontStyle": "italic" } },
            { "scope": ["keyword", "punctuation.definition.keyword"], "settings": { "foreground": C.orange, "fontStyle": "italic" } },
            { "scope": ["entity.name.function", "support.function"], "settings": { "foreground": C.blue, "fontStyle": "italic" } },
            { "scope": "string", "settings": { "foreground": C.yellow } },
            { "scope": ["entity.name.type", "support.type", "support.class"], "settings": { "foreground": C.green } },
            { "scope": "entity.name.tag", "settings": { "foreground": C.blue } },
            { "scope": "entity.other.attribute-name", "settings": { "foreground": C.blue } },
            { "scope": "punctuation", "settings": { "foreground": text_muted } }
        ]
    };
}

function build(config, options) {
    const displayName = options.displayName || 'Forest';
    const outputDir = options.outputDir || process.cwd();

    // We generate two themes: Light and Dark
    const themes = [
        {
            filename: `${displayName}-light-color-theme.json`,
            content: generateVSCodeTheme(`${displayName} Light`, "light", config.light)
        },
        {
            filename: `${displayName}-dark-color-theme.json`,
            content: generateVSCodeTheme(`${displayName} Dark`, "dark", config.dark)
        }
    ];

    // Destinations: Extension Root folders
    const extensionRoots = [
        // Ensure we always write to the output dir
        outputDir,
        // Then any extra destinations
        ...(options.destinations || [])
    ];

    // Try to load package.json for the extension
    let pkgJSON = {};
    try {
        // Priority 1: Theme specific package.json in sourceDir
        if (options.sourceDir) {
            const themePkgPath = path.join(options.sourceDir, 'package.json');
            if (fs.existsSync(themePkgPath)) {
                pkgJSON = JSON.parse(fs.readFileSync(themePkgPath, 'utf8'));
                console.log(`    [VSCode] Using theme manifest: ${formatPath(themePkgPath)}`);
            }
        }

        // Priority 2: Root package.json (Fallback)
        if (Object.keys(pkgJSON).length === 0) {
            const rootPkgPath = path.resolve(process.cwd(), 'package.json');
            if (fs.existsSync(rootPkgPath)) {
                pkgJSON = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
                // Clean up root manifest for distribution
                delete pkgJSON.main;
                delete pkgJSON.scripts;
                delete pkgJSON.dependencies;
                delete pkgJSON.devDependencies;
                console.log(`    [VSCode] Using root manifest as fallback: ${formatPath(rootPkgPath)}`);
            }
        }

        // Common: Update contributor paths to be relative to themes/ folder
        if (pkgJSON.contributes && pkgJSON.contributes.themes) {
            pkgJSON.contributes.themes = pkgJSON.contributes.themes.map(t => {
                // If path does not start with ./themes/, make it so
                const basename = path.basename(t.path);
                return { ...t, path: `./themes/${basename}` };
            });
        }

    } catch (e) {
        console.warn('Could not read package.json for VSCode manifest generation', e);
    }


    for (const extRoot of extensionRoots) {
        if (!extRoot) continue;

        try {
            // Ensure Extension Root Exists
            if (!fs.existsSync(extRoot)) {
                fs.mkdirSync(extRoot, { recursive: true });
            }

            // Create themes/ subdir
            const themesDir = path.join(extRoot, 'themes');
            if (!fs.existsSync(themesDir)) {
                fs.mkdirSync(themesDir, { recursive: true });
            }

            // Write Manifest (package.json)
            const manifestPath = path.join(extRoot, 'package.json');
            fs.writeFileSync(manifestPath, JSON.stringify(pkgJSON, null, 2));
            console.log(`    [VSCode] Manifest Updated: ${formatPath(manifestPath)}`);

            // Copy Auxiliary Files (README, LICENSE, etc.)
            if (options.sourceDir) {
                const auxFiles = ['README.md', 'LICENSE', 'LICENSE.md', 'LICENSE.txt', '.vscodeignore', 'icon.png'];
                for (const file of auxFiles) {
                    const srcPath = path.join(options.sourceDir, file);
                    if (fs.existsSync(srcPath)) {
                        fs.copyFileSync(srcPath, path.join(extRoot, file));
                    }
                }
            }

            // Write Theme Files
            for (const theme of themes) {
                const targetPath = path.join(themesDir, theme.filename);
                fs.writeFileSync(targetPath, JSON.stringify(theme.content, null, 2));
                console.log(`    [VSCode] Generated: ${formatPath(targetPath)}`);
            }

        } catch (e) {
            console.warn(`    [VSCode] Failed to write to ${extRoot}: ${e.message}`);
        }
    }
}

export { build };
