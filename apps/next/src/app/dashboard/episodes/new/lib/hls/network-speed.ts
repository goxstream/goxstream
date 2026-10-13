"use client";

/**
 * Estimates active network downlink speed in Megabits per second (Mbps).
 * Uses Network Information API when available, or micro-ping timing fallback.
 */
export async function getEstimatedDownlinkMbps(): Promise<number> {
  if (typeof window === "undefined") return 5;

  // 1. Check Network Information API
  const nav = window.navigator as any;
  if (nav?.connection?.downlink && typeof nav.connection.downlink === "number" && nav.connection.downlink > 0) {
    return nav.connection.downlink;
  }

  // 2. Micro-ping timing measurement using static lightweight public asset (~15 KB)
  try {
    const startTime = performance.now();
    const response = await fetch("/favicon.ico?t=" + Date.now(), { cache: "no-cache" });
    const blob = await response.blob();
    const durationSecs = (performance.now() - startTime) / 1000;

    if (durationSecs > 0 && blob.size > 0) {
      const bitsLoaded = blob.size * 8;
      const calculatedMbps = bitsLoaded / (durationSecs * 1000000);
      return Math.max(calculatedMbps, 1);
    }
  } catch {
    // Default fallback assumption
  }

  return 5; // Default 5 Mbps assumption
}

/**
 * Calculates dynamic timeout budget (in milliseconds) based on bandwidth and file size.
 * Ensures sufficient budget for downloading ~32MB WASM core binaries over public CDNs.
 */
export function calculateDynamicTimeoutMs(fileSizeMB: number, downlinkMbps: number): number {
  const safeMbps = Math.max(downlinkMbps, 1);
  const expectedSecs = (fileSizeMB * 8) / safeMbps;
  const bufferSecs = 15;
  const totalMs = Math.ceil((expectedSecs + bufferSecs) * 1000);

  // Minimum budget of 45s, maximum of 90s for WASM CDN fetching
  return Math.min(Math.max(totalMs, 45000), 90000);
}

