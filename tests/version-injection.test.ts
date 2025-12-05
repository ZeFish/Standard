import { test, expect } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

test.describe("Version Injection Verification", () => {
    let projectVersion: string;
    const projectRoot = process.cwd();

    test.beforeAll(async () => {
        // Read version from package.json
        const packageJsonPath = path.join(projectRoot, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        projectVersion = packageJson.version;
        console.log(`Target version: ${projectVersion}`);
    });

    test("JS build injects version string", async () => {
        // Run build with injection
        await execAsync("node bin/build-js.js --inject-version", { cwd: projectRoot });

        // Check a key library file
        const libFile = path.join(projectRoot, "lib", "standard.js");
        expect(fs.existsSync(libFile)).toBe(true);

        const content = fs.readFileSync(libFile, "utf-8");
        const expectedString = `Standard::Framework v${projectVersion}`;
        expect(content).toContain(expectedString);
        console.log(`✓ JS version injection verified in standard.js`);
    });

    test("CSS build injects version string", async () => {
        // Run build with injection
        await execAsync("node bin/build-css.js --inject-version", { cwd: projectRoot });

        // Check a key library file
        const libFile = path.join(projectRoot, "lib", "standard.min.css");
        expect(fs.existsSync(libFile)).toBe(true);

        // CSS might be minified, but the comment should be preserved or string inside content
        const content = fs.readFileSync(libFile, "utf-8");
        const expectedString = `Standard::Framework v${projectVersion}`;
        expect(content).toContain(expectedString);
        console.log(`✓ CSS version injection verified in standard.min.css`);
    });

    test("Check bundle version injection", async () => {
        const bundleFile = path.join(projectRoot, "lib", "standard.bundle.full.js");
        if (fs.existsSync(bundleFile)) {
            const content = fs.readFileSync(bundleFile, "utf-8");
            const expectedString = `Standard::Framework v${projectVersion}`;
            expect(content).toContain(expectedString);
            console.log(`✓ Bundle version injection verified in standard.bundle.full.js`);
        } else {
            console.log("ℹ Bundle file not found (setup might differ), skipping bundle check");
        }
    });
});
