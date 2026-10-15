import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR, type GeneratorTarget } from "../config/index.ts";

/**
 * Pre-generation hook: runs before openapi-generator executes.
 */
export function beforeGenerate(target: GeneratorTarget): void {
  // For PHP, clean the test directory so updated templates always take effect
  if (target.generator === "php") {
    const testDir = path.resolve(target.outputDir, "test");
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  }
}

/**
 * Post-generation hook: runs after openapi-generator finishes with code 0.
 */
export function afterGenerate(target: GeneratorTarget): void {
  // Post-step: Copy the root Apache-2.0 LICENSE file into the SDK package output directory
  const rootLicense = path.resolve(ROOT_DIR, "LICENSE");
  if (fs.existsSync(rootLicense)) {
    fs.copyFileSync(rootLicense, path.resolve(target.outputDir, "LICENSE"));
  }
}
