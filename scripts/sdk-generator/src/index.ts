import { TARGETS, DEFAULT_SPEC_URL, type TargetKey } from "./config/index.ts";
import { runGenerator } from "./core/runner.ts";

const [targetArg, customSpecUrl] = process.argv.slice(2);

function printHelp(): void {
  console.log(`
ShionStream SDK Multi-Language Generator CLI
============================================
Usage:
  pnpm --filter=@shionstream/sdk-generator generate [target] [specUrl]
  or:
  tsx src/index.ts [target] [specUrl]

Available Targets:
  all           Generate all SDK targets sequentially
  typescript    TypeScript (Fetch) SDK -> sdks/typescript
  php           PHP (PSR-18 / Composer) SDK -> sdks/php
  python        Python (Pydantic / urllib3) SDK -> sdks/python
  go            Go (net/http) SDK -> sdks/go
  bash          POSIX Shell / Bash CLI Client (curl / jq) -> sdks/bash
  powershell    PowerShell Module -> sdks/powershell

Options:
  [specUrl]     OpenAPI specification URL (Default: ${DEFAULT_SPEC_URL})

Examples:
  pnpm --filter=@shionstream/sdk-generator generate typescript
  pnpm --filter=@shionstream/sdk-generator generate all
  pnpm --filter=@shionstream/sdk-generator generate python https://api.gox.my.id/v1/openapi.json
`);
}

async function main(): Promise<void> {
  if (!targetArg || targetArg === "--help" || targetArg === "-h") {
    printHelp();
    return;
  }

  const specUrl = customSpecUrl || DEFAULT_SPEC_URL;

  if (targetArg === "all") {
    const targetKeys = Object.keys(TARGETS) as TargetKey[];
    console.log(`>> Generating all SDK targets...`);
    for (const key of targetKeys) {
      await runGenerator(key, specUrl);
    }
    console.log(`\n🎉 All SDK targets generated successfully!`);
    return;
  }

  if (!(targetArg in TARGETS)) {
    console.error(`[Error] Invalid target: "${targetArg}".`);
    printHelp();
    process.exit(1);
  }

  await runGenerator(targetArg as TargetKey, specUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
