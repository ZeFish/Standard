
import { defineConfig } from 'astro/config';
import standard from './src/astro/index.js';
import standardSyntax from './src/astro/vite/syntax.js';

import { ignoreLayout } from './src/astro/remark/ignore-layout.js';

// https://astro.build/config
export default defineConfig({
  integrations: [standard()],
  markdown: {
    remarkPlugins: [ignoreLayout],
    shikiConfig: {
      langs: [],
      langAlias: {
        nunjucks: 'html',
        njk: 'html'
      }
    }
  },
  server: {
    port: 8083
  },
  vite: {
    plugins: [standardSyntax()]
  }
});
