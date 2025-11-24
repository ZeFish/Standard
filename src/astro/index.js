/**
 * @zefish/standard Astro Integration
 */
import remarkTypography from "./remark/typography.js";
import remarkTags from "./remark/tags.js";
import remarkStandard from "./remark/standard.js";
import rehypeStandard from "./rehype/standard.js";
import { fileURLToPath } from "url";
import path from "path";

export default function standard(options = {}) {
    return {
        name: "@zefish/standard",
        hooks: {
            "astro:config:setup": ({ config, updateConfig, injectScript, injectRoute }) => {
                // 1. Configure Remark/Rehype Plugins
                updateConfig({
                    markdown: {
                        remarkPlugins: [
                            [remarkTypography, options.typography || {}],
                            [remarkTags, options.tags || {}],
                            [remarkStandard, options.standard || {}],
                        ],
                        rehypePlugins: [
                            [rehypeStandard, options.html || {}],
                        ],
                    },
                });

                // 2. Virtual Module for Config
                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: "vite-plugin-standard-config",
                                resolveId(id) {
                                    if (id === "virtual:standard/config") {
                                        return "\0virtual:standard/config";
                                    }
                                },
                                load(id) {
                                    if (id === "\0virtual:standard/config") {
                                        return `export default ${JSON.stringify(options)}`;
                                    }
                                },
                            },
                        ],
                    },
                });

                // 3. Inject Routes
                const currentDir = path.dirname(fileURLToPath(import.meta.url));

                injectRoute({
                    pattern: "/robots.txt",
                    entrypoint: path.join(currentDir, "routes/robots.js"),
                });
                injectRoute({
                    pattern: "/site.webmanifest",
                    entrypoint: path.join(currentDir, "routes/manifest.js"),
                });
                injectRoute({
                    pattern: "/_headers",
                    entrypoint: path.join(currentDir, "routes/headers.js"),
                });

                // 4. Add Global Styles (if needed)
                // injectScript('page', `import '@zefish/standard/css';`);
            },
        },
    };
}
