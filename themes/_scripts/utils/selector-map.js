import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { mapWebSelectorsToObsidian } = require("./selector-map.cjs");

export { mapWebSelectorsToObsidian };
export default mapWebSelectorsToObsidian;
