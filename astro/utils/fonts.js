const FONT_PRESETS = {
    inter: {
        module: "@fontsource-variable/inter",
        source: "variable",
    },
    instrumentSans: {
        module: "@fontsource-variable/instrument-sans",
        source: "variable",
    },
    instrumentSerif: {
        module: "@fontsource/instrument-serif",
        source: "static",
        subsets: ["latin"],
        weights: [400],
        styles: ["normal"],
    },
    fraunces: {
        module: "@fontsource-variable/fraunces",
        source: "variable",
    },
    ibmPlexMono: {
        module: "@fontsource/ibm-plex-mono",
        source: "static",
        subsets: ["latin"],
        weights: [400, 500, 600, 700],
        styles: ["normal"],
    },
    newsreader: {
        module: "@fontsource-variable/newsreader",
        source: "variable",
    },
};

const DEFAULT_FONT_FLAGS = {
    inter: true,
    instrumentSans: true,
    instrumentSerif: true,
    fraunces: true,
    ibmPlexMono: true,
    newsreader: true,
};

function ensureModuleName(fontKey, source = "variable") {
    if (source === "variable") {
        return `@fontsource-variable/${fontKey}`;
    }
    return `@fontsource/${fontKey}`;
}

function normalizeFontOption(fontKey, value) {
    if (value === false) return null;

    const preset = FONT_PRESETS[fontKey] || {
        module: ensureModuleName(fontKey),
        source: "variable",
    };

    if (value === true || value == null) {
        return { ...preset };
    }

    if (typeof value === "string") {
        return {
            ...preset,
            module: value,
        };
    }

    if (typeof value === "object") {
        const source = value.source || preset.source || "variable";
        const module =
            value.module ||
            value.package ||
            preset.module ||
            ensureModuleName(fontKey, source);

        return {
            ...preset,
            ...value,
            source,
            module,
            subsets:
                "subsets" in value
                    ? value.subsets || []
                    : preset.subsets || (source === "variable" ? [] : ["latin"]),
            weights:
                "weights" in value
                    ? value.weights || []
                    : preset.weights || (source === "variable" ? [] : [400]),
            styles:
                "styles" in value
                    ? value.styles || []
                    : preset.styles || ["normal"],
            imports: Array.isArray(value.imports) ? value.imports : preset.imports,
        };
    }

    return { ...preset };
}

function createFontImports(fonts = DEFAULT_FONT_FLAGS, resolveFn) {
    const config = fonts && Object.keys(fonts).length > 0 ? fonts : DEFAULT_FONT_FLAGS;
    const statements = new Set();

    for (const [fontKey, fontValue] of Object.entries(config)) {
        const font = normalizeFontOption(fontKey, fontValue);
        if (!font) continue;

        if (Array.isArray(font.imports) && font.imports.length > 0) {
            font.imports.forEach((specifier) => statements.add(`import "${specifier}";`));
            continue;
        }

        if (font.source === "variable") {
            let specifier = font.module;
            if (resolveFn) {
                try {
                    specifier = resolveFn(specifier);
                } catch (e) {
                    // Keep original specifier if resolution fails
                }
            }
            statements.add(`import "${specifier}";`);
            continue;
        }

        const subsets = font.subsets?.length ? font.subsets : ["latin"];
        const weights = font.weights?.length ? font.weights : [400];
        const styles = font.styles?.length ? font.styles : ["normal"];

        for (const subset of subsets) {
            for (const weight of weights) {
                for (const style of styles) {
                    let specifier;
                    // @fontsource packages typically omit 'normal' from the filename
                    if (style === "normal") {
                        specifier = `${font.module}/${subset}-${weight}.css`;
                    } else {
                        specifier = `${font.module}/${subset}-${weight}-${style}.css`;
                    }

                    if (resolveFn) {
                        try {
                            specifier = resolveFn(specifier);
                        } catch (e) {
                            // Keep original specifier if resolution fails
                        }
                    }

                    statements.add(`import "${specifier}";`);
                }
            }
        }
    }

    return Array.from(statements);
}

export { createFontImports, DEFAULT_FONT_FLAGS, FONT_PRESETS };
