import { getBacklinkGraph } from "./src/astro/remark/backlinks.js";

console.log("Imported successfully");
try {
    const graph = getBacklinkGraph();
    console.log("Graph retrieved:", graph);
} catch (error) {
    console.error("Error retrieving graph:", error);
}
