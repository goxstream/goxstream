import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GeneratorTarget, TargetKey } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monorepo root directory
export const ROOT_DIR = path.resolve(__dirname, "../../../../");

// SDK Generator base directory
export const SDK_GENERATOR_DIR = path.resolve(__dirname, "../../");

// Default OpenAPI Specification URL
export const DEFAULT_SPEC_URL = "http://localhost:8787/v1/openapi.json";

export const TARGETS: Record<TargetKey, GeneratorTarget> = {
  typescript: {
    name: "TypeScript (Fetch)",
    generator: "typescript-fetch",
    outputDir: path.resolve(ROOT_DIR, "sdks/typescript"),
    additionalProperties: {
      npmName: "@goxstream/goxstream-sdk",
      typescriptThreePlus: "true",
      supportsES6: "true",
    },
    description: "Pure TypeScript/JavaScript SDK for npm distribution",
  },
  php: {
    name: "PHP",
    generator: "php",
    outputDir: path.resolve(ROOT_DIR, "sdks/php"),
    additionalProperties: {
      invokerPackage: "GoxStream\\Client",
      packageName: "goxstream-client",
      variableNamingConvention: "camelCase",
      licenseName: "Apache-2.0",
    },
    description: "PHP SDK (PSR-18 / Composer)",
  },
  python: {
    name: "Python",
    generator: "python",
    outputDir: path.resolve(ROOT_DIR, "sdks/python"),
    additionalProperties: {
      packageName: "goxstream_sdk",
      projectName: "goxstream-sdk",
      library: "urllib3",
    },
    description: "Python SDK (Pydantic / urllib3)",
  },
  go: {
    name: "Go",
    generator: "go",
    outputDir: path.resolve(ROOT_DIR, "sdks/go"),
    additionalProperties: {
      packageName: "goxstream",
      isGoSubmodule: "true",
      structPrefix: "true",
    },
    description: "Go SDK (net/http)",
  },
  bash: {
    name: "Shell / Bash",
    generator: "bash",
    outputDir: path.resolve(ROOT_DIR, "sdks/bash"),
    additionalProperties: {
      scriptName: "goxstream-cli",
      curlOptions: "-sS",
    },
    description: "POSIX Shell / Bash CLI Client (curl / jq)",
  },
  powershell: {
    name: "PowerShell",
    generator: "powershell",
    outputDir: path.resolve(ROOT_DIR, "sdks/powershell"),
    additionalProperties: {
      packageName: "GoxStream.Client",
    },
    description: "PowerShell Module (PS Core 7+ & Windows PowerShell)",
  },
};
