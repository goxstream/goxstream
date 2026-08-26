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

  // 2. Micro-ping timing measurement using local worker file (~2.2 KB)
  try {
    const startTime = performance.now();
    const response = await fetch("/ffmpeg/core-mt/ffmpeg-core.worker.js?t=" + Date.now(), { cache: "no-cache" });
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
 *
 * Rules:
 * - Slow Internet (< 2-3 Mbps): Capped at 5,000ms (5s) so slow CDNs fail fast and trigger local server fallback immediately.
 * - Fast Internet (> 10 Mbps): Scaled up to 25,000ms (25s) allowing full high-speed CDN fetch.
 */
export function calculateDynamicTimeoutMs(fileSizeMB: number, downlinkMbps: number): number {
  if (downlinkMbps < 3) {
    return 5000; // 5s fast fail threshold for slow connections
  }

  const expectedSecs = (fileSizeMB * 8) / downlinkMbps;
  const bufferSecs = 3;
  const totalMs = Math.ceil((expectedSecs + bufferSecs) * 1000);

  return Math.min(Math.max(totalMs, 5000), 25000);
}
