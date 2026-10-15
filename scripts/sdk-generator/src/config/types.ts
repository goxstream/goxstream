export type TargetKey = "typescript" | "php" | "python" | "go" | "bash" | "powershell";

export interface GeneratorTarget {
  name: string;
  generator: string;
  outputDir: string;
  gitHost?: string;
  gitUserId?: string;
  gitRepoId?: string;
  additionalProperties: Record<string, string>;
  description: string;
}
