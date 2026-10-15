export type TargetKey = "typescript" | "php" | "python" | "go" | "bash" | "powershell";

export interface GeneratorTarget {
  name: string;
  generator: string;
  outputDir: string;
  additionalProperties: Record<string, string>;
  description: string;
}
