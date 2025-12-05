
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const fonts = [
    // This was failing before because of "-normal"
    "@fontsource/instrument-serif/latin-400.css",
    "@fontsource-variable/inter",
    "@fontsource-variable/instrument-sans",
    "@fontsource-variable/fraunces",
    // This was also failing
    "@fontsource/ibm-plex-mono/latin-400.css",
    "@fontsource-variable/newsreader"
];

console.log("Resolving fonts with corrected paths...");
let errors = 0;
fonts.forEach(f => {
    try {
        const resolved = require.resolve(f);
        console.log(`✅ ${f} -> ${resolved}`);
    } catch (e) {
        console.error(`❌ ${f} -> ERROR: ${e.message}`);
        errors++;
    }
});

if (errors > 0) {
    console.log(`\nFound ${errors} errors.`);
    process.exit(1);
} else {
    console.log("\nAll fonts resolved successfully!");
}
