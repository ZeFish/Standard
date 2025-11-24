import { visit } from 'unist-util-visit';

/**
 * Rehype plugin for Standard Framework HTML transforms:
 * - Wrap tables in <div class="scroll">
 * - Enhance external links (target="_blank", rel, class)
 * - Preload internal links
 */
export default function rehypeStandard(options = {}) {
    const wrapperClass = options.wrapperClass || 'scroll';

    return (tree) => {
        // 1. Wrap Tables
        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName === 'table') {
                // Check if already wrapped (simplistic check)
                if (parent && parent.tagName === 'div' && parent.properties.className && parent.properties.className.includes(wrapperClass)) {
                    return;
                }

                // Wrap
                const wrapper = {
                    type: 'element',
                    tagName: 'div',
                    properties: { className: [wrapperClass] },
                    children: [node],
                };

                parent.children[index] = wrapper;
            }
        });

        // 2. Enhance Links
        visit(tree, 'element', (node) => {
            if (node.tagName === 'a' && node.properties && node.properties.href) {
                const href = node.properties.href;
                const isExternal = /^https?:\/\/|^mailto:|^tel:|^ftp:/.test(href);

                if (isExternal) {
                    // Add external-link class
                    let classes = node.properties.className || [];
                    if (!Array.isArray(classes)) classes = [classes];
                    if (!classes.includes('external-link')) {
                        classes.push('external-link');
                    }
                    node.properties.className = classes;

                    // Add target="_blank"
                    if (!node.properties.target) {
                        node.properties.target = '_blank';
                    }

                    // Add rel="noopener noreferrer"
                    let rel = node.properties.rel || [];
                    if (!Array.isArray(rel)) rel = [rel];
                    if (!rel.includes('noopener')) rel.push('noopener');
                    if (!rel.includes('noreferrer')) rel.push('noreferrer');
                    node.properties.rel = rel;

                } else {
                    // Internal link - add preload (if not present)
                    // Note: standard HTML doesn't have a 'preload' attribute for anchors, 
                    // but the 11ty plugin added it. We'll add it as a data attribute or standard attribute if intended.
                    // The 11ty plugin added <a ... preload>.
                    if (!node.properties.preload) {
                        node.properties.preload = true;
                    }
                }
            }
        });
    };
}
