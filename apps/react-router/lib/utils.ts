import { cn } from "@goxstream/ui/lib/utils";
import type { CSSProperties } from "react";

export { cn };

/**
 * Utility helper to handle poster/banner/thumbnail images safely.
 * Accepts HTTP image URLs, relative paths, or CSS gradients.
 */
export function getImageStyle(urlOrGradient?: string | null): CSSProperties {
  if (!urlOrGradient) return {};
  if (
    urlOrGradient.startsWith("linear-gradient") ||
    urlOrGradient.startsWith("radial-gradient") ||
    urlOrGradient.startsWith("conic-gradient")
  ) {
    return { background: urlOrGradient };
  }
  return {
    backgroundImage: `url("${urlOrGradient}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}
