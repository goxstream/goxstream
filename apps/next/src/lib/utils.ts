import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
