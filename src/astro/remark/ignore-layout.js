
import yaml from 'js-yaml';

export function ignoreLayout() {
    return function (tree, file) {
        // 1. Modify Astro's injected frontmatter (if accessible)
        if (file.data.astro && file.data.astro.frontmatter) {
            if (file.data.astro.frontmatter.layout) {
                file.data.astro.frontmatter.legacy_layout = file.data.astro.frontmatter.layout;
                delete file.data.astro.frontmatter.layout;
            }
        }

        // 2. Modify the raw YAML node in the AST (to be safe)
        // This is necessary because Astro might parse the raw YAML before populating file.data.astro.frontmatter
        // or vice-versa, depending on the pipeline stage.
        // However, for Astro, modifying file.data.astro.frontmatter is usually enough for the *output* metadata,
        // but the *layout resolution* might happen earlier or look at the raw value.
        // Let's try modifying the AST node too.
        /*
        const yamlNode = tree.children.find(node => node.type === 'yaml');
        if (yamlNode) {
          try {
            const parsed = yaml.load(yamlNode.value);
            if (parsed && parsed.layout) {
              parsed.legacy_layout = parsed.layout;
              delete parsed.layout;
              yamlNode.value = yaml.dump(parsed);
            }
          } catch (e) {
            // ignore yaml errors
          }
        }
        */
    };
}
