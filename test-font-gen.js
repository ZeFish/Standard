
import { createFontImports } from './astro/utils/fonts.js';

console.log("Testing createFontImports...");
const imports = createFontImports();
console.log(imports.join('\n'));
