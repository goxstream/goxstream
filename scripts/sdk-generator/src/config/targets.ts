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
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-typescript",
    additionalProperties: {
      npmName: "@shionstream/shionstream-sdk",
      npmVersion: "1.0.0",
      typescriptThreePlus: "true",
      supportsES6: "true",
      licenseName: "Apache-2.0",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-typescript",
    },
    description: "Pure TypeScript/JavaScript SDK for npm distribution",
  },
  php: {
    name: "PHP",
    generator: "php",
    outputDir: path.resolve(ROOT_DIR, "sdks/php"),
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-php",
    additionalProperties: {
      invokerPackage: "ShionStream\\Client",
      packageName: "shionstream-client",
      variableNamingConvention: "camelCase",
      licenseName: "Apache-2.0",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-php",
    },
    description: "PHP SDK (PSR-18 / Composer)",
  },
  python: {
    name: "Python",
    generator: "python",
    outputDir: path.resolve(ROOT_DIR, "sdks/python"),
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-python",
    additionalProperties: {
      packageName: "shionstream_sdk",
      projectName: "shionstream-sdk",
      packageVersion: "1.0.0",
      library: "urllib3",
      licenseInfo: "Apache-2.0",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-python",
    },
    description: "Python SDK (Pydantic / urllib3)",
  },
  go: {
    name: "Go",
    generator: "go",
    outputDir: path.resolve(ROOT_DIR, "sdks/go"),
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-go",
    additionalProperties: {
      packageName: "shionstream",
      isGoSubmodule: "false",
      structPrefix: "true",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-go",
    },
    description: "Go SDK (net/http)",
  },
  bash: {
    name: "Shell / Bash",
    generator: "bash",
    outputDir: path.resolve(ROOT_DIR, "sdks/bash"),
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-bash",
    additionalProperties: {
      scriptName: "shionstream-cli",
      curlOptions: "-sS",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-bash",
    },
    description: "POSIX Shell / Bash CLI Client (curl / jq)",
  },
  powershell: {
    name: "PowerShell",
    generator: "powershell",
    outputDir: path.resolve(ROOT_DIR, "sdks/powershell"),
    gitHost: "github.com",
    gitUserId: "shionstream",
    gitRepoId: "shionstream-powershell",
    additionalProperties: {
      packageName: "ShionStream.Client",
      gitHost: "github.com",
      gitUserId: "shionstream",
      gitRepoId: "shionstream-powershell",
    },
    description: "PowerShell Module (PS Core 7+ & Windows PowerShell)",
  },
};
