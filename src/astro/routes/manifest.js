import config from "virtual:standard/config";

export async function GET(context) {
    const manifestConfig = config.manifest || {};
    if (manifestConfig.enabled === false) {
        return new Response(null, { status: 404 });
    }

    const defaults = {
        name: "My Site",
        short_name: "Site",
        description: "A website",
        start_url: "/",
        display: "standalone",
        orientation: "any",
        theme_color: "#000000",
        background_color: "#ffffff",
        icons: [],
        categories: [],
        screenshots: [],
        shortcuts: [],
    };

    // Merge defaults with config
    // Note: In a real app we might want to pull site title/desc from context.site if available, 
    // but Astro context doesn't give easy access to global site metadata unless passed in config.
    const manifest = {
        name: manifestConfig.name || defaults.name,
        short_name: manifestConfig.short_name || defaults.short_name,
        description: manifestConfig.description || defaults.description,
        start_url: manifestConfig.start_url || defaults.start_url,
        display: manifestConfig.display || defaults.display,
        orientation: manifestConfig.orientation || defaults.orientation,
        theme_color: manifestConfig.theme_color || defaults.theme_color,
        background_color: manifestConfig.background_color || defaults.background_color,
        icons: manifestConfig.icons || defaults.icons,
    };

    if (manifestConfig.categories) manifest.categories = manifestConfig.categories;
    if (manifestConfig.screenshots) manifest.screenshots = manifestConfig.screenshots;
    if (manifestConfig.shortcuts) manifest.shortcuts = manifestConfig.shortcuts;

    return new Response(JSON.stringify(manifest, null, 2), {
        headers: {
            "Content-Type": "application/manifest+json",
        },
    });
}
