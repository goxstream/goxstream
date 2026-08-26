"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { getEstimatedDownlinkMbps, calculateDynamicTimeoutMs } from "./network-speed";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let isMultiThreadedMode = false;

const CORE_VERSION = "0.12.10";
const MT_PRIMARY_CDN = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
const MT_FALLBACK_CDN = `https://unpkg.com/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
const ST_PRIMARY_CDN = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
const ST_FALLBACK_CDN = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
const LOCAL_MT_PATH = "/ffmpeg/core-mt";
const LOCAL_ST_PATH = "/ffmpeg/core";

/**
 * Helper to race a promise against a timeout.
 */
function timeoutPromise<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

async function fetchBlobURL(url: string, mimeType: string): Promise<string> {
  return toBlobURL(url, mimeType);
}

/**
 * Helper to fetch and instantiate Multi-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadMTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching multi-threaded WASM core binaries from ${cdnBase}...`);
  const coreURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");
  const workerURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.worker.js`, "text/javascript");

  if (onProgress) onProgress("Instantiating multi-threaded WASM core worker pool...");
  await instance.load({ coreURL, wasmURL, workerURL });
}

/**
 * Helper to fetch and instantiate Single-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadSTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching single-threaded WASM core binaries from ${cdnBase}...`);
  const coreURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");

  if (onProgress) onProgress("Instantiating single-threaded WASM core...");
  await instance.load({ coreURL, wasmURL });
}

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Features dynamic network-adaptive timeouts and robust CDN-first multi-tier fallback.
 */
export async function loadFFmpegCore(
  onProgress?: (msg: string) => void
): Promise<FFmpeg> {
  // 1. Return existing loaded instance if already ready
  if (ffmpegInstance && ffmpegInstance.loaded) {
    if (onProgress) onProgress("FFmpeg WASM Core engine is ready.");
    return ffmpegInstance;
  }

  // 2. Return in-flight loading promise to avoid duplicate concurrent load calls
  if (loadPromise) {
    if (onProgress) onProgress("FFmpeg WASM Core initialization in progress...");
    return loadPromise;
  }

  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  const instance = ffmpegInstance;

  // 3. Initiate single load promise
  loadPromise = (async () => {
    // Measure active network bandwidth
    const mbps = await getEstimatedDownlinkMbps();
    const mtTimeoutMs = calculateDynamicTimeoutMs(33, mbps);

    if (onProgress) {
      onProgress(`Network bandwidth: ~${mbps.toFixed(1)} Mbps (Adaptive MT CDN timeout budget: ${(mtTimeoutMs / 1000).toFixed(0)}s)`);
    }

    const supportsMultiThread =
      typeof window !== "undefined" &&
      typeof SharedArrayBuffer !== "undefined" &&
      window.crossOriginIsolated;

    if (supportsMultiThread) {
      // Tier 1: Primary Multi-Threaded CDN (jsDelivr)
      try {
        if (onProgress) onProgress("Loading Multi-Threaded WASM core via jsDelivr CDN...");
        await timeoutPromise(
          loadMTCore(instance, MT_PRIMARY_CDN, onProgress),
          mtTimeoutMs,
          `Primary MT CDN load timeout (${(mtTimeoutMs / 1000).toFixed(0)}s budget)`
        );

        isMultiThreadedMode = true;
        if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully (jsDelivr).");
        return instance;
      } catch (mtPrimaryErr: any) {
        // Tier 2: Fallback Multi-Threaded CDN (unpkg)
        try {
          if (onProgress) onProgress(`jsDelivr MT failed (${mtPrimaryErr?.message || "Error"}). Retrying unpkg MT CDN...`);
          await timeoutPromise(
            loadMTCore(instance, MT_FALLBACK_CDN, onProgress),
            mtTimeoutMs,
            `Fallback MT CDN load timeout (${(mtTimeoutMs / 1000).toFixed(0)}s budget)`
          );

          isMultiThreadedMode = true;
          if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully via unpkg.");
          return instance;
        } catch (mtFallbackErr: any) {
          if (onProgress) onProgress(`Public MT CDNs failed (${mtFallbackErr?.message || "Error"}). Trying Local Server MT Assets...`);
        }
      }

      // Tier 3: Local Server Multi-Threaded Assets (/ffmpeg/core-mt/) - Optional local fallback
      try {
        if (onProgress) onProgress("Loading Multi-Threaded WASM core from Local Server Assets (/ffmpeg/core-mt)...");
        await loadMTCore(instance, LOCAL_MT_PATH, onProgress);

        isMultiThreadedMode = true;
        if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully from Local Server.");
        return instance;
      } catch (localMtErr: any) {
        if (onProgress) onProgress("Local MT Core unavailable. Falling back to Single-Threaded CDN...");
      }
    } else {
      if (onProgress) onProgress("SharedArrayBuffer / Cross-Origin Isolation unavailable. Using Single-Threaded WASM Core...");
    }

    // Single-Threaded Tier Chain
    const stTimeoutMs = calculateDynamicTimeoutMs(32, mbps);

    // Tier 4: Primary Single-Threaded CDN (jsDelivr)
    try {
      if (onProgress) onProgress("Loading Single-Threaded WASM core via jsDelivr CDN...");
      await timeoutPromise(
        loadSTCore(instance, ST_PRIMARY_CDN, onProgress),
        stTimeoutMs,
        `Primary ST CDN load timeout (${(stTimeoutMs / 1000).toFixed(0)}s budget)`
      );

      isMultiThreadedMode = false;
      if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully (jsDelivr).");
      return instance;
    } catch (stPrimaryErr: any) {
      // Tier 5: Fallback Single-Threaded CDN (unpkg)
      try {
        if (onProgress) onProgress(`jsDelivr ST failed (${stPrimaryErr?.message || "Error"}). Retrying unpkg ST CDN...`);
        await timeoutPromise(
          loadSTCore(instance, ST_FALLBACK_CDN, onProgress),
          stTimeoutMs,
          `Fallback ST CDN load timeout (${(stTimeoutMs / 1000).toFixed(0)}s budget)`
        );

        isMultiThreadedMode = false;
        if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully via unpkg.");
        return instance;
      } catch (stFallbackErr: any) {
        if (onProgress) onProgress(`Public ST CDNs failed (${stFallbackErr?.message || "Error"}). Trying Local Server ST Assets...`);
      }
    }

    // Tier 6: Local Server Single-Threaded Assets (/ffmpeg/core/)
    try {
      if (onProgress) onProgress("Loading Single-Threaded WASM core from Local Server Assets (/ffmpeg/core)...");
      await loadSTCore(instance, LOCAL_ST_PATH, onProgress);

      isMultiThreadedMode = false;
      if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully from Local Server.");
      return instance;
    } catch (localStErr: any) {
      loadPromise = null;
      throw new Error(
        `Failed to load FFmpeg WASM Core from all CDN and local tiers: ${localStErr?.message || "Engine load failed"}`
      );
    }
  })();

  return loadPromise;
}

/**
 * Check if the FFmpeg engine is currently loaded.
 */
export function isFFmpegCoreLoaded(): boolean {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * Check if current loaded engine is operating in multi-threaded mode.
 */
export function isFFmpegMultiThreaded(): boolean {
  return isMultiThreadedMode;
}

/**
 * Get current loaded FFmpeg instance.
 */
export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}
