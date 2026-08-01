import { describe, it, expect } from "vitest";
import { generateStylesModule } from "./virtual.js";

describe("generateStylesModule", () => {
  it("returns an empty string when no styles provided", () => {
    expect(generateStylesModule([])).toBe("");
    expect(generateStylesModule()).toBe("");
  });

  it("generates import statements, dedupes and preserves order", () => {
    const styles = [
      "/abs/path/a.scss",
      "./local/b.scss",
      "/abs/path/a.scss", // duplicate
      "@pkg/styles.css",
    ];

    const src = generateStylesModule(styles);

    // Contains expected import lines
    expect(src).toContain('import "/abs/path/a.scss";');
    expect(src).toContain('import "./local/b.scss";');
    expect(src).toContain('import "@pkg/styles.css";');

    // Deduplication: only 3 unique imports
    const importCount = (src.match(/^import\s/gm) || []).length;
    expect(importCount).toBe(3);

    // Order preserved as first-appearance order
    const idxA = src.indexOf('"/abs/path/a.scss"');
    const idxB = src.indexOf('"./local/b.scss"');
    const idxC = src.indexOf('"@pkg/styles.css"');

    expect(idxA).toBeLessThan(idxB);
    expect(idxB).toBeLessThan(idxC);
  });
});
