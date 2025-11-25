import { getCollectedBacklinks, resetBacklinks } from "../remark/backlinks.js";

function serializeBacklinks() {
  const graph = getCollectedBacklinks();
  const result = {};
  for (const [key, entry] of graph.entries()) {
    result[key] = {
      key,
      meta: entry.meta || {},
      inbound: Array.from(entry.inbound || []),
      outbound: Array.from(entry.outbound || []),
    };
  }
  return result;
}

export function getBacklinkGraph() {
  return serializeBacklinks();
}

export function resetBacklinkGraph() {
  resetBacklinks();
}
