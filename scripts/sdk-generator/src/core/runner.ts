import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR, SDK_GENERATOR_DIR, DEFAULT_SPEC_URL, TARGETS, type TargetKey } from "../config/index.ts";
import { beforeGenerate, afterGenerate } from "./hooks.ts";

export async function runGenerator(targetKey: TargetKey, specUrl = DEFAULT_SPEC_URL): Promise<void> {
  const target = TARGETS[targetKey];
  if (!target) {
    throw new Error(`Unknown generator target: "${targetKey}". Available targets: ${Object.keys(TARGETS).join(", ")}`);
  }

  console.log(`\n======================================================`);
  console.log(`>> Starting Generator: ${target.name} [${targetKey}]`);
  console.log(`>> Spec URL   : ${specUrl}`);
  console.log(`>> Output Dir : ${target.outputDir}`);
  console.log(`======================================================`);

  // Execute pre-generation lifecycle hooks
  beforeGenerate(target);

  const props = Object.entries(target.additionalProperties)
    .map(([key, val]) => `${key}=${val}`)
    .join(",");

  const args = [
    "openapi-generator-cli",
    "generate",
    "-i",
    specUrl,
    "-g",
    target.generator,
    "-o",
    target.outputDir,
  ];

  if (target.gitHost) {
    args.push("--git-host", target.gitHost);
  }
  if (target.gitUserId) {
    args.push("--git-user-id", target.gitUserId);
  }
  if (target.gitRepoId) {
    args.push("--git-repo-id", target.gitRepoId);
  }

  if (props) {
    args.push(`--additional-properties=${props}`);
  }

  // Check if custom template override directory exists for this generator
  const customTemplateDir = path.resolve(SDK_GENERATOR_DIR, "templates", target.generator);
  if (fs.existsSync(customTemplateDir)) {
    args.push("-t", customTemplateDir);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn("npx", args, {
      cwd: ROOT_DIR,
      stdio: "inherit",
      env: process.env,
    });

    proc.on("error", (err: Error) => {
      console.error(`[Error] Failed to execute generator for ${target.name}:`, err);
      reject(err);
    });

    proc.on("close", (code: number | null) => {
      if (code === 0) {
        // Execute post-generation lifecycle hooks
        afterGenerate(target);

        console.log(`✓ Successfully generated ${target.name} at: ${target.outputDir}\n`);
        resolve();
      } else {
        const error = new Error(`Generator for ${target.name} exited with code ${code}`);
        console.error(`✗ ${error.message}`);
        reject(error);
      }
    });
  });
}
